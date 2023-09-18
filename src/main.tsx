import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
import {createTheme, ThemeProvider} from "@mui/material";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

const RootElement = document.getElementById('root');

if (RootElement) {
  const root = createRoot(RootElement);

  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
          <App/>
        </DevSupport>
      </ThemeProvider>
    </StrictMode>
  )
} else {
  alert('Не задан #root элемент!');
}
