import React from "react";
import { items_activity_data } from "../../data/items_tabs_data";
import Link from "next/link";
import axios from "axios";
import { SOLSCANCLUSTER, SOLSCANURL } from "../../utils/consts";
import { useEffect } from "react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import Loader from "../Loader";

async function getNFTActivities(address) {
  if (!address) return;
  const { data: activities } = await axios.get(
    `${SOLSCANURL}/account/transaction?address=${address}&cluster=${SOLSCANCLUSTER}`
  );

  if (!activities) return;
  const filteredData = activities?.data?.filter(
    ({ status }) => status === "Success"
  );

  const formatedActivities = filteredData.map(
    ({ blockTime, signer, parsedInstruction, txHash }) => ({
      date: new Date(blockTime * 1000).toLocaleDateString(),
      event:
        parsedInstruction[0]?.type === "createAccount"
          ? "mint"
          : parsedInstruction[0]?.type,
      signer: signer[0],
      txHash,
    })
  );

  return formatedActivities;
}

const Activity_tab = ({ address }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getNFTActivities(address)
      .then((a) => {
        setActivities(a);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [address]);

  if (isLoading) return <Loader />;

  if (activities.length === 0)
    return (
      <p className="text-center text-lg text-jacarta-400 mt-6 font-medium">
        This NFT has no activities
      </p>
    );

  return (
    <>
      {/* <!-- Activity --> */}
      <div
        className="tab-pane fade"
        id="activity"
        role="tabpanel"
        aria-labelledby="activity-tab"
      >
        <div
          role="table"
          className="scrollbar-custom dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 max-h-72 w-full overflow-y-auto rounded-lg rounded-tl-none border bg-white text-sm dark:text-white"
        >
          <div
            className="dark:bg-jacarta-600 bg-light-base sticky top-0 flex"
            role="row"
          >
            <div className="w-[25%] py-2 px-4" role="columnheader">
              <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                Event
              </span>
            </div>

            <div className="w-[25%] py-2 px-4" role="columnheader">
              <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                Signer
              </span>
            </div>
            <div className="w-[25%] py-2 px-4" role="columnheader">
              <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                Transaction
              </span>
            </div>
            <div className="w-[25%] py-2 px-4" role="columnheader">
              <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                Date
              </span>
            </div>
          </div>
          {activities.map(({ event, txHash, date, signer }, i) => {
            return (
              <div className="flex" role="row" key={i}>
                <div
                  className="dark:border-jacarta-600 capitalize border-jacarta-100 flex w-[25%] items-center border-t py-4 px-4"
                  role="cell"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M14 20v2H2v-2h12zM14.586.686l7.778 7.778L20.95 9.88l-1.06-.354L17.413 12l5.657 5.657-1.414 1.414L16 13.414l-2.404 2.404.283 1.132-1.415 1.414-7.778-7.778 1.415-1.414 1.13.282 6.294-6.293-.353-1.06L14.586.686zm.707 3.536l-7.071 7.07 3.535 3.536 7.071-7.07-3.535-3.536z"></path>
                  </svg>
                  {event}
                </div>

                <div
                  className="dark:border-jacarta-600 border-jacarta-100 flex w-[25%] items-center border-t py-4 px-4"
                  role="cell"
                >
                  <Link href={`/user/${signer}`}>
                    <a className="text-accent">
                      {signer?.substr(0, 13) + ".."}
                    </a>
                  </Link>
                </div>
                <div
                  className="dark:border-jacarta-600 border-jacarta-100 flex w-[25%] items-center border-t py-4 px-4"
                  role="cell"
                >
                  <Link
                    href={`https://solscan.io/tx/${txHash}?cluster=${SOLSCANCLUSTER}`}
                  >
                    <a className="text-accent">
                      {txHash?.substr(0, 13) + ".."}
                    </a>
                  </Link>
                </div>
                <div
                  className="dark:border-jacarta-600 border-jacarta-100 flex w-[25%] items-center border-t py-4 px-4"
                  role="cell"
                >
                  <span className="mr-1">{date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Activity_tab;
