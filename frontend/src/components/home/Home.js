import React, {useState, useEffect} from 'react'
import { useTransition, animated, config } from 'react-spring'
import {makeStyles, Typography, useScrollTrigger, Grow} from "@material-ui/core";
import logo from './vit-logo.png';
import college from './college.jpg';
import college2 from './college2.jpg';
import college3 from './college3.png';
import college4 from './college4.jpg';
import Grid from "@material-ui/core/Grid";
import About from "../about/About";

const slides = [
    { id: 0, url: logo },
    { id: 1, url: college },
    { id: 2, url: college2 },
    { id: 3, url: college3 },
    { id: 4, url: college4 },
]

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: 350,
        top: 0,
        left: 0,
        position: 'absolute',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        willChange: 'opacity',
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
                    style={{ ...props, backgroundImage: `url(${item.url})` }}
                >
                    {prop.children}
                </animated.div>
            ))
}

const GrowOnScroll = (props) => {
    const trigger = useScrollTrigger({
        threshold: 50,
        disableHysteresis: true
    })

    return (
        <Grow in={trigger} timeout={2000}>
            {props.children}
        </Grow>
    )
}

const Home = () => {
    return (
        <Grid container style={{
            padding: '10px',
        }}>
            <Grid item xs={12} style={{ height: 350 }}>
                <Carousel />
            </Grid>
            <GrowOnScroll>
                <Grid item xs={12}>
                    <Typography component='h1' variant='h2'>
                        Welcome to the VIT Alumni Portal!
                    </Typography>
                </Grid>
            </GrowOnScroll>
            <GrowOnScroll>
                <Grid item xs={12}>
                    <About />
                </Grid>
            </GrowOnScroll>
        </Grid>
    )
}

export default Home;