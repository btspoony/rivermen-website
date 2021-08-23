import farmiland from './Farmiland.json';
import farm from './Farm.json';
import {
  getFarmilandContractAddr,
  getFarmContractAddr,
  getContract,
  callContract,
  writeContract,
} from '../../utils/web3';

export const farmilandApi = () => {
  const contractAddress = getFarmilandContractAddr();
  const contract = getContract(contractAddress, farmiland.abi);
  console.log(contract);

  const cardReleaseTime = async (poolId: number, cardId: number) => {
    const res = await callContract(contract, 'cardReleaseTime', [poolId, cardId]);
    return res;
  };

  const cardPoints = async (poolId: number, cardId: number) => {
    const res = await callContract(contract, 'cardPoints', [poolId, cardId]);
    return res;
  };

  const earned = async (address: string, poolId: number) => {
    const res = await callContract(contract, 'earned', [address, poolId]);
    return res;
  };

  return {
    ...contract,
    cardReleaseTime,
    cardPoints,
    earned,
  };
};

export const farmApi = () => {
  const contractAddress = getFarmContractAddr();
  const contract = getContract(contractAddress, farm.abi);

  return {
    ...contract,
  };
};

export default {};
