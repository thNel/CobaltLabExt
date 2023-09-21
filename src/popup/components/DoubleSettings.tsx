import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import {Dispatch, ReactElement, SetStateAction} from "react";
import Typography from "@mui/material/Typography";

export const DoubleSettings = ({isDouble, setIsDouble, bidLimit, setBidLimit}: {
  isDouble: boolean;
  setIsDouble: Dispatch<SetStateAction<boolean>>;
  bidLimit: number;
  setBidLimit: Dispatch<SetStateAction<number>>;
}): ReactElement => {
  return (
    <Container
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
      }}
    >
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDouble}
              onChange={(event) => {
                setIsDouble(event.target.checked);
                localStorage.setItem('react_isDouble', JSON.stringify(event.target.checked));
              }}
            />
          }
          label={<Typography>Удваивать ставку при проигрыше?</Typography>}/>
        {isDouble
          ? <FormControlLabel
            control={
              <Input
                sx={{width: '70px'}}
                type={"number"}
                id={"limit"}
                value={bidLimit}
                onChange={(event) => {
                  setBidLimit(+event.target.value);
                  localStorage.setItem('react_bidLimit', JSON.stringify(event.target.value));
                }}
              />}
            label={<Typography>Лимит суммы:&nbsp;&nbsp;</Typography>}
            labelPlacement={"start"}
          />
          : null}
      </FormGroup>
    </Container>
  )
}