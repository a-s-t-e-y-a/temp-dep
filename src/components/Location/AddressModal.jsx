import React, { useState, useEffect, useRef } from "react";
import { useAddresses } from "../../context/AddressContext";
import { assets } from '../../assets/assets';
import deleteIcon from '../../assets/delete.png';

export default function AddressModal({ visible, onClose, onSelectLocation }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const service = useRef(null);
  const geocoder = useRef(null);
  const placeService = useRef(null);

  // Get data and methods from AddressContext
  const { addresses, selectedAddress, selectAddress, deleteAddress } = useAddresses();

  // Map labels to icons
  const labelIconMap = {
    Home: assets.home,
    Office: assets.office,
    Flat: assets.flat,
    Other: assets.home, // fallback icon
  };

  useEffect(() => {
    if (visible && window.google && !service.current) {
      service.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
      placeService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
  }, [visible]);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearch(input);
    if (!input || input.length < 3 || !service.current) {
      setSuggestions([]);
      return;
    }
    service.current.getPlacePredictions(
      { input, componentRestrictions: { country: "in" } },
      (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions([]);
          return;
        }
        setSuggestions(predictions);
      }
    );
  };

  const handleSelectSuggestion = (prediction) => {
    if (!placeService.current) return;
    placeService.current.getDetails({ placeId: prediction.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        onSelectLocation?.(place);
      } else {
        alert("Failed to fetch place details. Please try again.");
      }
    });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        geocoder.current.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          setGeoLoading(false);
          if (status === "OK" && results && results[0]) {
            onSelectLocation?.({
              ...results[0],
              geometry: { location: { lat: () => latitude, lng: () => longitude } }
            });
          } else {
            alert("Could not fetch address from location.");
          }
        });
      },
      () => {
        alert("Permission denied or unable to access location.");
        setGeoLoading(false);
      }
    );
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering select on parent div
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
    } catch (err) {
      alert("Failed to delete address. Please try again.");
    }
  };

  const handleSavedClick = (address) => {
    selectAddress(address);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
        >
          ×
        </button>
        <div className="px-6 pt-8 pb-2">
          <h2 className="text-[20px] font-bold mb-3">Add location</h2>
          <input
            type="search"
            className="border rounded w-full p-2 mb-4"
            placeholder="Search for location"
            value={search}
            onChange={handleSearchChange}
            autoFocus
            aria-label="Search location"
          />

          <button
            onClick={handleCurrentLocation}
            disabled={geoLoading}
            type="button"
            className="flex items-center gap-2 px-3 py-2 mb-3 w-full bg-transparent hover:bg-gray-100 transition rounded"
          >
            <svg width="22" height="22" fill="none" stroke="#0C5273" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#0C5273" />
              <circle cx="12" cy="12" r="3" fill="#0C5273" />
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[#0C5273] text-lg">
                {geoLoading ? "Detecting location..." : "Enable your current location"}
              </span>
            </div>
          </button>

          <div className="border-t my-2" />

          {/* Suggestions */}
          <div className="max-h-44 overflow-y-auto">
            {suggestions.map((s) => (
              <div
                key={s.place_id}
                className="py-3 border-b cursor-pointer hover:bg-gray-100 flex flex-col"
                onClick={() => handleSelectSuggestion(s)}
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && handleSelectSuggestion(s)}
              >
                <span className="font-semibold text-[15px] text-black">{s.structured_formatting.main_text}</span>
                <span className="text-[13px] text-gray-500">{s.structured_formatting.secondary_text || s.description}</span>
              </div>
            ))}
            {search.length >= 3 && suggestions.length === 0 && (
              <div className="text-gray-500 py-4 text-center">No results found</div>
            )}
          </div>

          {/* Saved Addresses */}
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2">Saved Addresses</h3>
            {addresses && addresses.length > 0 ? (
              addresses.map(a => {
                const isSelected = selectedAddress?.addressId === a.addressId;
                const iconSrc = labelIconMap[a.label] || null;

                return (
                  <div
                    key={a.addressId}
                    onClick={() => handleSavedClick(a)}
                    className={`relative py-2 px-3 border-b cursor-pointer flex items-center gap-3 ${
                      isSelected ? 'border-2 border-[#0C5273] bg-blue-50' : ''
                    }`}
                    style={{ borderColor: isSelected ? '#3b82f6' : undefined }}
                  >
                    {iconSrc && (
                      <img src={iconSrc} alt={`${a.label} icon`} className="w-5 h-5 flex-shrink-0" />
                    )}
                    <div className="flex-grow">
                      <div className="font-semibold text-black">
                        {a.label || "Other"}
                        <span className="text-gray-600 ml-1">
                          {a.buildingName ? `, ${a.buildingName}` : ''}{a.street ? `, ${a.street}` : ''}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {a.city}, {a.state} {a.pincode}
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if(window.confirm("Are you sure you want to delete this address?")){
                          deleteAddress(a.addressId);
                        }
                      }}
                      aria-label="Delete address"
                      className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded"
                    >
                      <img src={deleteIcon} alt="Delete" className="w-4 h-4"/>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No saved addresses found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
