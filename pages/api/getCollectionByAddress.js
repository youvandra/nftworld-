import { prisma } from "../../utils/prisma";

export default async function handler({ query }, res) {
  const { address } = query;
  const collection = await prisma.collection.findFirst({
    where: { address },
    include: { creator: true },
  });
  return res.json(collection);
}
