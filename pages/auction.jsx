import Link from "next/link";
import AuctionCardItem from "../components/categories/AuctionCardItem";
import auctions_card from "../data/auctions_card";
import Grid from "@mui/material/Grid";

export default function Admin() {
  return (
    <div className="pt-[5.5rem] lg:pt-24 container pb-2">
      <h1 className="mt-8 mb-12 text-center text-5xl font-bold">Auction</h1>

      <article className="mb-[1.875rem] md:mb-16">
        <div className="rounded-2xl flex flex-col overflow-hidden transition-shadow hover:shadow-lg md:flex-row">
          <figure className="group overflow-hidden md:w-1/2">
            <Link href="/single_post/post_1">
              <a>
                <img
                  src="https://img-cdn.magiceden.dev/rs:fill:700:700:0:0/plain/https://hxgkxp4mpxr2zqcygtsyijmv43ssivbbvcrdfripgi6hir3mjy.arweave.net/Pcyrv4x946zAWDTlhCWV5uUkVCG-oojLFDzI8dEdsTg"
                  alt="post 1"
                  className="h-full w-full transition-transform duration-[1600ms] will-change-transform group-hover:scale-105"
                />
              </a>
            </Link>
          </figure>

          {/* <!-- Body --> */}
          <div className="dark:border-jacarta-600 dark:bg-jacarta-700 border-jacarta-100 rounded-b-[1.25rem] border bg-white p-[10%] md:w-1/2 md:rounded-none md:rounded-r-[1.25rem]">
            {/* <!-- Meta --> */}
            <h2 className="font-display text-jacarta-700 dark:hover:text-accent hover:text-accent mb-4 text-xl dark:text-white sm:text-3xl">
              <Link href="/single_post/post_1">
                <a> The Sol Army GV Pass 2.0 #43 </a>
              </Link>
            </h2>

            <div className="mb-3 flex flex-wrap items-center space-x-1 text-xs">
              <Link href="#">
                <a className="dark:text-jacarta-200 text-jacarta-700 font-display hover:text-accent">
                  CREATED
                </a>
              </Link>
              <span className="dark:text-jacarta-400">by</span>
              <span className="text-accent inline-flex flex-wrap items-center space-x-1">
                <a href="#">The Sol Army</a>
              </span>
            </div>

            <p className="dark:text-jacarta-200 mb-8">
              A community-driven company with the objective to educate, innovate
              and pursue growth within Web3. Holding a GV Pass grants exclusive
              benefits. Winner gets a free GEN0 PFP. These 2.0 Passes have been
              upgraded already and include all new benefits! Check...
            </p>

            {/* <!-- Date / Time --> */}
            <div className="c-auction-time-border">
              <div className="w-[50%]">
                <p>FINAL BID</p>
                <p className="c-auction-fontsize-big">85.00 SOL</p>
                <p className="c-auction-fontsize-small">~$952.00</p>
              </div>
              <div className="w-[50%]">
                <p>AUCTION ENDED</p>
                <div className="c-auction-data-responsive">
                  <div className="w-[25%]">
                    <p className="c-auction-fontsize-big">--</p>
                    <p className="c-auction-fontsize-small">Hours</p>
                  </div>
                  <div className="w-[32%]">
                    <p className="c-auction-fontsize-big">--</p>
                    <p className="c-auction-fontsize-small">Minutes</p>
                  </div>
                  <div className="w-[32%]">
                    <p className="c-auction-fontsize-big">--</p>
                    <p className="c-auction-fontsize-small">Seconds</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="dark:text-jacarta-200 mb-8 my-3 text-2xs">
              <span>LAST BID BY Ex5B...nx7N</span>
              <span className="c-auctin-float">12/24/22, 9:33 PM</span>
            </p>

            <div className="mt-10 text-center">
              <button className="bg-accent w-full rounded hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all">
                Place your bid
              </button>
            </div>
          </div>
        </div>
      </article>

      <Grid container spacing={2} direction="row" alignItems="center">
        {auctions_card?.map((item, key) => {
          return (
            <Grid item xs={12} sm={4} md={3} key={key}>
              <AuctionCardItem data={item} key={key} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
