import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import pranjal from './pranjal2410-2.jpg';
import thite from './thite1811-2.jpeg';
import {CardContent, CardMedia, Typography} from "@material-ui/core";
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        display: 'flex',
        color: theme.palette.text.secondary,
    },
    media: {
        height: 350,
        width: 350,
        margin: 'auto',
        borderRadius: '20px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
}));

const About = () => {
    const classes = useStyles();

    return (
        <Grid container spacing={3} style={{ padding: '20px', maxHeight: '80%'}}>
            <Grow in={true} timeout={1500}>
                <Grid item xs={12}>
                    <Typography align='center' component='h3' variant='h3'>
                        Meet the developer team
                    </Typography>
                </Grid>
            </Grow>
            <Grow in={true} timeout={2500}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={10} className={classes.paper}>
                        <CardContent>
                            <CardMedia
                                className={classes.media}
                                image={pranjal}
                                component='img'
                                title='Pranjal Newalkar'
                            />
                            <Typography gutterBottom color='textPrimary' variant="h5" component="h2" style={{ marginTop: '5px'}}>
                                Pranjal Newalkar
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Hello guys! I am Pranjal Newalkar and I am currently pursuing a bachelor's degree in Electronics
                                and Telecommunication Engineering from Pune Institute of Computer Technology. I like to develop
                                web applications and have a keen interest in AI/ML.
                            </Typography>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grow>
            <Grow in={true} timeout={3500}>
                <Grid item xs={12} sm={6} style={{ maxWidth: '50%'}}>
                    <Paper elevation={10} className={classes.paper}>
                        <CardContent>
                            <CardMedia
                                className={classes.media}
                                image={thite}
                                component='img'
                                title='Piyush Thite'
                            />
                            <Typography gutterBottom color='textPrimary' variant="h5" component="h2" style={{ marginTop: '5px'}}>
                                Piyush Thite
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Glad to see you all here! My name is Piyush Thite and I am currently completing the bachelor's
                                program to pursue a degree in Electronics and Telecommunication Engineering from Vishwakarma
                                Institute of Technology, Pune. I like a bit of coding and am highly interested in Mechatronics.
                            </Typography>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grow>
        </Grid>
    )
}

export default About;