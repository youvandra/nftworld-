import { prisma } from "../../utils/prisma";

export default async function handler({ query }, res) {
  const { address } = query;
  try {
    await prisma.user
      .create({
        data: { address, name: "unnamed user" },
      })
      .finally(() => {
        res.status(200).send();
      });
  } catch {
    res.status(200).send();
  }
}
