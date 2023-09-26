import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import {Dispatch, ReactElement, SetStateAction} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToastUtils from "@/utils/toastUtils";

export const DoubleSettings = ({isDouble, setIsDouble, isSmartDouble, setIsSmartDouble, bidLimit, setBidLimit}: {
  isDouble: boolean;
  setIsDouble: Dispatch<SetStateAction<boolean>>;
  isSmartDouble: boolean;
  setIsSmartDouble: Dispatch<SetStateAction<boolean>>;
  bidLimit: number;
  setBidLimit: Dispatch<SetStateAction<number>>;
}): ReactElement => {
  return (
    <Box
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
      }}
    >
      <FormGroup sx={{flex: '1 1 auto', alignItems: 'center'}}>
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
          label={<Typography>Удваивать ставку при проигрыше</Typography>}/>
        {isDouble
          ? <>
            <FormControlLabel
              sx={{
                alignSelf: 'end',
              }}
              control={
                <Input
                  sx={{width: '140px'}}
                  inputProps={{
                    maxLength: 15
                  }}
                  value={bidLimit}
                  onChange={(event) => {
                    if (event.target.value.length === 0) {
                      setBidLimit(0);
                      localStorage.setItem('react_bidLimit', '0');
                      return;
                    }
                    if (isNaN(+event.target.value) || event.target.value.includes('.') || event.target.value.includes(',') || +event.target.value < 0) {
                      ToastUtils.error('Только целые числа!');
                      return;
                    }
                    setBidLimit(parseInt(event.target.value));
                    localStorage.setItem('react_bidLimit', JSON.stringify(parseInt(event.target.value)));
                  }}
                />}
              label={<Typography>Лимит суммы:&nbsp;&nbsp;</Typography>}
              labelPlacement={"start"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSmartDouble}
                  onChange={(event) => {
                    setIsSmartDouble(event.target.checked);
                    localStorage.setItem('react_isSmartDouble', JSON.stringify(event.target.checked));
                  }}
                />
              }
              label={<Typography>Smart</Typography>}/>
          </>
          : null}
      </FormGroup>
    </Box>
  )
}