/**
 * Re-usable snackbar that pops up bottom-center
 */
import React from "react"
import PropTypes from "prop-types"
import clsx from 'clsx'
import { makeStyles } from "@material-ui/core/styles"
import { amber, green } from "@material-ui/core/colors"

import {
  IconButton,
  Snackbar
} from "@material-ui/core"

import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from "@material-ui/icons"

const snackStyle = makeStyles(theme => ({
  closeButton: {
    padding: theme.spacing(0.5)
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    marginRight: theme.spacing(1)
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  success: {
    backgroundColor: green[600]
  }
}));

export default function PopupSnackbar(props) {
  const {autoHideDuration, message, action, variant, className, open, handleDismiss, ...other} = props;
  const css = snackStyle();

  const actionWithClose = [(
    <IconButton
      key="close"
      aria-label="close"
      color="inherit"
      className={css.closeButton}
      onClick={handleDismiss}
    >
      <CloseIcon />
    </IconButton>
  )].concat(action || []);


  return (
    <Snackbar
      className={clsx(css[variant, className || "info"])}
      ContentProps={{ 'aria-describedby': 'message-id' }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      autoHideDuration={autoHideDuration || 60000}
      message={message}
      action={actionWithClose}
      {...other}
    />
  );
}

PopupSnackbar.propTypes = {
  message: PropTypes.string.isRequired,
  action: PropTypes.array,
  autoHideDuration: PropTypes.number,
  open: PropTypes.bool.isRequired,
  handleDismiss: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['error', 'warning', 'info', 'success'])
};
