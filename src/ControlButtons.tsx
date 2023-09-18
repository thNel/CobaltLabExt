import {bidHandler, intervalHandler} from "./handlers";
import {Dispatch, ReactElement, SetStateAction, useState} from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export const ControlButtons = ({isInterval, setSum, sum, setLastWin, isDouble, setErrorMessage, delay, bid, bidLimit, setBid}: {
  setErrorMessage: Dispatch<SetStateAction<string>>;
  bid: [number, number, number, number, number];
  setBid: Dispatch<SetStateAction<[number, number, number, number, number]>>;
  setLastWin: Dispatch<SetStateAction<number>>;
  sum: number;
  setSum: Dispatch<SetStateAction<number>>;
  isDouble: boolean;
  bidLimit: number;
  delay: number;
  isInterval: boolean;
}): ReactElement => {
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const [runningInterval, setRunningInterval] = useState(false);
  const [counter, setCounter] = useState(0);

  const abortInterval = () => {
    clearInterval(timer);
    setRunningInterval(false);
    setCounter(0);
  };

  return (
    <Container className="card" maxWidth={"xl"}>
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
        onClick={bidHandler({bid, setBid, setSum, setErrorMessage, sum, setLastWin, isDouble})}
      >
        Сделать ставку
      </Button>
      <Button
        variant={"contained"}
        className={runningInterval || !isInterval ? 'hidden' : ''}
        onClick={intervalHandler({delay, setRunningInterval, setCounter, setSum, setErrorMessage, setLastWin, isDouble, setBid, bid, bidLimit, setTimer})}
      >
        Сделать ставку
      </Button>
    </Container>
  )
}