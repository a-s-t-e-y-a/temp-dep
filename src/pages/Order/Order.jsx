// import React, { useContext, useState } from 'react';
// import { StoreContext } from '../../context/StoreContext';
// import paytm from '../../assets/paytm.png';
// import googlepay from '../../assets/googlepay.png';
// import phonepe from '../../assets/phonepe.png';
// import bankaccount from '../../assets/bankaccount.png';
// import Header from '../../components/Header/Header';
// import { IoClose } from 'react-icons/io5';
// import PaymentTimer from '../PaymentTimer/PaymentTimer';
// import { useLocation } from 'react-router-dom';
// import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
// import { assets } from '../../assets/assets';
// import { BiPlus } from 'react-icons/bi';
// import { Collapse } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useAddresses } from '../../context/AddressContext';
// import { useAuth } from '../../context/AuthContext';
// import { ismobile } from 'react-device-detect';
// import { CartContext } from '../../context/CartContext';
// import { initiateUpiIntent } from '../../service/paymentService';
// import { logEvent } from 'firebase/analytics';
// import { analytics } from "../../firebase.config";

// const API_BASE = 'http://192.168.1.22:8000';

// // ******** TABBED UPI + CARD COMPONENT ***********
// const UpiSection = ({
//   selectedMethod,
//   setSelectedMethod,
//   customUpiId,
//   setCustomUpiId,
//   qrCodeUrl,
//   isQrPage,
//   setIsQrPage,
//   handleGenerateQr,
//   handleUpiIntentPayment,
//   setShowCardModal,
//   handleAddId,
//   isChecked,
//   setIsChecked,
//   selectedUpi,
//   setSelectedUpi,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [opens, setOpens] = useState(false);
//   const { selectedAddress } = useAddresses();

//   const upiApps = [
//     { id: 'paytm', name: 'Paytm UPI', icon: paytm },
//     { id: 'googlepay', name: 'Google Pay', icon: googlepay },
//     { id: 'phonepe', name: 'PhonePe', icon: phonepe },
//   ];

//   return (
//     <div className="border-[2px] border-[#D9D9D9] rounded-[10px] py-3 bg-white">
//       {selectedMethod === 'upiapp' &&
//         (!isQrPage ? (
//           <>
//             <button
//               className="rounded-tl-lg w-full rounded-bl-lg font-[500] text-[17px] text-black"
//               onClick={() => {
//                 setSelectedMethod('upiapp');
//                 setOpens(!opens); // Toggle collapse here
//               }}
//               type="button"
//             >
//               <div className="flex px-6 w-full justify-between">
//                 <div>Pay by any UPI App</div>
//                 <div
//                   className={`pt-2 text-[14px] transition-transform duration-300 ${
//                     opens ? 'rotate-180' : ''
//                   }`}
//                 >
//                   <FaChevronDown />
//                 </div>
//               </div>
//             </button>

//             <Collapse in={opens}>
//               <div>
//                 {/* UPI options and QR code */}
//                 <div className="hidden lg:block md:block">
//                   <div className="flex flex-row  px-6 pt-2">
//                     <div className="flex flex-col">
//                       <div className="mb-3 text-[#7A7A7A] font-[400] lg:text-[17px] md:text-[15px]">
//                         Scan the QR using any UPI app on your phone like PhonePe, Paytm, GooglePay
//                       </div>
//                       <div className="flex mb-4 gap-4">
//                         <img src={paytm} alt="Paytm" className="h-7 max-w-full" />
//                         <img src={googlepay} alt="GooglePay" className="h-7 max-w-full" />
//                         <img src={phonepe} alt="PhonePe" className="h-7 max-w-full" />
//                       </div>
//                       <button
//                         onClick={handleGenerateQr}
//                         className="md:mb-2 max-w-[340px] bg-[#0C5273] text-white font-semibold lg:py-2 md:py-1 rounded lg:hover:bg-[#0C5273] transition"
//                       >
//                         Generate QR Code
//                       </button>
//                     </div>
//                     <img
//                       src={assets.upi}
//                       alt="upi payment"
//                       className="lg:h-44 md:h-40 pb-0 mb-0 max-w-full"
//                     />
//                   </div>
//                 </div>
//                 <div className="hidden lg:block md:block">
//                   <div className="flex items-center gap-4 ">
//                     <hr className="flex-grow border-t [#D9D9D9]" />
//                     <span className="text-[#BEBDBD] text-[14px]">OR</span>
//                     <hr className="flex-grow border-t [#D9D9D9]" />
//                   </div>
//                 </div>
//                 <div className="block lg:hidden md:hidden px-4 border-t mt-2 py-2">
//                   <div className="flex flex-col gap-3">
//                     {upiApps.map((app) => (
//                       <div key={app.id} className="flex flex-col gap-2">
//                         <label
//                           htmlFor={`upi-${app.id}`}
//                           className="flex items-center justify-between w-full cursor-pointer"
//                         >
//                           <div className="flex items-center gap-3">
//                             <img src={app.icon} className="w-8 max-h-full" alt={app.name} />
//                             <div className="text-[14px] font-[500]">{app.name}</div>
//                           </div>
//                           <input
//                             id={`upi-${app.id}`}
//                             type="radio"
//                             name="upi"
//                             checked={selectedUpi === app.id}
//                             onChange={() => setSelectedUpi(app.id)}
//                             className="accent-[#0C5273]"
//                           />
//                         </label>

//                         {selectedUpi === app.id && (
//                           <button
//                             onClick={handleUpiIntentPayment}
//                             className="bg-[#0C5273] text-white text-[14px] w-[170px] rounded-md py-2 font-medium "
//                           >
//                             Pay via {app.name}
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="pt-2 px-6">
//                   <div
//                     className="flex items-center mb-2 gap-2 cursor-pointer"
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="rounded-full border-2 border-[#0C5273] text-[#0C5273] font-semibold w-5 h-5 flex items-center justify-center">
//                       <BiPlus strokeWidth={1.5} />
//                     </span>
//                     <span className="font-[700] text-[#0C5273]">Pay via UPI ID</span>
//                   </div>

//                   <Collapse in={open}>
//                     <div className="lg:ml-[30px] md:ml-[30px] pb-2">
//                       <input
//                         type="text"
//                         placeholder="Enter your UPI ID"
//                         className="lg:w-[280px] md:w-[280px] w-[full] max-w-md mb-3 font-[600] text-black px-3 p-2 border-[1px] border-[#0C5273] rounded"
//                         value={customUpiId}
//                         onChange={(e) => setCustomUpiId(e.target.value)}
//                       />
//                       <div>
//                         <button
//                           onClick={handleAddId}
//                           className="lg:w-[280px] md:w-[280px] w-full bg-[#0C5273] text-white p-2 rounded font-semibold"
//                         >
//                           Proceed to Pay
//                         </button>
//                       </div>
//                     </div>
//                   </Collapse>
//                 </div>
//               </div>
//             </Collapse>
//             <div className="mt-3 pt-3 border-t border-[#D9D9D9]">
//               <div className=" px-6">
//                 <div className="text-[17px] font-[500] text-black">Credit & Debit Cards</div>
//                 <button
//                   onClick={() => setShowCardModal(true)}
//                   className="w-full flex items-center gap-4  pt-3  bg-white  font-semibold text-[#0C5273]"
//                 >
//                   <img src={bankaccount} alt="BankAccount" className="w-6" />
//                   <span className="font-medium text-[#0C5273] font-bold text-sm">Pay via Card</span>
//                 </button>
//               </div>
//               <div className="block lg:hidden md:hidden">
//                 <div className="border-t-[2.5px] border-[#D9D9D9] mt-3 px-4 pt-3 pb-1">
//                   <h3 className="text-[18px] font-[400] text-[#696767] mb-2">Delivery address</h3>
//                   <div className="flex justify-between items-center">
//                     <div className="text-[14px] text-[#939393] leading-snug">
//                       {selectedAddress
//                         ? [
//                             selectedAddress.buildingName,
//                             selectedAddress.street,
//                             selectedAddress.city,
//                             selectedAddress.pincode,
//                           ]
//                             .filter(Boolean)
//                             .join(', ')
//                         : ''}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="px-6 border-b mb-4 pb-2">
//               <button onClick={() => setIsQrPage(false)} className=" text-left text-black">
//                 <div className="flex flex-row gap-4">
//                   <div className="pt-1">
//                     <FaChevronLeft />
//                   </div>
//                   <div className="font-[500] text-[16px]">Go Back</div>
//                 </div>
//               </button>
//             </div>
//             <div className="text-center">
//               <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-44 h-44 mb-2" />
//               <p className="font-semibold mb-2 text-[16px] text-[#7A7A7A]">Scan QR and Pay</p>

//               <div className="flex justify-center gap-4 mb-4">
//                 <img src={phonepe} alt="PhonePe" className="h-7 max-w-full" />
//                 <img src={googlepay} alt="GooglePay" className="h-7 max-w-full" />
//                 <img src={paytm} alt="Paytm" className="h-7 max-w-full" />
//               </div>
//               <p className="text-[14px] text-black ">
//                 Scan the QR from your mobile phone using any UPI app
//                 <br />
//                 such as PhonePe, GooglePay, Paytm, etc.
//               </p>
//             </div>
//           </>
//         ))}

//       {/* Card Tab Content */}
//       {/* NOTHING here! Card button will always be shown below, not conditionally rendered */}

//       {/* === Pay via Card button (ALWAYS SHOW BELOW TABS) === */}
//     </div>
//   );
// };

// // ************** ORDER COMPONENT ***************
// const Order = () => {
//   const { allProducts } = useContext(StoreContext);
//   const { quantites } = useContext(CartContext);
//   const { idToken } = useAuth();

//   const [selectedUpi, setSelectedUpi] = useState('');
//   const [showCardModal, setShowCardModal] = useState(false);
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [customUpiId, setCustomUpiId] = useState('');
//   const [showUpiModal, setShowUpiModal] = useState(false);
//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: '',
//     nameOnCard: '',
//     expiry: '',
//     cvv: '',
//   });
//   const [orderData, setOrderData] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [redirectTimer, setRedirectTimer] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState('upiapp');
//   const [isQrPage, setIsQrPage] = useState(false);
//   const [qrCodeUrl, setQrCodeUrl] = useState('');
//   const [isQrVisible, setIsQrVisible] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const userEmail = 'tech@letstryfoods.com'; // Replace with actual user email
//   const navigate = useNavigate();
//   const totalCount = Object.values(quantites).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
//   const cartItems = allProducts.filter((food) => quantites[food.id] > 0);
//   const location = useLocation();
//   const total = location.state?.total || 0;
//   const promoCode = location.state?.promoCode || '';

//   const { selectedAddress } = useAddresses();


//   const buildItemsAndValue = (cartItems) => {
//     const items = cartItems.map((it, idx) => {
//       const price = it.discountedPrice > 0 && it.discountedPrice < it.price ? it.discountedPrice : it.price;
//       return {
//         item_id: String(it.id),
//         item_name: it.name,
//         item_brand: it.brand || "LetsTryFoods",
//         item_category: it.category || "Snacks",
//         item_variant: it.unit || it.weight || undefined,
//         price: Number(Number(price).toFixed(2)),
//         quantity: Number(it.quantity || 1),
//         index: idx,
//       };
//     });
//     const value = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
//     return { items, value: Number(value.toFixed(2)) };
//   };

//   const trackAddPaymentInfo = ({ paymentType, couponCode }) => {
//     if (!analytics) return;
//     const { items, value } = buildItemsAndValue(cartItems);
//     logEvent(analytics, "add_payment_info", {
//       currency: "INR",
//       value,
//       coupon: couponCode || undefined,
//       payment_type: paymentType, // e.g., "UPI - QR", "UPI - Paytm", "Card"
//       items,
//     });
//   };

//   const getVpaForSelectedUpi = (upi) => {
//     switch (upi) {
//       case 'paytm':
//         return 'test@paytm';
//       case 'google':
//         return 'test@okaxis';
//       case 'phonepe':
//         return 'test@ybl';
//       default:
//         return customUpiId;
//     }
//   };

//   const handleUpiIntentPayment = async () => {
//     const order = await placeOrder();
//     navigate('/payment/timer');
//     if (!order?.orderId) {
//       alert('Order could not be placed.');
//       return;
//     }

//     try {
//       const intentData = {
//         orderId: order.orderId,
//         amount: total.toFixed(2),
//         email: userEmail,
//         vpa: 'notReq@upi',
//       };

//       const result = await initiateUpiIntent(intentData, idToken);
//       if (result.responseCode === "208" && result.bankPostData) {
//         let upiUrl;
//         switch (selectedUpi) {
//           case 'googlepay':
//             upiUrl = result.bankPostData.gpayIntentIosUrl || result.bankPostData.androidIntentUrl;
//             break;
//           case 'phonepe':
//             upiUrl = result.bankPostData.phonepeIntentIosUrl || result.bankPostData.androidIntentUrl;
//             break;
//           case 'paytm':
//             upiUrl = result.bankPostData.paytmIntentIosUrl || result.bankPostData.androidIntentUrl;
//             break;
//           default:
//             upiUrl = result.bankPostData.androidIntentUrl;
//         }

//         if (upiUrl) {
//           trackAddPaymentInfo({
//             paymentType: selectedUpi === 'googlepay' ? 'UPI - Google Pay'
//              : selectedUpi === 'phonepe' ? 'UPI - PhonePe'
//              : selectedUpi === 'paytm' ? 'UPI - Paytm'
//              : 'UPI - Intent',
//             couponCode: location.state?.promoCode
//             });
//           window.location.href = upiUrl;
//         } else {
//           console.error('Intent URL not found for selected UPI app.');
//         }
//       } else {
//         console.error('Intent payment failed or missing bankPostData.');
//       }
//     } catch (err) {
//       console.error('Failed to initiate UPI Intent payment:', err);
//     }
//   };

//   // UPI PAYMENT
//   const initiateUpiPayment = async (orderId, amount, email, vpa) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE}/api/zaakpay/upi-collect`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify({ orderId, amount, email, vpa }),
//       });
//       const data = await response.json();
//       setPaymentStatus(data.responseDescription);
//       if (data.doRedirect && data.postUrl) {
//         setRedirectTimer(true);
//         setTimeout(() => {
//           window.location.href = data.postUrl;
//         }, 1000);
//       }
//       return data;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCustomUpiPayment = async () => {
//     if (!selectedAddress) {
//       alert('Please select a delivery address.');
//       return;
//     }
//     if (!customUpiId.trim()) {
//       alert('Please enter a valid UPI ID.');
//       return;
//     }

//     try {
//       setLoading(true);

//       // ⏳ 1. Place the order first
//       const order = await placeOrder();

//       if (!order || !order.orderId) {
//         alert('❌ Order could not be placed.');
//         return;
//       }
//       trackAddPaymentInfo({ paymentType: 'UPI - ID', couponCode: location.state?.promoCode });
//       // ✅ 2. Then initiate the UPI payment
//       const result = await initiateUpiPayment(order.orderId, total, userEmail, customUpiId.trim());

//       // ✅ 3. Navigate only if payment was initiated
//       navigate('/payment/timer', {
//         state: { orderId: order.orderId },
//       });

//       // 🧹 4. Clean up
//       setCustomUpiId('');
//     } catch (error) {
//       console.error('❌ Error in UPI Payment:', error);
//       alert('An error occurred during payment.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const initiateCardPayment = async (details) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE}/api/zaakpay/card`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${idToken}`,
//         },

//         body: JSON.stringify({
//           ...details,
//           amount: total.toFixed(2),
//           orderId: orderData?.orderId,
//           email: userEmail,
//           expiryMonth: details.expiry.split('/')[0],
//           expiryYear: '20' + details.expiry.split('/')[1],
//           cvv: details.cvv,
//           cardNumber: details.cardNumber.replace(/\s/g, ''),
//           nameOnCard: details.nameOnCard,
//         }),
//       });
//       const data = await response.json();
//       setPaymentStatus(data.responseDescription);
//       if (data.doRedirect && data.postUrl) {
//         setRedirectTimer(true);
//         setTimeout(() => {
//           window.location.href = data.postUrl;
//         }, 1000);
//       }
//       return data;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Payment button click handler for predefined UPI options
//   const handlePayment = async () => {
//     if (!selectedAddress) {
//       alert('Please select a delivery address.');
//       return;
//     }
//     const order = await placeOrder();
//     if (!order || !order.orderId) {
//       alert('Order could not be placed.');
//       return;
//     }
//     if (selectedMethod === 'card') {
//       setShowCardModal(true);
//     } else {
//       setShowUpiModal(true);
//       const vpa = getVpaForSelectedUpi(selectedUpi);
//       await initiateUpiPayment(order.orderId, total, userEmail, vpa);
//     }
//   };

//   const handleCardSubmit = async (e) => {
//     e.preventDefault();
//     trackAddPaymentInfo({ paymentType: 'Card', couponCode: location.state?.promoCode });
//     navigate('/payment');
//     initiateCardPayment(cardDetails);
//     setShowCardModal(false);
//   };

//   const handleGenerateQr = async () => {
//     const order = await placeOrder();

//     if (!order?.orderId) {
//       alert('Order could not be placed.');
//       return;
//     }

//     const response = await fetch(`${API_BASE}/api/zaakpay/upi-qr-web`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         orderId: order.orderId,
//         amount: total.toFixed(2),
//         email: userEmail,
//       }),
//     });

//     const data = await response.json();
//     trackAddPaymentInfo({ paymentType: 'UPI - QR', couponCode: location.state?.promoCode });

//     if (data?.bankPostData?.link) {
//       setQrCodeUrl(`data:image/png;base64,${data.bankPostData.link}`);
//       setIsQrPage(true);
//       setPaymentStatus('Waiting for payment...');

//       // ❗ This is key
//       pollStatus(data.orderDetail?.orderId || order.orderId);
//     }
//   };

//   const pollStatus = (orderId) => {
//     let retryCount = 0;
//     const maxRetries = 100;

//     const interval = setInterval(async () => {
//       if (retryCount >= maxRetries) {
//         clearInterval(interval);
//         setPaymentStatus('⚠️ Payment timed out. Please try again.');
//         return;
//       }

//       retryCount++;

//       try {
//         const res = await fetch(
//           `http://192.168.1.22:8000/api/zaakpay/status?orderId=${orderId}`,
//           {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${idToken}`,
//             },
//           },
//         );

//         const statusData = await res.json();

//         const status = statusData.status || statusData.txnStatus;


//         if (status === 'SUCCESS' || status === '0') {
//           clearInterval(interval);
//           setPaymentStatus('✅ Payment Successful!');
//           navigate('/order-confirmation', { state: { orderId } });
//         } else if (status === 'FAILED') {
//           clearInterval(interval);
//           setPaymentStatus('❌ Payment Failed!');
//           navigate('/payment/failed');
//         } else {
//           setPaymentStatus('⌛ Waiting for payment...');
//         }
//       } catch (err) {
//         console.error('Polling error:', err);
//       }
//     }, 6000);
//   };

//   const placeOrder = async () => {
//     if (!selectedAddress || cartItems.length === 0) {
//       alert('Please select a valid delivery address and add items to cart.');
//       return null;
//     }
//     const payload = {
//       addressId: selectedAddress.addressId,
//       promoCode: promoCode,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/api/orders/place`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       // console.log('Place Order Response:', data);
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to place order.');
//       }

//       setOrderData(data);
//       return data;
//     } catch (error) {
//       console.error('Order placement error:', error);
//       alert(error.message || 'Something went wrong while placing the order.');
//       return null;
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen relative">
//       <Header />
//       <div className="max-w-6xl mx-auto px-4 md:px-10 lg:px-20 py-6 ">
//         <h2 className="text-[20px] md:text-[36px] lg:text-[36px] text-black font-[600] pb-[8px]">
//           Select Payment Method
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 md:col-span-2 space-y-6">
//             <UpiSection
//               selectedMethod={selectedMethod}
//               setSelectedMethod={setSelectedMethod}
//               customUpiId={customUpiId}
//               setCustomUpiId={setCustomUpiId}
//               handleAddId={handleCustomUpiPayment}
//               qrCodeUrl={qrCodeUrl}
//               isQrPage={isQrPage}
//               setIsQrPage={setIsQrPage}
//               handleGenerateQr={handleGenerateQr}
//               setShowCardModal={setShowCardModal}
//               isChecked={isChecked}
//               setIsChecked={setIsChecked}
//               handleUpiIntentPayment={handleUpiIntentPayment}
//               selectedUpi={selectedUpi}
//               setSelectedUpi={setSelectedUpi}
//             />
//           </div>
//           <div className="space-y-4 hidden lg:block md:block">
//             <div className="border-[2px] border-[#D9D9D9] rounded-[10px]  ">
//               <div className="border-b-[2px] border-[#D9D9D9] p-3">
//                 <h3 className="text-[18px] font-[400] text-[#696767] mb-2">Delivery address</h3>
//                 <div className="flex justify-between items-center">
//                   <div className="text-[14px] text-[#939393] leading-snug">
//                     {selectedAddress
//                       ? [
//                           selectedAddress.buildingName,
//                           selectedAddress.street,
//                           selectedAddress.city,
//                           selectedAddress.pincode,
//                         ]
//                           .filter(Boolean)
//                           .join(', ')
//                       : ''}
//                   </div>
//                 </div>
//               </div>

//               <div className="border-b-[1px] border-[#D9D9D9] p-3">
//                 <h3 className="text-[18px] font-[400] text-[#939393] flex justify-between items-center">
//                   Cart items
//                   <span className="text-[18px] font-[400] text-[#939393]">
//                     {totalCount} items
//                   </span>
//                 </h3>
//                 <div className="text-sm max-h-[310px] overflow-y-auto hide-scrollbar">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center py-2">
//                       <img
//                         src={item.imageUrl}
//                         alt={item.name}
//                         className="w-[80px] h-[80px] object-contain"
//                       />
//                       <div className="flex-1 ml-3">
//                         <div className="lg:text-[14px] md:text-[12px] text-[#000000] font-[400] md:leading-tight">
//                           {item.name}
//                         </div>
//                         <div className="lg:text-[14px] md:text-[12px] text-[#000000] font-[400] ">
//                           Size: {item.unit}
//                         </div>
//                         <div className=" lg:text-[16px] md:text-[12px] font-[500] text-black lg:mt-2 md:mt-1">
//                           ₹ {item.discountedPrice > 0 ? item.discountedPrice : item.price}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-between px-3 py-2 font-[500] text-black text-[18px]">
//                 <span>Grand Total</span>
//                 <span className="text-[#0C5273] text-[18px] font-[700]">₹ {total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Card Modal */}
//       {showCardModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <form
//             className="bg-white rounded-lg lg:w-full  w-[80%] md:w-full max-w-sm h-[450px] relative flex flex-col p-6 pt-4"
//             onSubmit={handleCardSubmit}
//           >
//             <button
//               onClick={() => {
//                 setShowCardModal(false);
//                 setCardDetails({
//                   cardNumber: '',
//                   nameOnCard: '',
//                   expiry: '',
//                   cvv: '',
//                 });
//               }}
//               className="absolute top-[28px] right-5 text-gray-500 lg:hover:text-black text-xl font-bold"
//               type="button"
//             >
//               <IoClose />
//             </button>
//             <h2 className="text-[22px] text-center text-black font-[600] mb-4">Card Details</h2>
//             <div className="flex flex-col justify-between flex-grow">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-[16px] text-black font-[700]">Card Number</label>
//                   <input
//                     type="text"
//                     className="w-full mt-2 p-2 border text-black text-[13px] border-gray-300 rounded"
//                     placeholder="1234 5678 9000 0000"
//                     value={cardDetails.cardNumber}
//                     onChange={(e) =>
//                       setCardDetails({ ...cardDetails, cardNumber: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[16px] text-black font-[700]">
//                     Account Holder's Name
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full mt-2 text-black text-[13px] p-2 border border-gray-300 rounded"
//                     placeholder="Vipin Sharma"
//                     value={cardDetails.nameOnCard}
//                     onChange={(e) =>
//                       setCardDetails({ ...cardDetails, nameOnCard: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="flex gap-4">
//                   <div className="flex-1">
//                     <label className="block text-[16px] text-black font-[700]">Expiry Date</label>
//                     <input
//                       type="text"
//                       className="w-full mt-2 text-black text-[13px] p-2 border border-gray-300 rounded"
//                       placeholder="MM/YY"
//                       maxLength={5}
//                       value={cardDetails.expiry}
//                       onChange={(e) => {
//                         let value = e.target.value.replace(/[^\d]/g, ''); // only digits

//                         if (value.length === 1) {
//                           const digit = parseInt(value, 10);
//                           if (digit >= 2 && digit <= 9) {
//                             // Pad single digits 2–9
//                             value = '0' + digit + '/';
//                             setCardDetails({ ...cardDetails, expiry: value });
//                             return;
//                           } else {
//                             // Wait for 2-digit input for 1
//                             setCardDetails({ ...cardDetails, expiry: value });
//                             return;
//                           }
//                         }

//                         if (value.length === 2) {
//                           const month = parseInt(value, 10);
//                           if (month >= 1 && month <= 12) {
//                             value = value.padStart(2, '0') + '/';
//                           } else {
//                             return; // Invalid month
//                           }
//                         }

//                         if (value.length > 2 && !value.includes('/')) {
//                           value = value.slice(0, 2) + '/' + value.slice(2);
//                         }

//                         if (value.length > 5) return;

//                         // Validate expiry if fully entered
//                         if (value.length === 5) {
//                           const [mmStr, yyStr] = value.split('/');
//                           const month = parseInt(mmStr, 10);
//                           const year = parseInt('20' + yyStr, 10);

//                           if (month < 1 || month > 12 || isNaN(year)) return;

//                           const now = new Date();
//                           const expiry = new Date(year, month);
//                           const current = new Date(now.getFullYear(), now.getMonth() + 1);

//                           if (expiry < current) return; // Already expired
//                         }

//                         setCardDetails({ ...cardDetails, expiry: value });
//                       }}
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <label className="block text-[16px] text-black font-[700]">CVV</label>
//                     <input
//                       type="text"
//                       className="w-full mt-2 text-black text-[13px] p-2 border border-gray-300 rounded"
//                       placeholder="xxx"
//                       value={cardDetails.cvv}
//                       onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="pt-6 mt-auto">
//                 <button
//                   type="submit"
//                   className="w-full bg-[#004D66] text-white py-2  text-center rounded font-semibold"
//                 >
//                   Proceed for payment
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       )}
//       {/* UPI Modal */}
//       {showUpiModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-sm p-6 flex flex-col items-center">
//             <h2 className="text-xl font-bold mb-4">Processing UPI Payment</h2>
//             <p className="mb-4">{paymentStatus || 'Waiting for payment confirmation...'}</p>
//             <button
//               className="mt-2 bg-[#004D66] text-white px-6 py-2 rounded font-semibold"
//               onClick={() => setShowUpiModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//       {/* Location Modal */}
//       {showLocationModal && (
//         <LocationFlow
//           onClose={() => setShowLocationModal(false)}
//           onAddressChange={(address) => setSelectedAddress(address)}
//         />
//       )}
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg text-center font-bold text-lg">
//             Processing...
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Order;


import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import paytm from '../../assets/paytm.png';
import googlepay from '../../assets/googlepay.png';
import phonepe from '../../assets/phonepe.png';
import bankaccount from '../../assets/bankaccount.png';
import Header from '../../components/Header/Header';
import { IoClose } from 'react-icons/io5';
import PaymentTimer from '../PaymentTimer/PaymentTimer';
import { useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { assets } from '../../assets/assets';
import { BiPlus } from 'react-icons/bi';
import { Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAddresses } from '../../context/AddressContext';
import { useAuth } from '../../context/AuthContext';
import { ismobile } from 'react-device-detect';
import { CartContext } from '../../context/CartContext';
import { initiateUpiIntent } from '../../service/paymentService';
import { logEvent } from 'firebase/analytics';
import { analytics } from "../../firebase.config";

const API_BASE =  import.meta.env.VITE_API_URL;

// ******** TABBED UPI + CARD COMPONENT ***********
const UpiSection = ({
  selectedMethod,
  setSelectedMethod,
  customUpiId,
  setCustomUpiId,
  qrCodeUrl,
  isQrPage,
  setIsQrPage,
  handleGenerateQr,
  handleUpiIntentPayment,
  setShowCardModal,
  handleAddId,
  isChecked,
  setIsChecked,
  selectedUpi,
  setSelectedUpi,
}) => {
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const { selectedAddress } = useAddresses();

  const upiApps = [
    { id: 'paytm', name: 'Paytm UPI', icon: paytm },
    { id: 'googlepay', name: 'Google Pay', icon: googlepay },
    { id: 'phonepe', name: 'PhonePe', icon: phonepe },
  ];

  return (
    <div className="border-[2px] border-[#D9D9D9] rounded-[10px] py-3 bg-white">
      {selectedMethod === 'upiapp' &&
        (!isQrPage ? (
          <>
            <button
              className="rounded-tl-lg w-full rounded-bl-lg font-[500] text-[17px] text-black"
              onClick={() => {
                setSelectedMethod('upiapp');
                setOpens(!opens); // Toggle collapse here
              }}
              type="button"
            >
              <div className="flex px-6 w-full justify-between">
                <div>Pay by any UPI App</div>
                <div
                  className={`pt-2 text-[14px] transition-transform duration-300 ${
                    opens ? 'rotate-180' : ''
                  }`}
                >
                  <FaChevronDown />
                </div>
              </div>
            </button>

            <Collapse in={opens}>
              <div>
                {/* UPI options and QR code */}
                <div className="hidden lg:block md:block">
                  <div className="flex flex-row  px-6 pt-2">
                    <div className="flex flex-col">
                      <div className="mb-3 text-[#7A7A7A] font-[400] lg:text-[17px] md:text-[15px]">
                        Scan the QR using any UPI app on your phone like PhonePe, Paytm, GooglePay
                      </div>
                      <div className="flex mb-4 gap-4">
                        <img src={paytm} alt="Paytm" className="h-7 max-w-full" />
                        <img src={googlepay} alt="GooglePay" className="h-7 max-w-full" />
                        <img src={phonepe} alt="PhonePe" className="h-7 max-w-full" />
                      </div>
                      <button
                        onClick={handleGenerateQr}
                        className="md:mb-2 max-w-[340px] bg-[#0C5273] text-white font-semibold lg:py-2 md:py-1 rounded lg:hover:bg-[#0C5273] transition"
                      >
                        Generate QR Code
                      </button>
                    </div>
                    <img
                      src={assets.upi}
                      alt="upi payment"
                      className="lg:h-44 md:h-40 pb-0 mb-0 max-w-full"
                    />
                  </div>
                </div>
                <div className="hidden lg:block md:block">
                  <div className="flex items-center gap-4 ">
                    <hr className="flex-grow border-t [#D9D9D9]" />
                    <span className="text-[#BEBDBD] text-[14px]">OR</span>
                    <hr className="flex-grow border-t [#D9D9D9]" />
                  </div>
                </div>
                <div className="block lg:hidden md:hidden px-4 border-t mt-2 py-2">
                  <div className="flex flex-col gap-3">
                    {upiApps.map((app) => (
                      <div key={app.id} className="flex flex-col gap-2">
                        <label
                          htmlFor={`upi-${app.id}`}
                          className="flex items-center justify-between w-full cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img src={app.icon} className="w-8 max-h-full" alt={app.name} />
                            <div className="text-[14px] font-[500]">{app.name}</div>
                          </div>
                          <input
                            id={`upi-${app.id}`}
                            type="radio"
                            name="upi"
                            checked={selectedUpi === app.id}
                            onChange={() => setSelectedUpi(app.id)}
                            className="accent-[#0C5273]"
                          />
                        </label>

                        {selectedUpi === app.id && (
                          <button
                            onClick={handleUpiIntentPayment}
                            className="bg-[#0C5273] text-white text-[14px] w-[170px] rounded-md py-2 font-medium "
                          >
                            Pay via {app.name}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 px-6">
                  <div
                    className="flex items-center mb-2 gap-2 cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="rounded-full border-2 border-[#0C5273] text-[#0C5273] font-semibold w-5 h-5 flex items-center justify-center">
                      <BiPlus strokeWidth={1.5} />
                    </span>
                    <span className="font-[700] text-[#0C5273]">Pay via UPI ID</span>
                  </div>

                  <Collapse in={open}>
                    <div className="lg:ml-[30px] md:ml-[30px] pb-2">
                      <input
                        type="text"
                        placeholder="Enter your UPI ID"
                        className="lg:w-[280px] md:w-[280px] w-[full] max-w-md mb-3 font-[600] text-black px-3 p-2 border-[1px] border-[#0C5273] rounded"
                        value={customUpiId}
                        onChange={(e) => setCustomUpiId(e.target.value)}
                      />
                      <div>
                        <button
                          onClick={handleAddId}
                          className="lg:w-[280px] md:w-[280px] w-full bg-[#0C5273] text-white p-2 rounded font-semibold"
                        >
                          Proceed to Pay
                        </button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </Collapse>
            <div className="mt-3 pt-3 border-t border-[#D9D9D9]">
              <div className=" px-6">
                <div className="text-[17px] font-[500] text-black">Credit & Debit Cards</div>
                <button
                  onClick={() => setShowCardModal(true)}
                  className="w-full flex items-center gap-4  pt-3  bg-white  font-semibold text-[#0C5273]"
                >
                  <img src={bankaccount} alt="BankAccount" className="w-6" />
                  <span className="font-medium text-[#0C5273] font-bold text-sm">Pay via Card</span>
                </button>
              </div>
              <div className="block lg:hidden md:hidden">
                <div className="border-t-[2.5px] border-[#D9D9D9] mt-3 px-4 pt-3 pb-1">
                  <h3 className="text-[18px] font-[400] text-[#696767] mb-2">Delivery address</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-[14px] text-[#939393] leading-snug">
                      {selectedAddress
                        ? [
                            selectedAddress.buildingName,
                            selectedAddress.street,
                            selectedAddress.city,
                            selectedAddress.pincode,
                          ]
                            .filter(Boolean)
                            .join(', ')
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="px-6 border-b mb-4 pb-2">
              <button onClick={() => setIsQrPage(false)} className=" text-left text-black">
                <div className="flex flex-row gap-4">
                  <div className="pt-1">
                    <FaChevronLeft />
                  </div>
                  <div className="font-[500] text-[16px]">Go Back</div>
                </div>
              </button>
            </div>
            <div className="text-center">
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-44 h-44 mb-2" />
              <p className="font-semibold mb-2 text-[16px] text-[#7A7A7A]">Scan QR and Pay</p>

              <div className="flex justify-center gap-4 mb-4">
                <img src={phonepe} alt="PhonePe" className="h-7 max-w-full" />
                <img src={googlepay} alt="GooglePay" className="h-7 max-w-full" />
                <img src={paytm} alt="Paytm" className="h-7 max-w-full" />
              </div>
              <p className="text-[14px] text-black ">
                Scan the QR from your mobile phone using any UPI app
                <br />
                such as PhonePe, GooglePay, Paytm, etc.
              </p>
            </div>
          </>
        ))}

      {/* Card Tab Content */}
      {/* NOTHING here! Card button will always be shown below, not conditionally rendered */}

      {/* === Pay via Card button (ALWAYS SHOW BELOW TABS) === */}
    </div>
  );
};

// ************** ORDER COMPONENT ***************
const Order = () => {
  const { allProducts } = useContext(StoreContext);
  const { quantites } = useContext(CartContext);
  const { idToken } = useAuth();

  const [selectedUpi, setSelectedUpi] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [customUpiId, setCustomUpiId] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: '',
  });
  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upiapp');
  const [isQrPage, setIsQrPage] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const userEmail = 'tech@letstryfoods.com'; // Replace with actual user email
  const navigate = useNavigate();
  const totalCount = Object.values(quantites).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
  const cartItems = allProducts.filter((food) => quantites[food.id] > 0);
  const location = useLocation();
  const total = location.state?.total || 0;
  const promoCode = location.state?.promoCode || '';

  const { selectedAddress } = useAddresses();

  const buildItemsAndValue = (cartItems) => {
    const items = cartItems.map((it, idx) => {
      const price = it.discountedPrice > 0 && it.discountedPrice < it.price ? it.discountedPrice : it.price;
      return {
        item_id: String(it.id),
        item_name: it.name,
        item_brand: it.brand || "LetsTryFoods",
        item_category: it.category || "Snacks",
        item_variant: it.unit || it.weight || undefined,
        price: Number(Number(price).toFixed(2)),
        quantity: Number(it.quantity || 1),
        index: idx,
      };
    });
    const value = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
    return { items, value: Number(value.toFixed(2)) };
  };

  const trackAddPaymentInfo = ({ paymentType, couponCode }) => {
    if (!analytics) return;
    const { items, value } = buildItemsAndValue(cartItems);
    logEvent(analytics, "add_payment_info", {
      currency: "INR",
      value,
      coupon: couponCode || undefined,
      payment_type: paymentType, // e.g., "UPI - QR", "UPI - Paytm", "Card"
      items,
    });
  };

  const getVpaForSelectedUpi = (upi) => {
    switch (upi) {
      case 'paytm':
        return 'test@paytm';
      case 'google':
        return 'test@okaxis';
      case 'phonepe':
        return 'test@ybl';
      default:
        return customUpiId;
    }
  };

  const handleUpiIntentPayment = async () => {
    const order = await placeOrder();
    navigate('/payment/timer');
    if (!order?.orderId) {
      alert('Order could not be placed.');
      return;
    }

    try {
      const intentData = {
        orderId: order.orderId,
        amount: total.toFixed(2),
        email: userEmail,
        vpa: 'notReq@upi',
      };

      const result = await initiateUpiIntent(intentData, idToken);
      if (result.responseCode === "208" && result.bankPostData) {
        let upiUrl;
        switch (selectedUpi) {
          case 'googlepay':
            upiUrl = result.bankPostData.gpayIntentIosUrl || result.bankPostData.androidIntentUrl;
            break;
          case 'phonepe':
            upiUrl = result.bankPostData.phonepeIntentIosUrl || result.bankPostData.androidIntentUrl;
            break;
          case 'paytm':
            upiUrl = result.bankPostData.paytmIntentIosUrl || result.bankPostData.androidIntentUrl;
            break;
          default:
            upiUrl = result.bankPostData.androidIntentUrl;
        }

        if (upiUrl) {
          trackAddPaymentInfo({
            paymentType: selectedUpi === 'googlepay' ? 'UPI - Google Pay'
             : selectedUpi === 'phonepe' ? 'UPI - PhonePe'
             : selectedUpi === 'paytm' ? 'UPI - Paytm'
             : 'UPI - Intent',
            couponCode: location.state?.promoCode
            });
          window.location.href = upiUrl;
        } else {
          console.error('Intent URL not found for selected UPI app.');
        }
      } else {
        console.error('Intent payment failed or missing bankPostData.');
      }
    } catch (err) {
      console.error('Failed to initiate UPI Intent payment:', err);
    }
  };

  // UPI PAYMENT
  const initiateUpiPayment = async (orderId, amount, email, vpa) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/zaakpay/upi-collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ orderId, amount, email, vpa }),
      });
      const data = await response.json();
      setPaymentStatus(data.responseDescription);
      if (data.doRedirect && data.postUrl) {
        setRedirectTimer(true);
        setTimeout(() => {
          window.location.href = data.postUrl;
        }, 1000);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleCustomUpiPayment = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }
    if (!customUpiId.trim()) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    try {
      setLoading(true);

      // ⏳ 1. Place the order first
      const order = await placeOrder();
      // console.log(order)
      if (!order || !order.orderId) {
        alert('❌ Order could not be placed.');
        return;
      }
      trackAddPaymentInfo({ paymentType: 'UPI - ID', couponCode: location.state?.promoCode });
      // ✅ 2. Then initiate the UPI payment
      const result = await initiateUpiPayment(order.orderId, total, userEmail, customUpiId.trim());

      // ✅ 3. Navigate only if payment was initiated
      navigate('/payment/timer', {
        state: { orderId: order.orderId },
      });

      // 🧹 4. Clean up
      setCustomUpiId('');
    } catch (error) {
      console.error('❌ Error in UPI Payment:', error);
      alert('An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  const initiateCardPayment = async (details) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/zaakpay/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },

        body: JSON.stringify({
          ...details,
          amount: total.toFixed(2),
          orderId: orderData?.orderId,
          email: userEmail,
          expiryMonth: details.expiry.split('/')[0],
          expiryYear: '20' + details.expiry.split('/')[1],
          cvv: details.cvv,
          cardNumber: details.cardNumber.replace(/\s/g, ''),
          nameOnCard: details.nameOnCard,
        }),
      });
      const data = await response.json();
      setPaymentStatus(data.responseDescription);
      if (data.doRedirect && data.postUrl) {
        setRedirectTimer(true);
        setTimeout(() => {
          window.location.href = data.postUrl;
        }, 1000);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Payment button click handler for predefined UPI options
  const handlePayment = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }
    const order = await placeOrder();
    if (!order || !order.orderId) {
      alert('Order could not be placed.');
      return;
    }
    if (selectedMethod === 'card') {
      setShowCardModal(true);
    } else {
      setShowUpiModal(true);
      const vpa = getVpaForSelectedUpi(selectedUpi);
      await initiateUpiPayment(order.orderId, total, userEmail, vpa);
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    trackAddPaymentInfo({ paymentType: 'Card', couponCode: location.state?.promoCode });
    navigate('/payment');
    initiateCardPayment(cardDetails);
    setShowCardModal(false);
  };

  // ✅ FIXED: include token + correct template strings for UPI QR
  const handleGenerateQr = async () => {
    if (!idToken) {
      alert('Please login again to continue with payment.');
      return;
    }

    const order = await placeOrder();
    if (!order?.orderId) {
      alert('Order could not be placed.');
      return;
    }
    // console.log(order)
    const response = await fetch(`${API_BASE}/api/zaakpay/upi-qr-web`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        orderId: order.orderId,
        amount: total.toFixed(2), // server will use authoritative amount
        email: userEmail,
      }),
    });
    // console.log(response)
    if (!response.ok) {
      const err = await response.text().catch(() => '');
      console.error('UPI-QR error:', err);
      alert('Failed to generate QR. Please try again.');
      return;
    }

    const data = await response.json();
    trackAddPaymentInfo({ paymentType: 'UPI - QR', couponCode: location.state?.promoCode });

    if (data?.bankPostData?.link) {
      setQrCodeUrl(`data:image/png;base64,${data.bankPostData.link}`);
      setIsQrPage(true);
      setPaymentStatus('Waiting for payment...');

      // Start polling
      pollStatus(order.orderId);
    }
  };

  // ✅ FIXED: token + backticks in URL
  const pollStatus = (orderId) => {
    let retryCount = 0;
    const maxRetries = 100;

    const interval = setInterval(async () => {
      if (retryCount >= maxRetries) {
        clearInterval(interval);
        setPaymentStatus('⚠ Payment timed out. Please try again.');
        return;
      }

      retryCount++;

      try {
        const res = await fetch(
          `${API_BASE}/api/zaakpay/status?orderId=${orderId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );

        const statusData = await res.json();
        // console.log(orderId)
        // console.log(statusData)
        const status = statusData.status || statusData.txnStatus;

        if (status === 'SUCCESS' || status === '0') {
          clearInterval(interval);
          setPaymentStatus('✅ Payment Successful!');
          navigate('/order-confirmation', { state: { orderId } });
        } else if (status === 'FAILED') {
          clearInterval(interval);
          setPaymentStatus('❌ Payment Failed!');
          navigate('/payment/failed');
        } else {
          setPaymentStatus('⌛ Waiting for payment...');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 6000);
  };

  const placeOrder = async () => {
    if (!selectedAddress || cartItems.length === 0) {
      alert('Please select a valid delivery address and add items to cart.');
      return null;
    }
    const payload = {
      addressId: selectedAddress.addressId,
      promoCode: promoCode,
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      setOrderData(data);
      return data;
    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.message || 'Something went wrong while placing the order.');
      return null;
    }
  };

  return (
    <div className="bg-white min-h-screen relative">
      <Header />
      <div className="max-w-6xl mx-auto px-4 md:px-10 lg:px-20 py-6 ">
        <h2 className="text-[20px] md:text-[36px] lg:text-[36px] text-black font-[600] pb-[8px]">
          Select Payment Method
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 md:col-span-2 space-y-6">
            <UpiSection
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              customUpiId={customUpiId}
              setCustomUpiId={setCustomUpiId}
              handleAddId={handleCustomUpiPayment}
              qrCodeUrl={qrCodeUrl}
              isQrPage={isQrPage}
              setIsQrPage={setIsQrPage}
              handleGenerateQr={handleGenerateQr}
              setShowCardModal={setShowCardModal}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              handleUpiIntentPayment={handleUpiIntentPayment}
              selectedUpi={selectedUpi}
              setSelectedUpi={setSelectedUpi}
            />
          </div>
          <div className="space-y-4 hidden lg:block md:block">
            <div className="border-[2px] border-[#D9D9D9] rounded-[10px]  ">
              <div className="border-b-[2px] border-[#D9D9D9] p-3">
                <h3 className="text-[18px] font-[400] text-[#696767] mb-2">Delivery address</h3>
                <div className="flex justify-between items-center">
                  <div className="text-[14px] text-[#939393] leading-snug">
                    {selectedAddress
                      ? [
                          selectedAddress.buildingName,
                          selectedAddress.street,
                          selectedAddress.city,
                          selectedAddress.pincode,
                        ]
                          .filter(Boolean)
                          .join(', ')
                      : ''}
                  </div>
                </div>
              </div>

              <div className="border-b-[1px] border-[#D9D9D9] p-3">
                <h3 className="text-[18px] font-[400] text-[#939393] flex justify-between items-center">
                  Cart items
                  <span className="text-[18px] font-[400] text-[#939393]">
                    {totalCount} items
                  </span>
                </h3>
                <div className="text-sm max-h-[310px] overflow-y-auto hide-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center py-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-[80px] h-[80px] object-contain"
                      />
                      <div className="flex-1 ml-3">
                        <div className="lg:text-[14px] md:text-[12px] text-[#000000] font-[400] md:leading-tight">
                          {item.name}
                        </div>
                        <div className="lg:text-[14px] md:text-[12px] text-[#000000] font-[400] ">
                          Size: {item.unit}
                        </div>
                        <div className=" lg:text-[16px] md:text-[12px] font-[500] text-black lg:mt-2 md:mt-1">
                          ₹ {item.discountedPrice > 0 ? item.discountedPrice : item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between px-3 py-2 font-[500] text-black text-[18px]">
                <span>Grand Total</span>
                <span className="text-[#0C5273] text-[18px] font-[700]">₹ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            className="bg-white rounded-lg lg:w-full  w-[80%] md:w-full max-w-sm h-[450px] relative flex flex-col p-6 pt-4"
            onSubmit={handleCardSubmit}
          >
            <button
              onClick={() => {
                setShowCardModal(false);
                setCardDetails({
                  cardNumber: '',
                  nameOnCard: '',
                  expiry: '',
                  cvv: '',
                });
              }}
              className="absolute top-[28px] right-5 text-gray-500 lg:hover:text-black text-xl font-bold"
              type="button"
            >
              <IoClose />
            </button>
            <h2 className="text-[22px] text-center text-black font-[600] mb-4">Card Details</h2>
            <div className="flex flex-col justify-between flex-grow">
              <div className="space-y-4">
                <div>
                  <label className="block text-[16px] text-black font-[700]">Card Number</label>
                  <input
                    type="text"
                    className="w-full mt-2 p-2 border text-black text-[13px] border-gray-300 rounded"
                    placeholder="1234 5678 9000 0000"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[16px] text-black font-[700]">
                    Account Holder's Name
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 text黑 text-[13px] p-2 border border-gray-300 rounded"
                    placeholder="Vipin Sharma"
                    value={cardDetails.nameOnCard}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, nameOnCard: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[16px] text-black font-[700]">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full mt-2 text-black text-[13px] p-2 border border-gray-300 rounded"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d]/g, ''); // only digits

                        if (value.length === 1) {
                          const digit = parseInt(value, 10);
                          if (digit >= 2 && digit <= 9) {
                            value = '0' + digit + '/';
                            setCardDetails({ ...cardDetails, expiry: value });
                            return;
                          } else {
                            setCardDetails({ ...cardDetails, expiry: value });
                            return;
                          }
                        }

                        if (value.length === 2) {
                          const month = parseInt(value, 10);
                          if (month >= 1 && month <= 12) {
                            value = value.padStart(2, '0') + '/';
                          } else {
                            return; // Invalid month
                          }
                        }

                        if (value.length > 2 && !value.includes('/')) {
                          value = value.slice(0, 2) + '/' + value.slice(2);
                        }

                        if (value.length > 5) return;

                        if (value.length === 5) {
                          const [mmStr, yyStr] = value.split('/');
                          const month = parseInt(mmStr, 10);
                          const year = parseInt('20' + yyStr, 10);

                          if (month < 1 || month > 12 || isNaN(year)) return;

                          const now = new Date();
                          const expiry = new Date(year, month);
                          const current = new Date(now.getFullYear(), now.getMonth() + 1);

                          if (expiry < current) return; // Already expired
                        }

                        setCardDetails({ ...cardDetails, expiry: value });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[16px] text-black font-[700]">CVV</label>
                    <input
                      type="text"
                      className="w-full mt-2 text-black text-[13px] p-2 border border-gray-300 rounded"
                      placeholder="xxx"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-auto">
                <button
                  type="submit"
                  className="w-full bg-[#004D66] text-white py-2  text-center rounded font-semibold"
                >
                  Proceed for payment
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* UPI Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Processing UPI Payment</h2>
            <p className="mb-4">{paymentStatus || 'Waiting for payment confirmation...'}</p>
            <button
              className="mt-2 bg-[#004D66] text-white px-6 py-2 rounded font-semibold"
              onClick={() => setShowUpiModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Location Modal */}
      {showLocationModal && (
        <LocationFlow
          onClose={() => setShowLocationModal(false)}
          onAddressChange={(address) => setSelectedAddress(address)}
        />
      )}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center font-bold text-lg">
            Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;