import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import logo from './main-logo.png';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import {getToken} from "../authentication/cookies";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import {green, orange} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router";
import Collapse from '@material-ui/core/Collapse';
import CardContent from "@material-ui/core/CardContent";
import {CardActions, CardMedia, Typography} from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        padding: '2px 4px',
        width: '60%'
    },
    input: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    avatar: {
        backgroundColor: orange[900],
        color: 'white',
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    img: {
        [theme.breakpoints.up('md')]: {
            maxWidth: '25vw%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80%'
        },
        height: '40vh',
    },
    media: {
        height: 350,
        display: 'flex',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    },
}));

const Search = () => {
    const classes = useStyles();
    let history = useHistory();
    const [search, setSearch] = React.useState('');
    const [people, setPeople] = React.useState([]);
    const [submitted, setSubmitted] = React.useState(false);

    const handleChange = (e) => {
        setSearch(e.target.value);
        axios({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                'search': e.target.value
            },
            url: '/portal/get-people/'
        }).then(response => {
            setPeople(response.data.people)
        }).catch(error => {
            console.log(error)
        })
    }

    const handleRequest = i => (e) => {
        let people_list = [...people];
        people_list[i].is_sent = true;
        setPeople(people_list);
        axios({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                'email': people[i].email
            },
            url: '/portal/request-connect/'
        }).then(res => {
        }).catch(error => {
            console.log(error);
        })
    }

    const handleView = i => (e) => {
        history.push('/person/'+people[i].slug);
    }

    const handleSubmit = (e) => {
        axios({
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                'search': search,
            },
            url: '/portal/get-people/',
        }).then(response => {
            setPeople(response.data.people);
            return true;
        }).then(res => {
            setSubmitted(true);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <>
            <Collapse in={!submitted}>
                <Grid
                    container
                    direction = "column"
                    justify = "flex-start"
                    alignItems = "center"
                >
                    <img src={logo} alt="BG" className={classes.img} />
                    <Paper className={classes.root} elevation={10}>
                        <IconButton className={classes.iconButton} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <InputBase
                            fullWidth
                            id={'search'}
                            name={'search'}
                            value={search}
                            className={classes.input}
                            onChange={handleChange}
                            placeholder="Enter name of Alumni"
                            inputProps={{ 'aria-label': 'name of alumni' }}
                        />
                        <IconButton className={classes.iconButton} onClick={() => setSearch('')} aria-label="clear">
                            <ClearIcon/>
                        </IconButton>
                        <Divider className={classes.divider} orientation="vertical" />
                        <IconButton onClick={handleSubmit} className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    {people.length > 0?(
                        <Paper elevation={10} style={{ width: '50%', margin: '20px', overflow: 'auto' }}>
                            <List>
                                {people.map((person, i) => {
                                    return (
                                        <ListItem key={i}>
                                            <ListItemAvatar>
                                                <Avatar aria-label={person.name} className={classes.avatar} src={person.profile_pic}>{person.name.slice(0,1)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={person.name}/>
                                            <ListItemSecondaryAction>
                                                {person.is_approved?null:(person.is_sent?(
                                                    <IconButton edge='end' aria-label='approve' style={{ margin: '10px'}}>
                                                        <CheckCircleRoundedIcon style={{ color: green[500]}}/>
                                                    </IconButton>
                                                ):(
                                                    <Button edge='end' aria-label='send' onClick={handleRequest(i)} color='primary' style={{ margin: '10px'}}>
                                                        Send Request
                                                    </Button>
                                                ))}
                                                <Button edge='end' aria-label='send' color='primary' onClick={handleView(i)}>
                                                    View Profile
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Paper>
                    ):null}
                </Grid>
            </Collapse>
            <Collapse in={submitted}>
                {people.length > 0?(
                    <Grid container spacing={3} style={{ margin: 'auto', padding: '20px', width: '75vw'}}>
                        {people.map((person, i) => {
                            return (
                                <Grid item key={i} xs={12} md={4} lg={4}>
                                    <Paper elevation={10} style={{ maxWidth: 350}}>
                                        <CardContent>
                                            {person.profile_pic?(
                                                <CardMedia
                                                    className={classes.media}
                                                    image={person.profile_pic}
                                                    component='img'
                                                    title={person.name}
                                                />
                                            ):null}
                                            <Typography gutterBottom variant="h5" component="h2" style={{ marginTop: '5px'}}>
                                                {person.name}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            {person.is_approved?null:(person.is_sent?(
                                                <IconButton edge='end' aria-label='approve' style={{ margin: '10px'}}>
                                                    <CheckCircleRoundedIcon style={{ color: green[500]}}/>
                                                </IconButton>
                                            ):(
                                                <Button edge='end' aria-label='send' onClick={handleRequest(i)} color='primary' style={{ margin: '10px'}}>
                                                    Send Request
                                                </Button>
                                            ))}
                                            <Button edge='end' aria-label='send' color='primary' onClick={handleView(i)}>
                                                View Profile
                                            </Button>
                                        </CardActions>
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                ):(
                    <Typography variant="h2" component="h2">
                        No results found for the name you entered.
                    </Typography>
                )}
            </Collapse>
        </>
    );
}

export default Search;
