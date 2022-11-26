import { PublicKey } from "@metaplex-foundation/js";
import { useMetaplex } from "./useMetaplex";

import { returnNFTsWithMetadata } from "../utils/returnNFTsWithMetadata";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
import { data } from "autoprefixer";

export function useNFTs() {
  const { metaplex } = useMetaplex();

  async function getNFTsByOwner(address) {
    const owner = new PublicKey(address);
    const rawNFTs = await metaplex.nfts().findAllByOwner({ owner });
    const formatedNFTs = await returnNFTsWithMetadata(rawNFTs);
    return formatedNFTs;
  }

  async function getNFTsByCreator(address) {
    const creator = new PublicKey(address);
    const rawNFTs = await metaplex.nfts().findAllByCreator({ creator });
    const formatedNFTs = await returnNFTsWithMetadata(rawNFTs);
    return formatedNFTs;
  }

  async function createNFT({ file, ...data }) {
    const { pinataURL: image } = await uploadFileToIPFS(file);

    const { pinataURL: uri } = await uploadJSONToIPFS({ ...data, image });

    return await metaplex
      .nfts()
      .create({
        name: data.name,
        uri,
        sellerFeeBasisPoints: 3,
        collection: data.collection === "" ? undefined : data.collection,
      });
  }

  return { getNFTsByOwner, getNFTsByCreator, createNFT };
}
