import { prisma } from "../../utils/prisma";

export default async function handler(_req, res) {
  const nfts = await prisma.featuredNFT.findMany({
    include: { creator: true },
  });
  if (nfts) return res.status(200).json(nfts);

  return res.status(500);
}
