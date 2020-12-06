import React from "react";
import {makeStyles} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import axios from 'axios';
import {getToken} from "../authentication/cookies";
import {orange} from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import img from './background-cover.png';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px',
        justifyContent: 'center',
        display: 'flex'
    },
    spinner: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        justifyContent: 'center',
    },
    bannerBackground: {
        margin: 'auto',
        width: '55vw',
        height: '50vh',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderColor: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
    avatar: {
        marginTop: theme.spacing(38),
        backgroundColor: orange[900],
        color: 'white',
        width: theme.spacing(15),
        boxShadow: theme.shadows[10],
        fontSize: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        height: theme.spacing(15),
    }
}));

const UserProfile = () => {
    const classes = useStyles();
    const [profile, setProfile] = React.useState({});
    const [spinner, setSpinner] = React.useState(true);

    React.useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Token ${getToken()}`,
            },
            url: '/portal/user-profile/',
        }).then(response => {
            setProfile(response.data)
            setSpinner(false);
        }).catch(err => {
            console.log(err.response.data)
        })
    }, [spinner])

    return spinner?(
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ):(
        <div className={classes.root}>
            <Paper className={classes.bannerBackground} elevation={15} style={{ backgroundImage: profile.cover_pic?`url(${profile.cover_pic})`:`url(${img})` }}>
                {profile.profile_pic?(
                    <Avatar src={profile.profile_pic} alt={profile.name} className={classes.avatar}/>
                ):(
                    <Avatar className={classes.avatar}>{profile.name.slice(0,1)}</Avatar>
                )}
            </Paper>
        </div>
    )
}

export default UserProfile;