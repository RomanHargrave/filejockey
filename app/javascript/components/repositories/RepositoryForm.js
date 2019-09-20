import React from "react"
import PropTypes from "prop-types"

import { MuiForm as RJSForm } from "rjsf-material-ui"

import { Button } from "@material-ui/core"

export default function RepositoryForm({ apiClient, existing, onChange }) {

  const [providers,    setProviders] = React.useState([]);
  const [providerForm, setProviderForm] = React.useState({});
  const [hasError,     setHasError] = React.useState(false);
  const [errorMsg,     setErrorMsg] = React.useState("");

  React.useEffect(() => {
    async function loadProviders() {
      setProviders(
        await apiClient
          .getRepositoryProviderResource()
          .find()
          .getData()
      );

      setProviderForm(
        await apiClient
          .getRepositoryProviderResource()
          .getForm("info.hargrave.filerouter.repository.local")
      );
    }

    loadProviders();
  }, []);

  return (
    <React.Fragment>
      <RJSForm schema={providerForm} />
    </React.Fragment>
  );

}
