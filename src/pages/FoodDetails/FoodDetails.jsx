import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Collapse } from "@mui/material";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import MetaTag from "../../components/MateTagComponent/MetaTag";
import { FiPlus, FiMinus } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";
import { useClickSpark } from "../../components/ClickSpark/useClickSpark";
import { useLoaderData } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { faViewItem } from "../../analytics/ga4";

const VITE_API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

const categoryIcons = {
  bhujia: `${VITE_API_IMAGE_URL}/images/products/bhujia.webp`,
  munchies: `${VITE_API_IMAGE_URL}/images/products/munchies.webp`,
  fasting_special: `${VITE_API_IMAGE_URL}/images/products/fasting_special.webp`,
  south_range: `${VITE_API_IMAGE_URL}/images/products/south_range.webp`,
  rusk: `${VITE_API_IMAGE_URL}/images/products/rusk.webp`,
  cookies: `${VITE_API_IMAGE_URL}/images/products/cakes.webp`,
  "chips_&_crisps": `${VITE_API_IMAGE_URL}/images/products/chips_%26_crisps.webp`,
  cakes: `${VITE_API_IMAGE_URL}/images/products/cakes.webp`,
  pratham: `${VITE_API_IMAGE_URL}/images/products/pratham.webp`,
};

const FoodDetails = () => {
  const { id } = useParams();

  const { increaseQty, decreaseQty, quantites, triggerCartDrawer } =
    useContext(CartContext);

  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const triggerSpark = useClickSpark();
  const data = useLoaderData();

  useEffect(() => {
    if (!data) return;

    const unitPrice =
      data.discountedPrice > 0 && data.discountedPrice < data.price
        ? data.discountedPrice
        : data.price;

    const item = {
      item_id: String(data.id || id),
      item_name: data.name,
      item_brand: data.brand || "LetsTryFoods",
      item_category: data.category || "Snacks",
      item_variant: data.unit || data.weight || undefined,
      price: Number(Number(unitPrice).toFixed(2)),
      quantity: 1,
    };

    faViewItem({
      currency: "INR",
      value: item.price * item.quantity,
      items: [item],
    });
  }, [data, id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleAddToCart = (e) => {
    triggerSpark(e, "#000000");
    increaseQty(id);
    triggerCartDrawer({
      id,
      name: data.name,
      imageUrl: data.imageUrl,
      unit: data.unit,
      price:
        data.discountedPrice > 0 && data.discountedPrice < data.price
          ? data.discountedPrice
          : data.price,
    });
  };

  const key = data.category.toLowerCase().replace(/ /g, "_");
  const categoryIconSrc =
    categoryIcons[key] ||
    "https://letstryawsbucket.s3.eu-north-1.amazonaws.com/images/products/cakes.png";

  return (
    <div className="w-full bg-white">
      <MetaTag
        title={`${data?.name} - Premium Healthy Snacks | Letstry`}
        description={`Buy ${data?.name} online. ${
          data?.description || "Delicious and healthy snacks"
        } starting at ₹${
          data?.discountedPrice > 0 ? data?.discountedPrice : data?.price
        }. Free delivery above ₹299.`}
        ogTitle={`${data?.name} | Letstry - Healthy Snacks`}
        ogDescription={`Shop ${data?.name} - ${
          data?.description || "Premium quality healthy snacks"
        } with fast delivery and best prices.`}
      />
      <div className="max-w-[1200px] py-10 px-6 mx-auto">
        <div className="flex flex-col lg:flex-row  gap-4 lg:justify-between items-center">
          {/* Left: Product Image */}
          <div className="w-[260px] lg:w-[450px] lg:h-[417px] h-[280px] flex flex-col border rounded-[15px] overflow-y-auto overflow-x-hidden p-4 gap-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="flex-shrink-0 w-full flex justify-center items-center">
              <img
                src={data.imageUrl}
                alt={data.name}
                className="w-full lg:h-[360px] h-[230px] object-contain"
                loading="lazy"
              />
            </div>
  
          </div>

          {/* Right: Product Info Box */}
          <div className="w-full lg:w-[550px] flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-black mb-0 pb-0">
              {data.name}
            </h1>
            <hr className="w-full border-gray-700 my-0" />

            <div className="flex items-center gap-3 text-sm text-gray-600 my-0 py-0">
              <img
                src={categoryIconSrc}
                alt={data.category}
                className="max-w-full h-10 flex-shrink-0"
              />
              <div className="flex flex-col my-0 py-0">
                <span className="font-medium text-black text-[15px] lg:text-[18px] ">
                  {data.category}
                </span>
                <Link
                  to={`/category/${data.category}`}
                  className="text-[#0C5273] mt-1 no-underline"
                >
                  Explore all products
                </Link>
              </div>
              <div className="ml-auto">
                <Link
                  to={`/category/${data.category}`}
                  className="mt-1 no-underline"
                >
                  <GoArrowRight className="text-black text-[18px] lg:text-[22px] text-right" />
                </Link>
              </div>
            </div>

            <hr className="w-full border-gray-700 mt-0 mb-2" />

            <div className="border border-gray-200 rounded-[15px] px-4 pb-3 pt-2 space-y-3 h-auto">
              {data.discountedPrice > 0 && data.discountedPrice < data.price ? (
                <>
                  <div className="text-[14px] lg:text-[20px] font-[600] text-black">
                    <span>₹{data.discountedPrice.toFixed(2)} </span>
                    <span className="line-through text-[12px] lg:text-[18px] text-[#00000091] font-[400]">
                      MRP ₹{data.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Tax included. Shipping calculated at checkout.
                  </div>
                  {data.discountPercent > 0 && (
                    <div className="text-[12px] lg:text-[18px] text-[#3149A6] font-[500]">
                      {data.discountPercent}% off
                    </div>
                  )}
                </>
              ) : (
                <>
                  {" "}
                  <div className="text-[14px] lg:text-[20px] font-[600] text-center text-black">
                    ₹{data.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tax included. Shipping calculated at checkout.
                  </div>
                </>
              )}

              <div className="text-sm">
                <span className="font-medium">Size:</span> {data.unit}
              </div>
      
              <div>
                {quantites[id] > 0 ? (
                  <div className="flex items-center ">
                    <button
                      className="w-[50px] h-10 text-[18px] py-2 px-3 border-2 border-[#0C5273] text-[#0C5273] bg-[#0C527326] font-[600] rounded-l"
                      onClick={() => decreaseQty(id)}
                    >
                      <FiMinus />
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={quantites[id]}
                      className="w-[130px] h-10 text-[18px] text-center border-y-2 border-[#0C5273] text-black bg-white font-[500]"
                    />
                    <button
                      className="w-[50px] h-10 text-[18px] py-2 px-[15px] border-2 border-[#0C5273] text-[#0C5273] bg-[#0C527326] font-[600] rounded-r"
                      onClick={handleAddToCart}
                    >
                      <FiPlus />
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-[#004D66] lg:hover:bg-[#00384C] text-white w-[230px] h-10 rounded-[3px] transition text-center font-semibold"
                    onClick={handleAddToCart}
                  >
                    Add To Cart
                  </button>
                )}
              </div>

              {/* Small screen product info */}
              <div className="lg:hidden mt-4">
                <div
                  className={` cursor-pointer`}
                  onClick={() => setOpens(!opens)}
                >
                  <span className="font-bold text- text-black inline-block">
                    Product Info &nbsp;
                  </span>
                  {opens ? (
                    <GoChevronUp className="text-[17px] text-black inline-block" />
                  ) : (
                    <GoChevronDown className="text-[17px] text-black inline-block" />
                  )}
                </div>
                <Collapse in={opens}>
                  <div className="bg-white overflow-x-auto">
                    <table className="min-w-full text-[13px]">
                      <tbody>
                        <tr className="border-b">
                          <th className="w-[110px] text-left py-3 font-medium align-top text-black">
                            Description
                          </th>
                          <td className="py-3  text-[#000000A8]">
                            {data?.description?.image && (
                              <img
                                src={data?.description?.image}
                                // src={Chana_image}
                                alt={data.name}
                                className="w-32 h-32 object-contain mb-4"
                              />
                            )}

                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: data?.description?.description,
                              }}
                            />
                          </td>
                        </tr>
                        <tr className="border-b text-black">
                          <th className="text-left py-3 font-medium align-top">
                            Unit
                          </th>
                          <td className=" py-3 text-[#000000A8]">
                            {data.unit}
                          </td>
                        </tr>
                        <tr className="border-b text-black">
                          <th className="text-left py-3 font-medium align-top">
                            Flavour
                          </th>
                          <td className="py-3 text-[#000000A8]">
                            {data.flavour}
                          </td>
                        </tr>
                        <tr className="border-b text-black">
                          <th className="text-left -3 font-medium align-top">
                            Shelf Life
                          </th>
                          <td className=" py-3 text-[#000000A8]">
                            {data.shelfLife}
                          </td>
                        </tr>
                        <tr className="border-b text-black">
                          <th className="text-left py-3 font-medium align-top">
                            Diet Preference
                          </th>
                          <td className="py-3 text-[#000000A8]">
                            {data.dietPreference}
                          </td>
                        </tr>
                        <tr className="border-b text-black">
                          <th className="text-left py-3 font-medium align-top">
                            Refund Policy
                          </th>
                          <td className="py-3 whitespace-pre-line text-[#000000A8]">
                            {data.refundPolicy}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-left py-3 font-medium align-top text-black">
                            Disclaimer
                          </th>
                          <td className=" py-3 whitespace-pre-line text-[#000000A8]">
                            {data.disclaimer}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>

        {/* Large screen collapsible product info */}
        <div className="hidden lg:block">
          <div
            className={`border border-gray-300 ${
              open ? "border-b-0" : "border-b"
            } rounded-t-[15px] bg-white w-full px-4 py-4 mt-10 flex justify-between items-center cursor-pointer`}
            onClick={() => setOpen(!open)}
          >
            <span className="font-bold text-gray-800">Product Info</span>
            {open ? (
              <GoChevronUp className="text-lg text-gray-600" />
            ) : (
              <GoChevronDown className="text-lg text-gray-600" />
            )}
          </div>
        </div>
        <Collapse in={open}>
          <div className="border-x border-b border-gray-300 rounded-b-[15px] bg-white overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <th className="w-[200px] text-left text-black px-4 py-3 font-medium align-top bg-gray-50">
                    Description
                  </th>
                  <td className="px-6 py-3 text-[#000000A8]">
                    <div className="flex justify-center items-center">
                      {data?.description?.image && (
                        <img
                          src={data?.description?.image}
                          // src={Chana_image}
                          alt={data.name}
                          className="w-auto h-auto object-contain mb-4"
                        />
                      )}
                    </div>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: data?.description?.description,
                      }}
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 text-black font-medium align-top bg-gray-50">
                    Unit
                  </th>
                  <td className="px-6 py-3 text-[#000000A8]">{data.unit}</td>
                </tr>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 text-black font-medium align-top bg-gray-50">
                    Flavour
                  </th>
                  <td className="px-6 py-3 text-[#000000A8]">{data.flavour}</td>
                </tr>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 text-black font-medium align-top bg-gray-50">
                    Shelf Life
                  </th>
                  <td className="px-6 py-3 text-[#000000A8]">
                    {data.shelfLife}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 text-black font-medium align-top bg-gray-50">
                    Diet Preference
                  </th>
                  <td className="px-6 py-3 text-[#000000A8]">
                    {data.dietPreference}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 text-black font-medium align-top bg-gray-50">
                    Refund Policy
                  </th>
                  <td className="px-6 py-3  text-[#000000A8] whitespace-pre-line">
                    {data.refundPolicy}
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3 text-black font-medium align-top bg-gray-50">
                    Disclaimer
                  </th>
                  <td className="px-6 py-3  text-[#000000A8] whitespace-pre-line">
                    {data.disclaimer}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default FoodDetails;
