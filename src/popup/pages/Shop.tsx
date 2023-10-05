import {ReactElement} from "react";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import Prices from "@/components/Prices";

const Shop = (): ReactElement => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flex: '1 1 auto',
        alignItems: 'start',
        justifyContent: 'center',
        paddingTop: '28px',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          maxHeight: '430px',
          overflow: 'auto',
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
    </Box>
  );
}

export default Shop;