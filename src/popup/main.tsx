import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './main.scss'
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import App from "@/App";
import {SnackbarProvider} from "notistack";

const theme = createTheme({palette: {mode: 'dark'}});

const RootElement = document.getElementById('root');

if (RootElement) {
  const root = createRoot(RootElement);

  root.render(
    <StrictMode>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <DevSupport ComponentPreviews={ComponentPreviews}
                      useInitialHook={useInitial}
          >
            <App/>
          </DevSupport>
        </ThemeProvider>
      </SnackbarProvider>
    </StrictMode>
  )
} else {
  alert('Не задан #root элемент!');
}
