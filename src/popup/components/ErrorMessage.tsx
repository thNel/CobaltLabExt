import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {ReactElement} from "react";
import Close from "@mui/icons-material/Close";

export const ErrorMessage = ({message}: {
  message: string
}): ReactElement => {
  return (
    <Container
      maxWidth='xl'
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography className={message.length > 0 ? 'error-message' : 'hidden'}>
        {message}
        <Close/>
      </Typography>
    </Container>
  )
}