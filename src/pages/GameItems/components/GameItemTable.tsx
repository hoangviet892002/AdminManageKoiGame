import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Table, Button, Spin, type TableProps } from "antd";
import queryKey from "../../../constant/query-key";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import { itemApi } from "../../../apis/item.api";
import { useNavigate } from "react-router-dom";
import type { ItemType } from "../../../types/ItemType";
import { defaultValue } from "../../../constant/default-value";
import useGameItemsStore from "../stores/gameItemsStore";

const GameItemTable = () => {
  const query = useQueryParams();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey.getGameItems, query],
    queryFn: async () => await itemApi.fetchItems(query),
  });

  const { setCurrentItem, setModalOpen } = useGameItemsStore();
  const navigate = useNavigate();

  const handleEdit = (item: ItemType) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Rarity", dataIndex: "rarity", key: "rarity" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: { coins: number; gems: number }) =>
        `${price.coins} coins, ${price.gems} gems`,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image || defaultValue.imageURL}
          alt="Game Item"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (item: ItemType) => (
        <Button type="link" onClick={() => handleEdit(item)}>
          Edit
        </Button>
      ),
    },
  ];

  const onChange: TableProps<ItemType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    const newQuery = createQueryParams({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    navigate({ search: newQuery });
  };

  return (
    <Table
      columns={columns}
      dataSource={data?.data}
      rowKey="_id"
      loading={isLoading || isFetching}
      pagination={{
        current: query.page ? Number(query.page) : 1,
        pageSize: query.limit ? Number(query.limit) : 10,
        total: data?.pagination.total || 0,
      }}
      onChange={onChange}
    />
  );
};

export default GameItemTable;
