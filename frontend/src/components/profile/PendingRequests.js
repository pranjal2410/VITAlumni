import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTheme from "@material-ui/core/styles/useTheme";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import axios from 'axios';
import {getToken} from "../authentication/cookies";
import {green, orange} from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import DialogContentText from "@material-ui/core/DialogContentText";

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: orange[900],
        color: 'white',
    },
}))

export const PendingRequests = ({ open, setOpen }) => {
    const theme = useTheme();
    const classes = useStyles();
    const [pending_list, setPending_list] = React.useState([]);

    React.useEffect(() => {
        axios({
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            url: '/portal/get-pending-list/'
        }).then(res => {
            setPending_list(res.data.pending_list);
        }).catch(err => {
        });
    }, [open])

    const handleClose = () => {
        setOpen(false);
    };

    const handleApprove = i => () => {
        let pending = [...pending_list];
        pending[i].approved = true;
        setPending_list(pending);
        axios({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                email: pending_list[i].email,
            },
            url: '/portal/get-pending-list/'
        }).then(res => {
        }).catch(err => {
        })
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-pending">
                <DialogTitle id="form-dialog-pending">Pending Requests</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: theme.palette.text.primary }}>
                        You can approve all the pending requests from this dialog.
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <List style={{ overflow: 'auto'}}>
                        {pending_list.map((request, i) => {
                            return (
                                <ListItem key={i}>
                                    <ListItemAvatar>
                                        <Avatar aria-label={request.name} className={classes.avatar} src={request.profile_pic}>V</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={request.name}/>
                                    <ListItemSecondaryAction>
                                        <IconButton edge='end' aria-label='approve' onClick={handleApprove(i)}>
                                            {request.approved?(<CheckCircleRoundedIcon style={{ color: green[500]}}/>):(<CheckCircleOutlineRoundedIcon/>)}
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close List
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
