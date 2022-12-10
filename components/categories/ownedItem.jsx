import React, { useState } from "react";
import Link from "next/link";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect } from "react";
import Tippy from "@tippyjs/react";

const OwnedItem = () => {
  const { sortedtrendingCategoryItemData } = useSelector(
    (state) => state.counter
  );

  const { getListings } = useAuctionHouse();

  const [listedItems, setListedItems] = useState([]);

  async function listedItemsByAddress() {
    const listings = await getListings();

    const _ = listings
      .filter(({ purchaseReceiptAddress }) => !purchaseReceiptAddress)
      .reduce((acc, listing) => {
        // If the current address doesn't exist in the accumulator, create a new key-value pair
        if (!acc[listing.asset.address.toBase58()]) {
          acc[listing.asset.address.toBase58()] =
            listing.price.basisPoints.toNumber() / LAMPORTS_PER_SOL;
        } else {
          // If the current address does exist in the accumulator, add the current listing object to the array of listings for that address
          if (
            acc[listing.asset.address.toBase58()] <
            listing.price.basisPoints.toNumber() / LAMPORTS_PER_SOL
          )
            acc[listing.asset.address.toBase58()] =
              listing.price.basisPoints.toNumber() / LAMPORTS_PER_SOL;
        }

        // Return the accumulator
        return acc;
      }, {});

    setListedItems(_);
  }

  useEffect(() => {
    listedItemsByAddress();
  }, []);

  if (sortedtrendingCategoryItemData?.length === 0) return <Loader />;
  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {sortedtrendingCategoryItemData.map((item) => {
        const { id, image, title } = item;
        const itemLink = id;

        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/item/${itemLink}`}>
                  <a>
                    <img
                      src={image}
                      alt="item 5"
                      className="w-full h-[230px] rounded-[0.625rem] object-cover"
                    />
                  </a>
                </Link>
              </figure>
              <div className="mt-7 flex items-center justify-between">
                <Link href={`/item/${itemLink}`}>
                  <a>
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      {title}
                    </span>
                  </a>
                </Link>
                <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                  <span>
                    <Tippy
                      content={<span className="py-1 px-2 block">SOL</span>}
                    >
                      <img
                        className="h-6 w-4"
                        src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=023"
                      />
                    </Tippy>
                  </span>
                </span>
              </div>

              <div className="mt-8 flex items-center justify-between">
                {listedItems[itemLink] ? (
                  <div className="font-display text-sm ">
                    Listed for{" "}
                    <span className="font-bold">{listedItems[itemLink]}</span>
                  </div>
                ) : (
                  <div className="font-display text-sm ">Not listed</div>
                )}
                <Link href={`/item/${itemLink}`}>
                  <a className="group flex items-center">
                    <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                      <use xlinkHref="/icons.svg#icon-history"></use>
                    </svg>
                    <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                      View History
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default OwnedItem;
