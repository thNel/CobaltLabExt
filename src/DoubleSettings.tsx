import {Checkbox, Container, FormControlLabel, FormGroup, Input} from "@mui/material";
import {Dispatch, ReactElement, SetStateAction} from "react";

export const DoubleSettings = ({isDouble, setIsDouble, bidLimit, setBidLimit}: {
  isDouble: boolean;
  setIsDouble: Dispatch<SetStateAction<boolean>>;
  bidLimit: number;
  setBidLimit: Dispatch<SetStateAction<number>>;
}): ReactElement => {
  return (
    <Container maxWidth={"xl"} className={"card"}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDouble}
              onChange={(event) => setIsDouble(event.target.checked)}
            />
          }
          label={'Удваивать ставку при проигрыше?'}/>
        {isDouble
          ? <FormControlLabel
            control={
              <Input
                type={"number"}
                id={"limit"}
                value={bidLimit}
                onChange={(event) => setBidLimit(+event.target.value)}
              />}
            label={'Лимит суммы:\u00A0\u00A0'}
            labelPlacement={"start"}
          />
          : null}
      </FormGroup>
    </Container>
  )
}