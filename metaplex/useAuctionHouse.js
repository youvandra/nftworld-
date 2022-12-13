import { PublicKey, sol } from "@metaplex-foundation/js";
import { useMetaplex } from "./useMetaplex";
import { AUCTION_HOUSE_ADDRESS } from "../utils/consts";
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

    const lazyListings = await metaplex
      .auctionHouse()
      .findListings({ auctionHouse, ...args });

    const liveListings = lazyListings.filter(({ canceledAt }) => !canceledAt);

    const loadedListings = await Promise.all(
      liveListings.map(
        async (lazyListing) =>
          await metaplex.auctionHouse().loadListing({ lazyListing })
      )
    );

    const formatedListings = await Promise.all(
      loadedListings.map(async (listing) => {
        const metadata = await returnNFTwithMetadata(listing.asset);
        return { ...listing, asset: { ...listing.asset, metadata } };
      })
    );

    return formatedListings;
  }

  async function getBids(
    args = { buyer: undefined, metadata: undefined, mint: undefined }
  ) {
    const auctionHouse = await getAuctionHouse();

    const lazyBids = await metaplex
      .auctionHouse()
      .findBids({ auctionHouse, ...args });
    const liveBids = lazyBids.filter(({ canceledAt }) => !canceledAt);

    const loadedBids = await Promise.all(
      liveBids.map(
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
  async function cancelListing(listing) {
    const auctionHouse = await getAuctionHouse();

    return await metaplex
      .auctionHouse()
      .cancelListing({ auctionHouse, listing });
  }

  async function list(address, price) {
    const mintAccount = new PublicKey(address);
    const auctionHouse = await getAuctionHouse();

    metaplex
      .auctionHouse()
      .list({ auctionHouse, mintAccount, price: sol(price) });
  }

  async function makeOffer(mintAccount, price) {
    const auctionHouse = await getAuctionHouse();
    await metaplex.auctionHouse().bid({ auctionHouse, mintAccount, price });
  }

  async function buyListing(listing) {
    const auctionHouse = await getAuctionHouse();
    return metaplex.auctionHouse().buy({ auctionHouse, listing });
  }

  async function acceptOffer(bid) {
    const programId = metaplex.programs().getToken().address;
    const { value: tokens } = await metaplex.connection.getTokenAccountsByOwner(
      metaplex.identity().publicKey,
      { mint: bid.asset.mint.address, programId }
    );

    const sellerToken = await metaplex
      .tokens()
      .findTokenByAddress({ address: tokens[0].pubkey });
    console.log({ sellerToken });
    const auctionHouse = await getAuctionHouse();

    return metaplex.auctionHouse().sell({ auctionHouse, bid, sellerToken });
  }

  return {
    getAuctionHouse,
    getListings,
    getBids,
    list,
    buyListing,
    makeOffer,
    acceptOffer,
    cancelBid,
    cancelListing,
  };
}
