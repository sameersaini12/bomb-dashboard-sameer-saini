import React,{useCallback ,useMemo} from "react";
import {Grid} from '@material-ui/core';
import Bomb from "../../assets/img/bomb.png"
import BShares from "../../assets/img/bshares.png"
import BBond from "../../assets/img/bbond.png"
import BombBTCB from "../../assets/img/bomb-bitcoin-LP.png";
import BshareBNB from "../../assets/img/bshare-bnb-LP.png"
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import moment from 'moment';
import { Helmet } from "react-helmet";
import { createGlobalStyle } from 'styled-components';
import useBombStats from '../../hooks/useBombStats';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useBombFinance from '../../hooks/useBombFinance';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import useModal from '../../hooks/useModal';
import useBank from '../../hooks/useBank';
import useShareStats from '../../hooks/usebShareStats';
import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useWithdraw from '../../hooks/useWithdraw';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
import useTokenBalance from '../../hooks/useTokenBalance';
import useStatsForPool from '../../hooks/useStatsForPool';
import useStakedBalance from '../../hooks/useStakedBalance';
import useStake from '../../hooks/useStake';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import ProgressCountdown from "../Boardroom/components/ProgressCountdown";
import { getDisplayBalance } from '../../utils/formatBalance';
import DepositModal from '../Boardroom/components/DepositModal';
import WithdrawModal from '../Boardroom/components/WithdrawModal';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import {useTransactionAdder} from '../../state/transactions/hooks';
import CountUp from 'react-countup';
import { roundAndFormatNumber } from '../../0x';
import HomeImage from '../../assets/img/background.jpg';
import Page from "../../components/Page";
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import ExchangeModal from '../Bond/components/ExchangeModal';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;

const TITLE = 'bomb.money | Dashboard';

const Dashboard = () => {
    const bombFinance = useBombFinance();
    const bombStats = useBombStats();
    const bShareStats = usebShareStats();
    const tShareStats = useShareStats();
    const tBondStats = useBondStats();
    const currentEpoch = useCurrentEpoch();
    const { to } = useTreasuryAllocationTimes();
    const boardroomAPR = useFetchBoardroomAPR();
    const cashStat = useCashPriceInEstimatedTWAP();
    const TVL = useTotalValueLocked();
    const cashPrice = useCashPriceInLastTWAP();
    const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
    const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 
    const totalStaked = useTotalStakedOnBoardroom();
    const stakedBalance = useStakedBalanceOnBoardroom();
    const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
    const earnings = useEarningsOnBoardroom();
    const {onReward} = useHarvestFromBoardroom();
    const {onStake} = useStakeToBoardroom();
    const tokenBalance = useTokenBalance(bombFinance.BSHARE);
    const bondBalance = useTokenBalance(bombFinance?.BBOND);
    const addTransaction = useTransactionAdder();
    const isBondPurchasable = useMemo(() => Number(tBondStats?.tokenInFtm) < 1.01, [tBondStats]);
    const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
    const canWithdraw = useWithdrawCheck();
    const canClaimReward = useClaimRewardCheck();


    const bank_BombBTCB = useBank("BombBtcbLPBShareRewardPool");
    let statsOnPool_BombBTCB = useStatsForPool(bank_BombBTCB);
    const earnings_BombBTCB = useEarnings(bank_BombBTCB.contract, bank_BombBTCB.earnTokenName, bank_BombBTCB.poolId);
    const tokenName_BombBTCB = bank_BombBTCB.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
    const tokenStats_BombBTCB = bank_BombBTCB.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
    const tokenPriceInDollars_BombBTCB = useMemo(
        () => (tokenStats_BombBTCB ? Number(tokenStats_BombBTCB.priceInDollars).toFixed(2) : null),
        [tokenStats_BombBTCB],
    );
    const earnedInDollars_BombBTCB = (Number(tokenPriceInDollars_BombBTCB) * Number(getDisplayBalance(earnings_BombBTCB))).toFixed(2);
    const {onReward_BombBTCB} = useHarvest(bank_BombBTCB);
    const stakedBalance_BombBTCB = useStakedBalance(bank_BombBTCB.contract, bank_BombBTCB.poolId);
    const {onWithdraw_BombBTCB} = useWithdraw(bank_BombBTCB);
    const {onStake_BombBTCB} = useStake(bank_BombBTCB);
    const tokenBalance_BombBTCB = useTokenBalance(bank_BombBTCB.depositToken);
    const stakedTokenPriceInDollars_BombBTCB = useStakedTokenPriceInDollars(bank_BombBTCB.depositTokenName, bank_BombBTCB.depositToken);
    const tokenPriceInDollars_BombBTCB_staked = useMemo(
        () => (stakedTokenPriceInDollars_BombBTCB ? stakedTokenPriceInDollars_BombBTCB : null),
        [stakedTokenPriceInDollars_BombBTCB],
    );
    const earnedInDollars_BombBTCB_staked = (
        Number(tokenPriceInDollars_BombBTCB_staked) * Number(getDisplayBalance(stakedBalance_BombBTCB, bank_BombBTCB.depositToken.decimal))
    ).toFixed(2);
    const [onPresentWithdraw_BombBTCB, onDismissWithdraw_BombBTCB] = useModal(
        <WithdrawModal
          max={stakedBalance_BombBTCB}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onWithdraw_BombBTCB(amount);
            onDismissWithdraw_BombBTCB();
          }}
          tokenName={bank_BombBTCB.depositTokenName}
        />,
      );

      const [onPresentDeposit_BombBTCB, onDismissDeposit_BombBTCB] = useModal(
        <DepositModal
          max={tokenBalance}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onStake_BombBTCB(amount);
            onDismissDeposit_BombBTCB();
          }}
          tokenName={bank_BombBTCB.depositTokenName}
        />,
      );

    


    const bank_BshareBNB = useBank("BshareBnbLPBShareRewardPool");
    let statsOnPool_BshareBNB = useStatsForPool(bank_BshareBNB);
    const earnings_BshareBNB = useEarnings(bank_BshareBNB.contract, bank_BshareBNB.earnTokenName, bank_BshareBNB.poolId);
    const tokenName_BshareBNB = bank_BshareBNB.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
    const tokenStats_BshareBNB = bank_BshareBNB.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
    const tokenPriceInDollars_BshareBNB = useMemo(
        () => (tokenStats_BshareBNB ? Number(tokenStats_BshareBNB.priceInDollars).toFixed(2) : null),
        [tokenStats_BshareBNB],
    );
    const earnedInDollars_BshareBNB = (Number(tokenPriceInDollars_BshareBNB) * Number(getDisplayBalance(earnings_BshareBNB))).toFixed(2);
    const {onReward_BshareBNB} = useHarvest(bank_BshareBNB);
    const stakedBalance_BshareBNB = useStakedBalance(bank_BshareBNB.contract, bank_BshareBNB.poolId);
    const {onWithdraw_BshareBNB} = useWithdraw(bank_BshareBNB);
    const {onStake_BshareBNB} = useStake(bank_BshareBNB);
    const tokenBalance_BshareBNB = useTokenBalance(bank_BshareBNB.depositToken);
    const stakedTokenPriceInDollars_BshareBNB = useStakedTokenPriceInDollars(bank_BshareBNB.depositTokenName, bank_BshareBNB.depositToken);
    const tokenPriceInDollars_BshareBNB_staked = useMemo(
        () => (stakedTokenPriceInDollars_BshareBNB ? stakedTokenPriceInDollars_BshareBNB : null),
        [stakedTokenPriceInDollars_BshareBNB],
    );
    const earnedInDollars_BshareBNB_staked = (
        Number(tokenPriceInDollars_BshareBNB_staked) * Number(getDisplayBalance(stakedBalance_BshareBNB, bank_BshareBNB.depositToken.decimal))
    ).toFixed(2);
    const [onPresentWithdraw_BshareBNB, onDismissWithdraw_BshareBNB] = useModal(
        <WithdrawModal
          max={stakedBalance_BshareBNB}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onWithdraw_BshareBNB(amount);
            onDismissWithdraw_BshareBNB();
          }}
          tokenName={bank_BshareBNB.depositTokenName}
        />,
      );

      const [onPresentDeposit_BshareBNB, onDismissDeposit_BshareBNB] = useModal(
        <DepositModal
          max={tokenBalance}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onStake_BshareBNB(amount);
            onDismissDeposit_BshareBNB();
          }}
          tokenName={bank_BshareBNB.depositTokenName}
        />,
      );

      const handleBuyBonds = useCallback(
        async (amount : string ) => {
          const tx = await bombFinance.buyBonds(amount);
          addTransaction(tx, {
            summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
          });
        },
        [bombFinance, addTransaction],
      );


      const handleRedeemBonds = useCallback(
        async (amount :string) => {
          const tx = await bombFinance.redeemBonds(amount);
          addTransaction(tx, {summary: `Redeem ${amount} BBOND`});
        },
        [bombFinance, addTransaction],
      );

      const balance_BBond = useTokenBalance(bombFinance.BBOND);

      const [onPresent_Redeem, onDismiss_Redeem] = useModal(
        <ExchangeModal
          title="Redeem"
          description={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
          max={balance_BBond}
          onConfirm={(value) => {
            handleRedeemBonds(value);
            onDismiss_Redeem();
          }}
          action="Redeem"
          tokenName="BBOND"
        />,
      );

      const balance_Bomb = useTokenBalance(bombFinance.BOMB);
      const bondsPurchasable = useBondsPurchasable();

      const [onPresent_Purchase, onDismiss_Purchase] = useModal(
        <ExchangeModal
          title="Purchase"
          description={
            !isBondPurchasable
              ? 'BOMB is over peg'
              : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
          }
          max={balance_Bomb}
          onConfirm={(value) => {
            handleBuyBonds(value);
            onDismiss_Purchase();
          }}
          action="Purchase"
          tokenName="BOMB"
        />,
      );


    const tokenPriceInDollars = useMemo(
        () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
        [bombStats],
      );
    
    const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
    
    const tokenPriceInDollarsfun = useMemo(
        () =>
        stakedTokenPriceInDollars
            ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
            : null,
        [stakedTokenPriceInDollars, stakedBalance],
    );

    const bombPriceInDollars = useMemo(
        () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
        [bombStats],
      );
      const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
      const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
      const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);


      const bSharePriceInDollars = useMemo(
        () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
        [bShareStats],
      );
      const bSharePriceInBNB = useMemo(
        () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
        [bShareStats],
      );
      const bShareCirculatingSupply = useMemo(
        () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
        [bShareStats],
      );
      const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

    
      const tBondPriceInDollars = useMemo(
        () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
        [tBondStats],
      );
      const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
      const tBondCirculatingSupply = useMemo(
        () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
        [tBondStats],
      );
      const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

      const {onWithdraw} = useWithdrawFromBoardroom();

      const [onPresentWithdraw, onDismissWithdraw] = useModal(
        <WithdrawModal
          max={stakedBalance}
          onConfirm={(value) => {
            onWithdraw(value);
            onDismissWithdraw();
          }}
          tokenName={'BShare'}
        />,
      );

      const [onPresentDeposit, onDismissDeposit] = useModal(
        <DepositModal
          max={tokenBalance}
          onConfirm={(value) => {
            onStake(value);
            onDismissDeposit();
          }}
          tokenName={'BShare'}
        />,
      );




    return (
        <Page>
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <BackgroundImage />
            <Grid container spacing={3} style={{}}>
                <Grid container sm={12} style={{ background : "rgb(32, 37, 67,.5)" ,borderRadius: "5px",color : "white" , display : "flex" , justifyContent : "center" , padding: "10px"}}>
                    <span style={{fontWeight : "400" , fontSize : "22px" }}>Bomb Finanace Summary</span>
                    <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"94%"}} />
                    <Grid item xs={12} sm={5} style={{padding : "10px"}}>
                        <div >
                            <div>
                                <table style={{borderCollapse : "separate"  , padding: "10px" , borderSpacing : "1em 1em" }}>
                                    <tr style={{fontSize : "10px" , fontWeight: "400" , borderBottom : "0.5px solid lightgray" }}>
                                        <td></td>
                                        <td>Current Supply</td>
                                        <td>Total Supply</td>
                                        <td>Price</td>
                                    </tr>
                                    <tr style={{borderBottom : "0.5px solid lightgray" , marginTop: "20px"}}>
                                        <td style={{fontSize : "12px" , fontWeight : "400"}}>
                                            <div style={{display: "flex" , flexDirection : "row" , justifyContent : "center" , alignItems : "center"}}>
                                                <img alt="bomb" src={Bomb} style={{height : "20px" , width : "20px"}}
                                                />
                                                $BOMB
                                            </div>
                                        </td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>{roundAndFormatNumber(Number(bombCirculatingSupply), 2)}</td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>{roundAndFormatNumber(Number(bombTotalSupply), 2)}</td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>${bombPriceInDollars ? roundAndFormatNumber(Number(bombPriceInDollars), 2) : '-.--'}
                                        <br/>
                                            <div style={{fontSize : "11px" , fontWeight : "400"}}>
                                                {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                                            </div>
                                        </td>
                                        <td>
                                            <img alt="metamask" src={MetamaskFox} style={{height : "31.41" , width : "35px"}} /> 
                                        </td>
                                    </tr>
                                    <tr style={{borderBottom : "0.5px solid lightgray"}}>
                                        <td style={{fontSize : "12px" , fontWeight : "400"}}>
                                            <div style={{display: "flex" , flexDirection : "row" , justifyContent : "center" , alignItems : "center"}}>
                                                <img alt="bshares" src={BShares} style={{height : "20px" , width : "20px"}}
                                                />
                                                $BSHARES
                                            </div>
                                        </td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>{roundAndFormatNumber(Number(bShareCirculatingSupply), 2)}</td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>{roundAndFormatNumber(Number(bShareTotalSupply), 2)}</td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}
                                        <br />
                                        <div style={{fontSize : "11px" , fontWeight : "400"}}>
                                            {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                                        </div>
                                        </td>
                                        <td>
                                            <img alt="metamask" src={MetamaskFox} style={{height : "31.41" , width : "35px"}} />
                                        </td>
                                    </tr>
                                    <tr style={{borderBottom : "0.5px solid lightgray"}}>
                                        <td style={{fontSize : "12px" , fontWeight : "400"}}>
                                            <div style={{display: "flex" , flexDirection : "row" , justifyContent : "center" , alignItems : "center"}}>
                                                <img alt="bbond" src={BBond} style={{height : "20px" , width : "20px"}}
                                                />
                                                $BBOND
                                            </div>
                                        </td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>{roundAndFormatNumber(Number(tBondCirculatingSupply), 2)}</td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600"}}>{roundAndFormatNumber(Number(tBondTotalSupply), 2)}</td>
                                        <td style= {{fontSize : "14px" , fontWeight : "600" , textAlign : "center"}}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
                                        <br />
                                        <div style={{fontSize : "11px" , fontWeight : "400"}}>
                                            {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
                                        </div>
                                        </td>
                                        <td>
                                            <img alt="metamask" src={MetamaskFox} style={{height : "31.41" , width : "35px"}} />
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={2} style={{display : "flex" , flexDirection : "column" , alignItems: "center"}}>
                        <div style={{fontSize : "18px" , fontWeight : "600" , marginTop : "20px" }}>
                            Current Epoch
                        </div>
                        <div style={{fontSize : "34px" , fontWeight : "700"}}>
                            {Number(currentEpoch)}
                        </div>
                        <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"84%"}} />
                        <div style={{fontSize : "34px" , fontWeight : "700"}}>
                            <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                        </div>
                        <div style={{fontSize : "18px" , fontWeight : "600" , }}>
                            Next Epoch in 
                        </div>
                        <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"64%"}} />
                        <div style={{fontSize : "14px" , fontWeight : "300" , }}>
                            <span>Live TWAP: </span><span style={{color: "#00E8A2" }}>
                                {scalingFactor}
                            </span>
                        </div>
                        <div style={{fontSize : "14px" , fontWeight : "300" , }}>
                            <span>TVL: </span><span style={{color: "#00E8A2" , fontSize: "14px"}}>
                                <CountUp  end={Number(TVL)} separator="," prefix="$" />
                            </span>
                        </div>
                        <div style={{fontSize : "14px" , fontWeight : "300" , }}>
                            <span>Last Epoch TWAP: </span><span style={{color: "#00E8A2" }}>
                                {bondScale || '-'}
                            </span>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={5} >
                        <div style={{display : "flex" , flexDirection : "column" , alignItems: "center" , justifyContent: "center"}}>
                        <div style={{ borderRadius : "50%" , height : "145.83px" , width : "145.83px"  , marginBottom : "20px" , display : "flex" , flexDirection : "column", justifyContent : "center" , alignItems : "center" , borderRight : "10px solid #C3C5CB" , borderLeft : "10px solid #FC7871" , borderTop : "10px solid #78D15C" , borderBottom : "10px solid #00ADE8" }}>
                            <div style={{color: "white" , backgroundColor : "#23284B" , borderRadius : "50%" , height : "112px" , width : "112px" , display : "flex" , flexDirection : "column", justifyContent : "center" , alignItems : "center"}}>
                                <div>$10,451</div>
                                <div style={{color : "lightgreen"}}>+22%</div>
                            </div>
                        </div>
                        </div>
                            <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-evenly"}}>
                                <div style={{display: "flex" , flexDirection: "column"}}>
                                    <div style={{display : "flex" , justifyContent: "start" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bomb" src={Bomb} style={{height : "20px" , width : "20px"}} />
                                        </div>
                                        <div style={{fontSize : "12px" , fontWeight: "100" }}>Bomb: </div>
                                        <div style={{fontSize : "14px" , fontWeight: "500"}}>17%</div>  
                                    </div>
                                    <div style={{display : "flex" , justifyContent: "start" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bshares" src={BShares} style={{height : "20px" , width : "20px"}} />
                                        </div>
                                        <div style={{fontSize : "12px" , fontWeight: "100"}}>BShares: </div>
                                        <div style={{fontSize : "14px" , fontWeight: "500"}}>17%</div>  
                                    </div>
                                    <div style={{display : "flex" , justifyContent: "start" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bbond" src={BBond} style={{height : "20px" , width : "20px"}} />
                                        </div>
                                        <div style={{fontSize : "12px" , fontWeight: "100"}}>BBond: </div>
                                        <div style={{fontSize : "14px" , fontWeight: "500"}}>17%</div>  
                                    </div>
                                </div>
                                <div style={{display: "flex" , flexDirection: "column"}}>
                                    <div style={{display : "flex" , justifyContent: "start" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bombbtcb" src={BombBTCB} style={{height : "20px" , width : "20px"}} />
                                        </div>
                                        <div style={{fontSize : "12px" , fontWeight: "100"}}>Bomb-BTCB: </div>
                                        <div style={{fontSize : "14px" , fontWeight: "500"}}>17%</div>  
                                    </div>
                                    <div style={{display : "flex" , justifyContent: "start" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bsharebnb" src={BshareBNB} style={{height : "20px" , width : "20px"}} />
                                        </div>
                                        <div style={{fontSize : "12px" , fontWeight: "100"}}>Bshare-BNB: </div>
                                        <div style={{fontSize : "14px" , fontWeight: "500"}}>17%</div>  
                                    </div>
                                    <div style={{display : "flex" , justifyContent: "start" , alignItems : "center" }}>
                                        <div style={{borderRadius : "50%" , height: "14px" , width: "14px" , backgroundColor: "lightgray"}}>
                                        </div>
                                        <div style={{fontSize : "12px" , fontWeight: "100"}}> Others: </div>
                                        <div style={{fontSize : "14px" , fontWeight: "500"}}>17%</div>  
                                    </div>
                                </div>
                            </div>
                    </Grid>
                </Grid>

                <Grid container style={{marginTop: "20px"}}>
                    <Grid item sm={7}>
                        <div style={{display : "flex" , flexDirection : "column" }}>
                            <div style={{display : "flex" , justifyContent : "end" , marginBottom: "18px"}}>
                                <span style={{color : "#9EE6FF" , fontSize : "16px", fontWeight : "600" , textDecoration : "underline"}}>Read Investment Strategy {`>`} </span>
                            </div>
                            <div style={{marginBottom: "17px"}}>
                                <button style={{cursor: "pointer",height : "40px" , width: "100%" , backgroundColor : "rgb(0, 173, 232,0.5)" , border: "0.5px solid #E41A1A" }}><span style={{fontSize: "24px" , fontWeight : "700" ,color : "white"}}>Invest Now</span></button>
                            </div>
                            <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-between" , marginBottom: "17px"}}>
                                    <button style={{cursor: "pointer",width : "49%" , height : "40px" , backgroundColor : "lightgray" , border: "1px solid #728CDF" }}><span style={{fontSize : "18px" , fontWeight: "600"}}>Chat on Discord</span></button>
                                    <button style={{cursor: "pointer",width : "49%" , height : "40px" , backgroundColor : "lightgray" , border: "1px solid #728CDF" }}><span style={{fontSize : "18px" , fontWeight: "600"}}>Read Docs</span></button>
                            </div>
                            <div style={{ background : "rgb(32, 37, 67,.5)" ,borderRadius: "10px",color : "white" , display : "flex" , flexDirection : "column" , padding : "10px 30px 10px 30px" , border: "1px solid #728CDF"}}>                                    
                                <div style={{display : "flex", flexDirection : "row" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bshares" src={BShares} style={{height : "48px" , width : "48px"}} />
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , width: "100%"}}>
                                            <div style={{display :"flex" , flexDirection : "row" , alignItems : "center"}}>
                                                <div style={{fontSize : "22px" , fontWeight : "700" , marginRight : "6px"}}>BoardRoom</div>
                                                <div><button style={{backgroundColor : "rgba(0, 232, 162, 0.5)" ,backdropFilter: "blur(10px)", border: "none" , borderRadius: "3px" , height : "16px" , width : "101px"}}><span style={{fontSize: "12px" , fontWeight : "500" , color : "white"}}>Recommended</span></button></div>
                                            </div>
                                            <div style={{display: "flex" , flexDirection : "row" , width: "100%" , justifyContent: "space-between"}}>
                                                <div style={{fontSize : "15px" , fontWeight : "300"}}>
                                                    Stake BShare and earn BOMB every epoch
                                                </div>
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <span style={{ fontSize: '15px' , fontWeight: "300"}}>TVL:</span> <CountUp  end={Number(TVL)} separator="," prefix="$" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"96%"}} />
                                <div style={{display : "flex" , flexDirection : "column" ,}}>
                                    <div style={{display : "flex" , justifyContent : "end"}}>
                                        <span style={{fontSize : "14px" , fontWeight : "400"}}>Total stake: </span>
                                        <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} />
                                        <span style={{fontSize : "16px" , fontWeight : "500"}}>
                                            {Math.floor(Number(getDisplayBalance(totalStaked)))}
                                        </span>
                                    </div>
                                    <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-between"  , marginTop: "20px"}}>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Daily Returns:
                                            </div>
                                            <div style={{fontSize: "27px" , fontWeight : "500"}}>
                                                {(boardroomAPR/365).toFixed(2)}%
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Your Stake:
                                            </div>
                                            <div style={{fontSize: "18px" , fontWeight : "500"}}>
                                                <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} />
                                                {getDisplayBalance(stakedBalance)}
                                            </div>
                                            <div style={{fontSize: "14px" , fontWeight : "300"}}>
                                                ~ ${tokenPriceInDollarsfun}
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Earned:
                                            </div>
                                            <div style={{fontSize: "18px" , fontWeight : "500"}}>
                                                <img alt="bomb" src={Bomb} style={{height : "16px" , width : "16px"}} />
                                                {getDisplayBalance(earnings)}
                                            </div>
                                            <div style={{fontSize: "14px" , fontWeight : "300"}}>
                                                ~ ${earnedInDollars}
                                            </div>
                                        </div>
                                        <div style={{display :"flex" , flexDirection : "column"}}>
                                            <div style={{display :"flex" , flexDirection : "row" , marginBottom: "10px" }}>
                                                <button onClick={onPresentDeposit}  style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Deposit</span></button>
                                                <button onClick={onPresentWithdraw} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Withdraw</span></button>
                                            </div>
                                            <div>
                                            {(earnings.eq(0) ||  !canClaimReward) ?
                                                (<button style={{cursor: "pointer" , opacity : "0.5",width: "100%", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim Reward <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>)
                                                :
                                                (<button onClick={onReward} style={{cursor: "pointer",width: "100%", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim Reward <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>)
                                            }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={5} style={{}}>
                        <div style={{ height: "94%" , background : "rgb(32, 37, 67,.5)" ,borderRadius: "10px",color : "white" , display : "flex" , flexDirection : "column" , padding : "10px 30px 10px 30px" , border: "1px solid #728CDF" , marginLeft: "20px"}}>
                            Latest News
                        </div>
                    </Grid>
                </Grid>
                <Grid container sm={12} style={{marginTop: "20px"}}>
                            <div style={{ width: "100%", background : "rgb(32, 37, 67,.5)" ,borderRadius: "10px",color : "white" , display : "flex" , flexDirection : "column" , padding : "10px 30px 10px 30px" , border: "1px solid #728CDF"}}>   
                                <div style={{display: "flex" , flexDirection : "row" , justifyContent : "space-between" , marginBottom : "30px"}}>
                                    <div style={{display : "flex" , flexDirection : "column"}}>
                                        <div style={{fontSize: "22px" , fontWeight : "700"}}>
                                            Bond Farms
                                        </div>
                                        <div style={{fontSize: "14px" , fontWeight : "400"}}>
                                            Stake your LP tokens in our farms to start earning $BSHARE
                                        </div>
                                    </div>
                                    <div style={{display: "flex" , justifyContent : "center" , alignItems : "center"}}>
                                        <button onClick={()=> {onReward_BombBTCB(); onReward_BshareBNB();} } style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim All <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>
                                    </div>
                                </div>                                 
                                <div style={{display : "flex", flexDirection : "row" , alignItems : "center" , justifyContent : "space-between"}}>
                                        <div style={{display : "flex" , flexDirection : "row"}}>    
                                            <div>
                                                <img alt="bombbtcb" src={BombBTCB} style={{height : "48px" , width : "48px"}} />
                                            </div>
                                            <div style={{display :"flex" , flexDirection : "row" , alignItems : "center"}}>
                                                <div style={{fontSize : "22px" , fontWeight : "700" , marginRight : "6px"}}>BOMB-BTCB</div>
                                                <div><button style={{backgroundColor : "rgba(0, 232, 162, 0.5)" ,backdropFilter: "blur(10px)", border: "none" , borderRadius: "3px" , height : "16px" , width : "101px"}}><span style={{fontSize: "12px" , fontWeight : "500" , color : "white"}}>Recommended</span></button></div>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <span style={{ fontSize: '15px' , fontWeight: "300"}}>TVL:</span> ${statsOnPool_BombBTCB?.TVL}
                                        </div>
                                    </div>
                                <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"96%"}} />
                                <div style={{display : "flex" , flexDirection : "column" ,}}>
                                    <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-between"  , marginTop: "20px"}}>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Daily Returns:
                                            </div>
                                            <div style={{fontSize: "27px" , fontWeight : "500"}}>
                                                {bank_BombBTCB.closedForStaking ? '0.00' : statsOnPool_BombBTCB?.dailyAPR}%
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Your Stake:
                                            </div>
                                            <div style={{fontSize: "18px" , fontWeight : "500"}}>
                                                <img alt="bombbtcb" src={BombBTCB} style={{height : "16px" , width : "16px"}} />
                                                {getDisplayBalance(stakedBalance_BombBTCB, bank_BombBTCB.depositToken.decimal)}
                                            </div>
                                            <div style={{fontSize: "14px" , fontWeight : "300"}}>
                                            ≈ ${earnedInDollars_BombBTCB_staked}
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Earned:
                                            </div>
                                            <div style={{fontSize: "18px" , fontWeight : "500"}}>
                                                <img alt="bomb" src={Bomb} style={{height : "16px" , width : "16px"}} />
                                                {getDisplayBalance(earnings_BombBTCB)}
                                            </div>
                                            <div style={{fontSize: "14px" , fontWeight : "300"}}>
                                                ~ ${earnedInDollars_BombBTCB}
                                            </div>
                                        </div>
                                        <div style={{display :"flex" , flexDirection : "row"}}>
                                                <button onClick={onPresentDeposit_BombBTCB} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Deposit</span></button>
                                                <button onClick={onPresentWithdraw_BombBTCB} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Withdraw</span></button>
                                            {earnings_BombBTCB.eq(0) ? 
                                                <button disabled={earnings_BombBTCB.eq(0)}  style={{ opacity: "0.5", cursor: "pointer",width: "100%", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim Reward <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>
                                            :
                                            <button disabled={earnings_BombBTCB.eq(0)} onClick={onReward_BombBTCB} style={{ cursor: "pointer",width: "100%", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim Reward <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>
                                            }
                                            
                                        </div>
                                    </div>

                                </div>
                                <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"100%"}} />




                                {/*################################*/}
                                <div style={{display : "flex", flexDirection : "row" , alignItems : "center" , justifyContent : "space-between"}}>
                                        <div style={{display : "flex" , flexDirection : "row"}}>    
                                            <div>
                                                <img alt="bsharebnb" src={BshareBNB} style={{height : "48px" , width : "48px"}} />
                                            </div>
                                            <div style={{display :"flex" , flexDirection : "row" , alignItems : "center"}}>
                                                <div style={{fontSize : "22px" , fontWeight : "700" , marginRight : "6px"}}>BOMB-BTCB</div>
                                                <div><button style={{backgroundColor : "rgba(0, 232, 162, 0.5)" ,backdropFilter: "blur(10px)", border: "none" , borderRadius: "3px" , height : "16px" , width : "101px"}}><span style={{fontSize: "12px" , fontWeight : "500" , color : "white"}}>Recommended</span></button></div>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <span style={{ fontSize: '15px' , fontWeight: "300"}}>TVL:</span> ${statsOnPool_BshareBNB?.TVL}
                                        </div>
                                    </div>
                                <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"96%"}} />
                                <div style={{display : "flex" , flexDirection : "column" ,}}>
                                    <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-between"  , marginTop: "20px"}}>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Daily Returns:
                                            </div>
                                            <div style={{fontSize: "27px" , fontWeight : "500"}}>
                                            {bank_BshareBNB.closedForStaking ? '0.00' : statsOnPool_BshareBNB?.dailyAPR}%
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Your Stake:
                                            </div>
                                            <div style={{fontSize: "18px" , fontWeight : "500"}}>
                                                <img alt="bhsarebnb" src={BshareBNB} style={{height : "16px" , width : "16px"}} />
                                                {getDisplayBalance(stakedBalance_BombBTCB, bank_BombBTCB.depositToken.decimal)}
                                            </div>
                                            <div style={{fontSize: "14px" , fontWeight : "300"}}>
                                                ≈ ${earnedInDollars_BshareBNB_staked}
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Earned:
                                            </div>
                                            <div style={{fontSize: "18px" , fontWeight : "500"}}>
                                                <img alt="bomb" src={Bomb} style={{height : "16px" , width : "16px"}} />
                                                {getDisplayBalance(earnings_BshareBNB)}
                                            </div>
                                            <div style={{fontSize: "14px" , fontWeight : "300"}}>
                                                ~ ${earnedInDollars_BshareBNB}
                                            </div>
                                        </div>
                                        <div style={{display :"flex" , flexDirection : "row"}}>
                                                <button onClick={onPresentDeposit_BshareBNB} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Deposit</span></button>
                                                <button onClick={onPresentWithdraw_BshareBNB} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Withdraw</span></button>
                                            
                                                {earnings_BshareBNB.eq(0) ? 
                                                <button disabled={earnings_BshareBNB.eq(0)}  style={{ opacity: "0.5", cursor: "pointer",width: "100%", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim Reward <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>
                                            :
                                            <button disabled={earnings_BshareBNB.eq(0)} onClick={onReward_BshareBNB} style={{ cursor: "pointer",width: "100%", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Claim Reward <img alt="bshares" src={BShares} style={{height : "16px" , width : "16px"}} /></span></button>
                                            }                                        
                                            </div>
                                    </div>
                                </div>
                            </div>
                    </Grid>
                    <Grid container sm={12} style={{marginTop: "20px"}} >
                    <div style={{ background : "rgb(32, 37, 67,.5)" ,borderRadius: "10px",color : "white" , display : "flex" , flexDirection : "column" , padding : "10px 30px 10px 30px" , border: "1px solid #728CDF" , width: "100%"}}>                                    
                                <div style={{display : "flex", flexDirection : "row" , alignItems : "center"}}>
                                        <div>
                                            <img alt="bbond" src={BBond} style={{height : "48px" , width : "48px"}} />
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , width: "100%"}}>
                                            <div style={{display :"flex" , flexDirection : "row" , alignItems : "center"}}>
                                                <div style={{fontSize : "22px" , fontWeight : "700" , marginRight : "6px"}}>Bonds</div>
                                                <div><button style={{backgroundColor : "rgba(0, 232, 162, 0.5)" ,backdropFilter: "blur(10px)", border: "none" , borderRadius: "3px" , height : "16px" , width : "101px"}}><span style={{fontSize: "12px" , fontWeight : "500" , color : "white"}}>Recommended</span></button></div>
                                            </div>
                                                <div style={{fontSize : "15px" , fontWeight : "300"}}>
                                                    BBond can be purchased only on contraction period, when TWAP of BOMB is below 1
                                                </div>
                                        </div>
                                    </div>
                                <div style={{display : "flex" , flexDirection : "column" ,}}>
                                    <div style={{display : "flex" , flexDirection : "row" , justifyContent : "space-between"  , marginTop: "20px"}}>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200" , marginBottom: "15px"}}>
                                                Current Price: (Bomb)^2:
                                            </div>
                                            <div style={{fontSize: "27px" , fontWeight : "400"}}>
                                                BBond = 
                                                {(( BigInt(tBondStats?.tokenInFtm))/(BigInt(bondScale)))}
                                                {(Number(bondScale))}
                                                 BTCB
                                            </div>
                                        </div>
                                        <div style={{display : "flex" , flexDirection : "column" , justifyContent: "start"}}>
                                            <div style={{fontSize: "14px" , fontWeight : "200"}}>
                                                Available to Redeem:
                                            </div>
                                            <div style={{fontSize: "36px" , fontWeight : "500"}}>
                                                <img alt="bbond" src={BBond} style={{height : "39px" , width : "39px"}} />
                                                {getDisplayBalance(bondBalance)}
                                            </div>
                                        </div>
                                        <div style={{display :"flex" , flexDirection : "column" , width: "40%"}}>
                                            <div style={{display : "flex" , flexDirection : "row" , justifyContent: "space-between"}}>
                                                <div >
                                                    <div style={{fontSize: "16px" , fontWeight : "500"}}>Purchase BBond</div>
                                                    {!isBondPurchasable ? (<div style={{fontSize: "14px" , fontWeight : "100"}}>Bomb is over peg</div>) : (<div></div>)} 
                                                </div>
                                                <div>
                                                {(!isBondRedeemable || tBondStats) ? (<button onClick={onPresent_Purchase} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Purchase</span></button>) 
                                                : (<button style={{cursor: "pointer", opacity: "0.5",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Purchase</span></button>                                                )} 
                                                </div>
                                            </div>
                                            <hr style={{height:"1px" , borderWidth:"0" , color:"lightgray" , backgroundColor:"lightgray" , width :"100%"}} />
                                            <div style={{display: "flex" , flexDirection : "row" , justifyContent: "space-between"}}>
                                                <div style={{fontSize: "16px" , fontWeight : "500"}}>
                                                    Redeem Bomb
                                                </div>
                                                <div>
                                                {(!bondBalance.eq(0) || isBondRedeemable || !tBondStats) ? (<button onClick={onPresent_Redeem} style={{cursor: "pointer",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Redeem</span></button>) 
                                                : (<button style={{cursor: "pointer", opacity: "0.5",width: "107px", height: "28px" , borderRadius: "50px",border: "1px solid white" , background: "transparent" , marginRight: "5px"}}><span style={{color: "white" , fontSize : "15px" , fontWeight: "400"}}>Redeem</span></button>                                                )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                    </Grid>
            </Grid>




            
        </Page>
    );
}

export default Dashboard;