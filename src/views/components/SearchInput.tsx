import React from 'react';
import clsx from 'clsx';
import {Paper, Input, Icon, Theme, createStyles, makeStyles} from '@material-ui/core';
import {observer} from "mobx-react";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  }
}));

export default observer(function SearchInput(props) {
  const { className, onChange, style, ...rest } = props;

  const classes = useStyles();

  return (
    <Paper{...rest} className={clsx(classes.root, className)} style={style}>
      <Icon>search</Icon>
      <Input {...rest}
        className={classes.input}
        disableUnderline
        onChange={onChange}
      />
    </Paper>
  );
});