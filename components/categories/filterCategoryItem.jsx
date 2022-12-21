import React, { useEffect, useState } from "react";
import Collection_category_filter from "../collectrions/collection_category_filter";
import { useDispatch } from "react-redux";
import { updateTrendingCategoryItemData } from "../../redux/counterSlice";
import OwnedItem from "./ownedItem";
import { useNFTs, useProgram } from "@thirdweb-dev/react/solana";
import { useRouter } from "next/router";
import Loader from "../Loader";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const FilterCategoryItem = ({ collectionBids, collectionLisings }) => {
  const dispatch = useDispatch();

  const [nfts, setNFTs] = useState([]);

  const router = useRouter();
  const address = router.query.collection;

  const { program } = useProgram(address);

  const { data, isLoading } = useNFTs(program);

  useEffect(() => {
    if (!data) return;

    const liveListings = collectionLisings.filter(
      ({ purchaseReceiptAddress }) => !purchaseReceiptAddress
    );

    const formatedNFTs = data.map(
      ({ metadata: { id, image, name: title, ...metadata } }) => {
        const nft = liveListings.find(
          (item) => id === item.asset.address.toBase58()
        );
        console.log({ nft });
        if (!nft)
          return {
            id,
            image,
            title,
            metadata,
            price: 0,
          };
        return {
          id,
          image,
          title,
          metadata,
          price: nft.price.basisPoints.toNumber() / LAMPORTS_PER_SOL,
        };
      }
    );
    setNFTs(formatedNFTs);
  }, [data, collectionLisings, collectionBids]);

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
