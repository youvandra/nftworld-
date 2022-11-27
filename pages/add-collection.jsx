import { useSDK } from "@thirdweb-dev/react/solana";
import axios from "axios";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import Meta from "../components/Meta";
import FormData from "form-data";
import { useWallet } from "@solana/wallet-adapter-react";
import Collection_dropdown2 from "../components/dropdown/collection_dropdown2";
import { collectionDropdown2_data } from "../data/dropdown";
import Tippy from "@tippyjs/react";
import CategoryDropdown from "../components/dropdown/categoryDropdown";
import { uploadFileToIPFS } from "../metaplex/pinata";
import { useRouter } from "next/router";

export default function CreateCollection() {
  const sdk = useSDK();
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const fileTypes = ["JPG", "PNG", "GIF"];

  const router = useRouter();

  async function createNFTCollection({
    name,
    description,
    image,
    banner,
    category,
  }) {
    if (!publicKey) return;
    setIsLoading(true);
    await sdk.deployer
      .createNftCollection({
        name,
        description,
        image,
      })
      .then(async (address) => {
        const { pinataURL: imageFile } = await uploadFileToIPFS(image);
        const { pinataURL: bannerFile } = await uploadFileToIPFS(banner);
        const data = {
          creatorAddress: publicKey.toBase58(),
          address,
          title: name,
          description,
          banner: bannerFile,
          image: imageFile,
          category,
        };

        axios
          .post("/api/addCollection", data)
          .then(() => {
            router.push(`/collection/${address}`);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  }
  const { handleSubmit, register, setValue } = useForm();

  const [file, setFile] = useState(null);
  const [banner, setBanner] = useState(null);

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

              {file ? (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  successfully uploaded : {file.name}
                </p>
              ) : (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  Drag or choose your file to upload
                </p>
              )}

              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                <div className="relative z-10 cursor-pointer">
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
                    JPG, PNG, GIF. Max size: 2 MB
                  </p>
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

              {banner ? (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  successfully uploaded : {banner.name}
                </p>
              ) : (
                <p className="dark:text-jacarta-300 text-2xs mb-3">
                  Drag or choose your file to upload
                </p>
              )}

              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                <div className="relative z-10 cursor-pointer">
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
                    JPG, PNG, GIF. Max size: 2 MB
                  </p>
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
                <div className="mb-3 flex items-center space-x-2">
                  <p className="dark:text-jacarta-300 text-2xs">
                    This is the collection where your item will appear.
                    <Tippy
                      theme="tomato-theme"
                      content={
                        <span>
                          Moving items to a different collection may take up to
                          30 minutes.
                        </span>
                      }
                    >
                      <span className="inline-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="dark:fill-jacarta-300 fill-jacarta-500 ml-1 -mb-[3px] h-4 w-4"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path>
                        </svg>
                      </span>
                    </Tippy>
                  </p>
                </div>
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
  );
}
