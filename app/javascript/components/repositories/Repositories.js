import React from "react"

import Client from "api/FileRouterClient"

import MaterialTableIcons from "components/MaterialTableIcons"
import MaterialTable from "material-table"

export default function Repositories(props) {
  const {client} = props;

  function getRepositories(query) {
    const page = client
      .getRepositoryResource()
      .find(query);
  }

  return (
    <MaterialTable
      icons={MaterialTableIcons}
      title="Configured Repositories" />
  );
}
