import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import GenerateRoutes from 'components/shared/GenerateRoutes'

// Route components
import RepositoryList from './RepositoryList'

const routes = [
  { path: '', exact: true, component: RepositoryList, key: 'display-repo-list' }
];

export default function Repositories({ apiClient, match }) {

  return (
    <React.Fragment>
      <GenerateRoutes basePath={match.path} routes={routes} addParams={{apiClient: apiClient}} />
    </React.Fragment>
  );

}
