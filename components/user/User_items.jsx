import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Activity_item from "../collectrions/Activity_item";
import Image from "next/image";
import Trending_categories_items from "../categories/trending_categories_items";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import "react-tabs/style/react-tabs.css";
import Explore_collection_item from "../collectrions/explore_collection_item";

import ListingItem from "../categories/listingItem";
import { PublicKey } from "@metaplex-foundation/js";
import Loader from "../Loader";
import { useSDK } from "@thirdweb-dev/react/solana";
import axios from "axios";
import { useDispatch } from "react-redux";
import { collectCollectionData } from "../../redux/counterSlice";

const User_items = ({ address }) => {
  const [itemActive, setItemActive] = useState(1);
  const tabItem = [
    {
      id: 1,
      text: "on sale",
      icon: "on-sale",
    },
    {
      id: 2,
      text: "owned",
      icon: "owned",
    },
    {
      id: 3,
      text: "created(20)",
      icon: "created",
    },
    {
      id: 4,
      text: "collections",
      icon: "listing",
    },
    {
      id: 5,
      text: "Activity",
      icon: "activity",
    },
  ];
  const dispatch = useDispatch();

  const { getListings } = useAuctionHouse();
  const [userListings, setUserListings] = useState();
  const [collections, setCollections] = useState([]);

  const sdk = useSDK();
  async function getUserListings() {
    if (!address) return;
    const listing = await getListings({ seller: new PublicKey(address) });
    setUserListings(listing);
  }

  useEffect(() => {
    getUserListings();
  }, [address]);

  async function getCollections() {
    if (!sdk || !address) return;
    const collections = await axios.get("/api/getCollections");
    if (!collections.data) return;

    const filteredCollections = collections.data.filter(
      ({ creatorAddress }) => address === creatorAddress
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
    setCollections(formatedCollections);
  }

  useEffect(() => {
    getCollections();
  }, [sdk, address]);

  useEffect(() => {
    dispatch(collectCollectionData(collections));
  }, [collections]);

  return (
    <>
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          {/* <img src="img/gradient_light.jpg" alt="gradient" className="h-full w-full" /> */}
          <Image
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
            layout="fill"
          />
        </picture>
        <div className="container">
          {/* <!-- Tabs Nav --> */}
          <Tabs className="tabs">
            <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
              {tabItem.map(({ id, text, icon }) => {
                return (
                  <Tab
                    className="nav-item"
                    role="presentation"
                    key={id}
                    onClick={() => setItemActive(id)}
                  >
                    <button
                      className={
                        itemActive === id
                          ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                          : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                      }
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
              {!userListings ? (
                <Loader />
              ) : (
                <div>
                  {/* <!-- Filter --> */}
                  <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
                    {userListings.map(
                      (
                        {
                          creators,
                          metadata: { image, name },
                          listing,
                          address,
                        },
                        i
                      ) => (
                        <ListingItem
                          key={i}
                          creatorAddress={creators[0]?.address?.toBase58()}
                          listing={listing}
                          image={image}
                          name={name}
                          address={address?.toBase58()}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </TabPanel>
            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items type="owned" />
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items type="created" />
              </div>
            </TabPanel>
            <TabPanel>
              {/* <!-- Grid --> */}
              <Explore_collection_item />
            </TabPanel>
            <TabPanel>
              <div>
                <Activity_item />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default User_items;
