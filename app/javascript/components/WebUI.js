/**
 * FileRouter WebUI
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
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
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core"

import {
  Menu as MenuIcon,
  Timeline as TimelineIcon,
  SettingsApplications as SettingsIcon,
  SyncAlt as SyncIcon,
  Folder as FolderIcon,
  Event as EventIcon
} from "@material-ui/icons"

// Route components
import Dashboard     from "./Dashboard"
import Repositories  from "./repositories/Repositories"
import Jobs          from "./jobs/Jobs"
import Transmissions from "./transmissions/Transmissions"
import SystemInfo    from "./system/SystemInfo"

// API Client
import FileRouterClient from "api/FileRouterClient"

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
    flexShrink: 1
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
  menuButton: {
    marginRight: theme.spacing(2)
  },
  appBarTitle: {
    flexGow: 1
  },
  toolbar: theme.mixins.toolbar
}));

// Menu Items
const routes = [
  {
    key: "nav-dashboard",
    icon: (<TimelineIcon />),
    name: "Dashboard",
    path: "/",
    exact: true,
    component: Dashboard
  },
  {
    key: 'nav-repos',
    icon: (<FolderIcon />),
    name: "Repositories",
    path: "/repositories",
    exact: false,
    component: Repositories
  },
  {
    key: "nav-jobs",
    icon: (<EventIcon />),
    name: "Jobs",
    path: "/jobs",
    exact: false,
    component: Jobs
  },
  {
    key: "nav-transmissions",
    icon: (<SyncIcon />),
    name: "Transmissions",
    path: "/transmissions",
    exact: false,
    component: Transmissions
  },
  {
    key: "nav-system",
    icon: (<SettingsIcon />),
    name: "System",
    path: "/system",
    component: SystemInfo,
    exact: false
  }
];

export default function WebUI() {
  const css = appChromeStyle();

  const apiClient = new FileRouterClient();


  const menu = (
    <React.Fragment>
      {/* This is a hack to offset the starting position of the menu list by the height of the appbar */}
      <div className={css.toolbar} />
      <List>
        {routes.map((item) => (
          <ListItem key={item.key} component={Link} {...{ to: item.path }} button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );

  const bar = (
    <AppBar className={css.appBar}>
      <Toolbar>
        <Hidden smUp implementation="css">
          <IconButton edge="start" className={css.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6" className={css.appBarTitle}>
          FileRouter
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const content = routes.map((item) => (
    <Route
      key={item.key}
      path={item.path}
      exact={item.exact}
      render={() => <item.component apiClient={apiClient} />}
    />
  ));


  return (
    <Router>
      <div className={css.root}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {bar}
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
            {/* This is a hack to offset the starting position of the content to accomodate the appbar */}
            <div className={css.toolbar} />
            {content}
          </main>
        </ThemeProvider>
      </div>
    </Router>
  );
}

