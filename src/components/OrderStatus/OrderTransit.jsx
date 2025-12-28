import React from 'react';
import { assets } from '../../assets/assets';
import { shipmentStageMap, getUserFriendlyStatus } from '../../util/shipmentStages';

const STAGES = [
  "Order Placed",
  "In Transit",
  "Out for Delivery",
  "Delivered"
];

const getStageIndex = (stage) => STAGES.indexOf(stage);

const OrderTransit = ({ order, currentStatus, shipmentStatusNo }) => {
  // If the mapped stage is "Cancelled" or "Customs Clearance", treat as "Order Placed" (or handle as you wish)
  let stage = getUserFriendlyStatus(shipmentStatusNo) || getUserFriendlyStatus(currentStatus);
  if (stage === "Cancelled" || stage === "Customs Clearance") {
    stage = "Order Placed";
  }

  const currentStageIndex = getStageIndex(stage);

  return (
    <div className="flex flex-col space-y-1 relative">
      {STAGES.map((label, index) => {
        const isCompleted = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;

        return (
          <div key={label} className="flex items-start space-x-3 relative">
            {/* Left Indicator + Line */}
            <div className="flex flex-col items-center">
              {/* Circle Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 
                ${isCompleted || isCurrent ? '' : 'bg-white border-gray-300'}`}
              >
                {(isCompleted || isCurrent) && (
                  <img src={assets.accept} alt="done" loading="lazy" className="max-w-full max-h-full" />
                )}
              </div>

              {/* Vertical Line */}
              {index !== STAGES.length - 1 && (
                <div
                  className={`w-px h-6 ${
                    isCompleted ? 'bg-[#22C55E]' : 'border-l border-dotted border-gray-300'
                  }`}
                />
              )}
            </div>

            {/* Right Label */}
            <div className="flex-1">
              <div className={`px-2 rounded-md ${isCurrent ? 'bg-green-100' : ''}`}>
                <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-black' : 'text-gray-400'}`}>
                  {label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>  
  );
};

export default OrderTransit;
