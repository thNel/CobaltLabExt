import {ReactElement} from "react";
import Grid from "@mui/material/Grid";
import Prices from "@/components/Prices";

const Shop = (): ReactElement => {
  return (
    <Grid
      container
      sx={{
        paddingLeft: '6px',
        alignItems: 'start',
        justifyContent: 'center',
        padding: '0 !important',
        marginTop: '20px',
      }}
    >
      <Grid
        item
        xs={6}
        sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
      >
        <Prices title={'Город'} code={'city'}/>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
      >
        <Prices title={'Бандитка'} code={'bc'}/>
      </Grid>
    </Grid>
  );
}

export default Shop;