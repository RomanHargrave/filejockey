import React from "react"

import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Card,
  Grid,
  Box
} from "@material-ui/core"

import RepositoryProviderInfoList from './RepositoryProviderInfoList'

function TabPanel(props) {
  return (
    <Box hidden={props.selectedIndex !== props.index} role="tabpanel">
      {props.children}
    </Box>
  );
}

export default function SystemInfo({ apiClient }) {
  const [activeTab, setActiveTab] = React.useState(0);

  function onTabSelect(e, newVal) {
    setActiveTab(newVal)
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={onTabSelect}>
          <Tab label="Repositories" />
        </Tabs>
      </AppBar>
      <TabPanel selectedIndex={activeTab} index={0}>
        <RepositoryProviderInfoList apiClient={apiClient} />
      </TabPanel>
    </React.Fragment>
  );
}
