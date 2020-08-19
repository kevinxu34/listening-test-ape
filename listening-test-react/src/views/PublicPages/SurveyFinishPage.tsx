import React, {useContext} from "react";
import {Box, Button, createStyles, Grid, Icon, Link, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {GlobalDialog} from "../../shared/ReactContexts";
import Axios from "axios";
import {useSimpleAlert} from "../../shared/components/UseSimpleAlert";
import {useLocation, useParams} from "react-router";
import {getCurrentHost} from "../../shared/ReactTools";

const useStyles = makeStyles((theme: Theme) => createStyles({
  paragraph: {marginBottom: theme.spacing(4)},
  actions: {textAlign: 'center', marginTop: theme.spacing(4)}
}))

export default function SurveyFinishPage() {
  const classes = useStyles();
  const openDialog = useContext(GlobalDialog);
  const [alert, setMessage] = useSimpleAlert();
  const location = useLocation();
  // If we got state, we show link, otherwise hid the confirm
  const [id, testUrl] = location.search.replace('?', '').split('&');
  const deletionLink = `${getCurrentHost()}/task/finish?${id}&${testUrl}`;

  const handleConfirmClick = () => openDialog('This action will delete your response permanently', 'Are you sure?', undefined,
    () => Axios.delete('/api/responses', {params: {'_id': id, 'testType': testUrl}}).then(
      () => setMessage('success', 'Your data has been deleted successfully'),
      res => setMessage('error', res.response.data)
    )
  );

  return <Box mt={8}>
    <Grid container justify="center" alignItems="center" direction="column">
      <Box m={2}>
        <Icon fontSize="large">check_circle_outline</Icon>
      </Box>
      <Typography variant="h5" className={classes.paragraph}>
        Thank you for taking part in this test
      </Typography>

      {location.state ? <Typography variant="body2" color="textSecondary" className={classes.paragraph}>
          Your responses are anonymous but if you do wish delete your responses at a later time, please save and visit
          this link: <Link href={deletionLink} target="_blank">{deletionLink}</Link>
        </Typography>

        : <Typography variant="body2" className={classes.paragraph}>
          Are you sure you want to delete your responses to test {id}?. Your responses are anonymous if you do wish delete your responses please
          click CONFIRM.
          <div className={classes.actions}>
            <Button color="secondary" onClick={handleConfirmClick}>CONFIRM</Button>
            {alert}
          </div>
        </Typography>
      }

    </Grid>
  </Box>;
}
