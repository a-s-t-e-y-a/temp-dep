import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboCard from '../../components/ComboCard/ComboCard';
import MetaTag from '../../components/MateTagComponent/MetaTag';
import { GoChevronLeft } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
const API_BASE =  import.meta.env.VITE_API_URL;
const Combo = () => {
  const [comboItems, setComboItems] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/combos`);
        const data = response.data;
        setComboItems(data);
      } catch (error) {
        console.error('Error fetching combo items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedByName = comboItems.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = [];
    acc[item.name].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen mb-4 px-[25px] md:px-[40px] lg:px-[70px] justify-stretch">
      <MetaTag
        title="Combo Deals - Best Value Healthy Snacks | Letstry"
        description="Save more with Letstry combo deals! Get the best value on healthy snack combinations. Premium quality snacks bundled at amazing prices with free delivery."
        ogTitle="Combo Deals | Letstry - Save More on Healthy Snacks"
        ogDescription="Discover amazing combo deals on healthy snacks. Save money while enjoying premium quality snacks delivered to your doorstep."
      />
      {/* Left: Products */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <h1 className="md:text-2xl lg:text-3xl font-bold text-black hidden lg:block md:block mb-2 mt-12">  Combos
        </h1>

        {loading ? (
          <p className="text-[20px] text-gray-600 mt-4 mx-4">Loading...</p>
        ) : Object.keys(groupedByName).length === 0 ? (
          <div className='flex ml-0 pl-0'>
            <div className='flex ml-0 pl-0 gap-2 py-2  block lg:hidden md:hidden'>
                      <button onClick={() => navigate('/')} className="ml-0 pl-0 mr-2">
                        <GoChevronLeft size={24} className='ml-0 pl-0' />
                      </button>
                      <div className='text-[19px] font-[700] '>Combos</div>
                    </div><p className="text-[17px] font-[500] mt-4 text-gray-600 mx-4">No products available.</p></div>
        ) : (
          <>
          <div className="flex items-center justify-between py-2 text-black block lg:hidden md:hidden">
  {/* Back Button */}
  <button onClick={() => navigate('/')} className="flex-shrink-0 pr-2">
    <GoChevronLeft size={24} />
  </button>

  {/* Title (centered) */}
  <div className="text-[19px] font-[700] flex-1 text-left">
    Combos
  </div>

  {/* Product Count (right aligned) */}
  <div className="text-[16px] font-[400] flex-shrink-0">
    {comboItems.length} Product{comboItems.length !== 1 ? 's' : ''}
  </div>
</div>

            <p className="text-[20px] font-[300] hidden lg:block md:block py-2 mb-8 text-black">
              {comboItems.length} Product{comboItems.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-auto gap-[26px] justify-items-stretch md:gap-[38px]">
               {Object.entries(groupedByName).map(([name, variants,title]) => (
                <ComboCard
                  key={variants[0].id}
                  name={name}
                  imageUrl={variants[0].imageUrl}
                  weightVariants={variants}
                  title={title}
                />
              ))}
            </div>
          </>
        )}
      </div>

      
    </div>
  );
};

export default Combo;
