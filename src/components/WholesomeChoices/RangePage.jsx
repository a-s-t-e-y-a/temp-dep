import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard/ProductCard";
import { faViewItemList, faSelectItem } from "../../analytics/ga4";


const API_BASE =  `${import.meta.env.VITE_API_URL}/api/foods/range`;
const VITE_API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;


const bottomLeftKeys = ["puff", "muffins", "wheat"];
const imageRightMobileKeys = ["puff", "muffins", "wheat", "no maida"];

const rangeConfig = {
  namkeen: { image: `${VITE_API_IMAGE_URL}/images/namkeenrangehead.webp`, gradient: ["#AA582D", "#FAC159"], heading: "Namkeen", heading2:" Range" },
  wafers:  { image: `${VITE_API_IMAGE_URL}/images/wafersrangehead.webp`, gradient: ["#D12C4A", "#E9A0AD"], heading: "Wafers", heading2:" Range" },
  roasted: { image: `${VITE_API_IMAGE_URL}/images/roastedrangehead.webp`, gradient: ["#AA582D", "#FAC159"], heading: "Roasted", heading2:" Range" },
  south:   { image: `${VITE_API_IMAGE_URL}/images/southrangehead.webp`, gradient: ["#24AD5E", "#B0CC7B"], heading: "South", heading2:" Range" },
  puff:    { image: `${VITE_API_IMAGE_URL}/images/puffrangehead.webp`, gradient: ["#CB6000", "#EAB07C"], heading: "Puff", heading2:" Range" },
  muffins: { image: `${VITE_API_IMAGE_URL}/images/muffinsrangehead.webp`, gradient: ["#A2C654", "#C7D6A0"], heading: "Muffins", heading2:" Range" },
  "no palm oil": { image: `${VITE_API_IMAGE_URL}/images/nopalmoilrangehead.webp`, gradient: ["#595782", "#B8B5EB"], heading: "No Palm Oil", heading2:" Range" },
  wheat:   { image: `${VITE_API_IMAGE_URL}/images/wheatrangehead.webp`, gradient: ["#B4824A", "#DECA9F"], heading: "Wheat", heading2:" Range" },
  "no maida":   { image: `${VITE_API_IMAGE_URL}/images/nomaidarangehead.webp`, gradient: ["#449095", "#BFE9EC"], heading: "No Maida", heading2:" Range" },
};

const RangePage = () => {
  const { rangeName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rangeData, setRangeData] = useState([]);
  const [error, setError] = useState(null);
  const listImpressionSentRef = useRef(false);

  const formattedRangeName = decodeURIComponent(rangeName).toLowerCase();
  const configKey = useMemo(() => (
    Object.keys(rangeConfig).find((key) => formattedRangeName.includes(key))
  ), [formattedRangeName]);

  const headingImage = configKey ? rangeConfig[configKey].image : `${VITE_API_IMAGE_URL}/images/namkeenrangehead.webp`;
  const [toColor, fromColor] = configKey
    ? rangeConfig[configKey].gradient
    : ["#AA582D", "#FAC159"];

  const isImageRightMobile = imageRightMobileKeys.includes(configKey?.toLowerCase());

  // Fetch data
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    axios
      .get(`${API_BASE}?name=${encodeURIComponent(rangeName)}`)
      .then((res) => {
        if (!active) return;
        setRangeData(res.data || []);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error fetching range data:", err);
        setError("Failed to fetch range data.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        listImpressionSentRef.current = false; // reset guard when the list reloads
      });
    return () => { active = false; };
  }, [rangeName]);

  const uniqueNames = useMemo(() => [...new Set(rangeData.map((item) => item.name))], [rangeData]);
  const displayProducts = useMemo(
    () => uniqueNames.map((name) => rangeData.find((p) => p.name === name)).filter(Boolean),
    [uniqueNames, rangeData]
  );

  const heading = configKey ? rangeConfig[configKey].heading : "";
  const heading2 = configKey ? rangeConfig[configKey].heading2 : "";

  const imageSizeClass = configKey?.toLowerCase() === "namkeen"
    ? "w-36 md:w-44 lg:w-52"
    : configKey?.toLowerCase() === "roasted"
    ? "w-24 md:w-32 lg:w-40"
    : configKey?.toLowerCase() === "puff"
    ? "w-28 md:w-40 lg:w-48"
    : configKey?.toLowerCase() === "no maida"
    ? "w-24 md:w-28 lg:w-32"
    : configKey?.toLowerCase() === "no palm oil"
    ? "w-24 md:w-32 lg:w-36"
    : configKey?.toLowerCase() === "south"
    ? "w-24 md:w-32 lg:w-36"
    : configKey?.toLowerCase() === "wafers"
    ? "w-24 md:w-32 lg:w-36"
    : configKey?.toLowerCase() === "muffins"
    ? "w-24 md:w-32 lg:w-40"
    : configKey?.toLowerCase() === "wheat"
    ? "w-32 md:w-40 lg:w-52"
    : bottomLeftKeys.includes(configKey?.toLowerCase())
    ? "w-20 md:w-32 lg:w-36"
    : "w-36 md:w-48 lg:w-56";

  const imagePositionClass = configKey?.toLowerCase() === "no maida"
    ? "left-0 bottom-0"
    : configKey?.toLowerCase() === "south"
    ? "right-0 bottom-[-14px] md:bottom-[-18px] lg:bottom-[-24px]"
    : configKey?.toLowerCase() === "muffins"
    ? "left-0 bottom-[-14px] md:bottom-[-18px] lg:top-[-24px]"
    : configKey?.toLowerCase() === "wheat"
    ? "left-0 bottom-[0px] md:bottom-[0px] lg:bottom-[0px]"
    : configKey?.toLowerCase() === "no palm oil"
    ? "right-0 bottom-[-14px] md:bottom-[-18px] lg:bottom-[-24px]"
    : bottomLeftKeys.includes(configKey?.toLowerCase())
    ? "left-0 bottom-[-14px] md:bottom-[-18px] lg:bottom-[-24px]"
    : configKey?.toLowerCase() === "roasted"
    ? "right-0 bottom-0"
    : "right-0 bottom-0";

  // Analytics identifiers
  const LIST_ID = useMemo(
    () => `range_${(configKey || formattedRangeName || rangeName).toLowerCase().replace(/\s+/g, '_')}`,
    [configKey, formattedRangeName, rangeName]
  );
  const LIST_NAME = useMemo(
    () => `Range: ${configKey || rangeName}`,
    [configKey, rangeName]
  );

  // Fire view_item_list once after products render
  useEffect(() => {
    if (!displayProducts || displayProducts.length === 0) return;
    if (listImpressionSentRef.current) return;

    const items = displayProducts.map((p, idx) => {
      const base = Number(p?.price);
      const disc = Number(p?.discountedPrice);
      const hasBase = Number.isFinite(base);
      const hasDisc = Number.isFinite(disc) && hasBase && disc > 0 && disc < base;
      const price = hasDisc ? disc : hasBase ? base : 0;

      return {
        item_id: String(p.id),
        item_name: p.name,
        item_brand: p.brand || "LetsTryFoods",
        item_category: p.category || (configKey || "Range"),
        item_variant: p.unit || p.weight || undefined,
        price: Number(price.toFixed(2)),
        index: idx,
        item_list_id: LIST_ID,
        item_list_name: LIST_NAME,
      };
    });

    faViewItemList({ item_list_id: LIST_ID, item_list_name: LIST_NAME, items });
    listImpressionSentRef.current = true;
  }, [displayProducts, LIST_ID, LIST_NAME, configKey]);

  // Click handler for select_item
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
      item_category: product.category || (configKey || "Range"),
      item_variant: product.unit || product.weight || undefined,
      price: Number(price.toFixed(2)),
      quantity: 1,
      index,
      item_list_id: LIST_ID,
      item_list_name: LIST_NAME,
    };

    faSelectItem({ item_list_id: LIST_ID, item_list_name: LIST_NAME, items: [item] });
    navigate(`/food/${encodeURIComponent(product.id)}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading {rangeName} products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded lg:hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile gradient */}
      <div
        className="relative pt-10 pb-10 px-0 sm:hidden mt-0.25 h-[135px] overflow-visible"
        style={{ background: `linear-gradient(to right, ${fromColor}, ${toColor})` }}
      >
        <div className="flex h-full items-center justify-center px-4 md:px-8 lg:px-16">
          <h2
            className={`text-[#4F1428] text-[45px] font-bold leading-tight tracking-wide ${
              isImageRightMobile ? "text-right" : "text-left"
            } max-w-7xl w-full md:px-8 lg:px-16 mx-auto`}
            style={{ fontFamily: "'Abril Fatface', cursive" }}
          >
            {heading} <br /> {heading2}
          </h2>
        </div>
        <img
          src={headingImage}
          alt={`${rangeName} range`}
          className={`absolute object-contain z-10 ${imageSizeClass} ${imagePositionClass} ${
            isImageRightMobile ? "left-0 sm:left-auto right-0" : ""
          }`}
        />
      </div>

      {/* Desktop gradient */}
      <div
        className="hidden sm:block relative rounded-b-2xl pt-10 pb-10 md:mx-[40px] lg:mx-[70px] mt-0.25 h-[150px] lg:h-[160px] overflow-visible"
        style={{ background: `linear-gradient(to right, ${fromColor}, ${toColor})` }}
      >
        <div className="flex h-full items-center justify-center">
          <h2
            className="text-[#4F1428] md:text-[50px] lg:text-[60px] font-bold leading-tight tracking-wide text-center w-full"
            style={{ fontFamily: "'Abril Fatface', cursive" }}
          >
            {heading} <br /> {heading2}
          </h2>
        </div>
        <img
          src={headingImage}
          alt={`${rangeName} range`}
          className={`absolute object-contain z-10 ${imageSizeClass} ${imagePositionClass}`}
        />
      </div>

      <section className="px-[25px] md:px-[40px] lg:px-[70px] my-8">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-[55px] gap-[26px] md:gap-[38px]">
            {displayProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                name={product.name}
                id={product.id}
                imageUrl={product.imageUrl}
                title={product.title}
                category={product.category}
                onClick={() => handleSelectItem(product, idx)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">No products found in {rangeName}</p>
          </div>
        )}
      </section>
    </>
  );
};

export default RangePage;
