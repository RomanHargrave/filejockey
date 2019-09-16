import React from "react"
import PropTypes from "prop-types"

import { makeStyles } from "@material-ui/core/styles"

import {
  AppBar as MUIAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core"

import { Menu as MenuIcon } from "@material-ui/icons"

const appBarStyle = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function AppBar(props) {
  const css = appBarStyle();

  return (
    <MUIAppBar className={props.classes.appBar} position="static">
      <Toolbar>
        <IconButton edge="start" className={css.menuButton} color="inherit" aria-label="menu" onClick={props.onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={css.title}>
          FileRouter
        </Typography>
      </Toolbar>
    </MUIAppBar>
  );
}
