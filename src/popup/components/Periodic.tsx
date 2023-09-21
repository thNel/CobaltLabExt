import {Dispatch, ReactElement, SetStateAction} from "react";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import InputAdornment from '@mui/material/InputAdornment';
import Typography from "@mui/material/Typography";

export const Periodic = ({isInterval, setIsInterval, delay, setDelay}: {
  isInterval: boolean;
  setIsInterval: Dispatch<SetStateAction<boolean>>;
  delay: number;
  setDelay: Dispatch<SetStateAction<number>>;
}): ReactElement => {
  return (
    <Container
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FormGroup row>
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
          label={<Typography>Периодично?</Typography>}/>
        {isInterval
          ? <FormControlLabel
            control={
              <Input
                sx={{width: '100px'}}
                type={"number"}
                id="delay"
                value={delay}
                onChange={(event) => {
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
    </Container>
  )
}