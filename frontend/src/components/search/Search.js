import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import logo from './main-logo.png';
import darkLogo from './main-logo-dark.png';
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
import {ThemeContext} from "../../context/ThemeContext";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {BASE_URL} from "../../hosts";

const branches = [
    "Computer Engineering",
    "Electronics & Telecommunication Engineering",
    "Mechanical Engineering",
    "Instrumentation Engineering",
    "Civil Engineering",
    "Chemical Engineering"
]

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
    container: {
        margin: 'auto',
        padding: '20px',
        width: '75vw',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '5px',
        marginTop: '10px',
    }
}));

const Search = () => {
    const classes = useStyles();
    let history = useHistory();
    const {dark} = React.useContext(ThemeContext);
    const [search, setSearch] = React.useState('');
    const [people, setPeople] = React.useState([]);
    const [submitted, setSubmitted] = React.useState(false);
    const [list, setList] = React.useState(null);
    const [filter, setFilter] = React.useState('all')

    const handleList = (e) => {
        setList(e.currentTarget);
    }
    
    const handleClick = (e) => {
        setFilter(e.currentTarget.getAttribute('value'));
        setList(null);
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
        axios({
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                'search': e.target.value,
                'filter': filter,
            },
            url: BASE_URL + '/portal/get-people/'
        }).then(response => {
            setPeople(response.data.people)
        }).catch(error => {
        })
    }

    const handleRequest = i => (e) => {
        let people_list = [...people];
        people_list[i].is_sent = true;
        setPeople(people_list);
        axios({
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                'email': people[i].email
            },
            url: BASE_URL + '/portal/request-connect/'
        }).then(res => {
        }).catch(error => {
        })
    }

    const handleView = i => (e) => {
        history.push('/person/'+people[i].slug);
    }

    const handleSubmit = (e) => {
        axios({
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                'search': search,
                'filter': filter,
            },
            url: BASE_URL + '/portal/get-people/',
        }).then(response => {
            setPeople(response.data.people);
            return true;
        }).then(res => {
            setSubmitted(true);
        }).catch(err => {
        })
    }

    return (
        <>
            <Collapse in={!submitted} timeout={1500}>
                <Grid
                    container
                    direction = "column"
                    justify = "flex-start"
                    alignItems = "center"
                >
                    <img src={dark?logo:darkLogo} alt="BG" className={classes.img} />
                    <Paper className={classes.root} elevation={10}>
                        <IconButton className={classes.iconButton} aria-label="menu" onClick={handleList}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={list}
                            keepMounted
                            open={Boolean(list)}
                            onClose={() => setList(null)}
                        >
                            <MenuItem value='all' onClick={handleClick}>All</MenuItem>
                            {branches.map((branch, i) => {
                                return (
                                    <MenuItem key={i} value={branch} onClick={handleClick}>{branch}</MenuItem>
                                )
                            })}
                        </Menu>
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
                                                <Avatar aria-label={person.name} className={classes.avatar} src={BASE_URL + person.profile_pic}>{person.name.slice(0,1)}</Avatar>
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
                    <Grid container spacing={3} className={classes.container}>
                        <Grid item xs={12}>
                            <Typography align='center' component='h3' variant='h3'>
                                Your search results
                            </Typography>
                        </Grid>
                        {people.map((person, i) => {
                            return (
                                <Grid item key={i} xs={12} md={4} lg={4}>
                                    <Paper elevation={10} style={{ maxWidth: 350}}>
                                        <CardContent>
                                            {person.profile_pic?(
                                                <CardMedia
                                                    className={classes.media}
                                                    image={BASE_URL + person.profile_pic}
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
                        <Grid item xs={12} style={{ marginTop: '20px'}}>
                            <Button onClick={() => setSubmitted(!submitted)} variant="contained" fullWidth color='primary'>
                                Go Back
                            </Button>
                        </Grid>
                    </Grid>
                ):(
                    <Grid container style={{margin: 'auto', marginTop: '10px', padding: '20px', width: '75vw'}}>
                        <Grid item xs={12}>
                            <Typography variant="h3" component="h3" align="center">
                                No results found for the name you entered
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: '20px'}}>
                            <Button onClick={() => setSubmitted(!submitted)} variant="contained" fullWidth color='primary'>
                                Go Back
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Collapse>
        </>
    );
}

export default Search;
