import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Fab } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add as AddIcon } from '@material-ui/icons'

import GenerateRoutes from 'components/shared/GenerateRoutes'

// Route components
import RepositoryList from './RepositoryList'

/**
 * Offers via FAB the oppourtunity to create a new repo
 */
function AddRepository({ apiClient }) {
  const addRepoStyle = makeStyles((theme) => ({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      backgroundColor: theme.secondary.light
    },
    fabIcon: {
      color: theme.secondary.contrastText
    }
  }));

  const css = addRepoStyle();

  const {open, setOpen} = React.useState(false);

  return (
    <React.Fragment>
      <Fab aria-label='Add' className={css.fab}>
        <AddIcon className={css.fabIcon} />
      </Fab>
    </React.Fragment>
  );
}

const routes = [
  { path: '', exact: true, component: RepositoryList, key: 'display-repo-list'  },
  { path: '', exact: true, component: AddRepository,  key: 'add-repo-available' }
];

export default function Repositories({ apiClient, match }) {

  return (
    <React.Fragment>
      <GenerateRoutes basePath={match.path} routes={routes} addParams={{apiClient: apiClient}} />
    </React.Fragment>
  );

}
