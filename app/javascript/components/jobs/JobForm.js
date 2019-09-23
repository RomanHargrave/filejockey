import React from "react"
import PropTypes from "prop-types"

import FileRouterClient from "api/FileRouterClient"

import { makeStyles } from "@material-ui/core/styles"

import {
  Grid,
  TextField
} from "@material-ui/core"

import ChipInput from "material-ui-chip-input"

const formStyle = makeStyles(theme => ({
  inputBase: {
    width: '100%'
  }
}));

export default function JobForm({ apiClient, onChange, formData }) {
  const css = formStyle();

  const [availableDestinations, setAvailableDestinations] = React.useState([]);
  const [availableSources,      setAvailableSources]      = React.useState([]);
  const [state,                 setState]                 = React.useState(formData);

  // Load sources & destinations
  React.useEffect(() => {
    async function loadSources() {
      const sources = await apiClient
        .getRepositoryResource()
        .find('', { isSource: true});

      sources.pageSize = -1; // Chip input doesn't support autocomplete functions...

      setAvailableSources(sources.data);
    }

    async function loadDestinations() {
      const destinations = await apiClient
        .getRepositoryResource()
        .find('', { isDestination: true });

      destinations.pageSize = -1;

      setAvailableDestinations(destinations.data);
    }

    loadSources();
    loadDestinations();
  }, []);

  const handleChange = name => event => setState({ ...state, [name]: event.target.value });

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TextField
          className={css.inputBase}
          label="Name"
          required={true}
          value={state.name || ""}
          onChange={handleChange('name')}
        />
      </Grid>
      <Grid item xs={6}>
        <ChipInput
          label="Source"
          placeholder="Search for a source"
          clearInputValueOnChange={true}
          dataSource={availableSources}
          dataSourceConfig={{ text: 'name', value: 'id' }}
        />

      </Grid>
    </Grid>
  );
}

JobForm.propTypes = {
  apiClient: PropTypes.instanceOf(FileRouterClient).isRequired,
  onChange: PropTypes.func,
  formData: PropTypes.object.isRequired
};

JobForm.defaultProps = {
  formData: {}
};
