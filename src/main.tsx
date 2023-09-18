import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

const RootElement = document.getElementById('root');

if (RootElement) {
  const root = ReactDOM.createRoot(RootElement);

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App/>
      </ThemeProvider>
    </React.StrictMode>
  )
} else {
  alert('Не задан #root элемент!');
}
