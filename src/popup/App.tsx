import Container from "@mui/material/Container";
import Main from "@/pages/Main";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useSnackbar} from 'notistack';
import ToastUtils from "@/utils/toastUtils";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Typography from "@mui/material/Typography";

const App = () => {
  const [currentPage, setCurrentPage] = useState<number>(JSON.parse(localStorage.getItem('react_selectedPage') ?? '0') ?? 0);
  const maxPage = 1;
  const pageNames = ['Рулетка'];
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const setPage = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('react_selectedPage', `${page}`);
  }

  useEffect(() => {
    ToastUtils.setSnackBar(enqueueSnackbar, closeSnackbar);
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'rgba(133,133,133,0.07)',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          justifySelf: 'start',
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
        alignItems: 'center',
        justifyContent: 'center',
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
          <Typography>{pageNames[currentPage] ?? 'Скоро появится!'}</Typography>
          <EastIcon
            sx={{
              cursor: 'pointer',
            }}
            className={currentPage < maxPage ? '' : 'invisible'}
            onClick={currentPage < maxPage ? () => setPage(currentPage + 1) : undefined}
          />
        </Box>
      </Box>
      <Container
        maxWidth='xl'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '50px',
        }}
      >
        {(() => {
          switch (currentPage) {
            case 0:
              return <Main/>;
          }
        })()}
      </Container>
    </>
  )
}

export default App;