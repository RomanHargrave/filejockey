import React from "react"
import PropTypes from "prop-types"

/**
 * Insert CSS reset and define dark theme provider
 */
export default function MuiLoader(props) {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
      </React.Fragment>
    </ThemeProvider>
  );
}
