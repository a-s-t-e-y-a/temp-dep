// src/pages/Categories/Categories.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MetaTag from '../../components/MateTagComponent/MetaTag';
import ProductCard from '../../components/ProductCard/ProductCard';
import { GoChevronLeft } from 'react-icons/go';
import { faViewItemList , faSelectItem } from '../../analytics/ga4';
import { useRef } from 'react'

const API_BASE =  `${import.meta.env.VITE_API_URL}/api/foods`;

// simple global cache accessor (shared with Home.jsx)
function getCategoryCache() {
  if (!window.__categoryCache) window.__categoryCache = new Map();
  return window.__categoryCache; // key: category, value: { data, ts }
}

function normalizeCategory(name = '') {
  return String(name).trim().toLowerCase();
}

function filterByCategory(items, categoryName) {
  const target = normalizeCategory(categoryName);
  return (items || []).filter(p => {
    const cat = (p.category ?? '').toString().trim().toLowerCase();
    const sub = (p.subcategory ?? '').toString().trim().toLowerCase();
    return cat.includes(target) || sub.includes(target);
  });
}

const Categories = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState(null);

  const listImpressionSentRef = useRef(false);

  const LIST_ID = `category_${normalizeCategory(categoryName)}`;
  const LIST_NAME = categoryName;

  // Safe back: go back if history exists; otherwise go home
  const safeBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };



  useEffect(() => {
    let cancelled = false;
    const cache = getCategoryCache();
    const cacheKey = normalizeCategory(categoryName);

    // 1) Try cache first (instant paint)
    const cached = cache.get(cacheKey);
    if (cached && Array.isArray(cached.data)) {
      setProducts(cached.data);
      setLoading(false); // show cached immediately
    } else {
      setLoading(true);
    }

    // 2) Always revalidate in background (SWR)
    (async () => {
      try {
        setError(null);
        const res = await axios.get(API_BASE);
        const filtered = filterByCategory(res.data, categoryName);

        if (!cancelled) {
          setProducts(filtered);
          setLoading(false);
          cache.set(cacheKey, { data: filtered, ts: Date.now() });
        }
      } catch (e) {
        if (!cancelled) {
          // Only show error if nothing in cache
          if (!cached) setError('Failed to fetch products for this category.');
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [categoryName]);

  const handleSelectItem = (product, index) => {
    const price = product.discountedPrice > 0 && product.discountedPrice < product.price
      ? product.discountedPrice
      : product.price;

    const item = {
      item_id: String(product.id),
      item_name: product.name,
      item_brand: product.brand || "LetsTryFoods",
      item_category: categoryName || "Category",
      item_variant: product.unit || product.weight || undefined,
      price: Number(Number(price).toFixed(2)),
      quantity: 1,
      index,
      item_list_id: LIST_ID,
      item_list_name: LIST_NAME,
    };

    faSelectItem({
      item_list_id: LIST_ID,
      item_list_name: LIST_NAME,
      items: [item],
    });

    navigate(`/food/${encodeURIComponent(product.id)}`);
  };

  // Deduplicate by name (unchanged)
  const uniqueProducts = useMemo(() => {
    const seen = new Set();
    return products.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
  }, [products]);

  useEffect(() => {
    if (!uniqueProducts || uniqueProducts.length === 0) return;
    if (listImpressionSentRef.current) return;

    const items = uniqueProducts.map((p, idx) => {
      const price = p.discountedPrice > 0 && p.discountedPrice < p.price
        ? p.discountedPrice
        : p.price;

      return {
        item_id: String(p.id),
        item_name: p.name,
        item_brand: p.brand || "LetsTryFoods",
        item_category: categoryName || "Category",
        item_variant: p.unit || p.weight || undefined,
        price: Number(Number(price).toFixed(2)),
        index: idx,
        item_list_id: LIST_ID,
        item_list_name: LIST_NAME,
      };
    });

    faViewItemList({
      item_list_id: LIST_ID,
      item_list_name: LIST_NAME,
      items,
    });

    listImpressionSentRef.current = true;
    },[uniqueProducts, categoryName]); // Re-fire when category or products change

  // Reset the guard when categoryName changes
  useEffect(() => {
    listImpressionSentRef.current = false;
  }, [categoryName]);

  if (loading) {
    return (
      <section className="px-6 md:px-10 lg:px-16 my-8">
        <div className="text-left py-8 px-2">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">
            Loading {categoryName} products...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 md:px-10 lg:px-16 my-8">
        <div className="text-center py-8">
          <p className="text-red-600 text-lg mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded lg:hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-[25px] md:px-[40px] lg:px-[70px] mb-4">
      <MetaTag
        title={`${categoryName} - Premium Healthy Snacks | Letstry`}
        description={`Shop ${categoryName} snacks at Letstry. Discover ${uniqueProducts.length} delicious and healthy ${categoryName.toLowerCase()} options. Free delivery on orders above ₹299.`}
        ogTitle={`Best ${categoryName} Snacks Online | Letstry`}
        ogDescription={`Browse our collection of ${uniqueProducts.length} ${categoryName.toLowerCase()} snacks. Healthy, tasty, and delivered fresh to your doorstep.`}
      />
      {/* Header (desktop/tablet) */}
      <div className="mb-8 text-left hidden lg:block md:block">
        <h1 className="md:text-2xl lg:text-3xl font-bold text-black mb-2 mt-12">
          {categoryName}
        </h1>
        <p className="text-[20px] font-[300] py-2 text-black">
          {uniqueProducts.length} product{uniqueProducts.length !== 1 && 's'}
        </p>
      </div>

      {/* Mobile header with back button */}
      <div className="flex items-center justify-between py-2 text-black block lg:hidden md:hidden">
        {/* Back Button -> go to previous page */}
        <button onClick={safeBack} className="flex-shrink-0 pr-2" aria-label="Go back">
          <GoChevronLeft size={24} />
        </button>

        {/* Title (centered) */}
        <div className="text-[19px] font-[700] flex-1 text-left">
          {categoryName}
        </div>

        {/* Product Count (right aligned) */}
        <div className="text-[16px] font-[400] flex-shrink-0">
          {uniqueProducts.length} Product{uniqueProducts.length !== 1 && 's'}
        </div>
      </div>

      {/* Products Grid */}
      {uniqueProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-[60px] gap-[35px] md:gap-[38px] ml-3 lg:ml-0">
          {uniqueProducts.map((product,idx) => (
            <div key={product.id} className="w-full justify-between">
              <ProductCard
                name={product.name}
                id={product.id}
                imageUrl={product.imageUrl}
                type="regular"
                title={product.title}
                category={product.category}
                onClick={() => handleSelectItem(product,idx)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            No products found in this category.
          </p>
          {/* Desktop back button -> goes to previous page, fallback to home if none */}
          <button
            onClick={safeBack}
            className="px-4 py-2 bg-gray-600 text-white rounded lg:hover:bg-gray-700 transition hidden lg:block md:block"
          >
            Back
          </button>
        </div>
      )}

      {/* Footer back action (desktop) */}
      {uniqueProducts.length > 0 && (
        <div className="mt-8 text-center hidden lg:block md:block">
          <button
            onClick={safeBack}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Back
          </button>
        </div>
      )}
    </section>
  );
};

export default Categories;
