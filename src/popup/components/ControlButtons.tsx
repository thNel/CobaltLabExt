import {bidHandler, intervalHandler} from "@/utils/handlers";
import {Dispatch, ReactElement, SetStateAction, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export const ControlButtons = (
  {
    isInterval,
    setSum,
    sum,
    setLastWin,
    isDouble,
    delay,
    bid,
    bidLimit,
    setBid,
    setRunningInterval,
    runningInterval,
    setMaxWin,
    setScrap,
    maxWin
  }: {
    bid: [number, number, number, number, number];
    setBid: Dispatch<SetStateAction<[number, number, number, number, number]>>;
    setLastWin: Dispatch<SetStateAction<number>>;
    sum: number;
    setSum: Dispatch<SetStateAction<number>>;
    isDouble: boolean;
    bidLimit: number;
    delay: number;
    isInterval: boolean;
    setRunningInterval: Dispatch<SetStateAction<boolean>>;
    runningInterval: boolean;
    setScrap: Dispatch<SetStateAction<string>>;
    setMaxWin: Dispatch<SetStateAction<number>>;
    maxWin: number;
  }): ReactElement => {
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const [counter, setCounter] = useState(0);

  const abortInterval = () => {
    clearInterval(timer);
    setRunningInterval(false);
    setCounter(0);
  };

  useEffect(() => () => abortInterval(), [])

  return (
    <Container
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Button
        variant={"contained"}
        color={"secondary"}
        className={runningInterval ? '' : 'hidden'}
        onClick={abortInterval}
      >
        Остановить
      </Button>
      <span className={runningInterval ? '' : 'hidden'}>
        Счётчик ставок: {counter}
      </span>
      <Button
        variant={"contained"}
        className={runningInterval || isInterval ? 'hidden' : ''}
        onClick={bidHandler({bid, setBid, setSum, sum, setLastWin, isDouble, maxWin, setMaxWin, setScrap})}
      >
        Сделать ставку
      </Button>
      <Button
        variant={"contained"}
        className={runningInterval || !isInterval ? 'hidden' : ''}
        onClick={intervalHandler({
          delay,
          setRunningInterval,
          setCounter,
          setSum,
          setLastWin,
          isDouble,
          setBid,
          bid,
          bidLimit,
          setTimer,
          setScrap,
          maxWin,
          setMaxWin,
        })}
      >
        Сделать ставку
      </Button>
    </Container>
  )
}