// export * from './queryClient';
import { useQuery } from 'react-query';
import { globalStore } from 'rekv';
import { pawnPoolApi, RMApi } from '../contracts';
import { getPawnContractAddr, getRMAddr, getRMContractAddr } from '../../utils/web3';
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

export const useAccountAssets = (addr: string, idx: number) => {
  const getUserAssets = async () => {
    if (!addr) {
      return [];
    }
    const address = [getRMContractAddr()];
    const { assets } = await queryAssets(addr, address[idx]);

    return assets;
  };

  return useQuery(`${QUERY_USER_RM}${addr}${idx}`, getUserAssets);
};
