import React from "react"
import PropTypes from "prop-types"

import FileRouterClient from "api/FileRouterClient"

import MaterialTableIcons from "components/MaterialTableIcons"
import MaterialTable from "material-table"

export default function JobList({ apiClient, tableRef }) {
  const columns = [
    { title: "Name",          field: "name" },
    { title: "Source",        field: "sourceName",        sorting: false },
    { title: "Destinations",  field: "destinationCount",  sorting: false }
  ];

  function getJobs(query) {
    return new Promise(async (resolve, reject) => {
      const pager = apiClient
        .getJobResource()
        .find(query.search);

      pager.page      = query.page;
      pager.pageSize  = query.pageSize;

      const data      = await pager.getData();
      const pageNum   = await pager.getCurrentPage();
      const pageCount = await pager.getPageCount();

      const rows = data.map((job) => ({
        name:             job.name,
        sourceName:       job.source.name,
        destinationCount: job.destinations.length,
        _model:           job
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
      title="Configured Jobs"
      data={getJobs}
      columns={columns}
    />
  );
}

JobList.propTypes = {
  apiClient: PropTypes.instanceOf(FileRouterClient).isRequired
}
