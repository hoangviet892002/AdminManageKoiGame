import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Table, Button, Spin, type TableProps } from "antd";
import queryKey from "../../../constant/query-key";
import useQueryParams, {
  createQueryParams,
} from "../../../hooks/query/useQueryParams";
import { koiBreedApi } from "../../../apis/koi-breed.api";
import { useNavigate } from "react-router-dom";
import type { KoiBreedType } from "../../../types/koi-breed.type";
import { defaultValue } from "../../../constant/default-value";

const KoiTypeTable = () => {
  const query = useQueryParams();
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [queryKey.getKoiTypes, query],
    queryFn: async () => await koiBreedApi.fetchKoiTypes(query),
  });

  const navigate = useNavigate();
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
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => <Button type="link">Edit</Button>,
    },
  ];
  const onChange: TableProps<KoiBreedType>["onChange"] = (
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

export default KoiTypeTable;
