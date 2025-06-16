import React from "react";
import GameItemTable from "./components/GameItemTable";
import GameItemsSearchbar from "./components/GameItemsSearchbar";
import GameItemsFilter from "./components/GameItemFilter";
import ClearFilterButton from "../../components/ClearFilterButton";
import useGameItemsStore from "./stores/gameItemsStore";
import { Button } from "antd";
import ItemForm from "./components/ItemForm";

const GameItems = () => {
  const { setCurrentItem, setModalOpen } = useGameItemsStore();

  const handleAdd = () => {
    setCurrentItem(null);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Game Items</h2>
      <div className="mb-4 flex items-center justify-between w-full">
        <GameItemsSearchbar />
        <div>
          <GameItemsFilter />
          <ClearFilterButton />
        </div>
        <ItemForm />
      </div>
      <Button
        type="primary"
        onClick={handleAdd}
        style={{ marginBottom: "16px" }}
      >
        Add Item
      </Button>
      <GameItemTable />
    </div>
  );
};

export default GameItems;
