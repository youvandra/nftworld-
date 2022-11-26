import { prisma } from "../../utils/prisma";

export default async function handler(_req, res) {
  const collection = await prisma.collection.findMany({
    include: { creator: true },
  });
  if (collection) return res.status(200).json(collection);

  return res.status(500);
}
