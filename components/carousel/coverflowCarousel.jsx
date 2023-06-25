import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, Ally } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { coverflow_data } from "../../data/coverflow_data";
import Link from "next/link";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import axios from "axios";

const CoverflowCarousel = () => {
  const [nfts, setNFTs] = useState(coverflow_data);
  const { getListings } = useAuctionHouse();

  async function getTopNFTs() {
    const purchases = (await getListings()).filter(
      ({ purchaseReceiptAddress }) => purchaseReceiptAddress
    );

    let nftCounts = {};

    // Loop through each purchase and count the number of times each NFT has been purchased
    for (let purchase of purchases) {
      let nftAddress = purchase.asset.address.toBase58();
      if (nftAddress in nftCounts) {
        nftCounts[nftAddress]++;
      } else {
        nftCounts[nftAddress] = 1;
      }
    }

    // Create an array to store the NFTs sorted by their number of purchases
    let sortedNFTs = [];

    // Loop through each NFT in the nftCounts object and add it to the sortedNFTs array
    for (let nftAddress in nftCounts) {
      sortedNFTs.push({
        address: nftAddress,
        count: nftCounts[nftAddress],
      });
    }

    // Sort the sortedNFTs array in descending order by the number of purchases
    sortedNFTs.sort((a, b) => b.count - a.count);

    const newArray = sortedNFTs.map(({ address }) => address);

    //top 10
    const top10 = purchases.filter(({ asset }) =>
      newArray.includes(asset.address.toBase58())
    );

    const formatedNFTs = await Promise.all(
      top10.map(async ({ asset, sellerAddress }) => {
        const { data: user } = await axios.get(
          `/api/getUserbyAddress?address=${sellerAddress?.toBase58()}`
        );

        return {
          img: asset.metadata.metadata.image,
          id: asset.address.toBase58(),
          authorImage: user.profilePhoto,
          authorName: user.name,
          title: asset.name,
          creatorAddress: sellerAddress.toBase58(),
        };
      })
    );

    // Return the top 10 best selling NFTs
    setNFTs(formatedNFTs);
  }

  // async function getFeaturedNFTs() {
  //   const { data } = await axios.get("/api/getFeaturedNFTs");

  //   if (data) {
  //     const formatedData = data.map(
  //       ({ address, creator: { name, profilePhoto }, ...nft }) => ({
  //         id: address,
  //         authorImage: profilePhoto,
  //         authorName: name,
  //         ...nft,
  //       })
  //     );
  //     setNFTs(formatedData);
  //   }
  // }

  useEffect(() => {
    // getFeaturedNFTs();
    getTopNFTs();
  }, []);

  return (
    <>
      {/* <!-- Coverflow Slider --> */}
      <div className="relative px-6 pb-16 sm:px-0">
        {/* <!-- Slider --> */}
        <Swiper
          breakpoints={{
            // when window width is >= 640px
            100: {
              // width: 640,
              slidesPerView: 1,
            },
            575: {
              // width: 640,
              slidesPerView: 3,
            },
            // when window width is >= 768px
            992: {
              // width: 768,
              slidesPerView: 5,
            },
          }}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={5}
          loop={true}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Navigation]}
          navigation={{
            nextEl: ".swiper-button-next-4",
            prevEl: ".swiper-button-prev-4",
          }}
          className="swiper coverflow-slider !py-5"
        >
          {nfts.map((item, key) => {
            const { img, id, authorImage, authorName, title, creatorAddress } =
              item;
            const itemLink = id;
            return (
              <SwiperSlide key={key}>
                <article>
                  <div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
                    <figure className="relative">
                      <Link href={"/item/" + itemLink}>
                        <a>
                          <img
                            src={img}
                            alt={title}
                            className="swiper-lazy h-[430px] w-full object-cover"
                            height={"430px"}
                            width={"379px"}
                          />
                        </a>
                      </Link>
                    </figure>
                    <div className="p-6">
                      <div className="flex">
                        <Link href="/user/avatar_6">
                          <a className="shrink-0">
                            <img
                              src={authorImage}
                              alt="avatar"
                              className="mr-4 h-10 w-10 rounded-full"
                            />
                          </a>
                        </Link>
                        <div>
                          <Link href={"/item/" + itemLink}>
                            <a className="block">
                              <span className="font-display text-lg leading-none text-jacarta-700 hover:text-accent dark:text-white">
                                {title}
                              </span>
                            </a>
                          </Link>
                          <Link href={`/user/${creatorAddress}`}>
                            <a className="text-2xs text-accent">{authorName}</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="swiper-button-prev-4 group absolute top-1/2 left-4 z-10 -mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl shadow-white-volume">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-jacarta-700 group-hover:fill-accent"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
          </svg>
        </div>
        <div className="swiper-button-next-4 group absolute top-1/2 right-4 z-10 -mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl shadow-white-volume">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-jacarta-700 group-hover:fill-accent"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </svg>
        </div>

        {/* <!-- end coverflow slider --> */}
      </div>
    </>
  );
};

export default CoverflowCarousel;
