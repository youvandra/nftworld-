import { prisma } from "../../utils/prisma";

export default async function handler({ query }, res) {
  const { creatorAddress } = query;
  const collection = await prisma.collection.findMany({
    where: { creatorAddress },
    select: { address: true, image: true, title: true },
  });
  if (collection) return res.status(200).json(collection);

  return res.status(500);
}
