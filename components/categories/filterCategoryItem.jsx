import React, { useEffect, useState } from "react";
import { trendingCategoryData } from "../../data/categories_data";
import Collection_category_filter from "../collectrions/collection_category_filter";
import { useDispatch } from "react-redux";
import { updateTrendingCategoryItemData } from "../../redux/counterSlice";
import OwnedItem from "./ownedItem";
import { useNFTs, useProgram } from "@thirdweb-dev/react/solana";
import { useRouter } from "next/router";

const FilterCategoryItem = () => {
  const dispatch = useDispatch();

  const [nfts, setNFTs] = useState(trendingCategoryData.slice(0, 8));

  const router = useRouter();
  const address = router.query.collection;

  const { program } = useProgram(address);

  const { data } = useNFTs(program);

  useEffect(() => {
    if (!data) return;

    const formatedNFTs = data.map(
      ({ metadata: { id, image, name: title } }) => ({ id, image, title })
    );
    setNFTs(formatedNFTs);
  }, [data]);

  useEffect(() => {
    dispatch(updateTrendingCategoryItemData(nfts));
  }, [nfts]);

  return (
    <div>
      {/* <!-- Filter --> */}
      <Collection_category_filter />
      <OwnedItem />
    </div>
  );
};

export default FilterCategoryItem;
