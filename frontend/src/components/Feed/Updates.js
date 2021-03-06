import React from 'react';
import {makeStyles,
        Grid,
        Paper,
        CardMedia,
        CardActions,
        CardContent,
        CardHeader,
        Button,
        Typography} from "@material-ui/core";
import {useHistory, useLocation} from "react-router";
import axios from 'axios';
import {getToken} from "../authentication/cookies";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import PhotoIcon from '@material-ui/icons/Photo';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import Tooltip from "@material-ui/core/Tooltip";
import AssignmentIcon from '@material-ui/icons/Assignment';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {green, red, blue} from "@material-ui/core/colors";
import Zoom from "@material-ui/core/Zoom";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Grow} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import {BASE_URL} from "../../hosts";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px',
        justifyContent: 'center',
        display: 'flex',
    },
    photo: {
        marginTop: '10px',
        borderRadius: '10px',
    },
    link: {
        fontSize: '20px',
        color: theme.palette.text.primary
    },
    avatar: {
        backgroundColor: green[500],
    },
    scroll: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    fab: {
        color: theme.palette.common.white,
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    media: {
        height: 350,
        display: 'flex',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    },
    spinner: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        justifyContent: 'center',
    },
}))

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function ScrollTop(props) {
    const { children } = props;
    const classes = useStyles();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.scroll}>
                {children}
            </div>
        </Zoom>
    );
}

const Updates = () => {
    let history = useHistory();
    const ref = React.useRef(null);
    if(!getToken())
        history.push('/sections');
    const classes = useStyles();
    const location = useLocation();
    const [spinner, setSpinner] = React.useState(true);
    const [feed, setFeed] = React.useState([]);
    const [connection_list, setConnection_list] = React.useState([]);
    const [profile, setProfile] = React.useState({});
    const [submit, setSubmit] = React.useState(false);
    const [post, setPost] = React.useState({
        doc: null,
        docFile: null,
        photo: null,
        photoFile: null,
        text: '',
        updateType: 'normal',
        title: null,
    });

    React.useEffect(() => {
        axios({
            method: 'GET',
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            url: BASE_URL + '/portal/updates/',
        }).then(response => {
            setSubmit(false);
            setSpinner(false);
            setFeed(response.data.feed);
            setProfile(response.data.user_data);
            setConnection_list(response.data.connection_list)
        }).catch(error => {
        })
    }, [location, submit])

    const handleDocUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function(e) {
            setPost({
                ...post,
                doc: [reader.result],
                docFile: event.target.files[0],
            });
        }
        setPost({
            ...post,
            doc: event.target.files[0],
        })
    }

    const handlePicUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function(e) {
            setPost({
                ...post,
                photo: [reader.result],
                photoFile: event.target.files[0]
            });
        }
        setPost({
            ...post,
            photo: event.target.files[0],
        })
    }

    const handleDocClick = (e) => {
        if(post.doc!==null)
            setPost({
                ...post,
                doc: null,
                docFile: null,
            })
    }

    const handlePicClick = (e) => {
        if(post.photo!==null)
            setPost({
                ...post,
                photo: null,
                photoFile: null,
            })
    }

    const handleChange = (e) => {
        if(e.target.id){
            setPost({
                ...post,
                [e.target.id]: e.target.value
            })
        } else {
            setPost({
                ...post,
                [e.target.name]: e.target.value,
                text: e.target.value==='job_update'?'Started working at ':post.text,
            })
        }
    }

    const handleSubmit = (e) => {
        const data = new FormData();
        data.append('title', post.title);
        data.append('text', post.text);
        data.append('photo', post.photoFile);
        data.append('doc', post.docFile);
        data.append('is_profile_pic', post.updateType === 'profile_picture');
        data.append('is_cover_pic', post.updateType === 'cover_picture');
        data.append('is_job_update', post.updateType ==='job_update');
        data.append('is_notice', post.updateType === 'notice');

        axios({
            method: 'post',
            headers: {
                "Content-Type" : "multipart/from-data",
                "Authorization": `Token ${getToken()}`,
            },
            data: data,
            url: BASE_URL + '/portal/updates/'
        }).then(response => {
            setPost({
                ...post,
                text: '',
                doc: null,
                photo: null,
                docFile: null,
                photoFile: null,
            })
            setSubmit(true);
        }).catch(err => {
        })
    }

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
            <Grow in={true} timeout={1500}>
                <Box style={{maxHeight: '80vh', margin: '20px', padding: '10px', overflow: 'auto', overflowX: 'hidden', maxWidth: '33%'}}>
                    <Paper style={{ maxWidth: 350, margin: 'auto' }} elevation={10}>
                        <CardContent>
                            {profile.profile_pic?(
                                <CardMedia
                                    className={classes.media}
                                    image={BASE_URL + profile.profile_pic}
                                    component='img'
                                    title={profile.name}
                                />
                            ):null}
                            <Typography gutterBottom variant="h5" component="h2" style={{ marginTop: '5px'}}>
                                {profile.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Hello {profile.name}! You can check out the latest feed here by clicking on the 'FEED' tab.
                                If you want to check your own profile, please click on the 'USER PROFILE' tab!
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => history.push('/profile')}>
                                View Profile
                            </Button>
                        </CardActions>
                    </Paper>
                </Box>
            </Grow>
            <Grow in={true} timeout={3000}>
                <Box style={{maxHeight: '100vh', padding: '10px', overflow: 'auto', overflowX: 'hidden', width: '34%'}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} id='back-to-top-anchor' ref={ref}>
                            <Paper style={{ maxWidth: 500, margin: 'auto' }} elevation={5}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Add an update
                                    </Typography>
                                    {post.updateType === 'notice'?(
                                        <TextField
                                            color='primary'
                                            multiline={true}
                                            onChange={handleChange}
                                            type='text'
                                            id='title'
                                            name='title'
                                            fullWidth
                                            value={post.title}
                                            margin='normal'
                                            label='Title'
                                            variant='outlined'
                                        />
                                    ): null}
                                    <TextField
                                        color='primary'
                                        multiline={true}
                                        onChange={handleChange}
                                        type='text'
                                        id='text'
                                        name='text'
                                        fullWidth
                                        value={post.text}
                                        margin='dense'
                                        label='Write something...'
                                        size='medium'
                                        rows={4}
                                        variant='outlined'
                                    />
                                    {post.photo!==null?(
                                        <img
                                            className={classes.photo}
                                            width='100%'
                                            src={post.photo}
                                            alt='media'
                                        />
                                    ):null}
                                    {post.doc!==null?(
                                        <TextField
                                            value={post.doc.name}
                                            fullWidth
                                            color='primary'
                                            variant='outlined'
                                            style={{ marginTop: '10px' }}
                                            disabled
                                        />
                                    ):null}
                                </CardContent>
                                <CardActions disableSpacing>
                                    <Tooltip title={post.photo!==null?'Detach photo':'Attach photo'} arrow placement='top'>
                                        <IconButton color='inherit' component={post.photo!==null?'button':'label'} onClick={handlePicClick}>
                                            {post.photo!==null?(<PhotoIcon/>):(<PhotoOutlinedIcon/>)}
                                            {post.photo===null?(
                                                <input type='file' accept='image/*' onChange={handlePicUpload} hidden/>
                                            ):null}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Attach document' arrow placement='top'>
                                        <IconButton color='inherit' component={post.doc!==null?'button':'label'} onClick={handleDocClick} disabled={post.is_profile_pic}>
                                            {post.doc!==null?(<AssignmentIcon/>):(<AssignmentOutlinedIcon/>)}
                                            {post.doc===null?(
                                                <input type='file' onChange={handleDocUpload} hidden/>
                                            ):null}
                                        </IconButton>
                                    </Tooltip>
                                    <TextField
                                        id="updateType"
                                        select
                                        label="Select Update Type"
                                        value={post.updateType}
                                        onChange={handleChange}
                                        variant="outlined"
                                        name="updateType"
                                        fullWidth
                                        margin='normal'
                                    >
                                        <MenuItem value='normal'>Normal Update</MenuItem>
                                        <MenuItem value='profile_picture'>Profile Picture</MenuItem>
                                        <MenuItem value='cover_picture'>Cover Picture</MenuItem>
                                        <MenuItem value='job_update'>Job Update</MenuItem>
                                        {profile.is_staff?(
                                            <MenuItem value='notice'>Notice</MenuItem>
                                        ):null}
                                    </TextField>
                                </CardActions>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={handleSubmit}>
                                        POST
                                    </Button>
                                </CardActions>
                            </Paper>
                        </Grid>
                        {feed.map((update, i) => {
                            const date = new Date(update.created_on);
                            return (
                                <Grid item xs={12} key={i}>
                                    <Paper style={{ maxWidth: 500, margin: 'auto' }} elevation={10} id={'paper'+i}>
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label={update.user} className={classes.avatar} src={update.user_dp}>{update.user_dp}</Avatar>
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
                    <ScrollTop>
                        <Tooltip title='Back to top'>
                            <Fab size="medium" aria-label="scroll back to top" className={classes.fab} color='inherit'>
                                <KeyboardArrowUpIcon />
                            </Fab>
                        </Tooltip>
                    </ScrollTop>
                </Box>
            </Grow>
            <Grow in={true} timeout={4500}>
                <Box style={{maxHeight: '80vh', margin: '20px', padding: '10px', overflow: 'auto', overflowX: 'hidden', maxWidth: '33%'}}>
                    <Paper style={{ maxWidth: 500, margin: 'auto', padding: '20px' }} elevation={10}>
                        <Typography variant="h4" component='h4' color="textPrimary">
                            Your connection list:
                        </Typography>
                        <List style={{ overflow: 'auto'}}>
                            {connection_list.map((connection, i) => {
                                return (
                                    <ListItem key={i}>
                                        <ListItemAvatar>
                                            <Avatar aria-label={connection.name} className={classes.avatar} src={connection.profile_pic}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={<Link to={'/person/'+connection.slug} className={classes.link}>{connection.name}</Link>}/>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Paper>
                </Box>
            </Grow>
        </div>
    )
}

export default Updates;