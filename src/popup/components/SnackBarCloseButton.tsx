import {SnackbarKey} from "notistack";
import {ReactElement} from "react";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import ToastUtils from "@/utils/toastUtils";

const SnackbarCloseButton = (
  {
    snackbarKey,
  }: {
    snackbarKey: SnackbarKey;
  }): ReactElement => (
  <IconButton onClick={() => ToastUtils.close(snackbarKey)}>
    <Close/>
  </IconButton>
);

export default SnackbarCloseButton;