import {Dispatch, ReactElement, SetStateAction} from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import InputAdornment from '@mui/material/InputAdornment';
import Typography from "@mui/material/Typography";
import ToastUtils from "@/utils/toastUtils";
import Box from "@mui/material/Box";

export const Periodic = ({isInterval, setIsInterval, delay, setDelay}: {
  isInterval: boolean;
  setIsInterval: Dispatch<SetStateAction<boolean>>;
  delay: number;
  setDelay: Dispatch<SetStateAction<number>>;
}): ReactElement => {
  return (
    <Box
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FormGroup sx={{flex: '1 1 auto', alignItems: 'center'}}>
        <FormControlLabel
          control={
            <Checkbox
              id='interval'
              checked={isInterval}
              onChange={(event) => {
                setIsInterval(event.target.checked);
                localStorage.setItem('react_isInterval', JSON.stringify(event.target.checked));
              }}
            />
          }
          label={<Typography>Автоставка</Typography>}/>
        {isInterval
          ? <FormControlLabel
            sx={{
              alignSelf: 'start',
            }}
            control={
              <Input
                sx={{width: '100px'}}
                inputProps={{
                  maxLength: 7
                }}
                value={delay}
                onChange={(event) => {
                  if (event.target.value.length === 0) {
                    setDelay(1);
                    localStorage.setItem('react_delay', '1');
                    return;
                  }
                  if (isNaN(+event.target.value) || event.target.value.includes('.') || event.target.value.includes(',') || +event.target.value < 1) {
                    ToastUtils.error('Только целые числа!');
                    return;
                  }
                  setDelay(+event.target.value);
                  localStorage.setItem('react_delay', JSON.stringify(event.target.value));
                }}
                endAdornment={<InputAdornment position="end">ms</InputAdornment>}
              />
            }
            label={<Typography>Интервал:&nbsp;&nbsp;</Typography>}
            labelPlacement={"start"}
          />
          : null}
      </FormGroup>
    </Box>
  )
}