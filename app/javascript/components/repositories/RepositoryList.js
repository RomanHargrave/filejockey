import React from "react"

import MaterialTableIcons from "components/MaterialTableIcons"
import MaterialTable from "material-table"

export default function RepositoryList({ apiClient, tableRef }) {
  const columns = [
    { title: "Name",        field: "name" },
    { title: "Source",      field: "is_source" },
    { title: "Destination", field: "is_destination" },
    { title: "Provider",    field: "provider_id" }
  ];

  function getRepositories(query) {
    return new Promise(async (resolve, reject) => {
      const orderParams = {};
      if (query.orderBy) {
        orderParams.orderBy = query.orderBy.field;
        orderParams.order   = query.orderDirection;
      }

      const pager = apiClient
        .getRepositoryResource()
        .find(query.search, orderParams);

      // Set the request page before executing
      pager.page      = query.page;
      pager.pageSize  = query.pageSize;

      // Execute the request
      const data      = await pager.getData();
      const pageNum   = await pager.getCurrentPage();
      const pageCount = await pager.getPageCount();

      const rows = data.map((repo) => ({
        name:           repo.name,
        is_source:      repo.isSource ? 'Yes' : 'No',
        is_destination: repo.isDestination ? 'Yes' : 'No',
        provider_id:    repo.providerId,
        _model:         repo
      }));

      resolve({
        data: rows,
        page: pageNum - 1,
        totalCount: pageCount - 1
      });
    });
  }

  return (
    <MaterialTable
      tableRef={tableRef}
      icons={MaterialTableIcons}
      title="Configured Repositories"
      data={getRepositories}
      columns={columns}
    />
  );
}
