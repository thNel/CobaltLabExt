import {Dispatch, ReactElement, SetStateAction} from "react";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import InputAdornment from '@mui/material/InputAdornment';

export const Periodic = ({isInterval, setIsInterval, delay, setDelay}: {
  isInterval: boolean;
  setIsInterval: Dispatch<SetStateAction<boolean>>;
  delay: number;
  setDelay: Dispatch<SetStateAction<number>>;
}): ReactElement => {
  return (
    <Container maxWidth={"xl"} className="card">
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              id='interval'
              checked={isInterval}
              onChange={(event) => setIsInterval(event.target.checked)}
            />
          }
          label={'Периодично?'}/>
        {isInterval
          ? <FormControlLabel
            control={
              <Input
                type={"number"}
                id="delay"
                value={delay}
                onChange={(event) => setDelay(+event.target.value)}
                endAdornment={<InputAdornment position="end">ms</InputAdornment>}
              />
            }
            label={"Интервал:\u00A0\u00A0"}
            labelPlacement={"start"}
          />
          : null}
      </FormGroup>
    </Container>
  )
}