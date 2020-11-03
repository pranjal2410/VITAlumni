import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useTheme} from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import {useHistory, useLocation} from "react-router";
import {AccountCircle, ExitToApp, LockOpen} from "@material-ui/icons";
import {Login} from "../authentication/Login";
import {SignUp} from "../authentication/SignUp";
import {getToken} from "../authentication/cookies";
import {Logout} from "../authentication/Logout";
import {Backdrop} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        backgroundColor: theme.palette.background.default,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        flexWrap: "wrap",
        boxShadow: "none",
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    tabs: {
        marginLeft: theme.spacing(2),
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: theme.palette.text.primary
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        boxShadow: "10",
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        justifyContent: 'flex-end'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function Navbar() {
    const classes = useStyles();
    const [tab, setTab] = React.useState(0);
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [signUp, setSignUp] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [logout, setLogout] = React.useState(false);
    const location = useLocation();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let token = getToken();
        if(token !== '') {
            setLoggedIn(true);
        }
        const path = location.pathname;
        switch (path) {
            case '/':
                setTab(0);
                break;
            case '/sections':
                setTab(1);
                break;
            case '/about':
                setTab(2);
                break;
            default:
                setTab(0);
        }
    }, [location, login, signUp, logout])

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
        switch(newTab) {
            case 0:
                history.push('/')
                break;
            case 1:
                history.push('/sections')
                break;
            case 2:
                history.push('/about')
                break;
            default:
                history.push('/')
        }
    };

    return (
        <>
            <AppBar position="sticky" className={clsx(classes.appBar, {[classes.appBarShift]: open})}>
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap style={{ color: theme.palette.text.primary }}>
                        VITAlumni
                    </Typography>
                    <Hidden smDown>
                        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" className={classes.tabs}>
                            <Tab label="Home" />
                            <Tab label="Sections" />
                            <Tab label="About Us" />
                        </Tabs>
                    </Hidden>
                    <Backdrop open={open} className={classes.backdrop}>
                        <Drawer
                            className={classes.drawer}
                            variant="persistent"
                            anchor="left"
                            open={open}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            <div className={classes.drawerHeader}>
                                <Typography variant='h6' color={theme.palette.text.primary} style={{ marginRight: theme.spacing(6)}}>Drawer</Typography>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </div>
                            <Divider />
                            <List>
                                {!loggedIn?(
                                    <>
                                        <ListItem button key={'Login'} onClick={() => setLogin(true)}>
                                            <ListItemIcon><LockOpen /></ListItemIcon>
                                            <ListItemText primary={'Login'} />
                                        </ListItem>
                                        <ListItem button key={'SignUp'} onClick={() => setSignUp(true)}>
                                            <ListItemIcon><AccountCircle /></ListItemIcon>
                                            <ListItemText primary={'Sign Up'} />
                                        </ListItem>
                                    </>
                                ):(
                                    <ListItem button key={'Logout'} onClick={() => setLogout(true)}>
                                        <ListItemIcon><ExitToApp/></ListItemIcon>
                                        <ListItemText primary={'Logout'} />
                                    </ListItem>
                                )}
                            </List>
                            <Divider />
                        </Drawer>
                    </Backdrop>
                </Toolbar>
            </AppBar>
            <Login open={login} setOpen={setLogin}/>
            <SignUp open={signUp} setOpen={setSignUp}/>
            <Logout open={logout} setOpen={setLogout} setLoggedIn={setLoggedIn}/>
        </>
    );
}