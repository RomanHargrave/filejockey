import React from "react"

import Client from "api/FileRouterClient"

import MaterialTableIcons from "components/MaterialTableIcons"
import MaterialTable from "material-table"

export default function Repositories(props) {
  const { apiClient } = props;

  const columns = [
    { title: "Name", field: "name" }
  ];

  function getRepositories(query) {
    return new Promise(async (resolve, reject) => {
      const pager = apiClient
        .getRepositoryResource()
        .find(query.search);

      // Set the request page before executing
      pager.page      = query.page;
      pager.pageSize  = query.pageSize;

      // Execute the request
      const data      = await pager.getData();
      const pageNum   = await pager.getCurrentPage();
      const pageCount = await pager.getPageCount();

      const rows = data.map((repo) => {
        name: repo.name
      });

      resolve({
        data: rows,
        page: pageNum - 1,
        totalCount: pageCount - 1
      });
    });
  }

  return (
    <MaterialTable
      icons={MaterialTableIcons}
      title="Configured Repositories"
      data={getRepositories}
      columns={columns}
    />
  );
}
