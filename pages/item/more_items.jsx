import React from "react";
import { HeadLine } from "../../components/component";
import BidsCarousel from "../../components/carousel/bidsCarousel";
import Loader from "../../components/Loader";

const More_items = ({ nfts }) => {
  return (
    <section className="dark:bg-jacarta-800 bg-light-base py-24">
      {/* <!-- Hot Bids --> */}
      <div className="container">
        <HeadLine
          text="More from this collection"
          classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
        />

        <div className="relative">
          {/* <!-- Slider --> */}
          {nfts ? <BidsCarousel nfts={nfts} /> : <Loader />}
        </div>
      </div>
      {/* <!-- end hot bids --> */}
    </section>
  );
};

export default More_items;
