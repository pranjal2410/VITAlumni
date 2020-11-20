import React from 'react';
import {makeStyles,
        Grid,
        Paper,
        CardMedia,
        CardActions,
        CardContent,
        CardActionArea,
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

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px',
        justifyContent: 'center',
        display: 'flex'
    },
    photo: {
        marginTop: '10px',
        borderRadius: '10px',
    }
}))

const Updates = () => {
    let history = useHistory();
    if(!getToken())
        history.push('/sections');
    const classes = useStyles();
    const location = useLocation();
    const [feed, setFeed] = React.useState([]);
    const [post, setPost] = React.useState({
        doc: null,
        docFile: null,
        photo: null,
        photoFile: null,
        text: null,
    });

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
            setFeed(response.data.feed)
            console.log(response.data.feed)
        }).catch(error => {
            console.log(error.response.data)
        })
    }, [location])

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

    const handleTextChange = (e) => {
        setPost({
            ...post,
            text: e.target.value
        })
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
            console.log(response.data)
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper style={{ maxWidth: 500, margin: 'auto' }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Add an update
                            </Typography>
                            <TextField
                                color='primary'
                                multiline={true}
                                onChange={handleTextChange}
                                type='text'
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
                                <IconButton color='inherit' component={post.doc!==null?'button':'label'} onClick={handleDocClick}>
                                    {post.doc!==null?(<AssignmentIcon/>):(<AssignmentOutlinedIcon/>)}
                                    {post.doc===null?(
                                        <input type='file' onChange={handleDocUpload} hidden/>
                                    ):null}
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                        <CardActions>
                            <Button size="small" color="primary" onClick={handleSubmit}>
                                POST
                            </Button>
                        </CardActions>
                    </Paper>
                </Grid>
                {feed.map((update, i) => {
                    return (
                    <Grid item xs={12}>
                        <Paper style={{ maxWidth: 500, margin: 'auto' }}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {update.user + ' posted an update.'}
                                    </Typography>
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
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Learn More
                                </Button>
                            </CardActions>
                        </Paper>
                    </Grid>)
                })}
            </Grid>
        </div>
    )
}

export default Updates;