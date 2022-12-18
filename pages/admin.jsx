import { sol } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useAuctionHouse } from "../metaplex/useAuctionHouse";
import { useMetaplex } from "../metaplex/useMetaplex";
import { ADMIN_ADDRESSESS } from "../utils/consts";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export default function Admin() {
  const { publicKey } = useWallet();
  const { getAuctionHouse } = useAuctionHouse();
  const { metaplex } = useMetaplex();
  const [auctionHouse, setAuctionHouse] = useState();
  const [feeBalance, setFeeBalance] = useState();

  useEffect(() => {
    getAuctionHouse().then((ah) => {
      console.log(ah);
      setAuctionHouse(ah);
    });
  }, []);

  useEffect(() => {
    if (!auctionHouse) return;
    metaplex.connection.getBalance(auctionHouse.feeAccountAddress).then((b) => {
      setFeeBalance(b / LAMPORTS_PER_SOL);
    });
  }, [auctionHouse]);

  const router = useRouter();

  useEffect(() => {
    if (!publicKey) return;

    // if (!ADMIN_ADDRESSESS.includes(publicKey.toBase58())) router.push("/");
  }, [publicKey]);

  if (!publicKey)
    return (
      <div className="pt-[5.5rem] lg:pt-24 container">
        <Loader />
      </div>
    );

  if (!ADMIN_ADDRESSESS.includes(publicKey.toBase58()))
    return (
      <div className="pt-[5.5rem] lg:pt-24 container">
        <h1 className="mt-8 mb-12 text-center text-5xl font-bold text-jacarta-200">
          Access denied
        </h1>
        <button
          onClick={() => {
            metaplex.auctionHouse().create({ sellerFeeBasisPoints: 300 });
          }}
          className="bg-accent px-3 py-1 rounded-full mt-2"
        >
          create
        </button>
      </div>
    );
  if (!auctionHouse)
    return (
      <div className="pt-[5.5rem] lg:pt-24 container">
        <h1 className="mt-8 mb-12 text-center text-5xl font-bold">
          Admin section
        </h1>
      </div>
    );
  return (
    <div className="pt-[5.5rem] lg:pt-24 container">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">
        Admin section
      </h1>
      <pre>Auction house address: {auctionHouse.address.toBase58()}</pre>
      <pre>Fee account: {auctionHouse.feeAccountAddress.toBase58()}</pre>
      <pre>Fee account Balance: {feeBalance} SOL</pre>
      <pre>
        treasury Withdrawal account:{" "}
        {auctionHouse.treasuryWithdrawalDestinationAddress.toBase58()}
      </pre>

      <button
        onClick={() => {
          metaplex.system().transferSol({
            amount: sol(1),
            to: auctionHouse.feeAccountAddress,
          });
        }}
        className="bg-accent px-3 py-1 rounded-full mt-2"
      >
        Top up 1 SOL
      </button>
    </div>
  );
}
