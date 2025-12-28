import  { createContext, useState, useContext, useEffect, useCallback } from "react";
import { fetchSavedAddresses, saveAddress, deleteAddress } from "../service/LocationService";
import { StoreContext } from "./StoreContext";
import { useAuth } from "./AuthContext";
// Create Context
const AddressContext = createContext();

// Provider wrapper
export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { idToken } = useAuth();
  const store = useContext(StoreContext);
  const token = store.token;

  // Load addresses
  const loadAddresses = useCallback(async () => {
    if (!idToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSavedAddresses(idToken);
      setAddresses(data);

      // If no selected address yet, pick first one
      if (data.length > 0 && !selectedAddress) {
        setSelectedAddress(data[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  }, [idToken, selectedAddress]);

  // Save or update
  const handleSaveAddress = useCallback(
    async (payload) => {
      try {
        const saved = await saveAddress(payload, idToken);
        await loadAddresses(); // refresh list
        return saved;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [idToken, loadAddresses]
  );

  // Delete
  const handleDeleteAddress = useCallback(
    async (id) => {
      try {
        await deleteAddress(id, idToken);
        setAddresses((prev) => prev.filter((a) => a.addressId !== id));
        // If deleted was selected → clear or select another
        if (selectedAddress?.addressId === id) {
          setSelectedAddress(null);
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [idToken, selectedAddress]
  );

  // Select address
  const handleSelectAddress = (address) => {
    console.log(address)
    setSelectedAddress(address);
  };

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        loading,
        error,
        loadAddresses,
        saveAddress: handleSaveAddress,
        deleteAddress: handleDeleteAddress,
        selectAddress: handleSelectAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

// Custom hook to consume
export const useAddresses = () => {
  return useContext(AddressContext);
};
