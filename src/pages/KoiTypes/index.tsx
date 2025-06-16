import React from "react";
import KoiTypeTable from "./components/KoiTypeTable";
import KoiTypeSearchBar from "./components/KoiTypeSearchBar";
import KoiTypeFilter from "./components/KoiTypeFilter";
import ClearFilterButton from "../../components/ClearFilterButton";

const KoiTypes = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Koi Types</h2>
      <div className="mb-4 flex items-center justify-between w-full">
        {/* Search Bar */}
        <KoiTypeSearchBar />

        {/* Filter Section */}
        <div>
          <KoiTypeFilter />
          <ClearFilterButton />
        </div>
      </div>

      <KoiTypeTable />
    </div>
  );
};

export default KoiTypes;
