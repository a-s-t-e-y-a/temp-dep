import React, { useState } from "react";
import AddressModal from "./AddressModal";
import ConfirmLocationModal from "./ConfirmLocationModal";
import AddressForm from "./AddressForm";

export default function LocationFlow({ visible, onClose, onSave }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [initialPosition, setInitialPosition] = useState({ lat: 28.6139, lng: 77.209 });

  // Handle place selection from search, current location, or saved addresses
  const handleAddressSelect = (place) => {
    // Extract lat/lng or fallback to default
    if (place.geometry && place.geometry.location) {
      setInitialPosition({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      setInitialPosition({ lat: 28.6139, lng: 77.209 }); // Default fallback
    }
    setSelectedPlace(place);
    setShowConfirm(true);    // Show confirm-location step
  };

  // On confirm location map step, prefill for form
  const handleConfirmLocation = (coordsWithAddress) => {
    let prefillAddress = {
      line1: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      phone: "",
      latitude: coordsWithAddress.lat,
      longitude: coordsWithAddress.lng,
    };

    if (selectedPlace?.address_components) {
      selectedPlace.address_components.forEach((comp) => {
        const types = comp.types;
        if (types.includes("street_number"))
          prefillAddress.line1 = comp.long_name + " " + prefillAddress.line1;
        if (types.includes("route")) prefillAddress.line1 += comp.long_name;
        if (types.includes("locality")) prefillAddress.city = comp.long_name;
        if (types.includes("administrative_area_level_1"))
          prefillAddress.state = comp.long_name;
        if (types.includes("postal_code")) prefillAddress.zip = comp.long_name;
        if (types.includes("country")) prefillAddress.country = comp.long_name;
      });
    }

    setShowConfirm(false);
    setSelectedPlace({ ...selectedPlace, prefill: prefillAddress });
    setShowForm(true);       // Show address form step
  };

  // Save handler from AddressForm (final step)
  const handleFormSave = (address) => {
    onSave(address);         // Pass saved address to parent (Cart)
    setShowForm(false);
    onClose();               // Close entire flow
  };

  return (
    <>
      <AddressModal
        visible={visible && !showConfirm && !showForm}
        onClose={onClose}
        onSelectLocation={handleAddressSelect}
      />
      <ConfirmLocationModal
        visible={visible && showConfirm}
        onClose={() => setShowConfirm(false)}
        initialPosition={initialPosition}
        onConfirm={handleConfirmLocation}
      />
      <AddressForm
        visible={visible && showForm}
        editing={selectedPlace?.prefill || null}
        onClose={() => setShowForm(false)}
        onSaved={handleFormSave}
      />
    </>
  );
}
