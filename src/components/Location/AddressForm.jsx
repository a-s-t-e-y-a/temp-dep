import React, { useState, useEffect } from "react";
import { useAddresses } from "../../context/AddressContext";
import { assets } from "../../assets/assets";

const ADDRESS_LABELS = [
  { label: "Home", icon: assets.home },
  { label: "Office", icon: assets.office },
  { label: "Flat", icon: assets.flat },
  { label: "Other", icon: null },
];

const getField = (components, type) =>
  components?.find((c) => c.types.includes(type))?.long_name || "";

export default function AddressForm({
  visible,
  editing = null,
  onClose,
  onSaved,
}) {
  const { saveAddress, selectAddress, loadAddresses } = useAddresses();
  const [addressForm, setAddressForm] = useState({
    addressId: undefined,
    label: "Home",
    customLabel: "",
    recipientPhoneNumber: "",
    recipientName: "",
    buildingName: "",
    floor: "",
    street: "",
    towerRing: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const setField = (k, v) => {
    setAddressForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  useEffect(() => {
    if (!editing) return;
    const comps = editing.address_components || [];
    setAddressForm({
      addressId: editing.addressId,
      label: editing.label || "Home",
      customLabel: editing.customLabel || "",
      recipientPhoneNumber: editing.recipientPhoneNumber || "",
      recipientName: editing.recipientName || "",
      buildingName: editing.buildingName || getField(comps, "premise") || getField(comps, "establishment") || "",
      floor: editing.floor || "",
      street: editing.street || getField(comps, "route") || "",
      towerRing: editing.towerRing || getField(comps, "sublocality_level_2") || "",
      landmark: editing.landmark || getField(comps, "point_of_interest") || getField(comps, "natural_feature") || "",
      pincode: editing.pincode || getField(comps, "postal_code") || "",
      city: editing.city || getField(comps, "locality") || getField(comps, "administrative_area_level_2") || "",
      state: editing.state || getField(comps, "administrative_area_level_1") || "",
      country: editing.country || "India",
    });
  }, [editing]);

  const validate = () => {
    const e = {};
    if (!addressForm.label) e.label = "Select an address type";
    if (addressForm.label === "Other" && !addressForm.customLabel.trim()) e.customLabel = "Please provide a label";
    if (!addressForm.recipientPhoneNumber) e.recipientPhoneNumber = "Phone is required";
    else if (!/^[4-9]\d{9}$/.test(addressForm.recipientPhoneNumber)) e.recipientPhoneNumber = "Enter a valid 10-digit mobile";
    if (!addressForm.recipientName) e.recipientName = "Recipient name is required";
    else if (addressForm.recipientName.length < 2) e.recipientName = "Name is too short";
    if (!addressForm.buildingName) e.buildingName = "Building name is required";
    if (!addressForm.pincode && !/^[1-9]\d{5}$/.test(addressForm.pincode)) e.pincode = "Enter a valid 6-digit PIN";
    setErrors(e);
    if (!addressForm.city) e.city = "City is required";
    if (!addressForm.state) e.state = "State is required";
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;
    setSaving(true);

    const finalLabel = addressForm.label === "Other" ? addressForm.customLabel.trim() : addressForm.label;

    const payload = {
      ...addressForm,
      label: finalLabel,
    };

    try {
      const saved = await saveAddress(payload);
      console.log("Address saved:", payload);
      await loadAddresses();
      selectAddress(payload);
      setSaving(false);
      onSaved && onSaved(saved);
    } catch (err) {
      setGlobalError(err.message || "Failed to save");
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center overflow-y-auto">
      <div className="relative bg-white rounded-lg max-w-[440px] w-full max-h-[90vh] overflow-auto p-4">
        {globalError && (
          <div className="mb-2 p-2 bg-red-50 text-red-700 text-xs font-medium rounded">{globalError}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black">Add Address Details</h2>
            <button onClick={onClose} aria-label="Close" className="text-2xl font-bold text-gray-600">&times;</button>
          </div>

          {/* Address Type */}
          <p className="mb-2 font-semibold text-sm">
            Select an address type <span className="text-red-600">*</span>
          </p>
          <div className="flex gap-2 mb-4">
            {ADDRESS_LABELS.map(({ label, icon }) => {
              const isDisabled =
                ["Home", "Office", "Flat"].includes(label) &&
                false; // Add your logic to disable if label used
              const isActive = addressForm.label === label;
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => !isDisabled && (setField("label", label), setField("customLabel", ""))}
                  disabled={isDisabled}
                  title={isDisabled ? `${label} already used` : ""}
                  className={`flex items-center gap-1 px-3 py-1 rounded border text-xs font-semibold ${
                    isActive ? "bg-blue-100 border-blue-700 text-[#0C5273]" : "bg-gray-100 border-gray-300"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {icon && <img src={icon} alt={`${label} icon`} className="w-4 h-4" />}
                  {label}
                </button>
              );
            })}
          </div>
          {addressForm.label === "Other" && (
            <>
              <p className="mb-1 font-semibold text-xs">Save as</p>
              <input
                type="text"
                className="w-full p-2 mb-3 text-xs rounded bg-gray-100 border border-gray-300"
                placeholder="Custom label"
                value={addressForm.customLabel}
                onChange={(e) => setField("customLabel", e.target.value)}
              />
              {errors.customLabel && (
                <p className="text-red-600 text-xs mb-2">{errors.customLabel}</p>
              )}
            </>
          )}
          {errors.label && <p className="text-red-600 text-xs mb-3">{errors.label}</p>}

          <p className="text-gray-600 text-xs mb-6">
            Enter your details to experience seamless delivery
          </p>

          {/* Phone */}
          <label className="block mb-1 text-xs font-semibold text-black">RECIPIENT PHONE NUMBER <span className="text-red-600">*</span></label>
          <div className="flex items-center bg-gray-100 border rounded mb-3 px-2 py-1">
            <span className="text-black text-xs mr-2">+91</span>
            <input
              type="tel"
              maxLength={10}
              className="flex-grow bg-transparent outline-none text-xs font-semibold text-black"
              value={addressForm.recipientPhoneNumber}
              onChange={(e) =>
                setField("recipientPhoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputMode="numeric"
            />
          </div>
          {errors.recipientPhoneNumber && (
            <p className="text-red-600 text-xs mb-3">{errors.recipientPhoneNumber}</p>
          )}

          {/* Name */}
          <label className="block mb-1 text-xs font-semibold text-black">RECIPIENT NAME <span className="text-red-600">*</span></label>
          <input
            className="w-full p-2 mb-3 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
            value={addressForm.recipientName}
            onChange={(e) => setField("recipientName", e.target.value)}
          />
          {errors.recipientName && (
            <p className="text-red-600 text-xs mb-3">{errors.recipientName}</p>
          )}

          {/* Building Name */}
          <label className="block mb-1 text-xs font-semibold text-black">BUILDING NAME <span className="text-red-600">*</span></label>
          <input
            className="w-full p-2 mb-3 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
            value={addressForm.buildingName}
            onChange={(e) => setField("buildingName", e.target.value)}
          />
          {errors.buildingName && (
            <p className="text-red-600 text-xs mb-3">{errors.buildingName}</p>
          )}

          {/* Optional Fields */}
          <label className="block mb-1 text-xs font-semibold text-black">FLOOR (optional)</label>
          <input
            className="w-full p-2 mb-3 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
            value={addressForm.floor}
            onChange={(e) => setField("floor", e.target.value)}
          />

          <label className="block mb-1 text-xs font-semibold text-black">STREET/AREA (optional)</label>
          <input
            className="w-full p-2 mb-3 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
            value={addressForm.street}
            onChange={(e) => setField("street", e.target.value)}
          />

          <label className="block mb-1 text-xs font-semibold text-black">LANDMARK (optional)</label>
          <input
            className="w-full p-2 mb-3 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
            value={addressForm.landmark}
            onChange={(e) => setField("landmark", e.target.value)}
          />

          {/* PIN, City, State */}
          <div className="grid grid-cols-3 gap-2">
          
            <div>
              <label className="block mb-1 text-xs font-semibold text-black">PIN</label>
              <input
                className="w-full p-2 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
                value={addressForm.pincode}
                onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0,6))}
                maxLength={6}
              />
              {errors.pincode && (
                <p className="text-red-600 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-black">City</label>
              <input
                className="w-full p-2 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
                value={addressForm.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-black">State</label>
              <input
                className="w-full p-2 text-xs rounded bg-gray-100 border border-gray-300 text-black font-semibold"
                value={addressForm.state}
                onChange={(e) => setField("state", e.target.value)}
              />
              {errors.state && (
                <p className="text-red-600 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-3 border-t mt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0C5273] text-white text-base font-semibold py-2 rounded disabled:opacity-60"
            >
              {saving ? (addressForm.addressId ? "Updating..." : "Saving...") : (addressForm.addressId ? "Update Address" : "Save Address")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
