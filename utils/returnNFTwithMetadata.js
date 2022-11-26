import axios from "axios";

export async function returnNFTwithMetadata(rawNFT) {
  const { data } = await axios.get(rawNFT.uri);
  return { ...rawNFT, metadata: data };
}
