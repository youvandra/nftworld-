import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Feature_collections_data from "../../data/Feature_collections_data";
import axios from "axios";
import { useNFTs } from "../../metaplex/useNFTs";
import { useSDK } from "@thirdweb-dev/react/solana";
import { PublicKey } from "@metaplex-foundation/js";

const Explore_collection_item = ({ itemFor }) => {
  const [data, setData] = useState(Feature_collections_data);
  const sdk = useSDK();

  async function getCollections() {
    if (!sdk) return;
    const collections = await axios.get("/api/getCollections");
    if (!collections.data) return;

    const filteredCollections = collections.data.filter(({ creatorAddress }) =>
      itemFor ? itemFor === creatorAddress : true
    );

    const formatedCollections = await Promise.all(
      filteredCollections.map(
        async ({
          title,
          address: id,
          creator: { name: userName, profilePhoto: userImage, address },
          bigImage,
          subImage1,
          subImage2,
          subImage3,
        }) => {
          const program = await sdk.getNFTCollection(new PublicKey(id));
          const nfts = [];
          // const nfts = await program.getAll({ count: 3 });
          const itemsCount = await program.totalSupply();

          const img1 = nfts[0]?.metadata?.image;
          const img2 = nfts[1]?.metadata?.image;
          const img3 = nfts[2]?.metadata?.image;

          return {
            title,
            id,
            itemsCount,
            userName,
            bigImage,
            subImage1: img1 ?? subImage1,
            subImage2: img2 ?? subImage2,
            subImage3: img3 ?? subImage3,
            userImage,
            address,
          };
        }
      )
    );
    setData(formatedCollections);
  }

  useEffect(() => {
    getCollections();
  }, [sdk]);

  return (
    <>
      {data.map((item) => {
        const {
          id,
          bigImage,
          subImage1,
          subImage2,
          subImage3,
          userImage,
          title,
          itemsCount,
          userName,
          address,
        } = item;
        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 flex flex-col h-full dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <Link href={`/collection/${id}`}>
                <a className="flex flex-grow space-x-[0.625rem]">
                  <span className="w-[74.5%]">
                    <img
                      src={bigImage}
                      alt="item 1"
                      className="h-full min-h-[182px] w-full rounded-[0.625rem] object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="flex w-1/3 flex-col space-y-[0.625rem]">
                    <img
                      src={subImage1}
                      alt="item 1"
                      className="h-full rounded-[0.625rem] object-cover"
                      loading="lazy"
                    />
                    <img
                      src={subImage2}
                      alt="item 1"
                      className="h-full rounded-[0.625rem] object-cover"
                      loading="lazy"
                    />
                    <img
                      src={subImage3}
                      alt="item 1"
                      className="h-full rounded-[0.625rem] object-cover"
                      loading="lazy"
                    />
                  </span>
                </a>
              </Link>

              <Link href={`collection/${id}`}>
                <a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
                  {title}
                </a>
              </Link>

              <div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
                <div className="flex flex-wrap items-center">
                  <Link href={`/user/${address}`}>
                    <a className="mr-2 shrink-0">
                      <img
                        src={userImage}
                        alt="owner"
                        className="h-5 w-5 rounded-full"
                      />
                    </a>
                  </Link>
                  <span className="dark:text-jacarta-400 mr-1">by</span>
                  <Link href={`/user/${address}`}>
                    <a className="text-accent">
                      <span>
                        {userName?.length > 15
                          ? `${userName?.substring(0, 13)}..`
                          : userName}
                      </span>
                    </a>
                  </Link>
                </div>
                <span className="dark:text-jacarta-300 text-sm">
                  {itemsCount} Item{itemsCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
};

export default Explore_collection_item;
