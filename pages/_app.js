import "../styles/globals.css";
import "../styles/style.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useRouter } from "next/router";
import { MetaMaskProvider } from "metamask-react";
import Meta from "../components/Meta";
import UserContext from "../components/UserContext";
import { useEffect, useRef } from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import MetaplexProvider from "../metaplex/MetaPlexProvider";
import { Toaster } from "react-hot-toast";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
  BraveWalletAdapter,
  SlopeWalletAdapter,
  ExodusWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  SolletExtensionWalletAdapter,
  MathWalletAdapter,
  SolongWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SOLANA_RPC_NODE, THIRDWEB_DESIRED_NODE } from "../utils/consts";

require("@solana/wallet-adapter-react-ui/styles.css");

const WALLETS = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new BraveWalletAdapter(),
  new SlopeWalletAdapter(),
  new ExodusWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new LedgerWalletAdapter(),
  new SolletExtensionWalletAdapter(),
  new MathWalletAdapter(),
  new SolongWalletAdapter(),
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pid = router.asPath;
  const scrollRef = useRef({
    scrollPos: 0,
  });
  const wallet = useWallet();

  useEffect(() => {
    // if (pid === '/home/home_8') {
    // 	const html = document.querySelector('html');
    // 	html.classList.remove('light');
    // 	html.classList.add('dark');
    // }
  }, []);

  return (
    <>
      <Meta title="NFT WORLD" />
      <Toaster />
      <Provider store={store}>
        <ThirdwebProvider
          autoConnect={true}
          network={THIRDWEB_DESIRED_NODE}
          wallet={wallet}
          wallets={WALLETS}
        >
          <ConnectionProvider endpoint={SOLANA_RPC_NODE}>
            <ThemeProvider enableSystem={true} attribute="class">
              <MetaMaskProvider>
                <MetaplexProvider>
                  <UserContext.Provider value={{ scrollRef: scrollRef }}>
                    {pid === "/login" ? (
                      <Component {...pageProps} />
                    ) : (
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    )}
                  </UserContext.Provider>
                </MetaplexProvider>
              </MetaMaskProvider>
            </ThemeProvider>
          </ConnectionProvider>
        </ThirdwebProvider>
      </Provider>
    </>
  );
}

export default MyApp;
