import axios from "axios";
import {Dispatch, SetStateAction} from "react";
import ToastUtils from "@/utils/toastUtils";
import {multipliers} from "@/store";
import {BidType} from "@/types";

export const bidHandler = (
  {
    setSum,
    setLastWin,
    bid,
    sum,
    setBid,
    isDouble,
    isSmartDouble,
    setScrap,
    setMaxWin,
    maxWin
  }: {
    bid: BidType;
    setBid: Dispatch<SetStateAction<BidType>>;
    setLastWin: Dispatch<SetStateAction<number>>;
    sum: number;
    setSum: Dispatch<SetStateAction<number>>;
    isDouble: boolean;
    isSmartDouble: boolean;
    setScrap: Dispatch<SetStateAction<string>>;
    setMaxWin: Dispatch<SetStateAction<number>>;
    maxWin: number;
  }) => async () => {
  setSum(0);
  setLastWin(0);
  try {
    const {data} = (await axios.post<{
      status: string;
      data: {
        winSum: number;
        scrap: number;
      };
      message: string
    }>(
      'https://cobaltlab.tech/api/cobaltGame/roulette/spin',
      {
        bet: bid.map(item => item === 0 ? null : Math.round(item)),
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ));
    if (data.status === 'success') {
      setScrap(data.data.scrap.toString());
      setMaxWin(data.data.winSum > maxWin ? data.data.winSum : maxWin);
      setLastWin(data.data.winSum);
      setSum(sum - bid.reduce((acc, item) => acc + Math.round(item), 0) + data.data.winSum);
      if (data.data.winSum < 2 && isDouble) {
        if (isSmartDouble) {
          setBid(bid.map((item, index) => item + (item / multipliers[index])) as BidType);
          localStorage.setItem('react_bid', JSON.stringify(bid.map((item, index) => item + (item / multipliers[index]))));
        } else {
          setBid(bid.map(item => item * 2) as BidType);
          localStorage.setItem('react_bid', JSON.stringify(bid.map(item => item * 2)));
        }
      }
    } else {
      setLastWin(0);
      ToastUtils.error(data.message);
    }
  } catch (e: any) {
    setLastWin(0);
    console.log('catched', e);
    ToastUtils.error(String(e.message ?? e));
    return;
  }
}

export const intervalHandler = (
  {
    delay,
    setSum,
    setLastWin,
    bid,
    setBid,
    isDouble,
    isSmartDouble,
    setRunningInterval,
    setTimer,
    bidLimit,
    setCounter,
    maxWin,
    setMaxWin,
    setScrap,
  }: {
    bid: BidType;
    setBid: Dispatch<SetStateAction<BidType>>;
    setLastWin: Dispatch<SetStateAction<number>>;
    setSum: Dispatch<SetStateAction<number>>;
    isDouble: boolean;
    isSmartDouble: boolean;
    setRunningInterval: Dispatch<SetStateAction<boolean>>;
    setTimer: Dispatch<SetStateAction<ReturnType<typeof setInterval> | undefined>>;
    bidLimit: number;
    setCounter: Dispatch<SetStateAction<number>>;
    delay: number;
    setScrap: Dispatch<SetStateAction<string>>;
    setMaxWin: Dispatch<SetStateAction<number>>;
    maxWin: number;
  }) => () => {
  let localTimer = setInterval(() => {
  }, 100000);
  clearInterval(localTimer);
  const abortInterval = () => {
    clearInterval(localTimer);
    setRunningInterval(false);
    setCounter(0);
  };
  setRunningInterval(true);
  let localCounter = 0;
  let localSum = 0;
  let localBid: typeof bid = [...bid];
  let localMaxWin = maxWin;
  const startBid: typeof bid = [...bid];
  setSum(localSum);
  setLastWin(0);
  localTimer = setInterval(async () => {
    const bidSum = localBid.reduce((acc, item) => acc + Math.round(item), 0);
    if (bidLimit > 0 && bidSum > bidLimit) {
      abortInterval();
      ToastUtils.error('Превышен заданный лимит');
      return;
    }
    try {
      const {data} = await axios.post<{
        status: string;
        data: {
          winSum: number;
          scrap: number;
        };
        message: string
      }>(
        'https://cobaltlab.tech/api/cobaltGame/roulette/spin',
        {
          bet: localBid.map(item => item === 0 ? null : Math.round(item)),
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      if (data.status === 'success') {
        setScrap(data.data.scrap.toString());
        localMaxWin = data.data.winSum > localMaxWin ? data.data.winSum : localMaxWin
        setMaxWin(localMaxWin);
        setLastWin(data.data.winSum);
        localCounter += 1;
        setCounter(localCounter);
        localSum = localSum - bidSum + data.data.winSum;
        setSum(localSum);
        if (data.data.winSum < 2 && isDouble) {
          if (isSmartDouble) {
            localBid = localBid.map((item, index) => item + (item / multipliers[index])) as BidType;
          } else {
            localBid = localBid.map(item => item * 2) as BidType;
          }
          setBid(localBid);
          localStorage.setItem('react_bid', JSON.stringify(localBid));
        } else {
          localBid = [...startBid] as typeof startBid;
          setBid(startBid);
          localStorage.setItem('react_bid', JSON.stringify(localBid));
        }
      } else {
        abortInterval();
        ToastUtils.error(data.message);
      }
    } catch (e: any) {
      abortInterval();
      ToastUtils.error(String(e.message ?? e));
      return;
    }
  }, delay);
  setTimer(localTimer);
};