import { PublicKey, sol } from "@metaplex-foundation/js";
import { useMetaplex } from "./useMetaplex";
import { AUCTION_HOUSE_ADDRESS } from "../utils/consts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { returnNFTwithMetadata } from "../utils/returnNFTwithMetadata";

export function useAuctionHouse() {
  const { metaplex } = useMetaplex();

  async function getAuctionHouse() {
    return await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey(AUCTION_HOUSE_ADDRESS) });
  }

  async function getListings(
    args = { seller: undefined, metadata: undefined, mint: undefined }
  ) {
    const auctionHouse = await getAuctionHouse();
    const rawListings = await metaplex
      .auctionHouse()
      .findListings({ auctionHouse, ...args });

    const listing = await Promise.all(
      rawListings.map(async ({ metadataAddress, ...l }) => {
        const rawNFTS = await metaplex
          .nfts()
          .findByMetadata({ metadata: metadataAddress });
        const nfts = await returnNFTwithMetadata(rawNFTS);
        return { ...nfts, listing: l };
      })
    );

    // console.log(listing);
    return listing;
  }

  async function getBids(
    args = { seller: undefined, metadata: undefined, mint: undefined }
  ) {
    const auctionHouse = await getAuctionHouse();

    const lazyBids = await metaplex
      .auctionHouse()
      .findBids({ auctionHouse, ...args });

    const loadedBids = await Promise.all(
      lazyBids.map(
        async (lazyBid) => await metaplex.auctionHouse().loadBid({ lazyBid })
      )
    );

    const formatedBids = await Promise.all(
      loadedBids.map(async (bid) => {
        const metadata = await returnNFTwithMetadata(bid.asset);
        return { ...bid, asset: { ...bid.asset, metadata } };
      })
    );

    return formatedBids;
  }

  async function cancelBid(bid) {
    const auctionHouse = await getAuctionHouse();

    return await metaplex.auctionHouse().cancelBid({ auctionHouse, bid });
  }

  async function sellBid(bid) {
    const auctionHouse = await getAuctionHouse();

    metaplex.auctionHouse().sell({ auctionHouse, bid });
  }

  async function list(address, price) {
    const mintAccount = new PublicKey(address);
    const auctionHouse = await getAuctionHouse();

    metaplex
      .auctionHouse()
      .list({ auctionHouse, mintAccount, price: sol(price) });
  }

  return { getAuctionHouse, getListings, getBids, sellBid, cancelBid, list };
}
