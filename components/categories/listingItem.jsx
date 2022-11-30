import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Tippy from "@tippyjs/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";

export default function ListingItem({
  creatorAddress,
  listing,
  image,
  name,
  address,
}) {
  const {} = useAuctionHouse();
  const [creator, setCreator] = useState();

  async function getUser() {
    if (!creatorAddress) return;
    const { data } = await axios.get(
      `/api/getUserByAddress?address=${creatorAddress}`
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
  }, [creatorAddress]);

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
              <Link href={`/user/${creatorAddress ?? "#"}`}>
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
                className="w-full h-full object-cover rounded-[0.625rem]"
                loading="lazy"
              />
            </a>
          </Link>
        </figure>
        <div className="mt-7 flex items-center justify-between">
          <Link href={`/user/${creatorAddress}`}>
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
          <button className="text-accent font-display text-sm font-semibold">
            Buy
          </button>
        </div>
      </div>
    </article>
  );
}
