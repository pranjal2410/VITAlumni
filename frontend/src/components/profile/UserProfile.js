import React from "react";
import {Button, CardActions, CardContent, CardHeader, CardMedia, Grid, makeStyles} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import axios from 'axios';
import {getToken} from "../authentication/cookies";
import {green, orange} from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import img from './background-cover.png';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Link} from "react-router-dom";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px',
        justifyContent: 'center',
        width: '100%'
    },
    title: {
        color: theme.palette.text.primary,
    },
    spinner: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        justifyContent: 'center',
    },
    bannerBackground: {
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
    },
    feedAvatar: {
        backgroundColor: green[500],
    },
    link: {
        fontSize: '20px',
        color: theme.palette.text.primary
    },
    photo: {
        marginTop: '10px',
        borderRadius: '10px',
    }
}));

const UserProfile = () => {
    const classes = useStyles();
    const [profile, setProfile] = React.useState({});
    const [feed, setFeed] = React.useState([]);
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
            setProfile(response.data.user_data)
            setFeed(response.data.feed_data)
            setSpinner(false);
        }).catch(err => {
            console.log(err.response.data)
        })
    }, [spinner])

    const handleGreet = i => (e) => {
        let feed_arr = [...feed];
        feed_arr[i].is_greeted = !feed_arr[i].is_greeted;
        if(feed_arr[i].is_greeted)
            feed_arr[i].greets += 1;
        else
            feed_arr[i].greets -= 1;
        setFeed(feed_arr);
        axios({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                id: feed[i].id
            },
            url: '/portal/greet/'
        }).then(response => {
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    return spinner?(
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ):(
        <div className={classes.root}>
            <div style={{display: 'flex'}}>
                <Box style={{maxHeight: '100vh', margin: '20px', padding: '10px'}}>
                    <Paper className={classes.bannerBackground} elevation={15} style={{ backgroundImage: profile.cover_pic?`url(${profile.cover_pic})`:`url(${img})` }}>
                        {profile.profile_pic?(
                            <Avatar src={profile.profile_pic} alt={profile.name} className={classes.avatar}/>
                        ):(
                            <Avatar className={classes.avatar}>{profile.name.slice(0,1)}</Avatar>
                        )}
                    </Paper>
                </Box>
                <Box style={{maxHeight: '80vh', margin: '20px', padding: '10px', overflow: 'auto'}}>
                    <Typography className={classes.title} component='h2' variant='h1'>{profile.name}</Typography>
                </Box>
            </div>
            <Box style={{ maxHeight: '80vh', overflow: 'auto', marginTop: '75px', overflowX: 'hidden', textAlign: 'center'}}>
                <Typography className={classes.title} component='h3' variant='h4'>Updates posted by {profile.name}:</Typography>
                <Grid container spacing={3}>
                    {feed.map((update, i) => {
                        const date = new Date(update.created_on);
                        return (
                            <Grid item xs={12} key={i}>
                                <Paper style={{ maxWidth: 500, margin: 'auto' }} elevation={10} id={'paper'+i}>
                                    <CardHeader
                                        avatar={
                                            <Avatar aria-label={update.user} className={classes.feedAvatar} src={update.user_dp} />
                                        }
                                        action={update.by_self?(
                                            <>
                                                <IconButton aria-label="settings">
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </>
                                        ):null}
                                        title={update.user}
                                        subheader={months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()}
                                    />
                                    <CardContent>
                                        {update.text!=='null'?(
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {update.text}
                                            </Typography>
                                        ):null}
                                        {update.photo?(
                                            <CardMedia
                                                className={classes.photo}
                                                component='img'
                                                image={update.photo}
                                            />
                                        ):null}
                                        {update.doc?(
                                            <>
                                                <br/>
                                                <Link to='#' className={classes.link} onClick={() => window.open('http://localhost:8000'+update.doc)}>Click here to download the document</Link>
                                            </>
                                        ):null}
                                    </CardContent>
                                    <CardActions>
                                        <Button size="medium" color="primary" startIcon={update.is_greeted?(<ThumbUpIcon/>):(<ThumbUpOutlinedIcon/>)} onClick={handleGreet(i)}>
                                            {update.is_greeted?('UnGreet'):('Greet')}
                                        </Button>
                                    </CardActions>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {update.greets} people have greeted this.
                                        </Typography>
                                    </CardContent>
                                </Paper>
                            </Grid>)
                    })}
                </Grid>
            </Box>
        </div>
    )
}

export default UserProfile;