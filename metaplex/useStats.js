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

  const getCollectionFloorPrice = async (
    a = address,
    listings = collectionLisings
  ) => {
    if (!a) return;
    if (!listings || listings.length === 0) return "N/A";

    //filter Available listings
    const availableListings = listings.filter(
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

  const getVolumeTraded = async (a = address, listings = collectionLisings) => {
    if (!listings || listings.length === 0 || !a) return "N/A";

    //filter completed purchases

    const purchases = listings.filter(
      ({ purchaseReceiptAddress }) => purchaseReceiptAddress
    );

    return purchases.reduce(
      (a, { price }) => a + price?.basisPoints?.toNumber() / LAMPORTS_PER_SOL,
      0
    );
  };

  useEffect(() => {
    getCollectionFloorPrice().then((fp) => {
      setFloorPrice(fp);
    });

    getVolumeTraded().then((vt) => {
      setVolumeTraded(vt);
    });
  }, [address, collectionLisings]);

  useEffect(() => {
    getCollectionOwners().then((o) => {
      setOwners(o);
    });
  }, [address, sdk]);

  useEffect(() => {
    getCollectionListings();
  }, [address]);

  async function getAllCollectionsStats() {
    const l = await getListings();

    const listingsByCollection = l
      .filter(({ asset }) => asset.collection)
      .reduce((acc, nft) => {
        // If the current address doesn't exist in the accumulator, create a new key-value pair
        if (!acc[nft.asset.collection.address]) {
          acc[nft.asset.collection.address] = [nft];
        } else {
          // If the current address does exist in the accumulator, add the current NFT object to the array of NFTs for that address
          acc[nft.asset.collection.address].push(nft);
        }

        // Return the accumulator
        return acc;
      }, {});

    const vt = {};
    for (const col in listingsByCollection) {
      vt[col] = await getVolumeTraded(true, listingsByCollection[col]);
    }
    const fp = {};
    for (const col in listingsByCollection) {
      fp[col] = await getCollectionFloorPrice(true, listingsByCollection[col]);
    }
    return { fp, vt };
  }

  return {
    floorPrice,
    owners,
    volumeTraded,
    collectionLisings,
    getVolumeTraded,
    getCollectionFloorPrice,
    getAllCollectionsStats,
  };
};
