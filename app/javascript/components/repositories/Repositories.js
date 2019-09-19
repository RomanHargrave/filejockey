import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Add as AddIcon } from '@material-ui/icons'

import CornerFAB from 'components/shared/CornerFAB'
import GenerateRoutes from 'components/shared/GenerateRoutes'

// Route components
import RepositoryList from './RepositoryList'

/**
 * Offers via FAB the oppourtunity to create a new repo
 */
function AddRepository({ apiClient }) {
  return (
    <CornerFAB>
      <AddIcon />
    </CornerFAB>
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
