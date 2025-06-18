import { Button } from "antd";
import ClearFilterButton from "../../components/ClearFilterButton";
import KoiBreedForm from "./components/KoiBreedForm";
import KoiTypeFilter from "./components/KoiTypeFilter";
import KoiTypeSearchBar from "./components/KoiTypeSearchBar";
import KoiTypeTable from "./components/KoiTypeTable";
import useKoiTypesStore from "./stores/koiTypesStore";

const KoiTypes = () => {
  const { setCurrentKoiType, setModalOpen } = useKoiTypesStore();
  const handleAdd = () => {
    setCurrentKoiType(null);
    setModalOpen(true);
  };

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
        <KoiBreedForm />
      </div>
      <Button
        type="primary"
        onClick={handleAdd}
        style={{ marginBottom: "16px" }}
      >
        Add Item
      </Button>

      <KoiTypeTable />
    </div>
  );
};

export default KoiTypes;
