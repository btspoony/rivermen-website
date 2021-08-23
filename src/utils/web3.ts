import Web3 from 'web3';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import JSBI from 'jsbi';

import { ChainId } from '../config/constants';

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

// account is optional
export const getContract = (address: string, ABI: any, account?: string) => {
  // if (!isAddress(address) || address === AddressZero) {
  //   throw Error(`Invalid 'address' parameter '${address}'.`);
  // }
  // return new Contract(address, ABI, getProviderOrSigner(account) as any)
  // return new web3.eth.Contract(ABI, address);
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

// export const getFarmilandContractAddr = () => {
//   const networkId = +window.ethereum.chainId;
//   return FARMILAND[networkId];
// };

// export const getFarmContractAddr = () => {
//   const networkId = +window.ethereum.chainId;
//   return FARM[networkId];
// };

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
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  return contract.methods[method](...args)
    .send({ from: address })
    .on('transactionHash', function (hash: string) {
      cbs && cbs.ongoing && cbs.ongoing(hash);
      console.log(hash);
    })
    .on('receipt', function (receipt: any) {
      cbs && cbs.onBlock && cbs.onBlock(receipt);
      console.log(receipt);
    })
    .on('confirmation', function (confirmationNumber: number, receipt: any) {
      cbs && cbs.confirm && cbs.confirm(confirmationNumber, receipt);
      console.log(confirmationNumber, receipt);
      return Promise.resolve(receipt);
    })
    .on('error', function (error: any, receipt: any) {
      cbs && cbs.error && cbs.error(error, receipt);
      console.log(error, receipt);
      return Promise.reject(error);
    });
};
