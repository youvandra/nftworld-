import React, { useEffect, useState } from "react";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { useForm } from "react-hook-form";
import axios from "axios";
import { sol } from "@metaplex-foundation/js";
import { toast } from "react-hot-toast";

const AuctionModal = ({ onClose, isOpen, nft }) => {
  const { makeOffer } = useAuctionHouse();
  const { handleSubmit, register } = useForm();
  const [collection, setCollection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState(3);
  const [hour, setHour] = useState(72);
  const [price, setPrice] = useState(0);

  const m = new Date();
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date =
    m.getUTCMonth() + 1 + "/" + m.getUTCDate() + "/" + m.getUTCFullYear();

  const week_day = weekday[m.getDay()];

  const time = m.getHours() + ":" + m.getMinutes();

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div>
      {" "}
      {/* <!-- Buy Now Modal --> */}
      <div className={isOpen ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="buyNowModalLabel">
                Auction
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => onClose()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>

            {/* <!-- Body --> */}
            <div className="modal-body p-6">
              <div className="mb-3">
                <p>Auction start date & time</p>
                <input type="date" className="c-item-auction-date" />
              </div>
              <div>
                <p>
                  Duration
                  {/* <div class="tw-cursor-help" data-tooltipped="" aria-describedby="tippy-tooltip-22" style="display: inline;"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" color="#8E8E8E" height="14" width="14" xmlns="http://www.w3.org/2000/svg" style="color: rgb(142, 142, 142);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div> */}{" "}
                </p>
                <input
                  className="c-item-auction mr-2"
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
                <span className="mr-6">Day(s)</span>
                <input
                  className="c-item-auction mr-2"
                  type="number"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                />
                <span>Hour(s)</span>
              </div>
              <div className="mb-5">
                <p>
                  <span className="c-item-auction-end-text-color">
                    The auction is due to end&nbsp;
                  </span>
                  {week_day}, {date}, {time}
                  <span className="c-item-auction-end-text-color">
                    &nbsp;(in your local time)
                  </span>
                </p>
              </div>
              <div className="mb-5">
                <p>Starting bid</p>
                <input
                  className="c-item-auction-bid-input mr-1"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.15"
                />
                <span className="mr-6">SOL</span>
              </div>
              <div className="mb-1">
                <p>Minimum bid increment: 0.05 SOL</p>
              </div>
              <div>
                <p className="c-item-auction-text-color">
                  You will be charged full creator royalty upon the item being
                  sold through auction
                </p>
              </div>
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4 w-full mb-2">
                <button
                  type="button"
                  className="bg-accent shadow-accent-volume disabled:bg-accent-lighter hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all w-full"
                >
                  List Now
                </button>
              </div>
              <div>
                <p>
                  <span className="c-item-auction-end-text-color">
                    By clicking "List Now", you agree to the&nbsp;
                  </span>
                  Magic Eden Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionModal;
