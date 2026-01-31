import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from "./context/AuthContext.jsx"; // <-- Import your Auth context
import { StoreContextProvider } from "./context/StoreContext.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";
import { AddressProvider } from "./context/AddressContext.jsx";
import Loader from "./components/RotatingText/Loader.jsx";
import { HelmetProvider } from "react-helmet-async";
import Snowfall from "react-snowfall"

const phone = window.innerWidth <= 768;

createRoot(document.getElementById("root")).render(
  <AuthProvider>
     {/* Snowfall effect for festive season */}
      {/* <Snowfall
        color="#AAADB3"
        snowflakeCount={phone ? 100 : 300}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none"
        }}
      /> */}
    <StoreContextProvider>
      <AddressProvider>
        <CartContextProvider>
          <Loader />
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </CartContextProvider>
      </AddressProvider>
    </StoreContextProvider>
  </AuthProvider>
);
