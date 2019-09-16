import React from "react"
import PropTypes from "prop-types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Grid,
  Paper
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const componentStyle = makeStyles(t => ({
  group: {
    width: 100
  },

  preformat: {
    fontFamily: 'monospace'
  }
}));

export default function RepositoryProviderInfo(props) {
  const classes = componentStyle();

  return (
    <Grid container spacing={3} direction="column">
      {/* Basic Information */}
      <Grid item xs={1}>
        <Paper className={classes.group}>
          <Typography varient='h5'>
            Provider Information
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">{props.providerId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell align="right">{props.version.join('.')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Features</TableCell>
                <TableCell align="right">{props.features.join(', ')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={1}>
        {/* List of configuration options */}

        <Typography variant="h5">
          Parameters
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Default</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.parameters.map((p) => (
              <TableRow key={p.field}>
                <TableCell className={classes.preformat}>
                  {p.field}
                </TableCell>
                <TableCell>
                  {p.required}
                </TableCell>
                <TableCell className={classes.preformat}>
                  {p.default}
                </TableCell>
                <TableCell>
                  {p.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

RepositoryProviderInfo.propTypes = {
  name: PropTypes.string,
  providerId: PropTypes.string,
  version: PropTypes.array,
  features: PropTypes.array,
  parameters: PropTypes.array
};
