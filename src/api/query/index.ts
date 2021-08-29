// export * from './queryClient';
import {
  useQuery,
  // useMutation,
} from 'react-query';
import { globalStore } from 'rekv';
import { pawnPoolApi, RMApi } from '../contracts';
import { getPawnContractAddr, getNFTAddr } from '../../utils/web3';
import { formatBalance, getMetadata, getConfig, postQuery, queryAssets } from '../../utils';
import { add } from '../../utils/bignumber';

export * from './queryClient';

const POOL_QUERY = 'getPoolInfo';
const CARDS_QUERY_BY_IDS = 'getCardsByIds';
const QUERY_USER_RM = 'getUserRMPawn';

export const getConnectedState = () => {
  const { appState = {} } = globalStore.useState('appState');
  const { connected = false } = appState;
  return connected;
};

export const getAddrState = () => {
  const { appState = {} } = globalStore.useState('appState');
  const { address = false } = appState;
  return address;
};

// query ovo info
export const usePoolInfo = (idx: number) => {
  // const connect = getConnectedState();
  // if (!connect) return { data: {} };
  const getPoolInfo = async () => {
    // todo add cards
    // get ovo Wxdai bal
    const bistro = bistroApi();
    const poolInfo = await bistro.getPool(idx);
    const balance = await bistro.getPoolsBalance(idx);

    return {
      ...poolInfo,
      balance,
    };
  };
  return useQuery(`${POOL_QUERY}${idx}`, getPoolInfo);
};

// query balance for current address
//   export const useFaceValue = (poolId: number, nftAddress: string, nftId: number) => {
//     const getInfo = async () => {
//       const bistro = pawnPoolApi();
//       const value = await bistro.getFaceValue(poolId, nftAddress, nftId);

//       return { value };
//     };

//     return useQuery(`${MY_FACE_VALUE_QUERY}${poolId}${nftAddress}${nftId}`, getInfo);
//   };

//   export const useConfig = () => {
//     const getConfigData = async () => {
//       const poolConfig = await getConfig('poolConfig');
//       const redeemConfig = await getConfig('redeemConfig');
//       const disableCards = await getConfig('disableCards');
//       return { poolConfig, redeemConfig, disableCards };
//     };
//     return useQuery(`${CONFIG_QUERY}`, getConfigData);
//   };

export const useAccountAssets = (addr: string) => {
  const getUserMainnetRice = async () => {
    if (!addr) {
      return [];
    }
    const query = `{
      accounts(where:{id: "${addr.toLowerCase()}"}) {
        balances {
          value
        }
      }
    }`;
    const { accounts = [] } = await postQueryRice(query.toString(), {});
    return accounts;
  };

  return useQuery(`${QUERY_USER_RM}`, getUserMainnetRice);
};
