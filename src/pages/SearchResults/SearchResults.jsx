import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MetaTag from '../../components/MateTagComponent/MetaTag';
import SearchCard from '../../components/SearchCard/SearchCard';
import { BiSearch } from "react-icons/bi";
import SearchDisplay from '../../components/SearchDisplay/SearchDisplay';
import { assets } from '../../assets/assets';
import { GoChevronLeft } from "react-icons/go";
import { faViewItemList, faSelectItem } from '../../analytics/ga4';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query from URL and recompute when URL changes
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const query = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const listImpressionSentRef = useRef(false);

  const categories = ["Makhana", "Chips", "Bhujia", "Snacks", "Dry Fruits", "Cookies"];

  const LIST_ID = `search_results_${query.toLowerCase().replace(/\s+/g, '_')}`;
  const LIST_NAME = `Search: ${query}`;

  useEffect(() => {
    setSearchTerm(query);
    if (!query) {
      setProducts([]);
      return;
    }

    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://recsys.letstryfoods.com/api/search?q=${encodeURIComponent(query)}`);
        const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];

        // Normalize minimal fields used by UI/GA4
        const normalized = raw.map((p) => {
          const id = String(p?.id ?? p?._id ?? p?.sku ?? '');
          const name = p?.name ?? p?.title ?? '';
          const imageUrl = p?.imageUrl ?? p?.image_url ?? p?.image ?? '';
          const unit = p?.unit ?? p?.weight ?? '';
          const base = Number(p?.price);
          const disc = Number(p?.discountedPrice ?? p?.discounted_price);
          const hasBase = Number.isFinite(base);
          const hasDisc = Number.isFinite(disc) && disc > 0 && hasBase && disc < base;
          const price = hasBase ? base : null;
          const discountedPrice = hasDisc ? disc : null;

          return {
            id,
            name,
            imageUrl,
            unit,
            price,
            discountedPrice,
            brand: p?.brand ?? 'LetsTryFoods',
            category: p?.category ?? 'Search Results',
            title: Array.isArray(p?.title) ? p.title : [],
            // keep raw for future needs
            __raw: p,
          };
        }).filter(x => x.id && x.name);

        if (alive) setProducts(normalized);
      } catch (err) {
        if (alive) setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [location.search, query]);

  // GA4 list view once per query
  useEffect(() => {
    if (!products || products.length === 0) return;
    if (listImpressionSentRef.current) return;

    const items = products.map((p, idx) => {
      const base = Number(p?.price);
      const disc = Number(p?.discountedPrice);
      const hasBase = Number.isFinite(base);
      const hasDisc = Number.isFinite(disc) && hasBase && disc > 0 && disc < base;
      const price = hasDisc ? disc : hasBase ? base : 0;

      return {
        item_id: String(p.id),
        item_name: p.name || 'Unknown',
        item_brand: p.brand || 'LetsTryFoods',
        item_category: p.category || 'Search Results',
        item_variant: p.unit || undefined,
        price: Number(price.toFixed(2)),
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
  }, [products, LIST_ID, LIST_NAME]);

  // Reset GA4 guard on query change
  useEffect(() => { listImpressionSentRef.current = false; }, [LIST_ID]);

  const handleSelectItem = (product, index) => {
    const base = Number(product?.price);
    const disc = Number(product?.discountedPrice);
    const hasBase = Number.isFinite(base);
    const hasDisc = Number.isFinite(disc) && hasBase && disc > 0 && disc < base;
    const price = hasDisc ? disc : hasBase ? base : 0;

    const item = {
      item_id: String(product.id),
      item_name: product.name,
      item_brand: product.brand || "LetsTryFoods",
      item_category: product.category || "Search Results",
      item_variant: product.unit || undefined,
      price: Number(price.toFixed(2)),
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="px-[25px] md:px-[40px] lg:px-[70px] lg:my-8 md:my-8 mb-8">
      <MetaTag
        title={`Search Results for "${query}" - Letstry`}
        description={`Find ${products.length} healthy snacks matching "${query}". Discover delicious and nutritious options from traditional Indian sweets to modern healthy snacks.`}
        ogTitle={`"${query}" Search Results | Letstry`}
        ogDescription={`Browse ${products.length} search results for "${query}". Premium healthy snacks with fast delivery.`}
      />

      {/* Mobile search input */}
      <div className="lg:hidden md:hidden flex ml-0 pl-0 gap-2 py-2">
        <button onClick={() => navigate('/')} className="ml-0 pl-0">
          <GoChevronLeft size={24} />
        </button>

        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <img src={assets.search} alt="search" loading="lazy" className="w-4 h-4" />
          </span>
          <input
            id="mobileSearch"
            name="search"
            type="text"
            placeholder="Search products"
            className="w-full rounded-[10px] border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C5273]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Popular searches */}
      <h2 className="lg:text-[22px] md:text-[24px] text-[20px] md:pb-2 text-black font-bold mb-2 mt-4">Popular Searches</h2>
      <div className="flex flex-wrap gap-3 mb-3">
        {categories.map((cat) => {
          const isSelected = query === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => navigate(`/search?q=${encodeURIComponent(cat.toLowerCase())}`)}
              className={`lg:px-[15px] lg:py-[5px] md:px-[15px] md:pt-[5px] md:pb-[7px] px-[10px] py-[8px] border lg:rounded-full md:rounded-full rounded-[10px] lg:text-[14px] md:text-[16px] text-xs flex items-center
                ${isSelected
                  ? 'bg-[#0C5273] text-white border-[#0C5273]'
                  : 'lg:bg-white md:bg-white bg-[#F8F8F8] text-black border-black lg:hover:bg-[#0C527326]'}`}
            >
              <span className="inline-block pr-2"><BiSearch /></span>
              <span className="inline-block">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Search results */}
      {loading ? (
        <SearchDisplay />
      ) : Array.isArray(products) && products.length > 0 ? (
        <div className='py-6'>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-auto lg:gap-[60px] gap-auto md:gap-[38px]">
            {products.map((item, idx) => (
              <SearchCard
                key={item.id}
                id={item.id}
                name={item.name}
                imageUrl={item.imageUrl}
                title={item.title}
                // pass fallback pricing/unit coming from search payload
                price={item.price}
                discountedPrice={item.discountedPrice}
                category={item.category}
                unit={item.unit}
                onClick={() => handleSelectItem(item, idx)}
              />
            ))}
          </div>
        </div>
      ) : (
        <SearchDisplay />
      )}
    </div>
  );
};

export default SearchResults;
