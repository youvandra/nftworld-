import { useWallet } from "@solana/wallet-adapter-react";
import { useNFTs } from "../metaplex/useNFTs";
import UserItem from "../components/categories/userItems";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import { useAuctionHouse } from "../metaplex/useAuctionHouse";
import UserListingItem from "../components/categories/UserListingItem";
import Loader from "../components/Loader";

export default function List() {
  const { publicKey } = useWallet();
  const { getNFTsByOwner } = useNFTs();
  const [itemsTabs, setItemsTabs] = useState(1);
  const { getListings } = useAuctionHouse();

  const [nfts, setNfts] = useState([]);
  const [myListings, setMyListings] = useState([]);

  const [isloading2, setIsloading2] = useState(false);
  const [isloading1, setIsloading1] = useState(false);

  const getMyNFTs = async () => {
    setIsloading1(true);
    const nfts = await getNFTsByOwner(publicKey.toBase58());
    setNfts(nfts);
    setIsloading1(false);
  };

  const getMyListings = async () => {
    setIsloading2(true);
    const nfts = await getListings({ seller: publicKey });
    setMyListings(
      nfts.filter(({ purchaseReceiptAddress }) => !purchaseReceiptAddress)
    );
    setIsloading2(false);
  };

  useEffect(() => {
    if (!publicKey) return;
    getMyListings();
    getMyNFTs();
  }, [publicKey]);

  const tabs = [
    {
      id: 1,
      text: "My Items",
      icon: "items",
    },
    {
      id: 2,
      text: "My listings",
      icon: "listing",
    },
  ];

  return (
    <div className="pt-[5.5rem] lg:pt-24 container">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">
        Manage listings
      </h1>
      <Tabs className="tabs">
        <TabList className="nav nav-tabs dark:border-jacarta-600 border-jacarta-100 mb-12 flex items-center justify-center border-b">
          {tabs.map(({ id, text, icon }) => {
            return (
              <Tab
                className="nav-item"
                key={id}
                onClick={() => setItemsTabs(id)}
              >
                <button
                  className={
                    itemsTabs === id
                      ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                      : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                  }
                >
                  <svg className="icon icon-items mr-1 h-5 w-5 fill-current">
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
          {isloading1 ? (
            <Loader />
          ) : nfts.length === 0 ? (
            <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
              You have no NFTs
            </p>
          ) : (
            <UserItem nfts={nfts} />
          )}
        </TabPanel>
        <TabPanel>
          {isloading2 ? (
            <Loader />
          ) : myListings.length === 0 ? (
            <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
              You have no listings
            </p>
          ) : (
            <UserListingItem
              getMyListings={getMyListings}
              listings={myListings}
            />
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
}
