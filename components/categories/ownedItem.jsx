import React from "react";
import Link from "next/link";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
import Loader from "../Loader";

const OwnedItem = () => {
  const { sortedtrendingCategoryItemData } = useSelector(
    (state) => state.counter
  );
  if (sortedtrendingCategoryItemData === []) return <Loader />;
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
