import Web3 from 'web3';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import JSBI from 'jsbi';
import { toast } from '.';

import {
  CHAIN_CONFIGS,
  TOKEN_ADDRESS,
  RM_ADDRESS,
  DAO_ADDRESS,
  SYN_ADDRESS,
} from '../config/constants';

export type BigintIsh = JSBI | bigint | string;

let web3: any;
// const provider = new ethers.providers.Web3Provider(window.ethereum);

// // account is optional
// export function getProvider(): Web3Provider {
//   return provider;
// }

// // account is not optional
// export function getSigner(account?: string): JsonRpcSigner {
//   return getProvider().getSigner(account).connectUnchecked();
// }

// // account is optional
// export function getProviderOrSigner(account?: string): Web3Provider | JsonRpcSigner {
//   return account ? getSigner(account) : provider;
// }

export const isAddress = (value: any): string | false => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};

// // account is optional
// export const getContract = (address: string, ABI: any, account?: string) => {
//   // if (!isAddress(address) || address === AddressZero) {
//   //   throw Error(`Invalid 'address' parameter '${address}'.`);
//   // }
//   // return new Contract(address, ABI, getProviderOrSigner(account) as any)
//   // return new web3.eth.Contract(ABI, address);
// };

// account is optional
export const getContract = (address: string, ABI: any, account?: string) => {
  if (!address) return null;
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  if (!web3 || !web3.eth) return null;

  // return new Contract(address, ABI, getProviderOrSigner(account) as any)
  return new web3.eth.Contract(ABI, address);
};

export function getWbe3() {
  return web3;
}

export const parseBigintIsh = (bigintIsh: BigintIsh): JSBI => {
  /* eslint-disable */
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === 'bigint'
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh);
};

export const getRMContractAddr = () => {
  const networkId = +window.ethereum.chainId;
  return RM_ADDRESS[networkId];
};

export const getDAOContractAddr = () => {
  const networkId = +window.ethereum.chainId;
  return DAO_ADDRESS[networkId];
};

export const getPawnContractAddr = () => {
  const networkId = +window.ethereum.chainId;
  return DAO_ADDRESS[networkId];
};

export const getSynContractAddr = () => {
  const networkId = +window.ethereum.chainId;
  return SYN_ADDRESS[networkId];
};

export const initWeb3 = (provider: any) => {
  web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
};

export const getTokenContract = (token = '') => {
  token = token.toUpperCase();
  const tokenMap = TOKEN_ADDRESS[token];
  const networkId = +window.ethereum.chainId;
  if (tokenMap[networkId]) {
    return tokenMap[networkId];
  } else {
    console.log(tokenMap);
  }
};

export const getRMAddr = () => {
  const networkId = +window.ethereum.chainId;
  return RM_ADDRESS[networkId];
};

export const callContract = async (contract: any, method: string, args: any[], cbs?: any) => {
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  return contract.methods[method](...args).call({ from: address }, (error: any, result: any) => {
    if (error) {
      cbs && cbs.error && cbs.error(result);
      return Promise.reject(error);
    }
    cbs && cbs.error && cbs.error(result);
    return Promise.resolve(result);
  });
};

export const writeContract = async (contract: any, method: string, args: any[], cbs?: any) => {
  const address = await getCurrentAccountAddr();
  try {
    return contract.methods[method](...args)
      .send({ from: address })
      .then((receipt: any) => {
        cbs && cbs.receipt && cbs.receipt(receipt);
        // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });
  } catch (error) {
    cbs && cbs.error && cbs.error(error);
    // console.log(error, receipt);
    const toastProps = {
      title: '',
      desc: '',
      duration: 6000,
      status: 'info',
    };
    toastProps.title = 'Error';
    toastProps.desc = error.message;
    toastProps.status = 'error';
    toast(toastProps);
    // return Promise.reject(error);
  }

  // .on('transactionHash', function (hash: string) {
  //   cbs && cbs.ongoing && cbs.ongoing(hash);
  //   console.log(hash);
  // })
  // .on('receipt', function (receipt: any) {
  //   console.log(receipt);
  //   cbs && cbs.receipt && cbs.receipt(receipt);
  // })
  // .on('confirmation', function (confirmationNumber: number, receipt: any) {
  //   if (confirmationNumber === 1) {
  //     console.log(confirmationNumber, receipt);
  //     cbs && cbs.confirm && cbs.confirm(confirmationNumber, receipt);
  //   }
  //   return Promise.resolve(receipt);
  // })
  // .on('error', function (error: any, receipt: any) {
  //   cbs && cbs.error && cbs.error(error, receipt);
  //   // console.log(error, receipt);
  //   toastProps.title = 'Error';
  //   toastProps.desc = error.message;
  //   toastProps.status = 'error';
  //   toast(toastProps);
  //   // return Promise.reject(error);
  // });
};

export const getCurrentAccountAddr = async () => {
  if (!web3 || !web3.eth) return null;
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  return address;
};

export const switchNetwork = async (chainId: number) => {
  if (window.ethereum) {
    const chainConfig = CHAIN_CONFIGS[chainId];
    try {
      await window.ethereum?.request(chainConfig);
    } catch (error) {
      console.log(error);
    }
  }
};
