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
    const filtredNFTs = rawNFTs.filter(
      ({ collection, collectionDetails }) => collection && !collectionDetails
    );
    const formatedNFTs = await returnNFTsWithMetadata(filtredNFTs);
    return formatedNFTs;
  }

  async function getNFTsByCreator(address) {
    const creator = new PublicKey(address);
    const rawNFTs = await metaplex.nfts().findAllByCreator({ creator });
    const filtredNFTs = rawNFTs.filter(
      ({ collection, collectionDetails }) => collection && !collectionDetails
    );
    const formatedNFTs = await returnNFTsWithMetadata(filtredNFTs);
    return formatedNFTs;
  }

  async function createNFT({ file, ...data }) {
    const { pinataURL: image } = await uploadFileToIPFS(file);

    const { pinataURL: uri } = await uploadJSONToIPFS({ ...data, image });

    return await metaplex.nfts().create({
      name: data.name,
      uri,
      sellerFeeBasisPoints: 3,
      collection: data.collection === "" ? undefined : data.collection,
    });
  }

  async function getCollectionsByOwner(address) {
    const owner = new PublicKey(address);
    const rawNFTs = await metaplex.nfts().findAllByOwner({ owner });
    const filtredNFTs = rawNFTs.filter(
      ({ collection, collectionDetails }) => collectionDetails
    );
    const formatedNFTs = await returnNFTsWithMetadata(filtredNFTs);
    return formatedNFTs;
  }

  return { getNFTsByOwner, getNFTsByCreator, createNFT, getCollectionsByOwner };
}
