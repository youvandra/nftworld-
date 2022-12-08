import { prisma } from "../../utils/prisma";

export default async function handler({ query }, res) {
  const { address } = query;
  prisma.collection
    .update({
      where: { address },
      data: { featureRequested: true },
    })
    .then(() => {
      res.status(200).send("");
    })
    .catch(() => {
      res.status(500).send("");
    });
}
