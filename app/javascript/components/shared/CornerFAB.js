import React from "react"
import PropTypes from "prop-types"

import { Fab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const fabStyle = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    backgroundColor: theme.secondary.light,
    color: theme.secondary.contrastText,
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.secondary.main
    }
  }
}));

export default function CornerFAB({ children, onClick }) {
  const css = fabStyle();
  return (
    <Fab aria-label='Add' className={css.fab} onClick={onClick} >
      {children}
    </Fab>
  );
}

CornerFAB.defaultProps = {
  onClick: (x => x)
}
