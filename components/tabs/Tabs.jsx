import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Properties from "./Properties";
import Activity_tab from "./Activity_tab";
import Price_history from "./Price_history";
import "react-tabs/style/react-tabs.css";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { useEffect } from "react";
import Loader from "../Loader";

function isWithinLast6Monthes(date) {
  const now = new Date();
  const yearAgo = new Date(now.getFullYear(), now.getMonth() - 6);
  return date >= yearAgo;
}

function getMonthName(dateString) {
  const date = new Date(dateString + "-01"); // create a Date instance from the date string
  const options = { month: "long" }; // specify that we want the month name
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const ItemsTabs = ({ nft }) => {
  const [tabsActive, setTabsActive] = useState(2);

  const { getListings } = useAuctionHouse();

  const [priceHistory, setPriceHistory] = useState();

  const tabsHeadText = [
    {
      id: 2,
      text: "properties",
      icon: "properties",
    },
    {
      id: 3,
      text: "details",
      icon: "details",
    },
    {
      id: 4,
      text: "activities",
      icon: "activity",
    },
    {
      id: 5,
      text: "price history",
      icon: "price",
    },
  ];

  const getPriceHistory = async () => {
    if (!nft) return;
    const allListing = await getListings({
      metadata: nft?.metadataAddress,
    });

    const purchases = allListing.filter(
      ({ purchaseReceiptAddress, createdAt }) =>
        purchaseReceiptAddress &&
        isWithinLast6Monthes(new Date(createdAt * 1000))
    );

    const stats = purchases.map(({ price, createdAt }) => ({
      price: price.basisPoints.toNumber() / LAMPORTS_PER_SOL,
      createdAt: new Date(createdAt.toNumber() * 1000),
    }));

    const result = stats.reduce((acc, { price, createdAt }) => {
      const month = createdAt.toISOString().slice(0, 7); // get the month and year from the date
      const monthName = getMonthName(month); // get the month name
      acc[monthName] = acc[monthName] || { avgPrice: 0, numSales: 0 };
      acc[monthName].numSales += 1;
      acc[monthName].avgPrice += price;
      acc[monthName].avgPrice =
        acc[monthName].avgPrice / acc[monthName].numSales;

      return acc;
    }, {});

    console.log(result);
    return result;
  };

  useEffect(() => {
    getPriceHistory().then((ph) => {
      setPriceHistory(ph);
    });
  }, [nft]);

  return (
    <>
      <div className="scrollbar-custom mt-14 overflow-x-auto rounded-lg">
        {/* <!-- Tabs Nav --> */}
        <Tabs className="min-w-fit tabs">
          <TabList className="nav nav-tabs flex items-center">
            {/* <!-- Offers --> */}
            {tabsHeadText.map(({ id, text, icon }) => {
              return (
                <Tab className="nav-item bg-transparent" key={id}>
                  <button
                    className={
                      tabsActive === id
                        ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                        : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                    }
                    onClick={() => setTabsActive(id)}
                  >
                    <svg className="icon mr-1 h-5 w-5 fill-current">
                      <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                    </svg>
                    <span className="font-display text-base font-medium">
                      {text}
                    </span>
                  </button>
                </Tab>
              );
            })}
          </TabList>

          <TabPanel>
            {nft?.metadata?.properties ? (
              <Properties properties={nft?.metadata?.properties} />
            ) : (
              <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
                This NFT has no properties
              </p>
            )}
          </TabPanel>
          <TabPanel>
            {/* <!-- Details --> */}
            <div
              className="tab-pane fade"
              id="details"
              role="tabpanel"
              aria-labelledby="details-tab"
            >
              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-t-2lg rounded-b-2lg rounded-tl-none border bg-white p-6 md:p-10">
                <div className="mb-2 flex items-center">
                  <span className="dark:text-jacarta-300 mr-2 min-w-[9rem]">
                    Contract Address:
                  </span>
                  <a
                    rel="noreferrer"
                    target={"_blank"}
                    href={`https://solscan.io/address/${nft?.address?.toBase58()}`}
                    className="text-accent"
                  >
                    {nft?.address?.toBase58()}
                  </a>
                </div>

                <div className="flex items-center">
                  <span className="dark:text-jacarta-300 mr-2 min-w-[9rem]">
                    Blockchain:
                  </span>
                  <span className="text-jacarta-700 dark:text-white">
                    Solana
                  </span>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <Activity_tab address={nft?.address?.toBase58()} />
          </TabPanel>
          <TabPanel>
            {priceHistory ? (
              <Price_history
                priceHistory={priceHistory}
                classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-t-2lg rounded-b-2lg rounded-tl-none border bg-white p-6"
              />
            ) : (
              <Loader />
            )}
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default ItemsTabs;
