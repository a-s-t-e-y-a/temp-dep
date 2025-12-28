import Fssai from "../../assets/banners/fssai_logo-removebg-preview.png";

const AdressDetail = () => {
  const manufacturingUnits = [
    {
      batchCode: "K",
      companyName: "Earth Crust Private Limited",
      address:
        "118H, PHASE-V, SECTOR-56, HSIIDC, KUNDLI, DISTT. SONIPAT, HARYANA-131028",

      fssaiLicense: "XXXXXXXXXXXXXXX",
    },
    {
      batchCode: "R",
      companyName: "EARTH CRUST PRIVATE LIMITED",
      address:
        "PLOT NO. 2019, PHASE-2, SECTOR-38 RAI, TEHSIL RAI DIST, SONIPAT, HARYANA-131029",

      fssaiLicense: "10824999000091",
    },
    {
      batchCode: "T",
      companyName: "EARTH CRUST PRIVATE LIMITED",
      address:
        "TIERRA FOOD INDIA PRIVATE LIMITED, KINFRA FOOD PROCESSING PARK, ELAMANNOOR P.O, ADOOR, PATHANAMTHITTA, KERALA-681524",

      fssaiLicense: "10019041002004",
    },
  ];

  return (
    <div className=" w-full bg-white">
      {/* Header Section */}
      <div className="bg-white px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 border-b">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Manufacturing Unit Addresses
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
          To identify manufacturing unit address, read the first character of
          the batch number and see below:
        </p>
      </div>

      {/* Table Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Batch Code
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Manufacturing Address
                </th>
              </tr>
            </thead>
            <tbody>
              {manufacturingUnits.map((unit, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-4 align-top">
                    <span className="text-xl font-bold text-gray-900">
                      {unit.batchCode}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {unit.companyName}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {unit.address}
                      </p>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          <img
                            src={Fssai}
                            alt="FSSAI Logo"
                            className="inline-block h-8 w-auto mb-2"
                          />{" "}
                          License No:{" "}
                          <span className="font-normal">
                            {unit.fssaiLicense}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="md:hidden space-y-4">
          {manufacturingUnits.map((unit, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                <h3 className="text-lg font-bold text-gray-900">
                  Batch Code: {unit.batchCode}
                </h3>
              </div>
              <div className="px-4 py-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {unit.companyName}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {unit.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">
                      <img
                        src={Fssai}
                        alt="FSSAI Logo"
                        className="inline-block h-6 w-auto mb-2"
                      />{" "}
                      License No:
                    </span>
                    <br />
                    <span className="text-gray-700">{unit.fssaiLicense}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdressDetail;
