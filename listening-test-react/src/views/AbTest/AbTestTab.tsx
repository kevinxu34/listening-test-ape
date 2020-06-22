import React from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme, Tooltip} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import Axios from "axios";
import {AudioAbDetail} from "./AudioAbDetail";
import TestResponseView from "../components/TestResponseView";
import {useParams} from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
    fabGreen: {
      color: theme.palette.common.white,
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
    },
  }),
);

export default function AbTestTab() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => setValue(newValue)
  const {id} = useParams();

  const handleDownload = () => {
    const uri = Axios.getUri({url: 'http://localhost:8888/api/response-download',
      params: {testType: 'abTest', testId: id}});
    // const uri = Axios.getUri({url: '/api/response-download', params: {testType: testType}})
    window.open(uri);
  }

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses"/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <AudioAbDetail/>}
        {value === 1 && <React.Fragment>
          <TestResponseView testType="abTest"/>
          <Tooltip title="Download All Responses For This Section">
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleDownload}>
              <Icon>get_app</Icon>
            </Fab>
          </Tooltip>
        </React.Fragment>}
      </Box>
    </React.Fragment>
  )
}