import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import {Dispatch, ReactElement, SetStateAction} from "react";
import Box from "@mui/material/Box";
import ToastUtils from "@/utils/toastUtils";

export const Bid = ({bid, setBid}: {
  bid: [number, number, number, number, number];
  setBid: Dispatch<SetStateAction<[number, number, number, number, number]>>;
}): ReactElement => {
  const multipliers: [string, string, string, string, string] = ['x1', 'x3', 'x5', 'x10', 'x20'];
  return (
    <Box
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap'
      }}
    >
      <FormGroup row>
        {bid.map((bidNow, index) =>
          <FormControlLabel
            key={index}
            control={
              <Input
                sx={{width: '64px'}}
                value={bidNow}
                inputProps={{
                  maxLength: 7
                }}
                onChange={(event) => {
                  if (event.target.value.length === 0) {
                    setBid(
                      bid.map(
                        (item, bidIndex) => index === bidIndex ? 0 : item
                      ) as typeof bid
                    );
                    localStorage.setItem('react_bid', JSON.stringify(bid.map(
                      (item, bidIndex) => index === bidIndex ? 0 : item
                    )));
                    return;
                  }
                  if (isNaN(+event.target.value) || event.target.value.includes('.') || event.target.value.includes(',') || +event.target.value < 0) {
                    ToastUtils.error('Только целые числа!');
                    return;
                  }
                  setBid(
                    bid.map(
                      (item, bidIndex) => index === bidIndex ? parseInt(event.target.value) : item
                    ) as typeof bid
                  );
                  localStorage.setItem('react_bid', JSON.stringify(bid.map(
                    (item, bidIndex) => index === bidIndex ? parseInt(event.target.value) : item
                  )));
                }}
              />
            }
            label={multipliers[index]}
            labelPlacement='bottom'
          />
        )}
      </FormGroup>
    </Box>
  )
}