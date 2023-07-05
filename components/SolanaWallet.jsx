import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import ModalComponent from "./modal/general_modal";
import { Row, Col } from "antd";
import { Network } from "./modal/general_modal/styles";
//import {ConnectWallet, getETHBalance, disconnectETHWallet} from './ETHwallet';
import { ethers, providers } from "ethers";
import UserId from "./userId";
import Link from "next/link";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useAuctionHouse } from "../metaplex/useAuctionHouse";
import { SOLANA_RPC_NODE, THIRDWEB_DESIRED_NODE } from "../utils/consts";

export default function SolanaWallet() {
  const { connect, connected, connecting, disconnect, wallet, publicKey } =
    useWallet();
  const { visible, setVisible } = useWalletModal(); //Solana wallets visibility
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);
  const [showm, setShowm] = useState(false); //SOLANA AND ETH WALLET MODAL visibility
  const [modal, setModal] = useState(false);
  const [eTHaccount, setETHaccount] = useState("");
  const [ETHbalance, setETHbalance] = useState(0);
  const [chain, setChain] = useState("");
  const [profileShow, setProfileShow] = useState(false);
  const [balance, setBalance] = useState(0); //SOLANA
  const [escrowBalance, setEscrowBalance] = useState(0);
  const { getEscrowBalance, withdrawEscrow } = useAuctionHouse();

  async function getbalance(pKey) {
    const connection = new Connection(clusterApiUrl(THIRDWEB_DESIRED_NODE));
    return await connection.getBalance(pKey);
  }

  useEffect(() => {
    if (!publicKey) return;
    getbalance(publicKey).then((b) => {
      setBalance(b);
    });

    getEscrowBalance().then((b) => {
      setEscrowBalance(b.basisPoints.toNumber());
    });
  }, [publicKey]);

  const getETHBalance = async (account) => {
    if (!account) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      let balance = await provider.getBalance(account);
      //setETHbalance(ethers.utils.formatEther(balance));
      // console.log(balance);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!eTHaccount) return;
    getETHBalance(eTHaccount).then((b) => {
      setETHbalance(b);
    });
  }, [eTHaccount]);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const ref = useRef(null);

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setActive(false);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  const copyETHAddress = useCallback(async () => {
    if (eTHaccount) {
      await navigator.clipboard.writeText(eTHaccount);
      setCopied(true);
      setActive(false);
      setTimeout(() => setCopied(false), 400);
    }
  }, [eTHaccount]);

  const handleDisconnect = useCallback(() => {
    disconnect().then(() => {
      setActive(false);
      localStorage.setItem("wallet", "");
    });
  });

  const disconnectETHWallet = () => {
    localStorage.setItem("wallet", "");
    setETHaccount("");
    setActive(false);
  };

  const openSolana = () => {
    if (eTHaccount) return alert("Please disconnect your ETH wallet first.");
    setShowm(false);
    setVisible(true);
  };

  const openETH = () => {
    if (publicKey) return alert("Please disconnect your SOL wallet first.");
    setShowm(false);
    setModal(true);
  };

  const connectETHWallet = async () => {
    setShowm(false);
    if (window.ethereum) {
      try {
        await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((accounts) => {
            setETHaccount(accounts[0]);
            localStorage.setItem("wallet", "ETH");
          });
      } catch (error) {
        alert("Failed to connect wallet.");
        console.log(error);
      }
    } else {
      message.error("Metamask or web3 browser not Detected!");
    }
  };

  /*useEffect(() => {
    if (!publicKey && !eTHaccount) setShowm(true);
    else setShowm(false);
  }, [publicKey, eTHaccount]);*/

  useEffect(() => {
    setChain(localStorage.getItem("wallet"));
  }, []);

  useEffect(() => {
    if (publicKey) {
      localStorage.setItem("wallet", "SOL");
      const _ = axios.get(`/api/signUser?address=${publicKey.toBase58()}`);
    }
  }, [publicKey]);
  //console.log('ETH ACCTS:',localStorage.getItem('ETHaccount'));
  //console.log('CHAIN:',chain);
  //console.log('SOL ACCT:',publicKey);
  //const content = useMemo(() => {
  if (!publicKey && !eTHaccount)
    return (
      <>
        <button
          onClick={() => {
            setShowm(true);
          }}
          className="js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15] hidden md:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className={
              "fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
            }
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z"></path>
          </svg>
        </button>

        {/*MOBILE*/}
        <button
          className="js-wallet bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all lg:hidden"
          onClick={() => setShowm(true)}
        >
          Connect Wallet
        </button>

        {/*WALLET MODAL */}
        <ModalComponent
          width={420}
          visible={showm}
          title="Chose a network"
          onCancel={() => setShowm(false)}
        >
          <Row>
            <Col span={12}>
              <Network onClick={() => openSolana()}>
                <img
                  src={"https://cryptologos.cc/logos/solana-sol-logo.svg?v=024"}
                  alt="Solana"
                  width="32"
                  height="32"
                />
                <p>Solana</p>
              </Network>
            </Col>
            {/* <Col span={12}>
              <Network onClick={() => openETH()}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 1440 1024"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M719.8 -367.3L180.1 528.3L719.8 283V-367.3Z"
                    fill="#8A92B2"
                  />
                  <path
                    d="M719.8 283L180.1 528.3L719.8 847.4V283ZM1259.6 528.3L719.8 -367.3V283L1259.6 528.3Z"
                    fill="#62688F"
                  />
                  <path
                    d="M719.8 847.4L1259.6 528.3L719.8 283V847.4Z"
                    fill="#454A75"
                  />
                  <path
                    d="M180.1 630.7L719.8 1391.3V949.6L180.1 630.7Z"
                    fill="#8A92B2"
                  />
                  <path
                    d="M719.8 949.6V1391.3L1259.9 630.7L719.8 949.6Z"
                    fill="#62688F"
                  />
                </svg>
                <p>Ethereum</p>
              </Network>
            </Col> */}
          </Row>
        </ModalComponent>

        <ModalComponent
          width={420}
          visible={modal}
          title="Select a wallet"
          onCancel={() => setModal(false)}
        >
          <Row>
            <Col span={12}>
              <Network onClick={() => connectETHWallet()}>
                <img
                  src={
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png"
                  }
                  alt="metamask"
                  width="32"
                  height="32"
                />
                <p>Metamask</p>
              </Network>
            </Col>
            <Col span={12}>
              <Network onClick={() => connectETHWallet()}>
                <img
                  src={
                    "https://trustwallet.com/assets/images/media/assets/TWT.png"
                  }
                  alt="trust-wallet"
                  width="32"
                  height="32"
                />
                <p>Trust Wallet</p>
              </Network>
            </Col>
          </Row>
        </ModalComponent>
      </>
    );
  if (connected || eTHaccount)
    return (
      <div className="wallet-adapter-dropdown">
        <ul className="flex items-center justify-center">
          <li className=" relative">
            <button
              aria-expanded={true}
              onClick={() => {
                if (active) return setActive(false);
                setActive(true);
              }}
              className="wallet-adapter-button-trigger js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
            >
              {eTHaccount ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 1440 1024"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M719.8 -367.3L180.1 528.3L719.8 283V-367.3Z"
                    fill="#8A92B2"
                  />
                  <path
                    d="M719.8 283L180.1 528.3L719.8 847.4V283ZM1259.6 528.3L719.8 -367.3V283L1259.6 528.3Z"
                    fill="#62688F"
                  />
                  <path
                    d="M719.8 847.4L1259.6 528.3L719.8 283V847.4Z"
                    fill="#454A75"
                  />
                  <path
                    d="M180.1 630.7L719.8 1391.3V949.6L180.1 630.7Z"
                    fill="#8A92B2"
                  />
                  <path
                    d="M719.8 949.6V1391.3L1259.9 630.7L719.8 949.6Z"
                    fill="#62688F"
                  />
                </svg>
              ) : (
                <WalletIcon wallet={wallet} />
              )}
            </button>
          </li>
          {eTHaccount ? (
            <li className="relative">
              <div className="js-nav-dropdown group-dropdown relative">
                <button
                  className="dropdown-toggle border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                  onMouseEnter={() => setProfileShow(true)}
                  onMouseLeave={() => setProfileShow(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                  </svg>
                </button>

                <div
                  className={
                    profileShow
                      ? "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl show lg:visible lg:opacity-100"
                      : "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl hidden lg:invisible lg:opacity-0"
                  }
                  onMouseEnter={() => setProfileShow(true)}
                  onMouseLeave={() => setProfileShow(false)}
                >
                  <UserId
                    classes="js-copy-clipboard font-display text-jacarta-700 my-4 flex select-none items-center whitespace-nowrap px-5 leading-none dark:text-white"
                    userId={String(eTHaccount)}
                    shortId={true}
                  />

                  <div className="dark:border-jacarta-600 border-jacarta-100 mx-5 mb-6 rounded-lg border p-4">
                    <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">
                      Balance
                    </span>
                    <div className="flex mb-3 items-center">
                      <div className="-ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 1440 1024"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M719.8 -367.3L180.1 528.3L719.8 283V-367.3Z"
                            fill="#8A92B2"
                          />
                          <path
                            d="M719.8 283L180.1 528.3L719.8 847.4V283ZM1259.6 528.3L719.8 -367.3V283L1259.6 528.3Z"
                            fill="#62688F"
                          />
                          <path
                            d="M719.8 847.4L1259.6 528.3L719.8 283V847.4Z"
                            fill="#454A75"
                          />
                          <path
                            d="M180.1 630.7L719.8 1391.3V949.6L180.1 630.7Z"
                            fill="#8A92B2"
                          />
                          <path
                            d="M719.8 949.6V1391.3L1259.9 630.7L719.8 949.6Z"
                            fill="#62688F"
                          />
                        </svg>
                      </div>
                      <span className="text-green text-lg font-bold">
                        {ETHbalance} ETH
                      </span>
                    </div>
                    {/*   <span className="dark:text-jacarta-200  text-sm font-medium tracking-tight">
               Escrow
             </span>
            <div className="flex items-center">
               <div className="-ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
               <svg width="22" height="22" viewBox="0 0 1440 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M719.8 -367.3L180.1 528.3L719.8 283V-367.3Z" fill="#8A92B2"/>
          <path d="M719.8 283L180.1 528.3L719.8 847.4V283ZM1259.6 528.3L719.8 -367.3V283L1259.6 528.3Z" fill="#62688F"/>
          <path d="M719.8 847.4L1259.6 528.3L719.8 283V847.4Z" fill="#454A75"/>
          <path d="M180.1 630.7L719.8 1391.3V949.6L180.1 630.7Z" fill="#8A92B2"/>
          <path d="M719.8 949.6V1391.3L1259.9 630.7L719.8 949.6Z" fill="#62688F"/>
          </svg>
               </div>
               <span className="text-green text-lg font-bold">
                 {ETHbalance} ETH
               </span>
             </div>
             <button
               className="bg-accent mt-2 text-sm rounded-full px-3 py-1 font-semibold"
               onClick={() => {
                 withdrawEscrow(escrowBalance / 1000000000);
               }}
             >
               Withdraw
             </button>*/}
                  </div>
                  <Link href={`/user/${eTHaccount}`}>
                    <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                      </svg>
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        My Profile
                      </span>
                    </a>
                  </Link>

                  {/* add collection */}
                  <Link href={`/feature-request`}>
                    <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                      >
                        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                      </svg>
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        Request feature
                      </span>
                    </a>
                  </Link>
                  {/* list NFT */}
                  <Link href={`/list`}>
                    <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                      <svg className="icon fill-jacarta-700 dark:fill-white h-4 w-4">
                        <use xlinkHref={`/icons.svg#icon-listing`}></use>
                      </svg>
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        Manage Listings
                      </span>
                    </a>
                  </Link>
                  <Link href={`/bid`}>
                    <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                      <svg className="icon fill-jacarta-700 dark:fill-white h-4 w-4">
                        <use xlinkHref={`/icons.svg#icon-bids`}></use>
                      </svg>
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        Manage bids
                      </span>
                    </a>
                  </Link>
                  <Link href="/edit-profile">
                    <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                      </svg>
                      <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                        Edit Profile
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </li>
          ) : (
            <>
              <li className="relative">
                <div className="js-nav-dropdown group-dropdown relative">
                  <button
                    className="dropdown-toggle border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                    onMouseEnter={() => setProfileShow(true)}
                    onMouseLeave={() => setProfileShow(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                    </svg>
                  </button>

                  <div
                    className={
                      profileShow
                        ? "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl show lg:visible lg:opacity-100"
                        : "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl hidden lg:invisible lg:opacity-0"
                    }
                    onMouseEnter={() => setProfileShow(true)}
                    onMouseLeave={() => setProfileShow(false)}
                  >
                    <UserId
                      classes="js-copy-clipboard font-display text-jacarta-700 my-4 flex select-none items-center whitespace-nowrap px-5 leading-none dark:text-white"
                      userId={String(publicKey)}
                      shortId={true}
                    />

                    <div className="dark:border-jacarta-600 border-jacarta-100 mx-5 mb-6 rounded-lg border p-4">
                      <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">
                        Balance
                      </span>
                      <div className="flex mb-3 items-center">
                        <div className="-ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=023" />
                        </div>
                        <span className="text-green text-lg font-bold">
                          {(balance / 1000000000).toPrecision(4)} SOL
                        </span>
                      </div>
                      <span className="dark:text-jacarta-200  text-sm font-medium tracking-tight">
                        Escrow
                      </span>
                      <div className="flex items-center">
                        <div className="-ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=023" />
                        </div>
                        <span className="text-green text-lg font-bold">
                          {(escrowBalance / 1000000000).toPrecision(4)} SOL
                        </span>
                      </div>
                      <button
                        className="bg-accent mt-2 text-sm rounded-full px-3 py-1 font-semibold"
                        onClick={() => {
                          withdrawEscrow(escrowBalance / 1000000000);
                        }}
                      >
                        Withdraw
                      </button>
                    </div>
                    <Link href={`/user/${publicKey.toBase58()}`}>
                      <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                        </svg>
                        <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                          My Profile
                        </span>
                      </a>
                    </Link>

                    {/* add collection */}
                    <Link href={`/feature-request`}>
                      <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                        >
                          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                        </svg>
                        <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                          Request feature
                        </span>
                      </a>
                    </Link>
                    {/* list NFT */}
                    <Link href={`/list`}>
                      <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                        <svg className="icon fill-jacarta-700 dark:fill-white h-4 w-4">
                          <use xlinkHref={`/icons.svg#icon-listing`}></use>
                        </svg>
                        <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                          Manage Listings
                        </span>
                      </a>
                    </Link>
                    <Link href={`/bid`}>
                      <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                        <svg className="icon fill-jacarta-700 dark:fill-white h-4 w-4">
                          <use xlinkHref={`/icons.svg#icon-bids`}></use>
                        </svg>
                        <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                          Manage bids
                        </span>
                      </a>
                    </Link>
                    <Link href="/edit-profile">
                      <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                        </svg>
                        <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                          Edit Profile
                        </span>
                      </a>
                    </Link>
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>

        {active && (
          <ul
            aria-label="dropdown-list"
            className={`wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active
            `}
            ref={ref}
            role="menu"
          >
            <li
              onClick={eTHaccount ? copyETHAddress : copyAddress}
              className="wallet-adapter-dropdown-list-item"
              role="menuitem"
            >
              {copied ? "Copied" : "Copy address"}
            </li>

            <li
              onClick={eTHaccount ? disconnectETHWallet : handleDisconnect}
              className="wallet-adapter-dropdown-list-item"
              role="menuitem"
            >
              Disconnect
            </li>
          </ul>
        )}
      </div>
    );
  else
    return (
      <button className="js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className={
            "fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
          }
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z"></path>
        </svg>
      </button>
    );
  //}, [connected, wallet, active, copied]);

  //  return content;
}
