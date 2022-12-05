import { useSDK } from "@thirdweb-dev/react/solana";
import axios from "axios";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import Meta from "../components/Meta";
import { useWallet } from "@solana/wallet-adapter-react";
import CategoryDropdown from "../components/dropdown/categoryDropdown";
import { uploadFileToIPFS } from "../metaplex/pinata";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";

export default function CreateCollection() {
  const sdk = useSDK();
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const fileTypes = ["JPG", "PNG", "GIF", "AVIF", "WEBP"];

  const router = useRouter();

  async function createNFTCollection({
    name,
    description,
    image,
    banner,
    category,
    sellerFeeBasisPoints,
    subImage1,
    subImage2,
    subImage3,
  }) {
    if (!publicKey) return;
    setIsLoading(true);
    toast("Adding your collection...", {
      position: "bottom-right",
      className: "bg-jacarta-600 text-jacarta-200",
    });
    const collectionAddress = await sdk.deployer.createNftCollection({
      name,
      description,
      image,
    });

    (await sdk.getNFTCollection(collectionAddress))
      .updateRoyalty(Number(sellerFeeBasisPoints) * 100)
      .then(async () => {
        const { pinataURL: imageFile } = await uploadFileToIPFS(image);
        const { pinataURL: bannerFile } = await uploadFileToIPFS(banner);
        const { pinataURL: sub1 } = await uploadFileToIPFS(subImage1);
        const { pinataURL: sub2 } = await uploadFileToIPFS(subImage2);
        const { pinataURL: sub3 } = await uploadFileToIPFS(subImage3);
        const data = {
          creatorAddress: publicKey.toBase58(),
          address: collectionAddress,
          title: name,
          description,
          banner: bannerFile,
          image: imageFile,
          category,
          subImage1: sub1,
          subImage2: sub2,
          subImage3: sub3,
        };
        console.log(data);
        axios
          .post("/api/addCollection", data)
          .then(() => {
            toast.success("Collection added successfully", {
              position: "bottom-right",
              className: "bg-jacarta-600 text-jacarta-200",
            });
            router.push(`/collection/${collectionAddress}`);
          })
          .finally(() => {
            setIsLoading(false);
          })
          .catch(() => {
            toast.error("There was a probelm adding your collection", {
              position: "bottom-right",
              className: "bg-jacarta-600 text-jacarta-200",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("There was a probelm adding your collection", {
          position: "bottom-right",
          className: "bg-jacarta-600 text-jacarta-200",
        });
      });
  }
  const { handleSubmit, register, setValue } = useForm();

  const [file, setFile] = useState(null);
  const [banner, setBanner] = useState(null);
  const [subImage1, setSubImage1] = useState(null);
  const [subImage2, setSubImage2] = useState(null);
  const [subImage3, setSubImage3] = useState(null);

  const handleSubImage1 = (file) => {
    setSubImage1(file);
    setValue("subImage1", file);
  };
  const handleSubImage2 = (file) => {
    setSubImage2(file);
    setValue("subImage2", file);
  };
  const handleSubImage3 = (file) => {
    setSubImage3(file);
    setValue("subImage3", file);
  };

  const handleImage = (file) => {
    setFile(file);
    setValue("image", file);
  };

  const handleBanner = (file) => {
    setBanner(file);
    setValue("banner", file);
  };

  const categoryData = [
    { id: "art", text: "art" },
    { id: "Collectibles", text: "Collectibles" },
    { id: "domain", text: "domain" },
    { id: "music", text: "music" },
    { id: "photography", text: "photography" },
  ];

  const handleCategory = (cat) => {
    setValue("category", cat);
  };

  return (
    <>
      <Toaster />
      <div>
        <Meta title="NFT World - Add Collection" />
        {/* <!-- Create --> */}
        <section className="relative py-24">
          <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
            <img
              src="/images/gradient_light.jpg"
              alt="gradient"
              className="h-full w-full"
            />
          </picture>
          <form
            onSubmit={handleSubmit(createNFTCollection)}
            className="container"
          >
            <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
              Add collection
            </h1>

            <div className="mx-auto max-w-[48.125rem]">
              {/* <!-- File Upload --> */}
              <div className="mb-6">
                <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Image
                  <span className="text-red">*</span>
                </label>

                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  Drag or choose your file to upload
                </p>

                <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                  <div className="relative z-10 cursor-pointer">
                    {!file ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                        </svg>
                        <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                          JPG, PNG, GIF,AVIF, WEBP, SVG, MP4, WEBM, MP3, WAV,
                          OGG, GLB, GLTF. Max size: 100 MB
                        </p>
                      </>
                    ) : (
                      <img src={URL.createObjectURL(file)} />
                    )}
                  </div>
                  <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                    <FileUploader
                      handleChange={handleImage}
                      name="file"
                      types={fileTypes}
                      classes="file-drag"
                      maxSize={2}
                      minSize={0}
                    />
                  </div>
                </div>
              </div>

              {/* <!-- Banner --> */}
              <div className="mb-6">
                <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Banner
                  <span className="text-red">*</span>
                </label>

                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  Drag or choose your file to upload
                </p>

                <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                  <div className="relative z-10 cursor-pointer">
                    {!banner ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                        </svg>
                        <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                          JPG, PNG, GIF,AVIF, WEBP, SVG, MP4, WEBM, MP3, WAV,
                          OGG, GLB, GLTF. Max size: 100 MB
                        </p>
                      </>
                    ) : (
                      <img src={URL.createObjectURL(banner)} />
                    )}
                  </div>
                  <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                    <FileUploader
                      handleChange={handleBanner}
                      name="file"
                      types={fileTypes}
                      classes="file-drag"
                      maxSize={2}
                      minSize={0}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Sub images
                  <span className="text-red">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                    <div className="relative z-10 cursor-pointer">
                      {!subImage1 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                          </svg>
                          <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                            JPG, PNG, GIF,AVIF, WEBP, SVG, MP4, WEBM, MP3, WAV,
                            OGG, GLB, GLTF. Max size: 100 MB
                          </p>
                        </>
                      ) : (
                        <img src={URL.createObjectURL(subImage1)} />
                      )}
                    </div>
                    <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                      <FileUploader
                        handleChange={handleSubImage1}
                        name="file"
                        types={fileTypes}
                        classes="file-drag"
                        maxSize={2}
                        minSize={0}
                      />
                    </div>
                  </div>{" "}
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                    <div className="relative z-10 cursor-pointer">
                      {!subImage2 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                          </svg>
                          <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                            JPG, PNG, GIF,AVIF, WEBP, SVG, MP4, WEBM, MP3, WAV,
                            OGG, GLB, GLTF. Max size: 100 MB
                          </p>
                        </>
                      ) : (
                        <img src={URL.createObjectURL(subImage2)} />
                      )}
                    </div>
                    <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                      <FileUploader
                        handleChange={handleSubImage2}
                        name="file"
                        types={fileTypes}
                        classes="file-drag"
                        maxSize={2}
                        minSize={0}
                      />
                    </div>
                  </div>{" "}
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                    <div className="relative z-10 cursor-pointer">
                      {!subImage3 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                          </svg>
                          <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                            JPG, PNG, GIF,AVIF, WEBP, SVG, MP4, WEBM, MP3, WAV,
                            OGG, GLB, GLTF. Max size: 100 MB
                          </p>
                        </>
                      ) : (
                        <img src={URL.createObjectURL(subImage3)} />
                      )}
                    </div>
                    <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                      <FileUploader
                        handleChange={handleSubImage3}
                        name="file"
                        types={fileTypes}
                        classes="file-drag"
                        maxSize={2}
                        minSize={0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Name --> */}
              <div className="mb-6">
                <label
                  htmlFor="item-name"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Name<span className="text-red">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="item-name"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Item name"
                  required
                />
              </div>

              {/* <!-- Description --> */}
              <div className="mb-6">
                <label
                  htmlFor="item-description"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Description
                </label>
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  The description will be included on the {"item's"} detail page
                  underneath its image. Markdown syntax is supported.
                </p>
                <textarea
                  {...register("description")}
                  id="item-description"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  rows="4"
                  required
                  placeholder="Provide a detailed description of your item."
                ></textarea>
              </div>

              {/* category  */}

              <div className="relative">
                <div>
                  <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                    Category
                  </label>
                </div>

                {/* dropdown */}
                <div className="dropdown my-1 cursor-pointer">
                  <CategoryDropdown
                    data={categoryData}
                    collection={true}
                    handleChange={handleCategory}
                  />
                </div>
              </div>
              {/* fee  */}
              <div className="my-6">
                <label
                  htmlFor="item-fee"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Royalty fee<span className="text-red">*</span>
                </label>
                <input
                  {...register("sellerFeeBasisPoints")}
                  type="text"
                  id="item-fee"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Royalty fee"
                  required
                />
              </div>

              {/* <!-- Submit --> */}
              <button
                disabled={!publicKey || isLoading}
                type="Submit"
                className="mt-6 bg-accent-dark disabled:bg-accent-lighter rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                {!isLoading ? "Add" : "Adding..."}
              </button>
            </div>
          </form>
        </section>
        {/* <!-- end create --> */}
      </div>
    </>
  );
}
