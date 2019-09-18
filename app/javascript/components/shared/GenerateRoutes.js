import React from "react"
import PropTypes from "prop-types"
import UrlJoin from "url-join"

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default function GenerateRoutes({ basePath, routes, addParams }) {
  const elements = routes.map((route) =>
    <Route
      key={route.key || route.path}
      path={UrlJoin(basePath, route.path)}
      exact={route.exact}
      render={(p) => <route.component {...addParams} {...p} />}
    />
  );

  return (
    <React.Fragment>
      {elements}
    </React.Fragment>
  );
}

GenerateRoutes.propTypes = {
  basePath: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  addParams: PropTypes.object.isRequired
}

GenerateRoutes.defaultProps = {
  basePath: '',
  addParams: {}
}
