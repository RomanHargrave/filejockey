import React from "react"
import PropTypes from "prop-types"

import { MuiForm as RJSForm } from "rjsf-material-ui"

import FileRouterClient from "api/FileRouterClient"

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"

const formStyle = makeStyles(theme => ({
  inputBase: {
    width: '100%'
  }
}));

/**
 * A form for creating/editing Repository instances.
 * The formData prop is designed to match the serialized rep of the Repository instance
 */
export default function RepositoryForm({ apiClient, onChange, lockProvider, formData }) {
  const css = formStyle();

  const [provider,     setProvider]     = React.useState(null);
  const [providers,    setProviders]    = React.useState([]);
  const [providerForm, setProviderForm] = React.useState({});
  const [state,        setState]        = React.useState(formData);
  const [canSend,      setCanSend]      = React.useState(true);
  const [canReceive,   setCanReceive]   = React.useState(true);

  // Load provider list on mount
  React.useEffect(() => {
    async function loadProviders() {
      setProviders(
        await apiClient
          .getRepositoryProviderResource()
          .find()
          .getData()
      );
    }

    loadProviders();
  }, []);

  // Based on the selected provider, enable or disable source/dest checkboxes
  React.useEffect(() => {
    async function loadForm(provider) {
      setProviderForm(await provider.getForm());
    }

    if (provider) {
      loadForm(provider);
      setCanSend(provider.features.includes('retrieve'));
      setCanReceive(provider.features.includes('submit'));

      // Also unset as appropriate
      setState({...state,
        is_source:      (state.is_source && canSend),
        is_destination: (state.is_destination && canReceive)
      });
    }
  }, [provider]);

  // Reload the provider form when the provider_id changes
  React.useEffect(() => {
    if (state.provider_id !== '') {
      setProvider(providers.find(p => p.id == state.provider_id));
    }
  }, [state.provider_id]);

  // Hit the onchange callback when state is altered
  React.useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  }, [state]);

  // Default component change handler
  const handleChange = name => event => {
    setState({...state, [name]: event.target.value});
  };

  // Component change handler for checkboxes
  const handleToggle = name => event => {
    setState({...state, [name]: event.target.checked});
  }

  // Plumb changes from provider subform in to the repository state
  function rjsfChanged(rjsf) {
    setState({...state, configuration: rjsf.formData});
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TextField
          className={css.inputBase}
          label="Name"
          required={true}
          value={state.name}
          onChange={handleChange('name')}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl disabled={lockProvider} className={css.inputBase}>
          <InputLabel htmlFor="provider-select">Repository Type</InputLabel>
          <Select
            required={true}
            value={state.provider_id}
            onChange={handleChange('provider_id')}
            inputProps={{ id: "provider-select" }}
          >
            {providers.map((p) => <MenuItem key={p.providerId} value={p.providerId}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          className={css.inputBase}
          label="Available as a Source"
          disabled={!canSend}
          control={
            <Checkbox
              checked={state.is_source}
              onChange={handleToggle('is_source')}
            />
          }
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          className={css.inputBase}
          label="Available as a Destination"
          disabled={!canReceive}
          control={
            <Checkbox
              checked={state.is_destination}
              onChange={handleToggle('is_destination')}
            />
          }
        />
      </Grid>
      <Grid item xs={12}>
        {/* This is a dynamically generated form. The provider will have a form schema which may be rendered by this component */}
        <RJSForm schema={providerForm} formData={state.configuration} onChange={rjsfChanged}>
          {/* Insert an empty fragment to replace the action buttons from the RJS form */}
          <React.Fragment />
        </RJSForm>
      </Grid>
    </Grid>
  );
}

RepositoryForm.propTypes = {
  lockProvider: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  apiClient: PropTypes.instanceOf(FileRouterClient).isRequired
};

RepositoryForm.defaultProps = {
  lockProvider: false,
  formData: {
    is_source: true,
    is_destination: true,
    provider_id: "",
    name: "",
    configuration: {}
  }
};
