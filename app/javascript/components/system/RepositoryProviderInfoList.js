/**
 * Lists repository providers and their details as returned by the API
 */
import React from "react"
import PropTypes from "prop-types"
import axios from "axios"

import {
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpandMoreIcon
} from '@material-ui/core'

import PopupSnackbar from '../shared/PopupSnackbar'
import RepositoryProviderInfo from './RepositoryProviderInfo'

export default function RepositoryProviderInfoList({ apiClient }) {

  const [providers, setProviders]   = React.useState([]);
  const [loadFailed, setLoadFailed] = React.useState(false);


  React.useEffect(() => {
    async function loadProviders() {
      try {
        const res = apiClient.getRepositoryProviderResource();
        setProviders(await res.find().getData());
      } catch (e) {
        console.log(e);
        setLoadFailed(true);
      }
    }

    loadProviders();
  }, []);

  return (
    <React.Fragment>
      <PopupSnackbar
        variant="error"
        open={loadFailed}
        handleDismiss={() => { setLoadFailed(false) }}
        message="Could not retrieve provider list"
      />
      {providers.map((p) => (
        <RepositoryProviderInfo
          key={p.id}
          name={p.name}
          providerId={p.id}
          version={p.version}
          features={p.features}
          parameters={p.parameters}
        />
      ))}
    </React.Fragment>
  );
}

RepositoryProviderInfoList.propTypes = {
  api: PropTypes.string
};
