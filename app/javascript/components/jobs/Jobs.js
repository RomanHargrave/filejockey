import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@material-ui/core"

import { Add as AddIcon } from "@material-ui/icons"

import CornerFAB from "components/shared/CornerFAB"
import GenerateRoutes from "components/shared/GenerateRoutes"

// Route Components
import JobForm from "./JobForm"
import JobList from "./JobList"

// API
import Job from "api/Job"

function Overview({ apiClient }) {

  const [open,     setOpen]     = React.useState(true);
  const [formData, setFormData] = React.useState({});
  const listTableRef            = React.createRef();

  function onDismiss() {
    setOpen(false);
    setFormData({});
  }

  function onSubmit() {
    async function _submit() {
      const newJob = new Job({
        resource: apiClient.getJobResource(),
        rep: formData
      });

      await newJob.save();

      listTableRef.current.onQueryChange();
      setOpen(false);
      setFormData({});
    }

    _onSubmit();
  }

  return (
    <React.Fragment>
      {/* Table Listing Jobs */}
      <JobList apiClient={apiClient} tableRef={listTableRef} />

      {/* Dialog and FAB to Create */}
      <Dialog open={open} aria-labelledby="add-job-title">
        <DialogTitle id="add-job-title">Create Job</DialogTitle>

        <DialogContent>
          <JobForm apiClient={apiClient} formData={formData} />
        </DialogContent>

        <DialogActions>
          <Button onClick={onDismiss}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Job
          </Button>
        </DialogActions>
      </Dialog>
      <CornerFAB onClick={() => setOpen(true)}>
        <AddIcon />
      </CornerFAB>
    </React.Fragment>
  );
}

const routes = [
  { path: "", exact: true, component: Overview, key: "jobs-landing" }
]

export default function Jobs({ apiClient, match }) {
  return <GenerateRoutes basePath={match.path} routes={routes} addParams={{apiClient: apiClient}} />
}
