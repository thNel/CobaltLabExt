import Container from "@mui/material/Container";
import Main from "@/pages/main/Main";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {useSnackbar} from 'notistack';
import ToastUtils from "@/utils/toastUtils";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

const App = () => {
  const [currentPage, setCurrentPage] = useState<number>(JSON.parse(localStorage.getItem('react_selectedPage') ?? '0') ?? 0);
  const maxPage = 1;
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const setPage = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('react_selectedPage', `${page}`);
  }

  useEffect(() => {
    ToastUtils.setSnackBar(enqueueSnackbar, closeSnackbar);
  }, []);

  return (
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
      <Box component='img' src="/images/bigLogo.png" className="logo" alt="CobaltLab logo"/>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 58,
      }}>
        <WestIcon
          sx={{
            cursor: 'pointer',
          }}
          className={currentPage > 0 ? '' : 'invisible'}
          onClick={currentPage > 0 ? () => setPage(currentPage - 1) : undefined}
        />
        <EastIcon
          sx={{
            cursor: 'pointer',
          }}
          className={currentPage < maxPage ? '' : 'invisible'}
          onClick={currentPage < maxPage ? () => setPage(currentPage + 1) : undefined}
        />
      </Box>
      {(() => {
        switch (currentPage) {
          case 0:
            return <Main/>
        }
      })()}
    </Container>
  )
}

export default App;