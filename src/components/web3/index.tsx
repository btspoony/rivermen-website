import React, { useEffect } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { globalStore } from 'rekv';
import Web3Modal from 'web3modal';
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Fortmatic from "fortmatic";
// import Torus from "@toruslabs/torus-embed";
// import Authereum from "authereum";
// import { Bitski } from "bitski";
import { initWeb3 } from '../../utils/web3';
import { IAppState, IBoxProfile } from '../../utils/types';
import { getChainData, ellipseAddress } from '../../utils/utilities';
import { openBox, getProfile } from '../../utils/box';

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
};

const getProviderOptions = () => {
  // other provider
  // const providerOptions = {
  //   walletconnect: {
  //     package: WalletConnectProvider,
  //     options: {
  //       infuraId: process.env.REACT_APP_INFURA_ID
  //     }
  //   },
  //   torus: {
  //     package: Torus
  //   },
  //   fortmatic: {
  //     package: Fortmatic,
  //     options: {
  //       key: process.env.REACT_APP_FORTMATIC_KEY
  //     }
  //   },
  //   authereum: {
  //     package: Authereum
  //   },
  //   bitski: {
  //     package: Bitski,
  //     options: {
  //       clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
  //       callbackUrl: window.location.href + "bitski-callback.html"
  //     }
  //   }
  // };
  const providerOptions = {};
  return providerOptions;
};

export default function Web3Com() {
  // const [chainId, setChainId] = useState(-1)
  // const [state, setstate] = useState(INITIAL_STATE)

  const { appState = INITIAL_STATE, profile = null } = globalStore.useState('appState', 'profile');
  let { web3Modal } = globalStore.useState('web3Modal');
  const { chainId, connected, address: curAddress } = appState;

  const resetApp = async () => {
    const { web3 } = appState;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    globalStore.setState({ appState: INITIAL_STATE });
  };

  const getBoxProfile = async (address: string, provider: any): Promise<IBoxProfile> => {
    /* eslint-disable */
    return new Promise(async (resolve, reject) => {
      try {
        await openBox(address, provider, async () => {
          const profile = await getProfile(address);
          if (profile) {
            globalStore.setState({ profile });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const getNetwork = () => {
    return getChainData(chainId).network;
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts: string[]) => {
      await globalStore.setState({
        appState: { ...appState, address: accounts[0], connected: true },
        profile: null,
      });
      getBoxProfile(accounts[0], provider);
      // await this.getAccountAssets();
    });
    provider.on('chainChanged', async (chainIdVal: number) => {
      const { web3 } = appState;
      const networkId = await web3.eth.net.getId();
      await globalStore.setState({ appState: { ...appState, chainId: chainIdVal, networkId } });
      // await this.getAccountAssets();
    });

    provider.on('networkChanged', async (networkId: number) => {
      const { web3 } = appState;
      const chainIdRes = await web3.eth.chainId();
      await globalStore.setState({ appState: { ...appState, chainId: chainIdRes, networkId } });
      // await this.getAccountAssets();
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainIdRes = await web3.eth.chainId();

    await globalStore.setState({
      appState: {
        web3,
        provider,
        connected: true,
        address,
        chainId: chainIdRes,
        networkId,
      },
    });
    getBoxProfile(address, provider);
    // await this.getAccountAssets();
  };

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      onConnect();
      return;
    }
    web3Modal = new Web3Modal({
      network: getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });
    globalStore.setState({ web3Modal: web3Modal });
  }, []);

  return (
    <Box as="div" flex={1} display="flex" justifyContent="center" height="auto">
      {!connected ? (
        <Button size="sm" onClick={() => onConnect()}>
          {' '}
          Connect{' '}
        </Button>
      ) : (
        <Box>
          {profile && profile.name ? (
            <Box>
              {profile.name}
              {profile.emoji}
            </Box>
          ) : (
            <Box>{ellipseAddress(curAddress, 5)}</Box>
          )}
        </Box>
      )}
    </Box>
  );
}
