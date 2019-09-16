import React from "react"
import PropTypes from "prop-types"

import {
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpandMoreIcon
} from '@material-ui/core'

import RepositoryProviderInfo from './RepositoryProviderInfo'

class RepositoryProviderInfoList extends React.Component {
  render () {
    return (
      <Container>
        {this.props.providers.map((p) => (
          <ExpansionPanel key={p.provider_id}>
            <ExpansionPanelSummary
              aria-controls={p.provider_id + "_content"} >
              {p.name}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <RepositoryProviderInfo
                field={p.field}
                providerId={p.provider_id}
                version={p.version}
                features={p.features}
                parameters={p.parameters}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </Container>
    );
  }
}

RepositoryProviderInfoList.propTypes = {
  providers: PropTypes.array
};
export default RepositoryProviderInfoList
