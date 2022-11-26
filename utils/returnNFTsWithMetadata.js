import { returnNFTwithMetadata } from "./returnNFTWithMetadata";

export async function returnNFTWithMetadata(rawNFTs) {
  const formatedNFTs = await Promise.all(
    rawNFTs.map(async (rawNFT) => await returnNFTwithMetadata(rawNFT))
  );
  return formatedNFTs;
}
