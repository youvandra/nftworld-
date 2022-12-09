import { useAuctionHouse } from "./useAuctionHouse";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useSDK } from "@thirdweb-dev/react/solana";
import { useEffect, useState } from "react";

export const useStats = (address) => {
  const { getListings } = useAuctionHouse();
  const sdk = useSDK();
  const [collectionLisings, setCollectionLisings] = useState([]);
  const [floorPrice, setFloorPrice] = useState("N/A");
  const [owners, setOwners] = useState(0);
  const [volumeTraded, setVolumeTraded] = useState("N/A");

  const getCollectionListings = async () => {
    if (!address) return;
    //get all listings
    const listings = await getListings();

    //filter collection listings
    const cl = listings.filter(
      ({ asset }) => asset?.collection?.address?.toBase58() === address
    );

    setCollectionLisings(cl);
  };

  const getCollectionFloorPrice = async () => {
    if (!address) return;
    if (!collectionLisings || collectionLisings.length === 0) return "N/A";

    //filter Available listings
    const availableListings = collectionLisings.filter(
      ({ purchaseReceiptAddress }) => !purchaseReceiptAddress
    );

    if (availableListings.length === 0) return "N/A";

    const prices = availableListings.map(
      ({ price }) => price.basisPoints.toNumber() / LAMPORTS_PER_SOL
    );
    const price = Math.min(...prices);

    return price;
  };

  const getCollectionOwners = async () => {
    if (!address || !sdk) return;
    const program = await sdk.getNFTCollection(address);

    const nfts = await program.getAll();
    const owners = nfts.map(({ owner }) => owner);

    const uniqueOwners = new Set(owners);

    return uniqueOwners.size;
  };

  const getVolumeTraded = async () => {
    if (!collectionLisings || collectionLisings.length === 0 || !address)
      return "N/A";

    //filter completed purchases

    const purchases = collectionLisings.filter(
      ({ purchaseReceiptAddress }) => purchaseReceiptAddress
    );

    const vt = purchases.reduce(
      (a, { price }) => a + price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL,
      0
    );

    setVolumeTraded(vt);
  };

  useEffect(() => {
    getCollectionFloorPrice().then((fp) => {
      setFloorPrice(fp);
    });

    getVolumeTraded().then(() => {});
  }, [address, collectionLisings]);

  useEffect(() => {
    getCollectionOwners().then((o) => {
      setOwners(o);
    });
  }, [address, sdk]);

  useEffect(() => {
    getCollectionListings();
  }, [address]);

  return { floorPrice, owners, volumeTraded };
};
