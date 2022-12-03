import { useWallet } from "@solana/wallet-adapter-react";
import { useNFTs } from "../metaplex/useNFTs";
import { useEffect, useState } from "react";
import BidItem from "../components/categories/bidItem";
import { useAuctionHouse } from "../metaplex/useAuctionHouse";

export default function List() {
  const { publicKey } = useWallet();
  const { getNFTsByOwner } = useNFTs();
  const { getBids } = useAuctionHouse();

  const [nfts, setNfts] = useState([]);

  const getMyNFTs = async () => {
    const nfts = await getNFTsByOwner(publicKey.toBase58());
    const formatedNFTs = nfts.map((n) => n);
    setNfts(formatedNFTs);
  };

  useEffect(() => {
    if (publicKey) getMyNFTs();
    (async () => {
      const bids = await getBids();
      console.log(bids);
    })();
  }, [publicKey]);

  return (
    <div className="pt-[5.5rem] lg:pt-24 container">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">
        Bid your NFT
      </h1>

      <BidItem nfts={nfts} />
    </div>
  );
}
