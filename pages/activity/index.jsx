import React, { useEffect, useState } from "react";
import Activity_item from "../../components/collectrions/Activity_item";
import Meta from "../../components/Meta";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";

const index = () => {
  const { getBids, getListings } = useAuctionHouse();
  const [bids, setBids] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getBids().then((b) => {
      setBids(b);
    });
    getListings().then((l) => {
      setListings(l);
    });
  }, []);

  return (
    <>
      <Meta title="Activity || NFTWORLD | NFT Marketplace Next.js Template" />
      <section className="relative mt-24 lg:pb-48 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
            Activity
          </h1>

          <Activity_item bids={bids} listings={listings} />
        </div>
      </section>
    </>
  );
};

export default index;
