import axios from "axios";
import {Dispatch, SetStateAction} from "react";

export const bidHandler = ({setErrorMessage, setSum, setLastWin, bid, sum, setBid, isDouble}: {
  setErrorMessage: Dispatch<SetStateAction<string>>;
  bid: [number, number, number, number, number];
  setBid: Dispatch<SetStateAction<[number, number, number, number, number]>>;
  setLastWin: Dispatch<SetStateAction<number>>;
  sum: number;
  setSum: Dispatch<SetStateAction<number>>;
  isDouble: boolean;
}) => async () => {
  setErrorMessage('');

  try {
    const {data} = (await axios.post<{
      status: string;
      data: {
        winSum: string;
      };
      message: string
    }>(
      'https://cobaltlab.tech/api/cobaltGame/roulette/spin',
      {
        bet: bid,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ));
    if (data.status === 'success') {
      setLastWin(+data.data.winSum);
      setSum(sum - bid.reduce((acc, item) => acc + item, 0) + +data.data.winSum);
      if (+data.data.winSum < 2 && isDouble) {
        setBid(bid.map(item => item * 2) as typeof bid);
      }
    } else {
      setLastWin(0);
      setErrorMessage(data.message);
    }
  } catch (e: any) {
    setLastWin(0);
    setErrorMessage(String(e.message ?? e));
    return;
  }
}

export const intervalHandler = ({delay, setErrorMessage, setSum, setLastWin, bid, setBid, isDouble, setRunningInterval, setTimer, bidLimit, setCounter}: {
  setErrorMessage: Dispatch<SetStateAction<string>>;
  bid: [number, number, number, number, number];
  setBid: Dispatch<SetStateAction<[number, number, number, number, number]>>;
  setLastWin: Dispatch<SetStateAction<number>>;
  setSum: Dispatch<SetStateAction<number>>;
  isDouble: boolean;
  setRunningInterval: Dispatch<SetStateAction<boolean>>;
  setTimer: Dispatch<SetStateAction<ReturnType<typeof setInterval> | undefined>>;
  bidLimit: number;
  setCounter: Dispatch<SetStateAction<number>>;
  delay: number;
}) => () => {
  let localTimer = setInterval(() => {}, 100000);
  clearInterval(localTimer);
  const abortInterval = () => {
    clearInterval(localTimer);
    setRunningInterval(false);
    setCounter(0);
  };
  setErrorMessage('');
  setRunningInterval(true);
  let localCounter = 0;
  let localSum = 0;
  let localBid: typeof bid = [...bid];
  const startBid: typeof bid = [...bid];
  localTimer = setInterval(async () => {
    const bidSum = localBid.reduce((acc, item) => acc + item, 0);
    if (bidLimit > 0 && bidSum > bidLimit) {
      abortInterval();
      setLastWin(0);
      setErrorMessage('Превышен заданный лимит');
      return;
    }
    try {
      const {data} = await axios.post<{
        status: string;
        data: {
          winSum: string;
        };
        message: string
      }>(
        'https://cobaltlab.tech/api/cobaltGame/roulette/spin',
        {
          bet: bid,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      if (data.status === 'success') {
        localCounter += 1;
        localSum = localSum - bidSum + +data.data.winSum;
        setCounter(localCounter);
        setSum(localSum);
        setLastWin(+data.data.winSum);
        if (+data.data.winSum < 2 && isDouble) {
          localBid = localBid.map(item => item * 2) as typeof localBid;
          setBid(localBid);
        } else {
          localBid = [...startBid] as typeof startBid;
          setBid(startBid);
        }
      } else {
        abortInterval();
        setLastWin(0);
        setErrorMessage(data.message);
      }
    } catch (e: any) {
      abortInterval();
      setLastWin(0);
      setErrorMessage(String(e.message ?? e));
      return;
    }
  }, delay);
  setTimer(localTimer);
};