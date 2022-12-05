import { uploadFileToIPFS } from "../../metaplex/pinata";
import { prisma } from "../../utils/prisma";

export default async function handler({ body, method }, res) {
  if (method !== "POST") return res.status(404).send("");
  try {
    const {
      banner,
      category,
      description,
      image,
      title,
      address,
      creatorAddress,
      subImage1,
      subImage2,
      subImage3,
    } = body;

    const postTime = new Date(Date.now()).toDateString().substring(4);
    const collection = await prisma.collection.create({
      data: {
        address,
        banner,
        bigImage: image,
        category,
        description,
        image,
        title,
        creatorAddress,
        postTime,
        subImage1,
        subImage2,
        subImage3,
      },
    });
    return res.json(collection);
  } catch (e) {
    console.error(e);
    res.status(500).send("");
  }
}
