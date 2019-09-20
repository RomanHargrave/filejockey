import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@material-ui/core"

import { Add as AddIcon } from '@material-ui/icons'

import CornerFAB from 'components/shared/CornerFAB'
import GenerateRoutes from 'components/shared/GenerateRoutes'
import RepositoryForm from './RepositoryForm'

// Route components
import RepositoryList from './RepositoryList'

// API
import Repository from 'api/Repository'

/**
 * Offers via FAB the oppourtunity to create a new repo
 */
function Overview({ apiClient }) {
  const [open,      setOpen]      = React.useState(false);
  const [formData,  setFormData]  = React.useState({});
  const listTableRef              = React.createRef();

  function onDismiss() {
    setOpen(false);
    setFormData({});
  }

  function onSubmit() {
    async function _submit() {
      const newRepo = new Repository({
        resource: apiClient.getRepositoryResource(),
        rep: formData
      });

      await newRepo.save();
      console.log(newRepo);

      listTableRef.current.onQueryChange();
      setOpen(false);
      setFormData({});
    }

    _submit();
  }

  return (
    <React.Fragment>
      {/* Table Listing Repositories */}
      <RepositoryList apiClient={apiClient} tableRef={listTableRef} />

      {/* Dialog and FAB to Create/Edit */}
      <Dialog open={open} aria-labelledby="add-repo-title">
        <DialogTitle id="add-repo-title">Create Repository</DialogTitle>
        <DialogContent>
          <RepositoryForm apiClient={apiClient} onChange={(s) => setFormData(s)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDismiss}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Repository
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
  { path: '', exact: true, component: Overview,  key: 'repos-landing' },
];

export default function Repositories({ apiClient, match }) {

  return <GenerateRoutes basePath={match.path} routes={routes} addParams={{apiClient: apiClient}} />;

}
