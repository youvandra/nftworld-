import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Collection_dropdown2 from "../../components/dropdown/collection_dropdown2";
import Meta from "../../components/Meta";

export default function index() {
  const { publicKey } = useWallet();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [collectionAddress, setCollectionAddress] = useState();

  const featureCollection = async (address) => {
    if (!address) return;
    await toast.promise(
      axios.get(`/api/requestFeature?address=${address}`),
      {
        error: "There was a problem sending you feature request",
        loading: "Sending your request",
        success: "Your request has been sent successfullly",
      },
      { position: "bottom-right" }
    );
  };

  function handleCategory(col) {
    setCollectionAddress(col);
  }

  async function getCollections() {
    if (!publicKey) return;
    const { data } = await axios.get(
      `/api/getMyCollections?creatorAddress=${publicKey.toBase58()}`
    );
    console.log(data);
    if (!data) return;
    const formatedCollections = data.map(
      ({ address: id, image, title: text }) => ({
        id,
        image,
        text,
      })
    );
    setCollections(formatedCollections);
  }

  useEffect(() => {
    getCollections();
  }, [publicKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    featureCollection(collectionAddress).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div>
      <Meta title="NFT World - Feature request" />

      <section className="relative py-24 ">
        <picture className=" pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <form onSubmit={handleSubmit} className="container">
          <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
            Feature collection request
          </h1>

          <div className="mx-auto max-w-[48.125rem]">
            {/* <!-- Collection --> */}
            <div className="relative">
              {/* dropdown */}
              <div className="dropdown my-1 cursor-pointer">
                <Collection_dropdown2
                  data={collections}
                  collection={true}
                  handleChange={handleCategory}
                />
              </div>
            </div>

            {/* <!-- Submit --> */}
            <button
              disabled={!publicKey || isLoading}
              type="Submit"
              className="bg-accent-dark mt-6 disabled:bg-accent-lighter rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
            >
              {!isLoading ? "Feature" : "Sending request..."}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
