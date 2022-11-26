import {
  Metaplex,
  walletAdapterIdentity,
  mockStorage,
} from "@metaplex-foundation/js";
import { MetaplexContext } from "./useMetaplex";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export default function MetaplexProvider({ children }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = useMemo(
    () =>
      connection && wallet
        ? Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(mockStorage())
        : null,
    [(connection, wallet)]
  );

  return (
    <MetaplexContext.Provider value={{ metaplex }}>
      {children}
    </MetaplexContext.Provider>
  );
}
