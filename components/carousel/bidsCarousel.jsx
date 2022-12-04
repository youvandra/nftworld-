import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "tippy.js/dist/tippy.css";
import { bidsData } from "../../data/bids_data";
import Link from "next/link";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const BidsCarousel = ({ nfts }) => {
  const data = useMemo(() => {
    if (!nfts) return bidsData;
    const formatedNFTs = nfts.map(
      ({ metadata: { id, image, name: title } }) => ({ id, title, image })
    );
    return formatedNFTs;
  }, [nfts]);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView="auto"
        loop={true}
        breakpoints={{
          240: {
            slidesPerView: 1,
          },
          565: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: ".bids-swiper-button-next",
          prevEl: ".bids-swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {data.map &&
          data.map((item, i) => {
            const { id, image, title } = item;
            const itemLink = id;
            return (
              <SwiperSlide className="text-white" key={i}>
                <article>
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                    <figure>
                      {/* {`item/${itemLink}`} */}
                      <Link href={"/item/" + itemLink}>
                        <a>
                          <div className="w-full">
                            <img
                              src={image}
                              alt={title}
                              className="object-cover h-[230px] w-[230px] rounded-[0.625rem] "
                              loading="lazy"
                            />
                          </div>
                        </a>
                      </Link>
                    </figure>
                    <div className="mt-4 flex items-center justify-between">
                      <Link href={"/item/" + itemLink}>
                        <a>
                          <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                            {title}
                          </span>
                        </a>
                      </Link>
                      <Link href={"/item/" + itemLink}>
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
              </SwiperSlide>
            );
          })}
      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default BidsCarousel;
