import React, {useState, useEffect} from 'react'
import { useTransition, animated, config } from 'react-spring'
import {makeStyles, Typography, useScrollTrigger, Grow} from "@material-ui/core";
import logo from './vit-logo.png';
import college from './college.jpg';
import college2 from './college2.jpg';
import college3 from './college3.png';
import college4 from './college4.jpg';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import axios from 'axios';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import NewsDialog from "./NewsDialog";

const slides = [
    { id: 0, url: logo, color: 'white' },
    { id: 1, url: college, color: 'black' },
    { id: 2, url: college2, color: 'black' },
    { id: 3, url: college3, color: 'black' },
    { id: 4, url: college4, color: 'black' },
]

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%',
        display: 'flex',
        height: 500,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        borderRadius: '5px',
        willChange: 'opacity',
    },
    banner: {
        margin: 'auto',
        width: '75vw',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
        height: '30vh',
        textAlign: 'center',
        borderRadius: '5px',
        display: 'flex',
    },
    paper: {
        margin: '20px',
        justifyContent: 'center',
        height: 500,
        textAlign: 'center',
        borderRadius: '10px',
        display: 'flex',
    },
    title: {
        fontSize: 54,
        fontFamily: 'Arial Black',
        marginLeft: '50px',
    },
    newsTable: {
        height: 400,
        backgroundColor: theme.palette.background.paper,
        margin: 'auto',
        width: 550,
        cursor: 'pointer',
    }
}))

const Carousel = (prop) => {
    const classes = useStyles();
    const [index, set] = useState(0)
    const transitions = useTransition(slides[index], item => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses,
    })
    useEffect(() => void setInterval(() => set(state => (state + 1) % 5), 5000), [])

    return transitions.map(({ item, props, key }) => (
                <animated.div
                    key={key}
                    className={classes.root}
                    style={{ ...props, backgroundImage: `url(${item.url})`, color: item.color }}
                >
                    {prop.children}
                </animated.div>
            ))
}

const GrowOnScroll = (props) => {
    const {children, threshold} = props;
    const trigger = useScrollTrigger({
        threshold: threshold,
        disableHysteresis: true
    })

    return (
        <Grow in={trigger} timeout={2000}>
            {children}
        </Grow>
    )
}

const Home = () => {
    const classes = useStyles();
    const [news, setNews] = useState([]);
    const [clicked, setClicked] = useState({});
    const [newsDialog, setNewsDialog] = useState(false);

    useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            url: '/portal/home/'
        }).then(response => {
            setNews(response.data.notices)
        }).catch(error => {
        })
    }, [])

    const handleNews = i => (e) => {
        setNewsDialog(true);
        setClicked(news[i]);
    }

    return (
        <Grid
            container
            style={{
                padding: '10px',
                maxWidth: '100%',
            }}
            alignContent='center'
        >
            <Grow in={true} timeout={1500}>
                <Grid item xs={12} style={{ marginTop: '20px'}}>
                    <Paper elevation={10} className={classes.banner}>
                        <Typography variant='h2' style={{ margin: 'auto', fontFamily: 'Impact'}}>
                            Welcome to the VIT Alumni Portal!
                        </Typography>
                    </Paper>
                </Grid>
            </Grow>
            <Grow in={true} timeout={2500}>
                <Grid item xs={12} sm={6} style={{ margin: 'auto'}}>
                    <Typography className={classes.title}>
                        This Portal
                    </Typography>
                    <Typography component='p' variant='h5' color='textPrimary' style={{ marginLeft: '50px'}}>
                        In this portal, we provide only the alumni and staff of this
                        college to register themselves with a valid email address which they
                        have provided for the college's record. The alumni and staff can
                        connect to each other and post updates regarding their current
                        status and job. Our goal is to make it easier for the staff and alumni
                        to find each other and thus be updated.
                    </Typography>
                </Grid>
            </Grow>
            <Grow in={true} timeout={3500}>
                <Grid item xs={12} sm={6}>
                    <div className={classes.paper}>
                        <Carousel/>
                    </div>
                </Grid>
            </Grow>
            <GrowOnScroll threshold={200}>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.newsTable} elevation={10}>
                        <Table className={classes.newsTable} aria-label="news table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>NEWS TITLES</TableCell>
                                    <TableCell align="right">DATE POSTED</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {news.map((notice, i) => {
                                    let date = new Date(notice.created_on);
                                    return (
                                        <TableRow key={i} onClick={handleNews(i)}>
                                            <TableCell component="th" scope="row">
                                                {notice.title}
                                            </TableCell>
                                            <TableCell align="right">
                                                {months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </GrowOnScroll>
            <GrowOnScroll threshold={200}>
                <Grid item xs={12} sm={6}>
                    <Typography className={classes.title}>
                        News & Notices
                    </Typography>
                    <Typography component='p' variant='h5' color='textPrimary' style={{ marginLeft: '50px'}}>
                        You can view all the news/notices posted here by the college staff or
                        any other concerned authority. You can even find the documents and photos
                        attached to a particular notice.
                    </Typography>
                </Grid>
            </GrowOnScroll>
            <NewsDialog open={newsDialog} setOpen={setNewsDialog} news={clicked}/>
        </Grid>
    )
}

export default Home;