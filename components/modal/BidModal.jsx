import React, { useEffect, useState } from "react";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import { useForm } from "react-hook-form";
import axios from "axios";
import { sol } from "@metaplex-foundation/js";
import { toast } from "react-hot-toast";

const BidModal = ({ onClose, isOpen, nft }) => {
  const { makeOffer } = useAuctionHouse();
  const { handleSubmit, register } = useForm();
  const [collection, setCollection] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function getCollection(address) {
    axios
      .get(`/api/getCollectionByAddress?address=${address}`)
      .then(({ data }) => {
        setCollection(data);
      });
  }

  useEffect(() => {
    if (nft) getCollection(nft.collection.address.toBase58());
  }, [nft]);

  async function onSubmit({ price }) {
    setIsLoading(true);
    toast
      .promise(
        makeOffer(nft.mint.address, sol(Number(price))),
        {
          error: "There was a problem placing your bid",
          loading: "Bidding..",
          success: "Successfully placed a bid",
        },
        { position: "bottom-right" }
      )
      .finally(() => {
        setIsLoading(false);
      })
      .then(() => {
        onClose();
      });
  }

  return (
    <div>
      {/* <!-- Buy Now Modal --> */}
      <div className={isOpen ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="buyNowModalLabel">
                Bid NFT
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
              <div className="dark:border-jacarta-600 border-jacarta-100 relative flex items-center border-t border-b py-4">
                <figure className="mr-5 self-start">
                  <img
                    src={nft.metadata.image ?? nft.metadata?.metadata?.image}
                    alt="avatar 2"
                    className="rounded-2lg max-h-96 max-w-xs"
                    loading="lazy"
                  />
                </figure>

                <div>
                  {collection && (
                    <a
                      href={`/item/${collection.address}`}
                      className="text-accent text-sm"
                    >
                      {collection.title}
                    </a>
                  )}
                  <h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">
                    {nft.name}
                  </h3>
                  <div className="flex flex-wrap items-center">
                    <span className="dark:text-jacarta-300 text-jacarta-500 mr-1 block text-sm">
                      Creator Earnings: {nft.sellerFeeBasisPoints / 100}%
                    </span>
                    <span data-tippy-content="The creator of this collection will receive 5% of the sale total from future sales of this item.">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="dark:fill-jacarta-300 fill-jacarta-700 h-4 w-4"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <input
                  {...register("price")}
                  type="number"
                  id="price"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Item price"
                  required
                />

                <button
                  disabled={isLoading || !nft}
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="bg-accent shadow-accent-volume disabled:bg-accent-lighter hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                >
                  {isLoading ? "Bidding..." : "Bid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
