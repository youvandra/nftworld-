import { prisma } from "../../utils/prisma";

export default async function handler({ method, body }, res) {
  if (method !== "POST") return res.status(404).send("");
  const {
    name,
    bio,
    coverPhoto,
    email,
    instagramName,
    profilePhoto,
    twitterHandle,
    website,
    address,
  } = body;
  try {
    await prisma.user
      .update({
        where: { address },
        data: {
          name,
          bio,
          coverPhoto,
          email,
          instagramName,
          profilePhoto,
          twitterHandle,
          website,
        },
      })
      .then(() => {
        res.status(200).send();
      })
      .catch(() => {
        res.status(500).send();
      });
  } catch {
    res.status(500).send();
  }
}
