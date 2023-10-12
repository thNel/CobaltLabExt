import {BaseVariant, EnqueueSnackbar, OptionsWithExtraProps, SnackbarKey} from 'notistack';
import {ReactElement} from 'react';
import SnackbarCloseButton from "@/components/SnackBarCloseButton";

export const voidFn = () => {
};

class ToastUtils {
  private enqueueSnackbar: EnqueueSnackbar = () => 0;
  private closeSnackbar: (key?: SnackbarKey) => void = voidFn;
  private defaultOpts: OptionsWithExtraProps<BaseVariant> = {
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

  success(msg: string | ReactElement, options: OptionsWithExtraProps<'success'> = {}) {
    return this.toast(msg, {
      ...options,
      variant: 'success',
    });
  }

  warning(msg: string | ReactElement, options: OptionsWithExtraProps<'warning'> = {}) {
    return this.toast(msg, {
      ...options,
      variant: 'warning',
    });
  }

  info(msg: string | ReactElement, options: OptionsWithExtraProps<'info'> = {}) {
    return this.toast(msg, {
      ...options,
      variant: 'info',
    });
  }

  error(msg: string | ReactElement, options: OptionsWithExtraProps<'error'> = {}) {
    return this.toast(msg, {
      ...options,
      variant: 'error',
    });
  }

  toast(msg: string | ReactElement, options: OptionsWithExtraProps<BaseVariant> = {}) {
    const finalOptions: OptionsWithExtraProps<BaseVariant> = {
      variant: 'default',
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
