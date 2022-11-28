import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "tippy.js/dist/tippy.css";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Feature_collections_data from "../../data/Feature_collections_data";
import Link from "next/link";
import axios from "axios";

const Feature_collections_carousel = () => {
  const [data, setData] = useState(Feature_collections_data);

  async function getCollections() {
    const collections = await axios.get("/api/getCollections");
    if (collections.data) {
      const formatedCollections = collections.data
        .filter(({ tending }) => tending)
        .map(
          ({
            title,

            address: id,
            creator: { name: userName, profilePhoto: userImage },
            itemsCount,
            bigImage,
            subImage1,
            subImage2,
            subImage3,
          }) => ({
            title,
            id,
            itemsCount,
            userName,
            bigImage,
            subImage1,
            subImage2,
            subImage3,
            userImage,
          })
        );
      setData(formatedCollections);
    }
  }

  useEffect(() => {
    getCollections();
  }, []);
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        breakpoints={{
          // when window width is >= 640px
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {data.map((item) => {
          const {
            id,
            bigImage,
            subImage1,
            subImage2,
            subImage3,
            userImage,
            title,
            itemsCount,
            userName,
          } = item;

          const itemLink = id;

          return (
            <SwiperSlide key={id}>
              <article>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                  <Link href={`/collection/${itemLink}`}>
                    <a className="flex space-x-[0.625rem]">
                      <figure className="w-[74.5%] h-full">
                        <img
                          src={bigImage}
                          alt="item 1"
                          className="rounded-[0.625rem] object-cover h-[240px] w-[150px]"
                        />
                      </figure>
                      <span className="flex w-1/3 flex-col space-y-[0.625rem]">
                        <img
                          src={subImage1}
                          alt="item 1"
                          className="h-full rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />

                        <img
                          src={subImage2}
                          alt="item 1"
                          className="h-full rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                        <img
                          src={subImage3}
                          alt="item 1"
                          className="h-full rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                      </span>
                    </a>
                  </Link>

                  <Link href={`/collection/${itemLink}`}>
                    <a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
                      {title}
                    </a>
                  </Link>

                  <div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
                    <div className="flex flex-wrap items-center">
                      <Link href={`/collection/${itemLink}`}>
                        <a className="mr-2 shrink-0">
                          <img
                            src={userImage}
                            alt="owner"
                            className="h-5 w-5 rounded-full"
                          />
                        </a>
                      </Link>
                      <span className="dark:text-jacarta-400 mr-1">by</span>
                      <Link href={`/collection/${itemLink}`}>
                        <a className="text-accent">
                          <span>{userName}</span>
                        </a>
                      </Link>
                    </div>
                    <span className="dark:text-jacarta-300 text-sm">
                      {itemsCount} Items
                    </span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* <!-- Slider Navigation --> */}
      <div className="group swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default Feature_collections_carousel;
