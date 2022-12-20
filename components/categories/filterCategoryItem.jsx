import React, { useEffect, useState } from "react";
import Collection_category_filter from "../collectrions/collection_category_filter";
import { useDispatch } from "react-redux";
import { updateTrendingCategoryItemData } from "../../redux/counterSlice";
import OwnedItem from "./ownedItem";
import { useNFTs, useProgram } from "@thirdweb-dev/react/solana";
import { useRouter } from "next/router";
import Loader from "../Loader";

const FilterCategoryItem = () => {
  const dispatch = useDispatch();

  const [nfts, setNFTs] = useState([]);

  const router = useRouter();
  const address = router.query.collection;

  const { program } = useProgram(address);

  const { data } = useNFTs(program);

  useEffect(() => {
    if (!data) return;

    const formatedNFTs = data.map(
      ({ metadata: { id, image, name: title, ...metadata } }) => ({
        id,
        image,
        title,
        metadata,
      })
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
      {data ? <OwnedItem /> : <Loader />}
    </div>
  );
};

export default FilterCategoryItem;
