import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import CssBaseline from "@material-ui/core/CssBaseline"
import { makeStyles } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from "@material-ui/core/styles"
import {
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core"

// Primary app components
import AppBar from './AppBar'

// Set up theme
const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#263238"
    }
  },
  primary: {
    light: "#4f5b62",
    main: "#263238",
    dark: "#000a12",
    contrastText: "#f0f0f0"
  },
  secondary: {
    light: "#7953d2",
    main: "#4527a0",
    dark: "#000070",
    contrastText: "#f0f0f0"
  }
});

// App chrome style - primarily AppBar/Drawer tweaks
const appChromeStyle = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuDrawer: {
    minWidth: 240,
    flexShrink: 1,
    zIndex: theme.zIndex.drawer
  },
  menuDrawerPaper: {
    minWidth: 240
  },
  content: {
    flexGrow: 1
  },
  root: {
    display: "flex"
  },
  toolbar: theme.mixins.toolbar
}));

export default function WebUI() {
  const css = appChromeStyle();
  const menu = (
    <React.Fragment>
      {/* This is a hack to offset the starting position of the menu list by the height of the appbar */}
      <div className={css.toolbar} />
      <List>
        <ListItem button>
          <ListItemText>Test</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );

  return (
    <div className={css.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar classes={{appBar: css.appBar}} zIndex={theme.zIndex.drawer + 1}/>
        {/* Hidden on xsDown - drawer is open */}
        <Hidden xsDown implementation="css">
          <Drawer variant="permanent" open className={css.menuDrawer} classes={{paper: css.menuDrawerPaper}}>
            {menu}
          </Drawer>
        </Hidden>
        {/* Hidden on small+ - drawer is retracted */}
        <Hidden smUp implementation="css">
          <Drawer className={css.menuDrawer} classes={{paper: css.menuDrawerPaper}}>
            {menu}
          </Drawer>
        </Hidden>
        <main className={css.content}>
        </main>
      </ThemeProvider>
    </div>
  );
}

