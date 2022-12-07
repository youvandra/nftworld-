/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { tranding_category_filter } from "../../data/categories_data";
import { HeadLine } from "../../components/component";
import Feature_collections_data from "../../data/Feature_collections_data";
import Collection_dropdown from "../../components/dropdown/collection_dropdown";
import Explore_collection_item from "../../components/collectrions/explore_collection_item";
import Meta from "../../components/Meta";
import { collectCollectionData } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";
import { useSDK } from "@thirdweb-dev/react/solana";
import axios from "axios";
import { PublicKey } from "@metaplex-foundation/js";

const Explore_collection = () => {
  const dispatch = useDispatch();
  const [collectionFilteredData, setCollectionFilteredData] = useState([]);
  const [filterVal, setFilterVal] = useState(0);
  const [data, setdata] = useState([]);
  const sdk = useSDK();

  const handleItemFilter = (text) => {
    if (text === "all") {
      setCollectionFilteredData(data);
    } else {
      setCollectionFilteredData(data.filter((item) => item.category === text));
    }
  };

  useEffect(() => {
    setCollectionFilteredData(data);
  }, [data]);

  useEffect(() => {
    dispatch(collectCollectionData(collectionFilteredData));
  }, [dispatch, collectionFilteredData]);

  async function getCollections() {
    if (!sdk) return;
    const collections = await axios.get("/api/getCollections");
    if (!collections.data) return;

    const formatedCollections = await Promise.all(
      collections.data.map(
        async ({
          title,
          address: id,
          creator: { name: userName, profilePhoto: userImage, address },
          bigImage,
          subImage1,
          subImage2,
          subImage3,
          category,
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
            category,
          };
        }
      )
    );
    setdata(formatedCollections);
  }

  useEffect(() => {
    getCollections();
  }, [sdk]);

  return (
    <>
      <Meta title="Explore Collection || NFTWORLD | NFT Marketplace Next.js Template" />
      <section className="relative mt-24 lg:pb-48 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full"
          />
        </picture>

        <div className="container">
          <HeadLine
            text="Explore Collections"
            classes="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white"
          />

          {/* <!-- Filter --> */}
          <div className="mb-8 flex flex-wrap items-start justify-between">
            <ul className="flex flex-wrap items-center">
              {tranding_category_filter.map(({ id, svg, text }) => {
                if (text === "all") {
                  return (
                    <li
                      className="my-1 mr-2.5"
                      key={id}
                      onClick={() => {
                        handleItemFilter(text);
                        setFilterVal(id);
                      }}
                    >
                      <button
                        className={
                          filterVal === id
                            ? " group bg-accent font-display flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors border-transparent text-white capitalize"
                            : "dark:border-jacarta-600 dark:bg-jacarta-900 dark:hover:bg-accent group hover:bg-accent border-jacarta-100 font-display text-jacarta-500 flex h-9 items-center rounded-lg border bg-white px-4 text-sm font-semibold transition-colors hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent dark:hover:text-white capitalize"
                        }
                      >
                        {text}
                      </button>
                    </li>
                  );
                } else {
                  return (
                    <li
                      className="my-1 mr-2.5"
                      key={id}
                      onClick={() => {
                        handleItemFilter(text);
                        setFilterVal(id);
                      }}
                    >
                      <button
                        className={
                          filterVal === id
                            ? "dark:border-jacarta-600 bg-accent group border-jacarta-100 font-display flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition-colors border-transparent dark:border-transparent text-white"
                            : "dark:border-jacarta-600 dark:bg-jacarta-900 dark:hover:bg-accent group hover:bg-accent border-jacarta-100 font-display text-jacarta-500 flex h-9 items-center rounded-lg border bg-white px-4 text-sm font-semibold transition-colors hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent dark:hover:text-white"
                        }
                      >
                        <svg
                          className={
                            filterVal === id
                              ? "icon mr-1 h-4 w-4 transition-colors fill-white"
                              : "icon fill-jacarta-700 dark:fill-jacarta-100 mr-1 h-4 w-4 transition-colors group-hover:fill-white"
                          }
                        >
                          <use xlinkHref={`/icons.svg#icon-${svg}`}></use>
                        </svg>
                        <span>{text}</span>
                      </button>
                    </li>
                  );
                }
              })}
            </ul>
            {/* dropdown */}
            <Collection_dropdown />
          </div>

          {/* <!-- Grid --> */}

          <Explore_collection_item />
        </div>
      </section>
    </>
  );
};

export default Explore_collection;
