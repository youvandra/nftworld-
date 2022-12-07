import { prisma } from "../../utils/prisma";

export default async function handler({ query }, res) {
  const { search } = query;
  const collections = await prisma.collection.findMany({
    include: { creator: true },
    where: {
      OR: [
        { title: { contains: search } },
        { creator: { name: { contains: search } } },
      ],
    },
  });

  const users = await prisma.user.findMany({
    where: { name: { contains: search } },
    include: { collections: true },
  });
  res.status(200).json({ collections, users });
}
