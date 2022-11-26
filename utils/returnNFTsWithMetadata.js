import { returnNFTwithMetadata } from "./returnNFTwithMetadata";

export async function returnNFTsWithMetadata(rawNFTs) {
  const formatedNFTs = await Promise.all(
    rawNFTs.map(async (rawNFT) => await returnNFTwithMetadata(rawNFT))
  );
  return formatedNFTs;
}
