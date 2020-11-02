import React from 'react';
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
import {useHistory} from "react-router";
import {AccountCircle, LockOpen} from "@material-ui/icons";
import {Login} from "../authentication/Login";

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
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        justifyContent: 'flex-end',
    },
}));

export default function Navbar() {
    const classes = useStyles();
    const [tab, setTab] = React.useState(0);
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [signUn, setSignUp] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <ListItem button key={'Login'} onClick={() => setLogin(true)}>
                                <ListItemIcon><LockOpen /></ListItemIcon>
                                <ListItemText primary={'Login'} />
                            </ListItem>
                            <ListItem button key={'SignUp'} onClick={() => setSignUp(true)}>
                                <ListItemIcon><AccountCircle /></ListItemIcon>
                                <ListItemText primary={'Sign Up'} />
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                </Toolbar>
            </AppBar>
            <Login open={login} setOpen={setLogin}/>
        </>
    );
}