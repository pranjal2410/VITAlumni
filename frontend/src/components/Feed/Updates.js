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
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {green, red, blue} from "@material-ui/core/colors";
import Zoom from "@material-ui/core/Zoom";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Checkbox from "@material-ui/core/Checkbox";
import useTheme from "@material-ui/core/styles/useTheme";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px',
        justifyContent: 'center',
        display: 'flex'
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
    }
}))

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
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
    const theme = useTheme();
    if(!getToken())
        history.push('/sections');
    const classes = useStyles();
    const location = useLocation();
    const [feed, setFeed] = React.useState([]);
    const [submit, setSubmit] = React.useState(false);
    const [post, setPost] = React.useState({
        doc: null,
        docFile: null,
        photo: null,
        photoFile: null,
        text: '',
        is_profile_pic: false,
    });
    const [menu, setMenu] = React.useState(null);

    React.useEffect(() => {
        axios({
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            url: '/portal/updates/',
        }).then(response => {
            setSubmit(false);
            setFeed(response.data.feed);

        }).catch(error => {
            console.log(error.response.data)
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
        if(e.target.id === 'text'){
            setPost({
                ...post,
                [e.target.id]: e.target.value
            })
        }
        else {
            let val;
            if(e.target.id === 'is_profile_pic')
                val = post.is_profile_pic;
            setPost({
                ...post,
                [e.target.id]: !val,
            })
        }
    }

    const handleSubmit = (e) => {
        const data = new FormData();
        data.append('text', post.text);
        data.append('photo', post.photoFile);
        data.append('doc', post.docFile);

        axios({
            method: 'post',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "multipart/from-data",
                "Authorization": `Token ${getToken()}`,
            },
            data: data,
            url: '/portal/updates/'
        }).then(response => {
            setPost({
                ...post,
                text: null,
                doc: null,
                photo: null,
                docFile: null,
                photoFile: null,
            })
            setSubmit(true);
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    const handleGreet = i => (e) => {
        let feed_arr = [...feed];
        feed_arr[i].is_greeted = !feed_arr[i].is_greeted;
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

    const handleMenu = (e) => {
        setMenu(e.currentTarget);
    }

    const handleMenuClose = (e) => {
        setMenu(null);
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} id='back-to-top-anchor'>
                    <Paper style={{ maxWidth: 500, margin: 'auto' }} elevation={5}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Add an update
                            </Typography>
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
                            <Checkbox
                                checked={post.is_profile_pic}
                                onChange={handleChange}
                                disabled={post.doc!==null}
                                style={post.doc===null?{color: theme.palette.text.primary}:{color: theme.palette.text.secondary}}
                                id='is_profile_pic'
                                name='is_profile_pic'
                                inputProps={{ 'aria-label': 'Select if profile picture update' }}
                            />
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
                        <Paper style={{ maxWidth: 500, margin: 'auto' }} elevation={10}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label={update.user} className={classes.avatar} src={update.user_dp} />
                                }
                                action={update.by_self?(
                                    <>
                                        <IconButton aria-label="settings" onClick={handleMenu}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={menu}
                                            keepMounted
                                            open={Boolean(menu)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleMenuClose}>Delete Update?</MenuItem>
                                        </Menu>
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
        </div>
    )
}

export default Updates;