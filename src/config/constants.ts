/* eslint-disable */
export const NAV_MAP: Record<string, string> = {
  home: '/',
};

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC_TESTNET = 97,
  XDAI = 100,
}
export const SupportedChainId = [1, 4]; // xdai and rinkeby

export const zeroAddr = '0x0000000000000000000000000000000000000000';

export const SYN_ADDRESS: any = {
  [ChainId.MAINNET]: '0x32bF46Fd2F6b2d624E555eB9C6Ee9482092e1150',
  [ChainId.RINKEBY]: '0x295F2515693d7cdCDbb6Ea1b3Cb116a4D91be38c',
};

export const DAO_ADDRESS: any = {
  [ChainId.MAINNET]: '0x32bF46Fd2F6b2d624E555eB9C6Ee9482092e1150',
  [ChainId.RINKEBY]: '0x295F2515693d7cdCDbb6Ea1b3Cb116a4D91be38c',
};

export const PAWN_ADDRESS: any = {
  [ChainId.MAINNET]: '0x32bF46Fd2F6b2d624E555eB9C6Ee9482092e1150',
  [ChainId.RINKEBY]: '0x295F2515693d7cdCDbb6Ea1b3Cb116a4D91be38c',
};

export const TOKEN_ADDRESS: { [key: string]: any } = {};

export const TOKEN: any = {
  [ChainId.MAINNET]: '',
  [ChainId.RINKEBY]: '0xd996D952e703d715D5fACB05915817CD53F377A5',
};

export const RM_ADDRESS: any = {
  [ChainId.MAINNET]: '0xcfff4c8c0df0e2431977eba7df3d3de857f4b76e',
  [ChainId.RINKEBY]: '0xd996D952e703d715D5fACB05915817CD53F377A5',
};

export const POINT_PRECISION = 100000000;
export const TOKEN_PERCISION = 1000000000000000000;

// switch network
export const CHAIN_CONFIGS = {
  100: {
    id: '1',
    jsonrpc: '2.0',
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x64',
        chainName: 'xDai',
        rpcUrls: ['https://dai.poa.network'],
        blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
        nativeCurrency: {
          name: 'xDai',
          symbol: 'XDAI',
          decimals: 18,
        },
      },
    ],
  },
  // 4: {
  //   id: '1',
  //   jsonrpc: '2.0',
  //   method: 'wallet_addEthereumChain',
  //   params: [
  //     {
  //       chainId: '0x4',
  //       chainName: 'Rinkeby',
  //       rpcUrls: ['https://rinkeby.infura.io/v3/6c3a011449f34ccdaaaddfc504d2e1e1'],
  //       blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  //       nativeCurrency: {
  //         name: 'Rinkeby',
  //         symbol: 'ETH',
  //         decimals: 18,
  //       },
  //     },
  //   ],
  // },
  4: {
    id: '1',
    jsonrpc: '2.0',
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x4' }],
  },
};
