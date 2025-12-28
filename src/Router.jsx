import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import {
  Home,
  Combo,
  AboutUs,
  Login,
  Logout,
  FoodDetails,
  Account,
  RangePage,
  Categories,
  Order,
  OrderConfirmation,
  PaymentOnHold,
  PaymentTimer,
  SearchResults,
  RefundAndCancellation,
  ShippingPolicy,
  TermsOfService,
//  ServiceUnavailable,
QrCodeGenerater,
AddressDetail,
  PaymentFailed,
} from './routesImports.js';

import { foodListLoader } from './Loaders/foodListLoader';
import { foodDetailLoader } from './Loaders/foodDetailLoader';
import { comboListLoader } from './Loaders/comboLoader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home />, loader: foodListLoader },
     // { path: 'serviceunavailable', element: <ServiceUnavailable /> },
      { path: 'payment', element: <PaymentOnHold /> },
      { path: 'payment/failed', element: <PaymentFailed /> },
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
        { path: 'address', element: <AddressDetail /> },
        { path: 'qrcode', element: <QrCodeGenerater /> },
      { path: 'search', element: <SearchResults /> },
      {
    path: 'category/:categoryName',
    element: <Categories />,
    loader: foodListLoader,
  },
      { path: 'refund-policy', element: <RefundAndCancellation /> },
      { path: 'shipping-policy', element: <ShippingPolicy /> },
      { path: 'terms', element: <TermsOfService /> },
      { path: 'food/:id', element: <FoodDetails />, loader: foodDetailLoader },
      { path: 'combo', element: <Combo />, loader: comboListLoader },
      { path: 'about', element: <AboutUs /> },
      { path: 'account', element: <Account /> },
      { path: 'range/:rangeName', element: <RangePage /> },
      { path: 'order', element: <Order /> },
      { path: 'order-confirmation', element: <OrderConfirmation /> },
      { path: 'payment/timer', element: <PaymentTimer /> },
    ],
  },
]);
