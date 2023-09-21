import {ReactElement, useState} from 'react'
import {Bid} from "@/components/Bid";
import {DoubleSettings} from "@/components/DoubleSettings";
import {Periodic} from "@/components/Periodic";
import {ControlButtons} from "@/components/ControlButtons";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Main = (): ReactElement => {
  const [bid, setBid] = useState<[number, number, number, number, number]>(
    JSON.parse(localStorage.getItem('react_bid') ?? '[0, 0, 0, 0, 0]') ?? [0, 0, 0, 0, 0]
  );
  const [isInterval, setIsInterval] = useState(localStorage.getItem('react_isInterval') === 'true' ?? false);
  const [isDouble, setIsDouble] = useState(localStorage.getItem('react_isDouble') === 'true' ?? false);
  const [delay, setDelay] = useState(JSON.parse(localStorage.getItem('react_delay') ?? '200') ?? 200);
  const [bidLimit, setBidLimit] = useState(JSON.parse(localStorage.getItem('react_bidLimit') ?? '0') ?? 0);
  const [sum, setSum] = useState(0);
  const [lastWin, setLastWin] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
      className='main-page'
    >
      <Bid bid={bid} setBid={setBid}/>
      <DoubleSettings isDouble={isDouble} setIsDouble={setIsDouble} bidLimit={bidLimit} setBidLimit={setBidLimit}/>
      <Periodic isInterval={isInterval} setIsInterval={setIsInterval} delay={delay} setDelay={setDelay}/>
      <ControlButtons bid={bid} setBid={setBid} setLastWin={setLastWin} sum={sum}
                      setSum={setSum} isDouble={isDouble} bidLimit={bidLimit} delay={delay} isInterval={isInterval}/>
      <Box
        maxWidth='xl'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <Typography>Выигрыш: {lastWin}</Typography>
        <Typography>Прибыль: {sum}</Typography>
      </Box>
    </Box>
  )
}

export default Main;