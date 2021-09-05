import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  Flex,
  useTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import ReactGA from 'react-ga';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { globalStore } from 'rekv';
import Web3Modal from 'web3modal';
import { useHistory } from 'react-router-dom';
// import { ChevronDownIcon } from '@chakra-ui/icons';
// import Fortmatic from "fortmatic";
// import Torus from "@toruslabs/torus-embed";
// import Authereum from "authereum";
// import { Bitski } from "bitski";
import SwitchNetworkModal from '../switchNetwork';
import { initWeb3 } from '../../utils/web3';
import { IAppState, IBoxProfile } from '../../utils/types';
import { getChainData, ellipseAddress } from '../../utils/utilities';
import { ETHERSCAN_PREFIXES } from '../../utils';
import { openBox, getProfile } from '../../utils/box';
import { SupportedChainId } from '../../config/constants';

// import { account } from '../../stores';
import { t } from '../../i18n';
import supportedChains from '../../utils/chains';

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
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
    // torus: {
    //   package: Torus
    // },
    // fortmatic: {
    //   package: Fortmatic,
    //   options: {
    //     key: process.env.REACT_APP_FORTMATIC_KEY
    //   }
    // },
    // authereum: {
    //   package: Authereum
    // },
    // bitski: {
    //   package: Bitski,
    //   options: {
    //     clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
    //     callbackUrl: window.location.href + "bitski-callback.html"
    //   }
    // }
  };
  // const providerOptions = {};
  return providerOptions;
};

interface Web3Props {
  variant?: string;
}

export default function Web3Com({ variant }: Web3Props) {
  // const [chainId, setChainId] = useState(-1)
  // const [state, setstate] = useState(INITIAL_STATE)
  const history = useHistory();
  const themes = useTheme();
  const { colors } = themes;
  const [isBase] = useMediaQuery(['(max-width: 768px)']);
  const menuOffset = isBase ? [40, 4] : [-16, 10];

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleOnOpen = () => {
    ReactGA.event({
      category: 'menu',
      action: 'show menu',
    });
    onOpen();
  };

  const getNetwork = () => {
    return getChainData(chainId).network;
  };

  const subscribeProvider = async (provider: any, newState: any) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts: string[]) => {
      ReactGA.event({
        category: 'account',
        action: 'change account',
      });
      await globalStore.setState({
        appState: { ...newState, address: accounts[0] },
        profile: null,
      });
      window.location.reload();
    });
    provider.on('chainChanged', async (chainIdVal: number) => {
      const { web3 } = newState;
      const networkId = await web3.eth.net.getId();
      await globalStore.setState({ appState: { ...newState, chainId: chainIdVal, networkId } });
      // await this.getAccountAssets();
      if (SupportedChainId.indexOf(networkId) < 0) {
        globalStore.setState({ switchModalShow: true });
      } else {
        globalStore.setState({ switchModalShow: false });
        window.location.reload();
      }
    });

    provider.on('networkChanged', async (networkId: number) => {
      const { web3 } = newState;
      const chainIdRes = await web3.eth.chainId();
      await globalStore.setState({ appState: { ...newState, chainId: chainIdRes, networkId } });
      // await this.getAccountAssets();
      if (SupportedChainId.indexOf(+networkId) < 0) {
        globalStore.setState({ switchModalShow: true });
      } else {
        globalStore.setState({ switchModalShow: false });
        window.location.reload();
      }
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainIdRes = await web3.eth.chainId();

    const newState = {
      web3,
      provider,
      connected: true,
      address,
      chainId: chainIdRes,
      networkId,
    };
    globalStore.setState({
      appState: newState,
    });

    await subscribeProvider(provider, newState);

    if (SupportedChainId.indexOf(+chainIdRes) < 0) {
      globalStore.setState({ switchModalShow: true });
    }
    // await this.getAccountAssets();
  };
  // init
  useEffect(() => {
    web3Modal = new Web3Modal({
      network: getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });
    globalStore.setState({ web3Modal });
  }, []);

  // auto connect
  useEffect(() => {
    if (!connected) {
      setTimeout(() => {
        onConnect();
      }, 3000);
    }
  }, [web3Modal]);

  const getNetworkName = () => {
    const networkPre = ETHERSCAN_PREFIXES[chainId];
    if (!networkPre || networkPre.length === 0) {
      if (chainId === 1) return 'mainnet';
      return 'unknow';
    }
    return networkPre.split('.')[0];
  };

  return (
    <Box width={{ base: '100px', md: '204px' }} fontFamily="Eurostile">
      <Flex pos="relative" height={{ base: '36px', md: '40px' }}>
        {!connected ? (
          <Button
            mt={{ base: 0, md: 2 }}
            variant="unstyled"
            w={{ base: '80px', md: '180px' }}
            size={'sm'}
            fontSize={{ base: '12px', md: '13px', lg: '14px' }}
            boxShadow="0px 3px 6px rgba(0, 0, 0, 0.16)"
            borderRadius="100px"
            onClick={() => {
              ReactGA.event({
                category: 'connect',
                action: 'connect account',
              });
              onConnect();
            }}
          >
            {t('btn.connect')}
          </Button>
        ) : (
          <Box
            pos="relative"
            pl={{ base: 0, md: 2 }}
            py={{ base: 1, md: 2 }}
            pr={{ base: 9, md: 14 }}
            borderRadius="3xl"
            textAlign="center"
            maxW="250px"
            height={{ base: '36px', md: '40px' }}
            border={{ base: 'none', md: `1px solid ${colors.borderColor}` }}
            boxShadow={{ base: 'none', md: '0px 0px 20px rgba(0, 0, 0, 0.16)' }}
            color={colors.textPrimary}
            bgColor="#fdfdfd"
            fontSize={{ base: 10, md: 14 }}
            cursor="pointer"
            onMouseEnter={() => handleOnOpen()}
            onMouseLeave={() => onClose()}
          >
            <Menu isOpen={isOpen} matchWidth={true} offset={menuOffset}>
              <MenuButton>
                <Box>
                  <Text
                    as="span"
                    color={colors.textTips}
                    display={{ base: 'block', md: 'inline' }}
                    textAlign="right"
                  >
                    {getNetworkName()}
                  </Text>
                  <Text as="span" d={{ base: 'block', md: 'inline' }} textAlign="center" pl="2">
                    {ellipseAddress(curAddress, 4)}
                  </Text>
                </Box>
              </MenuButton>
              <MenuList
                fontSize={{ base: 12, md: 16 }}
                textColor="textPrimary"
                fontWeight="bold"
                minWidth={{ base: '80px', md: '120px' }}
              >
                {/* <MenuItem
                onClick={() => {
                  onClose();
                  ReactGA.event({
                    category: 'menu',
                    action: `jump to perks`,
                  });
                  history.push('/perks');
                }}
                _hover={{ color: colors.highlight }}
              >
                {t('perks')}
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  onClose();
                  ReactGA.event({
                    category: 'menu',
                    action: `jump to trophies`,
                  });
                  history.push('/trophies');
                }}
                _hover={{ color: colors.highlight }}
              >
                {t('trophies')}
              </MenuItem>
              <MenuDivider /> */}
                <MenuItem
                  onClick={() => {
                    onClose();
                    ReactGA.event({
                      category: 'logout',
                      action: `dis connect wallet`,
                    });
                    resetApp();
                  }}
                  _hover={{ color: colors.highlight }}
                >
                  {t('disconnect')}
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Flex>
      {connected && <SwitchNetworkModal />}
    </Box>
  );
  // (
  //   <Box>
  //     {connected ? (
  //       <Box
  //         color={colors.textPrimary}
  //         fontSize="10px"
  //         cursor="pointer"
  //         textAlign="center"
  //         onMouseEnter={() => handleOnOpen()}
  //         onMouseLeave={() => onClose()}
  //       >
  //         <Menu isOpen={isOpen} matchWidth={true} offset={menuOffset}>
  //           <MenuButton>
  //             <Flex
  //               direction="column"
  //               justifyContent="center"
  //               alignItems="center"
  //               alignContent="center"
  //               color="textPrimary"
  //               position="relative"
  //             >
  //               {/* <Box w="24px">
  //                 {getProfileImageUrl() ? (
  //                   <Image borderRadius="full" src={getProfileImageUrl()} />
  //                 ) : (
  //                   <Jazzicon address={curAddress} />
  //                 )}
  //               </Box> */}
  //               {/* {profile && profile.name ? (
  //                 <Box>
  //                   <Text as="span" color={colors.textTips} pr={3}>
  //                     {getNetworkName()}
  //                   </Text>
  //                   {profile.name}
  //                   {profile.emoji}
  //                 </Box>
  //               ) : (
  //                 <Box>
  //                   <Text marginY="-4px">{ellipseAddress(curAddress, 4)}</Text>
  //                   <Text>{getNetworkName()}</Text>
  //                 </Box>
  //               )} */}

  //               <Box>
  //                 <Text marginY="-4px">{ellipseAddress(curAddress, 4)}</Text>
  //                 <Text>{getNetworkName()}</Text>
  //               </Box>

  //               {isOpen ? '' : <></>}
  //             </Flex>
  //           </MenuButton>
  //           <MenuList
  //             fontSize={{ base: 12, md: 16 }}
  //             textColor="textPrimary"
  //             fontWeight="bold"
  //             minWidth={{ base: '80px', md: '120px' }}
  //           >
  //             <MenuItem
  //               onClick={() => {
  //                 onClose();
  //                 ReactGA.event({
  //                   category: 'logout',
  //                   action: `dis connect wallet`,
  //                 });
  //                 resetApp();
  //               }}
  //               _hover={{ color: colors.highlight }}
  //             >
  //               {t('disconnect')}
  //             </MenuItem>
  //           </MenuList>
  //         </Menu>
  //       </Box>
  //     ) : (
  //       <Flex
  //         direction="column"
  //         justifyContent="center"
  //         alignItems="center"
  //         alignContent="center"
  //         color="textPrimary"
  //         cursor="pointer"
  //         onClick={() => {
  //           ReactGA.event({
  //             category: 'connect',
  //             action: 'connect account',
  //           });
  //           onConnect();
  //         }}
  //       >
  //         <Text fontSize="12px">{t('connect')}</Text>
  //       </Flex>
  //     )}
  //   </Box>
  // );
}
