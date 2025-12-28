import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import DisplayCard from '../DisplayCard/DisplayCard';
const SearchDisplay = ({ externalFoodList }) => {
  const { foodList } = useContext(StoreContext);
  const baseFoodList = externalFoodList || foodList;

  const seenNames = new Set();
  const filteredFoods = baseFoodList.filter(food => {
    const name = food.name?.toLowerCase();
    if (seenNames.has(name)) return false;
    seenNames.add(name);
    return true;
  });

  return (
    <div>
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-[60px] gap-[26px] md:gap-[38px] mt-6">
          {filteredFoods.map(food => (
            <DisplayCard key={food.id} {...food} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-6">
          <h4 className="text-[24px] font-[500] text-gray-600">No food found.</h4>
        </div>
      )}
    </div>
  );
};

export default SearchDisplay;