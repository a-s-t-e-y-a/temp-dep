import React, { useState, useEffect, useRef } from "react";

export default function ConfirmLocationModal({
  visible,
  onClose,
  initialPosition,
  onConfirm,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const listenerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(initialPosition || { lat: 28.6139, lng: 77.209 });
  const [geocodeData, setGeocodeData] = useState(null);
  const debounceTimerRef = useRef(null);

  // Sync marker position to incoming initialPosition (when modal re-opens)
  useEffect(() => {
    if (initialPosition) {
      setMarkerPosition(initialPosition);
    }
  }, [initialPosition, visible]);

  // Debounced reverse geocode on marker move
  useEffect(() => {
    if (!markerPosition) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: markerPosition }, (results, status) => {
          if (status === "OK" && results && results.length) {
            setGeocodeData({
              formatted_address: results[0].formatted_address,
              address_components: results.address_components,
              location: markerPosition,
              place_id: results.place_id
            });
          } else {
            setGeocodeData(null);
          }
        });
      }
    }, 300);
    return () => clearTimeout(debounceTimerRef.current);
  }, [markerPosition]);

  // Map init/re-init
  useEffect(() => {
    if (!visible) {
      // Cleanup on close
      if (listenerRef.current) {
        window.google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      if (mapInstanceRef.current) mapInstanceRef.current = null;
      return;
    }
    if (window.google && mapRef.current) {
      // Remove prev listener
      if (listenerRef.current) {
        window.google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      // Create new map
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 16,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        gestureHandling: "greedy",
        disableDefaultUI: true,
        clickableIcons: false,
      });
      mapInstanceRef.current = map;
      listenerRef.current = map.addListener("dragend", () => {
        const center = map.getCenter();
        if (center) setMarkerPosition({ lat: center.lat(), lng: center.lng() });
      });
    }
  }, [visible, initialPosition]);

  // Pan map on marker position update (drag or location change)
  useEffect(() => {
    if (mapInstanceRef.current && markerPosition) {
      mapInstanceRef.current.panTo(markerPosition);
    }
  }, [markerPosition]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-2">
          <h2 className="text-[20px] font-bold -ml-5">Location Information</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-black font-bold"
            aria-label="Close"
          >×</button>
        </div>

        {/* Map */}
        <div className="relative">
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: 230,
              borderRadius: "0 0 16px 16px",
            }}
          />
          {/* Address bubble */}
          {geocodeData?.formatted_address && (
            <div className="absolute left-1/2 top-[42%] z-30 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
              <span className="bg-black text-white px-4 py-1 rounded-2xl font-semibold shadow text-sm whitespace-nowrap">
                {geocodeData.formatted_address.split(",")[0]}
              </span>
              <div className="w-2 h-2 bg-black rotate-45 -mt-1 rounded-sm"></div>
            </div>
          )}
          {/* Marker */}
          <div className="absolute top-1/2 left-1/2 w-7 h-7 -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0C5273" width="100%" height="100%">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>

        {/* Location info and confirm button */}
        <div className="p-4 flex flex-col gap-2">
          <span className="text-sm text-gray-700">Delivering your order to</span>
          <div className="flex items-center font-semibold text-base gap-2 mb-2">
            <svg width={18} height={18} fill="#0C5273" className="mr-1" viewBox="0 0 24 24">
              <circle cx={12} cy={10} r={3} />
              <path d="M12 2v2m0 16v2m8-10h2m-18 0H2" />
            </svg>
            <span className="truncate text-black">
              {geocodeData?.formatted_address?.split(",")[0] || "-"}
            </span>
          </div>
          <button
            className="w-full bg-[#0C5273] text-white py-2 mt-2 rounded-lg font-semibold text-base transition hover:bg-[#195c9e]"
            onClick={() => geocodeData && onConfirm({ ...geocodeData, lat: markerPosition.lat, lng: markerPosition.lng })}
            disabled={!geocodeData}
          >
            Confirm and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
