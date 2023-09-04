import {useState} from 'react'
import './App.css'

function App() {
  const [isInterval, setIsInterval] = useState(false);
  const [isDouble, setIsDouble] = useState(false);
  const [delay, setDelay] = useState(1000);
  const [sum, setSum] = useState(0);
  const [bid, setBid] = useState<[number, number, number, number, number]>([0, 0, 0, 0, 0]);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastWin, setLastWin] = useState(0);
  const [runningInterval, setRunningInterval] = useState(false);
  const multipliers = ['x1', 'x3', 'x5', 'x10', 'x20'];
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const [counter, setCounter] = useState(0);


  const abortInterval = () => {
    clearInterval(timer);
    setRunningInterval(false);
    setCounter(0);
  };
  const intervalHandler = () => {
    setErrorMessage('');
    setRunningInterval(true);
    let localCounter = 0;
    let localSum = 0;
    let localBid: typeof bid= [...bid];
    const startBid: typeof bid= [...bid];
    setTimer(setInterval(() => {
      fetch("https://cobaltlab.tech/api/cobaltGame/roulette/spin", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bet: localBid,
        }),
      }).then(response => response.json().then((data: any) => {
        if (data.status === 'success') {
          console.log(localBid, data.data);
          localCounter += 1;
          localSum = localSum - localBid.reduce((acc, item) => acc + item, 0) + +data.data.winSum;
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
          setLastWin(0);
          abortInterval();
          setErrorMessage(data.message);
        }
      }));
    }, delay));
  };

  const bidHandler = () => {
    setErrorMessage('');
    fetch("https://cobaltlab.tech/api/cobaltGame/roulette/spin", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bet: bid,
      }),
    }).then(response => response.json().then((data: any) => {
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
    }));
  }

  return (
    <div className="App">
      <div>
          <img src="/images/bigLogo.png" className="logo" alt="CobaltLab logo" />
      </div>
      <div className="card">
        {bid.map((bidNow, index) =>
          <div className={'bid-column'}>
            <span>{multipliers[index]}</span>
            <input
              type="number"
              defaultValue={bidNow}
              value={bidNow}
              onChange={(event) =>
                setBid(
                  bid.map(
                    (item, bidIndex) => index === bidIndex ? +event.target.value : item
                  ) as typeof bid
                )
              }
            />
          </div>
        )}
      </div>
      <div className="card">
        <div>
          <input
            type='checkbox'
            id='double'
            defaultChecked={isDouble}
            onChange={(event) => setIsDouble(event.target.checked)}
          />
          <label htmlFor='double'>Удваивать ставку при проигрыше?</label>
        </div>
      </div>
      <div className="card">
        <div>
          <input
            type='checkbox'
            id='interval'
            defaultChecked={isInterval}
            onChange={(event) => setIsInterval(event.target.checked)}
          />
          <label htmlFor='interval'>Периодично?</label>
        </div>
        {isInterval
          ? <div>
            <label htmlFor="delay">Интервал:&nbsp;</label>
            <input
              type="number"
              id="delay"
              defaultValue={delay}
              onChange={(event) => setDelay(+event.target.value)}
            />
            ms
          </div>
          : null}
      </div>
      <div className="card">
        {runningInterval
          ? <><button onClick={abortInterval}>
            Остановить
          </button> <span>Счётчик ставок: {counter}</span></>
          : <button onClick={isInterval ? intervalHandler : bidHandler}>
            Сделать ставку
          </button>
        }
      </div>
      <div className='card'>
        <span>Выигрыш: {lastWin}</span>
        <span>Прибыль: {sum}</span>
      </div>
      {errorMessage.length > 0
        ? <span className='error-message'>ERROR: {errorMessage}</span>
        : null
      }
    </div>
  )
}

export default App;