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
import {AccountCircle, Brightness4, Brightness7, ExitToApp, LockOpen, People} from "@material-ui/icons";
import {Login} from "../authentication/Login";
import {SignUp} from "../authentication/SignUp";
import {getCookie, getToken} from "../authentication/cookies";
import {Logout} from "../authentication/Logout";
import {Backdrop} from "@material-ui/core";
import {OTP} from "../authentication/OTP";
import {PendingRequests} from "../profile/PendingRequests";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {EditProfile} from "../profile/EditProfile";
import {ThemeContext} from "../../context/ThemeContext";

const drawerWidth = 300;

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
    const {dark, toggleTheme} = React.useContext(ThemeContext);
    const [tab, setTab] = React.useState(0);
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [signUp, setSignUp] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [logout, setLogout] = React.useState(false);
    const [otp, setOTP] = React.useState(false);
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
            if(getCookie('verification'))
            {
                setOTP(true);
            }
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
            case '/feed':
                if(!getToken())
                    setTab(1);
                else
                    setTab(3);
                break;
            case '/search':
                if(!getToken())
                    setTab(1);
                else
                    setTab(4);
                break;
            case '/profile':
                if(!getToken())
                    setTab(1);
                else
                    setTab(5);
                break;
            default:
                setTab(null);
        }
    }, [location, login, signUp, logout])

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
        switch(newTab) {
            case 0:
                history.push('/');
                break;
            case 1:
                history.push('/sections');
                break;
            case 2:
                history.push('/about');
                break;
            case 3:
                history.push('/feed');
                break;
            case 4:
                history.push('/search');
                break;
            case 5:
                history.push('/profile');
                break;
            default:
                history.push('/');
        }
    };

    return (
        <>
            <AppBar position="sticky" className={clsx(classes.appBar, {[classes.appBarShift]: open})}>
                <Toolbar style={{ width: '100%'}}>
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
                            {loggedIn?(
                                <Tab label="Feed" />
                            ):null}
                            {loggedIn?(
                                <Tab label="Search" />
                            ):null}
                            {loggedIn?(
                                <Tab label="User Profile" />
                            ):null}
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
                                <Typography variant='h6' style={{ margin: 'auto', color: theme.palette.text.primary }}>Drawer</Typography>
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
                                    <>
                                        <ListItem button key={'Pending List'} onClick={() => setPending(true)}>
                                            <ListItemIcon><People/></ListItemIcon>
                                            <ListItemText primary={'Pending Requests'} />
                                        </ListItem>
                                        <ListItem button key={'Edit Profile'} onClick={() => setEdit(true)}>
                                            <ListItemIcon><EditOutlinedIcon/></ListItemIcon>
                                            <ListItemText primary={'Edit Profile'} />
                                        </ListItem>
                                        <ListItem button key={'Logout'} onClick={() => setLogout(true)}>
                                            <ListItemIcon><ExitToApp/></ListItemIcon>
                                            <ListItemText primary={'Logout'} />
                                        </ListItem>
                                    </>
                                )}
                            </List>
                            <Divider />
                        </Drawer>
                    </Backdrop>
                    <IconButton edge='end' color='textPrimary' onClick={toggleTheme}>
                        {dark ? <Brightness7/>: <Brightness4/>}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Login open={login} setOpen={setLogin} setOTP={setOTP}/>
            <SignUp open={signUp} setOpen={setSignUp} otp={otp} setOTP={setOTP}/>
            <OTP open={otp} setOpen={setOTP} setLoggedIn={setLoggedIn}/>
            <PendingRequests open={pending} setOpen={setPending}/>
            <EditProfile open={edit} setOpen={setEdit}/>
            <Logout open={logout} setOpen={setLogout} setLoggedIn={setLoggedIn}/>
        </>
    );
}