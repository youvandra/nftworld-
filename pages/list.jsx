import { useWallet } from "@solana/wallet-adapter-react";
import { useNFTs } from "../metaplex/useNFTs";
import UserItem from "../components/categories/userItems";
import { useEffect, useState } from "react";

export default function List() {
  const { publicKey } = useWallet();
  const { getNFTsByOwner } = useNFTs();

  const [nfts, setNfts] = useState([]);

  const getMyNFTs = async () => {
    const nfts = await getNFTsByOwner(publicKey.toBase58());
    const formatedNFTs = nfts.map((n) => n);
    setNfts(formatedNFTs);
    console.log(formatedNFTs);
  };

  useEffect(() => {
    if (publicKey) getMyNFTs();
  }, [publicKey]);

  return (
    <div className="pt-[5.5rem] lg:pt-24 container">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">
        List your NFT
      </h1>
      <UserItem nfts={nfts} />
    </div>
  );
}
