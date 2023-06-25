import React, { useEffect, useState } from "react";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const BidItem = ({ bids, getMyBids }) => {
  const { publicKey } = useWallet();
  const [creator, setCreator] = useState();
  const { cancelBid } = useAuctionHouse();

  const getCreator = async () => {
    const { data } = await axios.get(
      `/api/getUserbyAddress?address=${publicKey.toBase58()}`
    );
    if (!data) return;
    setCreator(data);
  };

  useEffect(() => {
    if (!publicKey) return;
    getCreator();
  }, publicKey);

  return (
    <>
      <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
        {bids.map((bid, i) => {
          const {
            metadata: {
              name,
              metadata: { image },
            },
            address,
          } = bid.asset;
          const itemLink = address.toBase58();
          return (
            <article key={i}>
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

                  <div className="absolute left-3 -bottom-3">
                    <div className="flex -space-x-2">
                      <Link href={`/user/${creator?.address}`}>
                        <a>
                          <Tippy
                            content={<span>creator: {creator?.name}</span>}
                          >
                            <img
                              src={creator?.profilePhoto}
                              alt="creator"
                              className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                            />
                          </Tippy>
                        </a>
                      </Link>
                    </div>
                  </div>
                </figure>
                <div className="mt-7 flex items-center justify-between">
                  <Link href={`/item/${itemLink}`}>
                    <a>
                      <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                        {name}
                      </span>
                    </a>
                  </Link>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => {
                      toast
                        .promise(
                          cancelBid(bid),
                          {
                            error: "There was a problem canceling your bid",
                            loading: "Canceling your bid..",
                            success: "Your bid was canceled successfully",
                          },
                          { position: "bottom-right" }
                        )
                        .then(() => {
                          getMyBids();
                        });
                    }}
                  >
                    Cancel bid
                  </button>
                  <span className="font-display  flex gap-1 text-jacarta-700 text-sm hover:text-accent  dark:text-white">
                    Bid for{" "}
                    {bid.price.basisPoints.toNumber() / LAMPORTS_PER_SOL}
                    {""}
                    <div className=" h-4 w-4">
                      <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=023" />
                    </div>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default BidItem;
