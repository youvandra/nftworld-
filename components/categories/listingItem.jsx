import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Tippy from "@tippyjs/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { useMetaplex } from "../../metaplex/useMetaplex";

export default function ListingItem({
  sellerAddress,
  listing,
  image,
  name,
  address,
}) {
  const [creator, setCreator] = useState();
  const { publicKey } = useWallet();

  async function getUser() {
    if (!sellerAddress) return;
    const { data } = await axios.get(
      `/api/getUserByAddress?address=${sellerAddress}`
    );
    if (data) {
      const formatedUser = {
        image: data.profilePhoto,
        name: data.name,
      };
      setCreator(formatedUser);
    }
  }

  useEffect(() => {
    getUser();
  }, [sellerAddress]);

  const { metaplex } = useMetaplex();
  const { getAuctionHouse } = useAuctionHouse();

  async function buy() {
    const auctionHouse = await getAuctionHouse();

    const l = await metaplex
      .auctionHouse()
      .loadListing({ lazyListing: listing });
    console.log(l);

    await metaplex.auctionHouse().buy({ auctionHouse, listing: l });
  }

  async function cancel() {
    const auctionHouse = await getAuctionHouse();

    const l = await metaplex
      .auctionHouse()
      .loadListing({ lazyListing: listing });
    console.log(l);

    await metaplex.auctionHouse().cancelListing({ auctionHouse, listing: l });
  }

  return (
    <article>
      <div className="dark:bg-jacarta-700 h-full dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
        <div className="mb-4 flex items-center  justify-between relative">
          <div className="flex -space-x-2 ">
            <Tippy
              theme="tomato"
              content={
                <span className="py-1 px-2 block">
                  Creator: {creator?.name ?? "Sussygirl"}
                </span>
              }
            >
              <Link href={`/user/${sellerAddress ?? "#"}`}>
                <a>
                  <img
                    src={creator?.image ?? ""}
                    alt="creator"
                    className="h-6 w-6 rounded-full"
                    height={24}
                    width={24}
                  />
                </a>
              </Link>
            </Tippy>
          </div>
        </div>
        <figure className="relative">
          <Link href={`/item/${address}`}>
            <a>
              <img
                src={image}
                alt="item 8"
                className="w-full h-full object-cover aspect-[4/3] rounded-[0.625rem]"
                loading="lazy"
              />
            </a>
          </Link>
        </figure>
        <div className="mt-7 flex items-center justify-between">
          <Link href={`/item/${address}`}>
            <a>
              <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                {name}
              </span>
            </a>
          </Link>
          <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
            <span>
              <Tippy content={<span className="py-1 px-2 block">SOL</span>}>
                <img
                  className="h-6 w-4"
                  src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=023"
                />
              </Tippy>
            </span>
          </span>
        </div>
        <div className="mt-2 text-sm">
          <span className="dark:text-jacarta-300">Price</span>
          <span className="dark:text-jacarta-100 text-jacarta-700">
            {" " +
              listing?.price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL +
              " SOL"}
          </span>
        </div>

        <div className="mt-8 flex items-center justify-between">
          {address === publicKey?.toBase58() ? (
            <button
              onClick={() => {
                cancel();
              }}
              className="text-accent font-display text-sm font-semibold"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => {
                buy();
              }}
              className="text-accent font-display text-sm font-semibold"
            >
              Buy
            </button>
          )}
          <Link href={`/item/${address}`}>
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
}
