import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import BidItem from "../components/categories/bidItem";
import Loader from "../components/Loader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useAuctionHouse } from "../metaplex/useAuctionHouse";
import { useNFTs } from "../metaplex/useNFTs";
import OfferItem from "../components/categories/OfferItem";

export default function List() {
  const { publicKey } = useWallet();
  const { getBids } = useAuctionHouse();

  const [allBids, setallBids] = useState([]);
  const [bids, setBids] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading1, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const { getNFTsByOwner } = useNFTs();

  const getAllbids = async () => {
    setIsLoading(true);
    setIsLoading2(true);
    const allBids = await getBids();

    setallBids(
      allBids.filter(({ purchaseReceiptAddress }) => !purchaseReceiptAddress)
    );
    setIsLoading2(false);
    setIsLoading(false);
  };

  const filterBids = async () => {
    if (allBids.length === 0) return;

    //bids
    setBids(
      allBids.filter(
        ({ buyerAddress }) => buyerAddress.toBase58() === publicKey.toBase58()
      )
    );

    //offers
    setIsLoading2(true);
    const ownedNFTsAddresses = (await getNFTsByOwner(publicKey.toBase58())).map(
      ({ mintAddress }) => mintAddress.toBase58()
    );

    setOffers(
      allBids.filter(({ asset }) => {
        return ownedNFTsAddresses.includes(asset.mint.address.toBase58());
      })
    );
    setIsLoading2(false);
  };

  useEffect(() => {
    getAllbids();
  }, []);
  useEffect(() => {
    filterBids();
  }, [publicKey, allBids]);
  const [itemsTabs, setItemsTabs] = useState(1);

  const tabs = [
    {
      id: 1,
      text: "My bids",
      icon: "bids",
    },
    {
      id: 2,
      text: "Incoming offers",
      icon: "listing",
    },
  ];

  return (
    <div className="pt-[5.5rem] lg:pt-24 container">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">
        Manage your bids
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
          {isLoading1 && <Loader />}
          {!isLoading1 &&
            (bids.length === 0 ? (
              <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
                You have no active bids
              </p>
            ) : (
              <BidItem bids={bids} getMyBids={getAllbids} />
            ))}
        </TabPanel>

        <TabPanel>
          {isLoading2 && <Loader />}
          {!isLoading2 &&
            (offers.length === 0 ? (
              <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
                You have no incoming offers
              </p>
            ) : (
              <OfferItem bids={offers} getAllBids={getAllbids} />
            ))}
        </TabPanel>
      </Tabs>
    </div>
  );
}
