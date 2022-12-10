/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection_data } from "../../data/collection_data";
import HeadLine from "../headLine";
import axios from "axios";
import { useSDK } from "@thirdweb-dev/react/solana";
import { PublicKey } from "@metaplex-foundation/js";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { useStats } from "../../metaplex/useStats";
import Loader from "../Loader";

const Top_collection = () => {
  const [timeActiveText, setTimeActiveText] = useState("last 7 days");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dropdownShow, setDropdownShow] = useState(false);
  const timeText = [
    {
      id: 1,
      text: "Last 24 Hours",
    },
    {
      id: 2,
      text: "Last 7 days",
    },
    {
      id: 3,
      text: "Last 30 days",
    },
  ];

  const { getListings } = useAuctionHouse();

  const { getVolumeTraded, getCollectionFloorPrice } = useStats();
  const [stats, setStats] = useState();

  async function getStats() {
    const l = await getListings();

    const listingsByCollection = l
      .filter(({ asset }) => asset.collection)
      .reduce((acc, nft) => {
        // If the current address doesn't exist in the accumulator, create a new key-value pair
        if (!acc[nft.asset.collection.address]) {
          acc[nft.asset.collection.address] = [nft];
        } else {
          // If the current address does exist in the accumulator, add the current NFT object to the array of NFTs for that address
          acc[nft.asset.collection.address].push(nft);
        }

        // Return the accumulator
        return acc;
      }, {});

    const vt = {};
    for (const col in listingsByCollection) {
      vt[col] = await getVolumeTraded(true, listingsByCollection[col]);
    }
    const fp = {};
    for (const col in listingsByCollection) {
      fp[col] = await getCollectionFloorPrice(true, listingsByCollection[col]);
    }
    setStats({ fp, vt });
  }

  useEffect(() => {
    getStats();
  }, []);

  const sdk = useSDK();

  async function getCollections() {
    if (!sdk) return;
    const collections = await axios.get("/api/getCollections");
    if (!collections.data) return;

    const formatedCollections = await Promise.all(
      collections.data.map(
        async ({
          title,
          image,
          isVerified: icon,
          volumeTraded: amount,
          postTime,
          postDate,
          address,
          creator,
        }) => {
          const program = await sdk.getNFTCollection(new PublicKey(address));
          const itemsCount = await program.totalSupply();
          return {
            title,
            image,
            icon,
            amount,
            postTime,
            postDate,
            address,
            creator,
            itemsCount,
          };
        }
      )
    );
    setData(formatedCollections);
    setAllData(formatedCollections);
  }
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getCollections().finally(() => {
      setIsLoading(false);
    });
  }, [sdk]);

  const handleFilter = (text) => {
    setTimeActiveText(text);
    const newCollectionData = allData.filter((item) => {
      if (text === "Last 30 days") {
        return item;
      }
      return item.postDate === text;
    });
    setData(newCollectionData);
  };

  const handleDropdown = (e) => {
    window.addEventListener("click", (w) => {
      if (w.target.closest(".dropdown-toggle")) {
        if (dropdownShow) {
          setDropdownShow(false);
        } else {
          setDropdownShow(true);
        }
      } else {
        setDropdownShow(false);
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <section className="dark:bg-jacarta-800 relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <div className="font-display text-jacarta-700 mb-12 text-center text-lg sm:text-3xl dark:text-white flex justify-center items-center gap-x-3">
            <HeadLine text="Top collections over" classes="inline" />

            <div className="dropdown cursor-pointer relative">
              <button
                className="dropdown-toggle text-accent inline-flex items-center"
                type="button"
                onClick={(e) => handleDropdown(e)}
              >
                {timeActiveText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-accent h-8 w-8"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
                </svg>
              </button>

              <div
                className={
                  dropdownShow
                    ? "dropdown-menu dark:bg-jacarta-800 z-10  min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl show text-jacarta-700 dark:text-white absolute m-0 top-full"
                    : "dropdown-menu dark:bg-jacarta-800 z-10  min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl hidden text-jacarta-700 dark:text-white absolute m-0 top-full"
                }
              >
                {timeText.map(({ id, text }) => {
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        handleFilter(text);
                      }}
                      className="block dropdown-text"
                    >
                      <span className="dropdown-item font-normal text-base dark:hover:bg-jacarta-600 hover:bg-jacarta-50 block rounded-xl px-5 py-2 transition-colors">
                        {text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-[1.875rem] lg:grid-cols-4">
            {data.map((item, id) => {
              const {
                image,
                title,
                icon,
                amount,
                address,
                creator,
                itemsCount,
              } = item;
              const itemLink = address;

              return (
                <div
                  className="border-jacarta-100 dark:bg-jacarta-700 rounded-2xl border bg-white py-4 px-7 transition-shadow hover:shadow-lg dark:border-transparent"
                  key={id}
                >
                  <div className="flex">
                    <figure className="mr-4 shrink-0">
                      <Link href={"/collection/" + itemLink}>
                        <a className="relative block">
                          {/* <img src={image} alt={title} className="rounded-2lg" /> */}
                          <img
                            src={image}
                            alt={title}
                            className="rounded-2lg aspect-square"
                            height={48}
                            width={48}
                            style={{ objectFit: "cover" }}
                          />
                          <div className="dark:border-jacarta-600 bg-jacarta-700 absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-2/4 items-center justify-center rounded-full border-2 border-white text-xs text-white">
                            {id + 1}
                          </div>
                          {icon && (
                            <div
                              className="dark:border-jacarta-600 bg-green absolute -left-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                              data-tippy-content="Verified Collection"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="h-[.875rem] w-[.875rem] fill-white"
                              >
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                              </svg>
                            </div>
                          )}
                        </a>
                      </Link>
                    </figure>
                    <div>
                      <Link href={"/collection/" + itemLink}>
                        <a className="block">
                          <span className="font-display whitespace-nowrap text-jacarta-700 hover:text-accent font-semibold dark:text-white">
                            {title?.length > 17
                              ? title.substring(0, 17) + ".."
                              : title}
                          </span>
                        </a>
                      </Link>
                      <span className="dark:text-jacarta-300 text-sm flex gap-2">
                        {stats?.vt[itemLink] ?? 0}{" "}
                        <img
                          className="h-6 w-4"
                          src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=023"
                        />
                      </span>
                    </div>
                  </div>
                  {creator && (
                    <div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
                      <div className="flex flex-wrap items-center">
                        <Link href={`/user/${creator?.address}`}>
                          <a className="mr-2 shrink-0">
                            <img
                              src={creator?.profilePhoto}
                              alt="owner"
                              className="h-5 w-5 rounded-full"
                            />
                          </a>
                        </Link>
                        <span className="dark:text-jacarta-400 mr-1">by</span>
                        <Link href={`/user/${creator?.address}`}>
                          <a className="text-accent">
                            <span>
                              {creator?.name?.length > 15
                                ? `${creator?.name?.substring(0, 8)}..`
                                : creator?.name}
                            </span>
                          </a>
                        </Link>
                      </div>
                      <span className="dark:text-jacarta-300 text-sm">
                        {itemsCount} Item{itemsCount === 1 ? "" : "s"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/rankings">
              <a className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all">
                Go to Rankings
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Top_collection;
