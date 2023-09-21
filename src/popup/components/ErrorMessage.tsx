import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {ReactElement} from "react";

export const ErrorMessage = ({message}: {
  message: string
}): ReactElement => {
  return (
    <Container maxWidth={"xl"}>
      <Typography className={message.length > 0 ? 'error-message' : 'hidden'}>
        {message}
      </Typography>
    </Container>
  )
}