/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { Table, Button, type TableProps, Popconfirm, message } from "antd";
import queryKey from "../../../constant/query-key";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import { koiBreedApi } from "../../../apis/koi-breed.api";
import { useNavigate } from "react-router-dom";
import type { KoiBreedType } from "../../../types/koi-breed.type";
import { defaultValue } from "../../../constant/default-value";
import useKoiTypesStore from "../stores/koiTypesStore";
import { useQueryClient } from "@tanstack/react-query";

const KoiTypeTable = () => {
  const query = useQueryParams();
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKey.getKoiTypes, query],
    queryFn: async () => await koiBreedApi.fetchKoiTypes(query),
  });

  const navigate = useNavigate();
  const { setCurrentKoiType, setModalOpen } = useKoiTypesStore();
  const queryClient = useQueryClient();

  const handleEdit = (record: KoiBreedType) => {
    setCurrentKoiType(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await koiBreedApi.deleteKoiBreed(id);
      if (response.isSuccess) {
        message.success("Koi breed deleted successfully");
        await queryClient.invalidateQueries({
          queryKey: [queryKey.getKoiTypes],
        });
      } else {
        message.error(response.message || "Failed to delete koi breed");
      }
    } catch (error) {
      console.error("Error deleting koi breed:", error);
      message.error("An error occurred while deleting the koi breed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Breed Name", dataIndex: "breedName", key: "breedName" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Base Price", dataIndex: "basePrice", key: "basePrice" },
    { title: "Rarity", dataIndex: "rarity", key: "rarity" },
    {
      title: "Growth Rate",
      dataIndex: "baseGrowthRate",
      key: "baseGrowthRate",
    },
    {
      title: "Image",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl: string) => (
        <img
          src={imgUrl || defaultValue.imageURL}
          alt="Koi Breed"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: KoiBreedType) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Koi Breed"
            description="Are you sure you want to delete this koi breed? This action cannot be undone."
            onConfirm={() => handleDelete(record._id || "")}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChange: TableProps<KoiBreedType>["onChange"] = (
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

export default KoiTypeTable;
