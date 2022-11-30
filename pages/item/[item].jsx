import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Auctions_dropdown from "../../components/dropdown/Auctions_dropdown";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ItemsTabs } from "../../components/component";
import More_items from "./more_items";
import Likes from "../../components/likes";
import { useDispatch } from "react-redux";
import { bidsModalShow } from "../../redux/counterSlice";
import { useMetaplex } from "../../metaplex/useMetaplex";
import { PublicKey } from "@metaplex-foundation/js";
import { returnNFTwithMetadata } from "../../utils/returnNFTwithMetadata";
import { useAuctionHouse } from "../../metaplex/useAuctionHouse";
import axios from "axios";
import { useProgram, useNFTs } from "@thirdweb-dev/react/solana";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const Item = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const address = router.query.item;
  const { metaplex } = useMetaplex();
  const { getAuctionHouse } = useAuctionHouse();
  const [creator, setCreator] = useState();
  const [imageModal, setImageModal] = useState(false);
  const [nft, setNFT] = useState(null);
  const [nftListing, setNFTListing] = useState();

  async function getNFT() {
    const rawNFT = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(address) });
    const _nft = await returnNFTwithMetadata(rawNFT);
    setNFT(_nft);
  }

  async function getListing() {
    const auctionHouse = await getAuctionHouse();
    const listing = await metaplex
      .auctionHouse()
      .findListings({ auctionHouse, metadata: nft.metadataAddress });
    if (!listing && listing.length === 0) return;
    const prices = listing.map(
      ({ price }) => price.basisPoints.toNumber() / LAMPORTS_PER_SOL
    );
    const price = Math.max(...prices);
    const index = prices.indexOf(price);
    setNFTListing(listing[index]);
  }

  async function getCreator() {
    axios
      .get(
        `/api/getUserByAddress?address=${nft?.creators[0]?.address?.toBase58()}`
      )
      .then(({ data }) => {
        setCreator(data);
      });
  }

  useEffect(() => {
    if (!nft) return;
    getListing();
    getCreator();
  }, [nft]);

  useEffect(() => {
    if (!address) return;
    getNFT();
  }, [address]);

  const [collection, setCollection] = useState();
  const [collectionNFTs, setCollectionNFTs] = useState();

  const { program } = useProgram(collection?.address);
  const { data: metadata } = useNFTs(program);

  useEffect(() => {
    if (!metadata) return;
    setCollectionNFTs(metadata);
  }, [metadata]);

  async function getCollection(address) {
    axios
      .get(`/api/getCollectionByAddress?address=${address}`)
      .then(({ data }) => {
        setCollection(data);
      });
  }

  useEffect(() => {
    if (nft && nft.collection) getCollection(nft.collection.address.toBase58());
  }, [nft]);

  return (
    <>
      {/*  <!-- Item --> */}
      <section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full"
          />
        </picture>
        <div className="container">
          {/* <!-- Item --> */}

          {nft && (
            <div className="md:flex md:flex-wrap">
              {/* <!-- Image --> */}
              <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
                <button className=" w-full" onClick={() => setImageModal(true)}>
                  <img
                    src={nft.metadata.image}
                    alt={nft.name}
                    className="rounded-2xl cursor-pointer  w-full"
                  />
                </button>

                {/* <!-- Modal --> */}
                <div
                  className={
                    imageModal ? "modal fade show block" : "modal fade"
                  }
                >
                  <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
                    <img
                      src={nft.metadata.image}
                      alt={nft.name}
                      className="h-full rounded-2xl"
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-close absolute top-6 right-6"
                    onClick={() => setImageModal(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="h-6 w-6 fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                    </svg>
                  </button>
                </div>
                {/* <!-- end modal --> */}
              </figure>

              {/* <!-- Details --> */}
              <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
                {/* <!-- Collection / Likes / Actions --> */}
                <div className="mb-3 flex">
                  {/* <!-- Collection --> */}
                  <div className="flex items-center">
                    <Link href={`/collection/${collection?.address}`}>
                      <a className="text-accent mr-2 text-sm font-bold">
                        {collection?.title}
                      </a>
                    </Link>
                    <span
                      className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                      data-tippy-content="Verified Collection"
                    >
                      <Tippy content={<span>Verified Collection</span>}>
                        <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                          <use xlinkHref="/icons.svg#icon-right-sign"></use>
                        </svg>
                      </Tippy>
                    </span>
                  </div>

                  {/* <!-- Likes / Actions --> */}
                  <div className="ml-auto flex items-stretch space-x-2 relative">
                    <Likes
                      like={86}
                      classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-2 px-4"
                    />

                    {/* <!-- Actions --> */}
                    <Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white" />
                  </div>
                </div>

                <h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
                  {nft.name}
                </h1>

                <p className="dark:text-jacarta-300 mb-10">
                  {nft.metadata.description}
                </p>

                {/* <!-- Creator / Owner --> */}
                <div className="mb-8 flex flex-wrap">
                  <div className="mr-8 mb-4 flex">
                    <figure className="mr-4 shrink-0">
                      <Link href={`/user/${creator?.address}`}>
                        <a className="relative block">
                          <img
                            src={creator?.profilePhoto}
                            alt={"creator"}
                            className="rounded-2lg h-12 w-12"
                            loading="lazy"
                          />
                          <div
                            className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                            data-tippy-content="Verified Collection"
                          >
                            <Tippy content={<span>Verified Collection</span>}>
                              <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                                <use xlinkHref="/icons.svg#icon-right-sign"></use>
                              </svg>
                            </Tippy>
                          </div>
                        </a>
                      </Link>
                    </figure>
                    <div className="flex flex-col justify-center">
                      <span className="text-jacarta-400 block text-sm dark:text-white">
                        {creator?.name + " "}
                        <strong>
                          {nft.sellerFeeBasisPoints / 100}% royalties
                        </strong>
                      </span>
                      <Link href={`/user/${creator?.address}`}>
                        <a className="text-accent block">
                          <span className="text-sm font-bold">creator</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* <!-- Bid --> */}
                {
                  <button
                    disabled={!nftListing}
                    className="bg-accent disabled:bg-accent-lighter shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                    onClick={() => dispatch(bidsModalShow())}
                  >
                    {nftListing
                      ? "Purchase for " +
                        nftListing.price.basisPoints.toNumber() /
                          LAMPORTS_PER_SOL +
                        " SOL"
                      : "Not purchasable"}
                  </button>
                }
                {/* <!-- end bid --> */}
              </div>
              {/* <!-- end details --> */}
            </div>
          )}

          <ItemsTabs nft={nft} />
        </div>
      </section>
      {/* <!-- end item --> */}

      <More_items nfts={collectionNFTs} />
    </>
  );
};

export default Item;
