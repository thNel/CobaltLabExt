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
    <Container
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FormGroup row sx={{gap: '16px'}}>
        {bid.map((bidNow, index) =>
          <FormControlLabel
            key={index}
            control={
              <Input
                sx={{width: '60px'}}
                type={"number"}
                value={bidNow}
                onChange={(event) => {
                  setBid(
                    bid.map(
                      (item, bidIndex) => index === bidIndex ? +event.target.value : item
                    ) as typeof bid
                  );
                  localStorage.setItem('react_bid', JSON.stringify(bid.map(
                    (item, bidIndex) => index === bidIndex ? +event.target.value : item
                  )));
                }}
              />
            }
            label={multipliers[index]}
            labelPlacement='bottom'
          />
        )}
      </FormGroup>
    </Container>
  )
}