import {useCallback} from 'react';
import useBombFinance from './useBombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {Bank} from '../bomb-finance';

const useHarvest = (bank: Bank) => {
  const bombFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(
      bombFinance.harvest(bank.contract, bank.poolId),
      `Claim ${bank.earnTokenName} from ${bank.contract}`,
    );
  }, [bank, bombFinance, handleTransactionReceipt]);

  return {onReward: handleReward , onReward_BombBTCB : handleReward , onReward_BshareBNB : handleReward};
};

export default useHarvest;
