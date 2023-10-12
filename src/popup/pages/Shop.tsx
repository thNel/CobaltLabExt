import {ReactElement} from "react";
import Grid from "@mui/material/Grid";
import Prices from "@/components/Prices";

const Shop = (): ReactElement => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        padding: 0,
        paddingTop: '28px',
        paddingLeft: '6px',
        alignItems: 'center',
        justifyContent: 'center',
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