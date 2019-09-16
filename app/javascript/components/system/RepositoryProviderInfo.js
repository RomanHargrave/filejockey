import React from "react"
import PropTypes from "prop-types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Box
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const componentStyle = makeStyles(theme => ({
  group: {
    width: 100
  },
  preformat: {
    fontFamily: 'monospace'
  },
  card: {
    margin: theme.spacing(1)
  },
  chipSet: {
    marginTop: theme.spacing(1)
  },
  chip: {
    marginRight: theme.spacing(0.5)
  },
  versionText: {
    float: 'right'
  },
  paramTable: {
    marginTop: theme.spacing(1)
  }
}));

export default function RepositoryProviderInfo(props) {
  const { name, providerId, version, features, parameters, ...other } = props;
  const css = componentStyle();

  const paramTable = (
    <Table size="small" className={css.paramTable}>
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
        {parameters.map((p) => (
          <TableRow key={p.field}>
            <TableCell className={css.preformat}>
              {p.field}
            </TableCell>
            <TableCell>
              {p.required}
            </TableCell>
            <TableCell>
              {p.type}
            </TableCell>
            <TableCell className={css.preformat}>
              {p.default}
            </TableCell>
            <TableCell>
              {p.description}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card className={css.card}>
      <CardContent>
        {/* Grid is used here to split the first line of the card b/t name and version */}
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
          </Grid>
          <Grid item xs={2} zeroMinWidth>
            <Typography className={css.versionText} variant="body2" component="span" color="textSecondary" align="right">
              {"v" + version.join(".")}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" component="span" className={css.preformat} color="textSecondary" gutterBottom>
          {providerId}
        </Typography>

        {/* Chips for feature names */}
        <Box className={css.chipSet}>
          {features.map(name => (<Chip size="small" className={css.chip} label={name} key={name} />))}
        </Box>

        {paramTable}
      </CardContent>
    </Card>
  );
}

RepositoryProviderInfo.propTypes = {
  name: PropTypes.string,
  providerId: PropTypes.string,
  version: PropTypes.array,
  features: PropTypes.array,
  parameters: PropTypes.array
};
