import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import Loader from "../Loader";

//bids and listings to activities

// id: '0Lazyone Panda',
// 		image: '/images/avatars/avatar_2.jpg',
// 		title: 'Lazyone Panda',
// 		price: 'sold for 1.515 ETH',
// 		time: '30 minutes 45 seconds ago',
// 		category: 'purchases',

const getUser = async (address) => {
  const { data: user } = await axios.get(
    `/api/getUserByAddress?address=${address?.toBase58()}`
  );

  return user;
};

async function formatBids(bids) {
  //remove purchases
  const filteredBids = bids.filter(
    ({ purchaseReceiptAddress }) => !purchaseReceiptAddress
  );

  const promises = filteredBids.map(
    async ({ asset, createdAt, price, buyerAddress }) => {
      const user = await getUser(buyerAddress);
      const formatedPrice = price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL;

      return {
        title: asset.metadata.name,
        image: asset.metadata.metadata.image,
        price: `bid for ${formatedPrice} SOL by ${user?.name ?? "unkown user"}`,
        id: asset.address,
        category: "bids",
        time: new Date(createdAt * 1000).toLocaleDateString(),
        address: asset.metadata.address,
      };
    }
  );
  const formatedBids = await Promise.all(promises);
  return formatedBids;
}

async function formatListings(l) {
  const listings = l.filter(
    ({ purchaseReceiptAddress }) => !purchaseReceiptAddress
  );
  const purchases = l.filter(
    ({ purchaseReceiptAddress }) => purchaseReceiptAddress
  );

  const listingsPromises = listings.map(
    async ({ asset, createdAt, price, sellerAddress }) => {
      const user = await getUser(sellerAddress);
      const formatedPrice = price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL;

      return {
        title: asset.metadata.name,
        image: asset.metadata.metadata.image,
        price: `listed for ${formatedPrice} SOL by ${
          user?.name ?? "unkown user"
        } `,
        id: asset.address,
        category: "listing",
        time: new Date(createdAt * 1000).toLocaleDateString(),
        address: asset.metadata.address,
      };
    }
  );
  const purchasesPromises = purchases.map(
    async ({ asset, createdAt, price, sellerAddress }) => {
      const user = await getUser(sellerAddress);
      const formatedPrice = price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL;

      return {
        title: asset.metadata.name,
        image: asset.metadata.metadata.image,
        price: `sold for ${formatedPrice} SOL by ${
          user?.name ?? "unkown user"
        }`,
        id: asset.address,
        category: "purchases",
        time: new Date(createdAt * 1000).toLocaleDateString(),
        address: asset.metadata.address,
      };
    }
  );

  const formatedListings = await Promise.all(listingsPromises);
  const formatedPurchases = await Promise.all(purchasesPromises);

  return [...formatedListings, ...formatedPurchases];
}

async function getActivities(bids, listings) {
  const l = await formatListings(listings);
  const b = await formatBids(bids);
  const a = [...b, ...l];

  a.sort((a, b) => new Date(b.time) - new Date(a.time));
  return a;
}

const Activity_item = ({ listings = [], bids = [] }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getActivities(bids, listings)
      .then((a) => {
        setActivities(a);
        setData(a);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [listings, bids]);

  const [filterVal, setFilterVal] = useState(null);
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const [data, setData] = useState(activities);
  const [filterData, setfilterData] = useState([
    "purchases",
    "listing",
    "bids",
  ]);

  const [inputText, setInputText] = useState("");

  const handleFilter = (category) => {
    if (category !== filterData[filterVal])
      return setData(activities.filter((item) => item.category === category));

    setData(activities);
    setFilterVal(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newArray = activities.filter((item) => {
      return item.title.toLowerCase().includes(inputText.toLocaleLowerCase());
    });
    setData(newArray);
    setInputText("");
  };

  useEffect(() => {
    setfilterData(filterData.filter(onlyUnique));
  }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      {/* <!-- Activity Tab --> */}
      <div className="tab-pane fade">
        {/* <!-- Records / Filter --> */}
        <div className="lg:flex">
          {/* <!-- Records --> */}
          <div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
            {data.map((item) => {
              const { id, image, title, price, time, category, address } = item;

              return (
                <Link href={`/item/${address}`} key={id}>
                  <a className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl relative flex items-center border bg-white p-8 transition-shadow hover:shadow-lg">
                    <figure className="mr-5 self-start">
                      <Image
                        src={image}
                        alt={title}
                        height={50}
                        width={50}
                        objectFit="cover"
                        className="rounded-2lg"
                        loading="lazy"
                      />
                    </figure>

                    <div>
                      <h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">
                        {title}
                      </h3>
                      <span className="dark:text-jacarta-200 text-jacarta-500 mb-3 block text-sm">
                        {price}
                      </span>
                      <span className="text-jacarta-300 block text-xs">
                        {time}
                      </span>
                    </div>

                    <div className="dark:border-jacarta-600 border-jacarta-100 ml-auto rounded-full border p-3">
                      <svg className="icon fill-jacarta-700 dark:fill-white h-6 w-6">
                        <use xlinkHref={`/icons.svg#icon-${category}`}></use>
                      </svg>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>

          {/* <!-- Filters --> */}
          <aside className="basis-4/12 lg:pl-5">
            <form
              action="search"
              className="relative mb-12 block"
              onSubmit={handleSubmit}
            >
              <input
                type="search"
                className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
                placeholder="Search"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-500 h-4 w-4 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
                </svg>
              </button>
            </form>

            <h3 className="font-display text-jacarta-500 mb-4 font-semibold dark:text-white">
              Filters
            </h3>
            <div className="flex flex-wrap">
              {filterData.map((category, i) => {
                return (
                  <button
                    className={
                      filterVal === i
                        ? "dark:border-jacarta-600 group bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border px-4 py-3 border-transparent text-white dark:border-transparent"
                        : "dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent"
                    }
                    key={i}
                    onClick={() => {
                      setFilterVal(i);
                      handleFilter(category);
                    }}
                  >
                    <svg
                      className={
                        filterVal === i
                          ? "icon mr-2 h-4 w-4 fill-white"
                          : "icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white"
                      }
                    >
                      <use xlinkHref={`/icons.svg#icon-${category}`}></use>
                    </svg>
                    <span className="text-2xs font-medium capitalize">
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Activity_item;
