import React, { createContext, useState, useRef, useEffect } from 'react';
import { fetchFoodList } from '../service/foodService';
import { addToCart, getCartData, removeQtyFromCart } from '../service/cartService';
import { useAuth } from './AuthContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchComboList } from '../service/comboService';
import { fetchGiftingProducts } from '../service/foodService';
import { useAddresses } from './AddressContext';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase.config';
const API_BASE =  import.meta.env.VITE_API_URL;

export const CartContext = createContext(null);

export function toGa4Item(item){
  return {
    item_id : String(item.id),
    item_name: item.name || item.title,
    item_category: item.category || 'food',
    price: Number(item.discountedPrice > 0 ? item.discountedPrice : item.price),
    quantity: 1,
  }
}

export function logAddToCart(item, qtyDelta, currency = 'INR') {
  const gaItem = { ...toGa4Item(item), quantity: qtyDelta };
  const value = (gaItem.price || 0) * qtyDelta;
  logEvent(analytics, 'add_to_cart', { currency, value, items: [gaItem] });
}

export function logRemoveFromCart(item, qtyDelta, currency = 'INR') {
  const gaItem = { ...toGa4Item(item), quantity: qtyDelta };
  const value = (gaItem.price || 0) * qtyDelta;
  logEvent(analytics, 'remove_from_cart', { currency, value, items: [gaItem] });
}


export const CartContextProvider = ({ children }) => {
  const [quantites, setQuantites] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState(null);
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);
  const { selectedAddress } = useAddresses();
  // Charges/state based on new quote API
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [handlingCharge, setHandlingCharge] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(0);

  // Legacy threshold kept for UI compatibility; server decides charges now
  const [deliveryThreshold, setDeliveryThreshold] = useState(500);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const drawerTimeoutRef = useRef(null);
  const { idToken } = useAuth();
  const auth = getAuth();

  // Location inputs for quote
  const shippingState = selectedAddress?.state || '';
  const shippingPincode = selectedAddress?.pincode || '';

  // === LocalStorage helpers + hydration guard ===
  const GUEST_CART_KEY = 'guestCart';

  const findItemById = (id) => allCartItems.find(p => String(p.id) === String(id));

  const readGuestCart = () => {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveGuestCart = (cart) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch {}
  };

  const normalizeState = (s) =>
  (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

  // Prevent clobbering localStorage during hydration transitions
  const hydratingRef = useRef(false);

  // Initial mount: hydrate from localStorage when not logged in
  useEffect(() => {
    if (!idToken) {
      hydratingRef.current = true;
      const gc = readGuestCart();
      setQuantites(gc);
      hydratingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth state change: merge on login, hydrate on logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();

        // 1) Merge guest cart -> backend
        const guestCartObj = readGuestCart();
        for (const [foodId, qty] of Object.entries(guestCartObj)) {
          for (let i = 0; i < qty; i++) {
            try {
              await addToCart(foodId, token);
            } catch (err) {}
          }
        }
        // 2) Clear guest cart after merge
        localStorage.removeItem(GUEST_CART_KEY);

        // 3) Load backend cart and mirror to state (do NOT save to guest cart)
        try {
          const items = await getCartData(token);
          const quantitiesFromServer = {};
          items.forEach((item) => {
            quantitiesFromServer[item.id] = item.quantity;
          });
          setQuantites(quantitiesFromServer);
        } catch (error) {
          console.error('Error fetching cart data:', error);
          setQuantites({});
        }
      } else {
        // Logout: hydrate from guest cart (should be empty after login)
        hydratingRef.current = true;
        const gc = readGuestCart();
        setQuantites(gc);
        hydratingRef.current = false;
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Single guarded persistence: mirror state to localStorage for guests only
  useEffect(() => {
    if (hydratingRef.current) return;
    if (!idToken) {
      saveGuestCart(quantites);
    }
  }, [quantites, idToken]);

  // Catalog for totals and suggestions
  const [allProducts, setAllProducts] = useState([]);
  const [allCombos, setAllCombos] = useState([]);
  const [allGiftProducts, setAllGiftProducts] = useState([]);

  useEffect(() => {
    fetchFoodList().then(setAllProducts).catch(() => {});
    fetchComboList().then(setAllCombos).catch(() => {});
    fetchGiftingProducts().then(setAllGiftProducts).catch(() => {});
  }, []);

  const allCartItems = [...allProducts, ...allCombos, ...allGiftProducts];

  const cartItems = (allCartItems || [])
    .filter((item) => (quantites?.[item.id] || 0) > 0)
    .map((item) => ({ ...item, quantity: quantites[item.id] || 0 }));

  const itemTotal = cartItems.reduce((acc, item) => {
    const price =  item.price;
    return acc + price * item.quantity;
  }, 0);

  // Coupon logic
  useEffect(() => {
    if (appliedCoupon && itemTotal < appliedCoupon.minOrderValue) {
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
    }
  }, [itemTotal, appliedCoupon]);

  // Calculate actual item prices (already discounted prices)
  const actualItemTotal = cartItems.reduce((acc, item) => {
    const price = item.discountedPrice > 0 && item.discountedPrice < item.price 
      ? item.discountedPrice 
      : item.price;
    return acc + (price * item.quantity);
  }, 0);

  // Calculate product discount (difference between original and discounted price)
  const productDiscount = cartItems.reduce((acc, item) => {
    const originalPrice = item.price;
    const discountedPrice = item.discountedPrice;
    const discountPerItem = originalPrice - discountedPrice;
    return acc + (discountPerItem * item.quantity);
  }, 0);

  // Apply coupon on actual (already discounted) item total
  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    if (actualItemTotal < appliedCoupon.minOrderValue) return 0;
    const rawDiscount = (appliedCoupon.discountPercent / 100) * actualItemTotal;
    return Math.min(rawDiscount, appliedCoupon.maxDiscount);
  };

  const actualCouponDiscount = getCouponDiscount();

  // Total discount shown to user (product discount + coupon discount)
  const couponDiscount = productDiscount + actualCouponDiscount;
  
  // Subtotal after applying coupon discount on actual item total
  const subtotal = actualItemTotal - actualCouponDiscount
  // Quote effect: call new API with subtotal, state, pincode
  useEffect(() => {
    const getQuote = async () => {
      // Reset when cart empty
      if ((itemTotal || 0) === 0) {
        setDeliveryCharge(0);
        setHandlingCharge(0);
        setGstPercentage(0);
        setDeliveryThreshold(500);
        return;
      }
      try {
        const params = new URLSearchParams({
          subtotal: String(Number(subtotal.toFixed(2))),
          state: normalizeState(shippingState) || '',
          pincode: shippingPincode || '',
        });
        const res = await fetch(`${API_BASE}/api/charges/quote?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Quote failed');
        const data = await res.json();
        setDeliveryCharge(Number(data.deliveryCharge || 0));
        setHandlingCharge(Number(data.handlingCharge || 0));
        setGstPercentage(Number(data.gstPercentage || 0));

        // Threshold now server-driven; keep default for any dependent UI
        setDeliveryThreshold(500);
      } catch (err) {
        // Fail-safe zeros
        setDeliveryCharge(0);
        setHandlingCharge(0);
        setGstPercentage(0);
      }
    };
    getQuote();
  }, [subtotal, shippingState, shippingPincode, itemTotal]);

  // Totals (computed locally to match server parts)
  const gstBase = (handlingCharge || 0) + (deliveryCharge || 0);
  const gst = ((gstBase) * (gstPercentage || 0)) / 100;
  const grandTotal = subtotal + (deliveryCharge || 0) + (handlingCharge || 0) + gst;

  // Suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      try {
        const list = await fetchFoodList();
        const unused = list.filter(
          (item) => !quantites?.[item.id] || quantites[item.id] === 0
        );
        setSuggestions(unused.slice(0, 3));
      } catch (e) {
        setSuggestions([]);
      }
    };
    getSuggestions();
  }, [quantites]);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
  };

  const triggerCartDrawer = (item) => {
    setRecentlyAddedItem(item);
    setShowDrawer(true);
    if (drawerTimeoutRef.current) {
      clearTimeout(drawerTimeoutRef.current);
    }
    drawerTimeoutRef.current = setTimeout(() => {
      if (!isDrawerHovered) {
        setShowDrawer(false);
      }
    }, 3000);
  };

  // Cart functions: only save guest cart for guests
  const increaseQty = async (foodId, token = idToken) => {
    const item = findItemById(foodId);
    // optimistic update
    setQuantites((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    // backend
    if (token) await addToCart(foodId, token);
    else saveGuestCart({ ...quantites, [foodId]: (quantites[foodId] || 0) + 1 });
    // analytics (qty delta = 1)
    if (item) logAddToCart(item, 1, 'INR');
  };

  const decreaseQty = async (foodId, token = idToken) => {
    const item = findItemById(foodId);
    setQuantites((prev) => ({ ...prev, [foodId]: Math.max((prev[foodId] || 0) - 1, 0) }));
    if (token) await removeQtyFromCart(foodId, token);
    else {
      const updated = { ...quantites, [foodId]: Math.max((quantites[foodId] || 0) - 1, 0) };
      saveGuestCart(updated);
    }
    if (item) logRemoveFromCart(item, 1, 'INR');
  };

const removeFromCart = async (foodId, token = idToken) => {
  const qty = quantites?.[foodId] || 0;
  if (qty === 0) return;
  const item = findItemById(foodId);

  // optimistic wipe
  setQuantites((prev) => {
    const updated = { ...prev };
    delete updated[foodId];
    return updated;
  });

  if (token) {
    // your existing loop remains
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    for (let i = 0; i < qty; i++) {
      try {
        await fetch(`${API_BASE}/api/cart/subtract`, {
          method: 'POST', headers, body: JSON.stringify({ foodId }),
        });
        await new Promise((res) => setTimeout(res, 50));
      } catch (err) { console.error(`Failed to remove item ${i + 1}:`, err); }
    }
  } else {
    const updated = { ...quantites };
    delete updated[foodId];
    saveGuestCart(updated);
  }

  // analytics: remove all remaining units at once
  if (item && qty > 0) logRemoveFromCart(item, qty, 'INR');
};

  const loadCartData = async (token = idToken) => {
    try {
      const items = await getCartData(token);
      const quantitiesFromServer = {};
      items.forEach((item) => {
        quantitiesFromServer[item.id] = item.quantity;
      });
      setQuantites(quantitiesFromServer);
      // Do NOT save to guest cart when logged in
    } catch (error) {
      console.error('Failed to load cart data:', error);
    }
  };

  useEffect(() => {
    if (!isDrawerHovered && showDrawer) {
      drawerTimeoutRef.current = setTimeout(() => {
        setShowDrawer(false);
      }, 3000);
    } else {
      clearTimeout(drawerTimeoutRef.current);
    }
  }, [isDrawerHovered, showDrawer]);

  return (
    <CartContext.Provider
      value={{
        quantites,
        setQuantites,
        increaseQty,
        decreaseQty,
        removeFromCart,
        loadCartData,
        showCart,
        setShowCart,
        showDrawer,
        setShowDrawer,
        recentlyAddedItem,
        triggerCartDrawer,
        isDrawerHovered,
        setIsDrawerHovered,
        // Charges and location
        deliveryCharge,
        deliveryThreshold,
        handlingCharge,
        gstPercentage,
        shippingState,
        shippingPincode,
        // Coupons and totals
        appliedCoupon,
        setAppliedCoupon,
        handleRemoveCoupon,
        // Catalog and cart calc
        suggestions,
        cartItems,
        itemTotal,
        couponDiscount,
        subtotal,
        gst,
        grandTotal,
        actualCouponDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
