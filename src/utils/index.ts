import Web3 from 'web3';
import { createStandaloneToast } from '@chakra-ui/react';
import moment from 'moment';
import Big from 'big.js';
import axios from 'axios';
import { ToastProps } from './types';
import { ChainId } from '../config/constants';

const tokenURI = process.env.REACT_APP_STORE_URI;
const metaPrefix = process.env.REACT_APP_METADATA_PREFIX;
const configURI = process.env.REACT_APP_CONFIG_URI;
const graphQLURI = process.env.REACT_APP_GRAPHQL_URI;
const openSeaURL = process.env.REACT_APP_OPENSEA_URI;

export const ETHERSCAN_PREFIXES: { [chainId: number]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  97: 'bsctestnet',
  100: '',
};

const toastStandalone = createStandaloneToast();
export const toast = ({
  title = '',
  desc = '',
  status = 'success',
  duration = 9000,
  isClosable = true,
}: ToastProps) => {
  toastStandalone({
    position: 'bottom-right',
    title,
    description: desc,
    status,
    duration,
    isClosable,
  });
};

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block',
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'block': {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

export const getNowTimestamp = () => {
  return new Date().getTime();
};

export const timeformater = (timestamp: number) => {
  const time = Number(timestamp);
  if (time === 0) return '';
  return moment(time * 1000).format('YYYY-MM-DD hh:mm:ss');
};

export const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatBalance = (amount = '0', decimal = 18) => {
  const num = Big(amount).div(10 ** decimal);
  return num.toFixed(2);
};

export const getMetadata = async (cardId: string, uri = tokenURI) => {
  try {
    const url = `${uri}/${metaPrefix}/${cardId}.json`;
    const req = await axios.get(url);
    const { data } = req;
    return {
      cardId,
      ...data,
    };
  } catch (error) {
    console.log('get metadata error: ', error);
    return {};
  }
};

export const queryAssets = async (owner: string, contract: string, limit = 50) => {
  try {
    const url = `${openSeaURL}assets`;
    const req = await axios.get(url, {
      params: { owner, asset_contract_address: contract, limit },
    });
    const { data } = req;
    return data;
  } catch (error) {
    console.log('get assets error: ', error);
    return {};
  }
};

export const getConfig = async (fileName: string, uri = configURI) => {
  try {
    const url = `${uri}/${fileName}.json`;
    const req = await axios.get(url);
    const { data } = req;
    return data;
  } catch (error) {
    console.log('get config file error: ', error);
    return {};
  }
};

export const postQuery = async (query: string, params = {}) => {
  try {
    const url = graphQLURI || '';
    const req = await axios.post(url, { query, variables: params });
    const { data } = req;
    return data.data;
  } catch (error) {
    console.log('get owner data error: ', error);
    return {};
  }
};
