import pawnPool from './pawnPool.json';
import erc721 from './ERC721.json';
import {
  getRMContractAddr,
  getDAOContractAddr,
  getContract,
  callContract,
  writeContract,
} from '../../utils/web3';

export const pawnPoolApi = () => {
  const contractAddress = getDAOContractAddr();
  const contract = getContract(contractAddress, pawnPool);
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
    // ...contract,
    cardReleaseTime,
    cardPoints,
    earned,
  };
};

export const RMApi = (address = '') => {
  const contractAddress = address || getRMContractAddr();
  const contract = getContract(contractAddress, erc721);

  const getApproved = async (id: number) => {
    const res = await callContract(contract, 'getApproved', [id]);
    return res;
  };

  // approve token to dao contract
  const approve = async (to: string, id: number, cbs: any) => {
    const res = await writeContract(contract, 'approve', [to, id], cbs);
    return res;
  };

  // const approve = async (poolId: number, amount: number, cbs: any) => {
  //   const res = await writeContract(contract, 'stake', [poolId, amount], cbs);
  //   return res;
  // };

  return {
    // ...contract,
    approve,
    getApproved,
  };
};

export default {};
