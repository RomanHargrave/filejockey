/*
 * Exports an object with the recommended table icons for material-table
 * (C) 2019 Roman Hargrave
 */

import React from "react";
import { forwardRef } from 'react';

import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from "@material-ui/icons"

export default {
  Add:            forwardRef((p, r) => <AddBox {...p} ref={r} />),
  Check:          forwardRef((p, r) => <Check {...p} ref={r} />),
  Clear:          forwardRef((p, r) => <Clear {...p} ref={r} />),
  Delete:         forwardRef((p, r) => <DeleteOutline {...p} ref={r} />),
  DetailPanel:    forwardRef((p, r) => <ChevronRight {...p} ref={r} />),
  Edit:           forwardRef((p, r) => <Edit {...p} ref={r} />),
  Export:         forwardRef((p, r) => <SaveAlt {...p} ref={r} />),
  Filter:         forwardRef((p, r) => <FilterList {...p} ref={r} />),
  FirstPage:      forwardRef((p, r) => <FirstPage {...p} ref={r} />),
  LastPage:       forwardRef((p, r) => <LastPage {...p} ref={r} />),
  NextPage:       forwardRef((p, r) => <ChevronRight {...p} ref={r} />),
  PreviousPage:   forwardRef((p, r) => <ChevronLeft {...p} ref={r} />),
  ResetSearch:    forwardRef((p, r) => <Clear {...p} ref={r} />),
  Search:         forwardRef((p, r) => <Search {...p} ref={r} />),
  SortArrow:      forwardRef((p, r) => <ArrowUpward {...p} ref={r} />),
  ThirdStateCheck:forwardRef((p, r) => <Remove {...p} ref={r} />),
  ViewColumn:     forwardRef((p, r) => <ViewColumn {...p} ref={r} />)
};

