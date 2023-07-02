import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { createContext, useContext } from "react";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { THIRDWEB_DESIRED_NODE } from "../utils/consts";

const connection = new Connection(clusterApiUrl(THIRDWEB_DESIRED_NODE));
const wallet = Keypair.generate();
const DEFAULT_CONTEXT = {
  metaplex: Metaplex.make(connection).use(keypairIdentity(wallet)),
};

export const MetaplexContext = createContext(DEFAULT_CONTEXT);

export function useMetaplex() {
  return useContext(MetaplexContext);
}
