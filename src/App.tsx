import {ReactElement, useState} from 'react'
import './App.css'
import {Bid} from "./Bid";
import {DoubleSettings} from "./DoubleSettings";
import {Periodic} from "./Periodic";
import {ControlButtons} from "./ControlButtons";
import {ErrorMessage} from "./ErrorMessage";

const App = (): ReactElement => {
  const [bid, setBid] = useState<[number, number, number, number, number]>([0, 0, 0, 0, 0]);
  const [isInterval, setIsInterval] = useState(false);
  const [isDouble, setIsDouble] = useState(false);
  const [delay, setDelay] = useState(200);
  const [bidLimit, setBidLimit] = useState(0);
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
      <ErrorMessage message={errorMessage} />
    </div>
  )
}

export default App;