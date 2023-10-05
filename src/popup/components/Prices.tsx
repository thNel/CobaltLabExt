import Box from "@mui/material/Box";
import {ReactElement, useState} from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import ToastUtils from "@/utils/toastUtils";
import {ShopInfo} from "@/types";
import {Refresh} from "@mui/icons-material";
import {Grid} from "@mui/material";
import {ResourceTypes} from "@/types/resourceTypes";

const Prices = ({title, code}: { title: string, code: string }): ReactElement => {
  const [prices, setPrices] = useState<ShopInfo[]>(JSON.parse(localStorage.getItem(`prices_${code}`) ?? '[]'));

  const refresh = async () => {
    try {
      const {data: {status, data, message}} = await axios.get<{
        status: string;
        data: ShopInfo[];
        message: string
      }>(`https://cobaltlab.tech/api/cobaltGame/${code}/shop`);

      if (status !== 'success') {
        ToastUtils.error(message);
        return;
      }
      setPrices(data);
      localStorage.setItem(`prices_${code}`, JSON.stringify(data));
    } catch (e: any) {
      console.log('catched', e);
      ToastUtils.error(String(e.message ?? e));
      return;
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <Typography>{title}</Typography>
      <Refresh sx={{cursor: 'pointer'}} onClick={refresh}/>
      <Grid container spacing={2}>
        {prices.map(item =>
          <Grid item xs={12} sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: '4px',
            justifyContent: 'center',
            flex: '1 1 auto',
          }}>
            <Typography>{item.to.quantity}</Typography>
            <img
              src={`/images/resources/${ResourceTypes[item.to.itemID]}.png`}
              alt={ResourceTypes[item.to.itemID]}
              height={30}
            />
            <Typography>за</Typography>
            <img
              src={`/images/resources/${ResourceTypes[item.from.itemID]}.png`}
              alt={ResourceTypes[item.from.itemID]}
              height={30}
            />
            <Typography>{item.from.quantity}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default Prices;