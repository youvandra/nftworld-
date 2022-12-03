import React, { useEffect, useState } from "react";
import HeadLine from "../headLine";
import Auctions_category_data from "../../data/auctions_category_data";
import Tippy from "@tippyjs/react";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import Link from "next/link";
import { bidsModalShow } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";
import "tippy.js/themes/light.css";
import Image from "next/image";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import axios from "axios";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const Auctions_categories = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(Auctions_category_data.slice(0, 4));
  const [shortData, setShortData] = useState(
    Auctions_category_data.slice(0, 4)
  );
  const [loadMoreBtn, setLoadMoreBtn] = useState(true);
  const { getListings } = useAuctionHouse();

  const handleloadMore = () => {
    setShortData(data);
    setLoadMoreBtn(false);
  };

  const getNFTListings = async () => {
    getListings().then(async (listings) => {
      const formatedLisings = await Promise.all(
        listings.map(
          async ({
            address,
            metadata: { image: bigImage },
            name: title,
            listing: { price },
            creators,
          }) => {
            const { data: user } = await axios.get(
              `/api/getUserByAddress?address=${creators[0].address.toBase58()}`
            );
            return {
              id: address?.toBase58(),
              bigImage,
              title,
              price,
              creatorName: user?.name ?? "unkown user",
              creatorImage: user?.profilePhoto,
              creatorAddress: user?.address,
            };
          }
        )
      );
      setData(formatedLisings);
      setShortData(formatedLisings.slice(0, 4));
    });
  };

  useEffect(() => {
    getNFTListings();
  }, []);

  return (
    <div>
      <section className="py-24">
        <div className="container">
          <HeadLine
            image="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/2764-fe0f.png"
            text="Live Listings"
            classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
          />
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
            {shortData.map((item, i) => {
              const {
                id,
                bigImage,
                title,
                price,
                creatorName,
                creatorImage,
                creatorAddress,
              } = item;
              const itemLink = `/item/${id}`;
              return (
                <article key={i}>
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                    <div className="mb-4 flex items-center justify-between relative">
                      <div className="flex -space-x-2 ">
                        <Tippy
                          theme="tomato"
                          content={
                            <span className="py-1 px-2 block">
                              Creator: {creatorName ?? "Sussygirl"}
                            </span>
                          }
                        >
                          <Link href={`/user/${creatorAddress ?? "#"}`}>
                            <a>
                              <img
                                src={
                                  creatorImage ?? "/images/user/user_avatar.gif"
                                }
                                alt="creator"
                                className="h-6 w-6 rounded-full"
                                height={24}
                                width={24}
                              />
                            </a>
                          </Link>
                        </Tippy>
                      </div>

                      {/* auction dropdown */}
                      <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropdown hover:bg-jacarta-100 rounded-full " />
                    </div>
                    <figure className="relative">
                      <Link href={itemLink}>
                        <a>
                          <Image
                            src={bigImage}
                            alt="item 8"
                            className="w-full rounded-[0.625rem]"
                            loading="lazy"
                            height="100%"
                            width="100%"
                            layout="responsive"
                            objectFit="cover"
                          />
                        </a>
                      </Link>
                    </figure>
                    <div className="mt-7 flex items-center justify-between">
                      <Link href={itemLink}>
                        <a>
                          <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                            {title}
                          </span>
                        </a>
                      </Link>
                      <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                        <span>
                          <Tippy
                            content={
                              <span className="py-1 px-2 block">SOL</span>
                            }
                          >
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
                          (price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL ??
                            1) +
                          " SOL"}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        className="text-accent font-display text-sm font-semibold"
                        onClick={() => dispatch(bidsModalShow())}
                      >
                        Buy
                      </button>
                      <Link href={itemLink}>
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

          {loadMoreBtn && (
            <div className="mt-10 text-center">
              <button
                onClick={handleloadMore}
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Auctions_categories;
