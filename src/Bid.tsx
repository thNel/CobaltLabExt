import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import {Dispatch, ReactElement, SetStateAction} from "react";

export const Bid = ({bid, setBid}: {
  bid: [number, number, number, number, number];
  setBid: Dispatch<SetStateAction<[number, number, number, number, number]>>;
}): ReactElement => {
  const multipliers: [string, string, string, string, string] = ['x1', 'x3', 'x5', 'x10', 'x20'];
  return (
    <Container maxWidth={"xl"} className={"card"}>
      <FormGroup>
        {bid.map((bidNow, index) =>
          <Box className={'bid-column'} key={index}>
            <FormControlLabel
              className={"bid-column"}
              control={
                <Input
                  type={"number"}
                  value={bidNow}
                  onChange={(event) =>
                    setBid(
                      bid.map(
                        (item, bidIndex) => index === bidIndex ? +event.target.value : item
                      ) as typeof bid
                    )}
                />
              }
              label={multipliers[index]}
            />
          </Box>
        )}
      </FormGroup>
    </Container>
  )
}