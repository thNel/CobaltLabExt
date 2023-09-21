import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Main from './pages/Main/'
import './main.css'
import {createTheme, ThemeProvider} from "@mui/material";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import {materialDarkThemeOptions} from "./themes/dark";

const theme = createTheme(materialDarkThemeOptions);

const RootElement = document.getElementById('root');

if (RootElement) {
  const root = createRoot(RootElement);

  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
          <Main/>
        </DevSupport>
      </ThemeProvider>
    </StrictMode>
  )
} else {
  alert('Не задан #root элемент!');
}
