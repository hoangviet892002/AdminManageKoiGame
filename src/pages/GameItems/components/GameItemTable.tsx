/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Table, type TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import { itemApi } from "../../../apis/item.api";
import { defaultValue } from "../../../constant/default-value";
import queryKey from "../../../constant/query-key";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import type { ItemType } from "../../../types/ItemType";
import useGameItemsStore from "../stores/gameItemsStore";
import { useMessage } from "../../../contexts/message.context";

const GameItemTable = () => {
  const query = useQueryParams();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey.getGameItems, query],
    queryFn: async () => await itemApi.fetchItems(query),
  });
  const queryClient = useQueryClient();

  const { setCurrentItem, setModalOpen } = useGameItemsStore();
  const navigate = useNavigate();

  const handleEdit = (item: ItemType) => {
    setCurrentItem(item);
    setModalOpen(true);
  };
  const { showMessage } = useMessage();

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
        <div>
          <Button type="link" onClick={() => handleEdit(item)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            onConfirm={async () => {
              try {
                const res = await itemApi.deleteItem(item._id as string);
                if (res.isSuccess) {
                  showMessage(
                    "success",
                    res.message || "Item deleted successfully"
                  );
                  await queryClient.invalidateQueries({
                    queryKey: [queryKey.getGameItems],
                  });
                } else {
                  showMessage("error", res.message || "Failed to delete item");
                }
              } catch (error) {
                showMessage(
                  "error",
                  "An error occurred while deleting the item"
                );
              }
            }}
            placement="topRight"
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChange: TableProps<ItemType>["onChange"] = (
    pagination,
    _filters,
    _sorter,
    _extra
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
