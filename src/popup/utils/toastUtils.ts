import {EnqueueSnackbar, SnackbarKey} from 'notistack';
import {ReactElement} from 'react';
import SnackbarCloseButton from "@/components/SnackBarCloseButton";

export const voidFn = () => {
};

class ToastUtils {
  private enqueueSnackbar: EnqueueSnackbar = () => 0;
  private closeSnackbar: (key?: SnackbarKey) => void = voidFn;
  private defaultOpts = {
    autoHideDuration: 3500,
    preventDuplicate: true,
    anchorOrigin: {vertical: 'top' as const, horizontal: 'right' as const},
    action: (snackbarKey: SnackbarKey) => SnackbarCloseButton({snackbarKey}),
  };

  setSnackBar(
    enqueueSnackbar: EnqueueSnackbar,
    closeSnackbar: (key?: SnackbarKey | undefined) => void
  ) {
    this.enqueueSnackbar = enqueueSnackbar;
    this.closeSnackbar = closeSnackbar;
  }

  success(msg: string | ReactElement, options = {}) {
    return this.toast(msg, {
      ...this.defaultOpts,
      ...options,
      variant: 'success',
    });
  }

  warning(msg: string | ReactElement, options = {}) {
    return this.toast(msg, {
      ...this.defaultOpts,
      ...options,
      variant: 'warning',
    });
  }

  info(msg: string | ReactElement, options = {}) {
    return this.toast(msg, {
      ...this.defaultOpts,
      ...options,
      variant: 'info',
    });
  }

  error(msg: string | ReactElement, options = {}) {
    return this.toast(msg, {
      ...this.defaultOpts,
      ...options,
      variant: 'error',
    });
  }

  toast(msg: string | ReactElement, options = {}) {
    const finalOptions = {
      variant: 'default' as const,
      ...this.defaultOpts,
      ...options,
    };
    return this.enqueueSnackbar(msg, {...finalOptions});
  }

  close(key?: SnackbarKey) {
    this.closeSnackbar(key);
  }
}

export default new ToastUtils();
