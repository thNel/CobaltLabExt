import {ReactElement, useState} from 'react'
import './style.css'
import {Bid} from "../../components/Bid";
import {DoubleSettings} from "../../components/DoubleSettings";
import {Periodic} from "../../components/Periodic";
import {ControlButtons} from "../../components/ControlButtons";
import {ErrorMessage} from "../../components/ErrorMessage";

const Main = (): ReactElement => {
  const [bid, setBid] = useState<[number, number, number, number, number]>(
    JSON.parse(localStorage.getItem('react_bid') ?? '[0, 0, 0, 0, 0]') ?? [0, 0, 0, 0, 0]
  );
  const [isInterval, setIsInterval] = useState(localStorage.getItem('react_isInterval') === 'true' ?? false);
  const [isDouble, setIsDouble] = useState(localStorage.getItem('react_isDouble') === 'true' ?? false);
  const [delay, setDelay] = useState(JSON.parse(localStorage.getItem('react_delay') ?? '200') ?? 200);
  const [bidLimit, setBidLimit] = useState(JSON.parse(localStorage.getItem('react_bidLimit') ?? '0') ?? 0);
  const [sum, setSum] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastWin, setLastWin] = useState(0);


  return (
    <div className="App">
      <div>
        <img src="/images/bigLogo.png" className="logo" alt="CobaltLab logo"/>
      </div>
      <Bid bid={bid} setBid={setBid}/>
      <DoubleSettings isDouble={isDouble} setIsDouble={setIsDouble} bidLimit={bidLimit} setBidLimit={setBidLimit}/>
      <Periodic isInterval={isInterval} setIsInterval={setIsInterval} delay={delay} setDelay={setDelay}/>
      <ControlButtons setErrorMessage={setErrorMessage} bid={bid} setBid={setBid} setLastWin={setLastWin} sum={sum}
                      setSum={setSum} isDouble={isDouble} bidLimit={bidLimit} delay={delay} isInterval={isInterval}/>
      <div className='card'>
        <span>Выигрыш: {lastWin}</span>
        <span>Прибыль: {sum}</span>
      </div>
      <ErrorMessage message={errorMessage}/>
    </div>
  )
}

export default Main;