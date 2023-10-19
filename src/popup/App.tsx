import Roulette from "@/pages/Roulette";
import {ReactElement, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useSnackbar} from 'notistack';
import ToastUtils from "@/utils/toastUtils";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Typography from "@mui/material/Typography";
import Shop from "@/pages/Shop";
import ACSettings from "@/pages/ACSettings";

const App = () => {
  const [currentPage, setCurrentPage] = useState<number>(JSON.parse(localStorage.getItem('react_selectedPage') ?? '0') ?? 0);
  const maxPage = 2; // начиная с 0
  const pageNames = ['Настройки автокликера', 'Рулетка', 'Цены в магазинах'];
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const setPage = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('react_selectedPage', `${page}`);
  }

  useEffect(() => {
    ToastUtils.setSnackBar(enqueueSnackbar, closeSnackbar);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: '1 1 auto',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(133,133,133,0.07)',
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
        }}
        className='dark-shadow-up'
      >
        <img
          src="/images/bigLogo.png"
          className="logo"
          alt="CobaltLab logo"
        />
      </Box>
      <Box sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(133,133,133,0.07)',
      }} className='dark-shadow-down'>
        <Box sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 2,
          paddingBottom: 1,
          paddingLeft: 1,
          paddingRight: 1,
        }}>
          <WestIcon
            sx={{
              cursor: 'pointer',
            }}
            className={currentPage > 0 ? '' : 'invisible'}
            onClick={currentPage > 0 ? () => setPage(currentPage - 1) : undefined}
          />
          <Typography variant={"h6"}>{pageNames[currentPage] ?? 'Скоро появится!'}</Typography>
          <EastIcon
            sx={{
              cursor: 'pointer',
            }}
            className={currentPage < maxPage ? '' : 'invisible'}
            onClick={currentPage < maxPage ? () => setPage(currentPage + 1) : undefined}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'start',
          padding: 0,
          maxHeight: '502px',
          overflow: 'auto',
        }}
      >
        {((): ReactElement => {
          switch (currentPage) {
            case 0:
              return <ACSettings/>;
            case 1:
              return <Roulette/>;
            case 2:
              return <Shop/>;
            default:
              return <Typography>Что-то пошло не так</Typography>;
          }
        })()}
      </Box>
    </Box>
  )
}

export default App;