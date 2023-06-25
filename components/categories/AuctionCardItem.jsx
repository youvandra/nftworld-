export default function AuctionCardItem({ data }) {
  console.log(data);
  return (
    <div className="c-auction-card">
      <div className="mb-3 w-full">
        <img src={data.image} className="rounded-3xl w-full" />
      </div>
      <div className="text-center mb-1">
        <p>{data.title}</p>
      </div>
      <div className="text-center c-auction-card-name-style mb-2">
        <p>{data.name}</p>
      </div>
      <div className="c-auction-time-border">
        <div>
          <p className="mb-3">FINAL BID</p>
          <div className="modal-dialog-centered">
            <img
              className="c-auction-category-image mr-1"
              src="https://magiceden.io/static/media/solana-icon-gradient.fa522d66295471a41d0ae10b89993cf3.svg"
            />
            <span>{data.price} SOL</span>
          </div>
        </div>
        <div>
          <div className="mb-3">AUCTION ENDED</div>
          <div className="text-right">ENDED</div>
        </div>
      </div>
    </div>
  );
}
