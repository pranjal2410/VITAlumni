import React from "react";
import {Button, CardActions, CardContent, CardHeader, CardMedia, Grid, makeStyles} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import axios from 'axios';
import {getToken} from "../authentication/cookies";
import {green, orange} from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import img from './background-cover.JPG';
import Typography from "@material-ui/core/Typography";
import {Link} from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {BASE_URL} from "../../hosts";

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
        width: '100%',
        height: '50vh',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
    avatar: {
        marginTop: theme.spacing(38),
        backgroundColor: orange[900],
        color: 'white',
        width: theme.spacing(12),
        boxShadow: theme.shadows[10],
        fontSize: 50,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'white',
        height: theme.spacing(12),
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
    },
    table: {
        width: '70%',
        marginTop: '20px',
        padding: '20px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
    },
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
                "Authorization": `Token ${getToken()}`,
            },
            url: BASE_URL + '/portal/user-profile/',
        }).then(response => {
            setProfile(response.data.user_data)
            setFeed(response.data.feed_data)
            setSpinner(false);
        }).catch(err => {
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
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                id: feed[i].id
            },
            url: BASE_URL + '/portal/greet/'
        }).then(response => {
        }).catch(err => {
        })
    }

    return spinner?(
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ):(
        <div className={classes.root}>
            <Grid container spacing={3} alignItems={'center'}>
                <Fade in={true} timeout={1000}>
                    <Grid item xs={6}>
                        <Paper className={classes.bannerBackground} elevation={15} style={{ backgroundImage: profile.cover_pic?`url(${profile.cover_pic})`:`url(${img})`}}>
                            {profile.profile_pic?(
                                <Avatar src={BASE_URL + profile.profile_pic} alt={profile.name} className={classes.avatar}/>
                            ):(
                                <Avatar className={classes.avatar}>{profile.name.slice(0,1)}</Avatar>
                            )}
                        </Paper>
                    </Grid>
                </Fade>
                <Fade in={true} timeout={2000}>
                    <Grid item xs={6}>
                        <Typography className={classes.title} component='h4' variant='h2'>{profile.name}</Typography>
                        <Paper elevation={10} className={classes.table}>
                            <Link href={'mailto:'+profile.email} color='textPrimary'>
                                <TextField
                                    color='primary'
                                    label={'Email'}
                                    defaultValue={profile.email}
                                    fullWidth
                                    disabled
                                    margin='normal'
                                    variant='outlined'
                                />
                            </Link>
                            <TextField
                                color='primary'
                                label={'Branch'}
                                defaultValue={profile.branch}
                                fullWidth
                                disabled
                                margin='normal'
                                variant='outlined'
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    clearable
                                    value={(new Date(profile.date_joined))}
                                    label='Date Registered'
                                    inputVariant={'outlined'}
                                    disabled
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    fullWidth
                                />
                                <KeyboardDatePicker
                                    clearable
                                    value={(new Date(profile.graduation))}
                                    label='Graduation Date'
                                    inputVariant={'outlined'}
                                    disabled
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    fullWidth
                                />
                                <KeyboardDatePicker
                                    clearable
                                    value={(new Date(profile.birthday))}
                                    label='Date of Birth'
                                    inputVariant={'outlined'}
                                    disabled
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </Paper>
                    </Grid>
                </Fade>
                <Grid item xs={12}>
                    <Fade in={true} timeout={3000}>
                        <Typography className={classes.title} variant='h4' style={{textAlign: 'center', marginTop: '75px', overflow: 'visible'}}>
                            Updates posted by {profile.name}:
                        </Typography>
                    </Fade>
                </Grid>
                <Fade in={true} timeout={3000}>
                    <Grid container style={{ maxHeight: '80vh', overflow: 'auto', marginTop: '20px', overflowX: 'hidden'}}>
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
                                                title={update.is_profile_pic?update.user + ' updated their profile picture':
                                                    update.is_cover_pic?update.user + ' updated their cover picture':
                                                        update.is_job_update?update.user + ' added a job update':update.user}
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
                                                        image={BASE_URL + update.photo}
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
                    </Grid>
                </Fade>
            </Grid>
        </div>
    )
}

export default UserProfile;