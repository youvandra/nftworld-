import { prisma } from "../../utils/prisma";

export default async function handler({ query }, res) {
  const { address } = query;
  const user = await prisma.user.findFirst({ where: { address } });
  return res.json(user);
}
