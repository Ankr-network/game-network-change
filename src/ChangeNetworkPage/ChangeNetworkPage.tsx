import {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation} from "react-router-dom";
import detectEthereumProvider from '@metamask/detect-provider';
import "./styles.css";
import React from "react";

interface IEthereumChain {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

const NETWORK_QUERY_PARAMETER = "network";
const LOGO_QUERY_PARAMETER = "logo";
const DEFAULT_LOGO_SRC = "https://www.ankr.com/_next/static/images/ankr-blue-logo-0a6dff66bd6e0c6659e5f6b7caec28f0.svg";

export const ChangeNetworkPage = () => {
  const {search} = useLocation();
  const [network, setNetwork] = useState<IEthereumChain>();
  const [ethereumProvider, setEthereumProvider] = useState<any>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    detectEthereumProvider()
      .then((provider: any) => {
        setEthereumProvider(provider)
      })
      .catch(() => {
        setError("There is no any providers. Please open this page in Metamask mobile browser ot install the Metamask plugin.");
      });
  }, [setEthereumProvider, setError]);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const networkJson = query.get(NETWORK_QUERY_PARAMETER);
    if (networkJson) {
      try {
        const network = JSON.parse(networkJson);
        setNetwork(network);
      } catch (e) {
        setError((e as any).message);
      }
    }
  }, [search, setError]);

  const logoSrc = useMemo(() => {
    const query = new URLSearchParams(search);
    const logoSrc = query.get(LOGO_QUERY_PARAMETER);
    return logoSrc || DEFAULT_LOGO_SRC;
  }, [search]);

  const changeNetwork = useCallback(async () => {
    if (ethereumProvider && network) {
      try {
        await ethereumProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: network.chainId}],
        });
      } catch (switchError) {
        try {
          await ethereumProvider.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } catch (addError) {
          setError((addError as Error).message);
        }
      }
    }
  }, [ethereumProvider, network, setError]);

  const networkName = useMemo(() => network ? network.chainName : "Wait...", [network]);

  return (
    <div className="page">
      <img
        src={logoSrc}
        className="logo"
        alt="logo"
      />
      <div className={"container"}>
        <div className={"title"}>{"Change network to"}</div>
        <button
          className={"button"}
          onClick={changeNetwork}
        >
          {networkName}
        </button>
      </div>
      {error && <div className={"error"}>{error}</div>}
    </div>
  );
};
