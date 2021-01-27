import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useTheme, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../hosts";

const useStyles = makeStyles(theme => ({
    photo: {
        marginTop: '10px',
        borderRadius: '10px',
    },
    link: {
        fontSize: '20px',
        color: theme.palette.text.primary
    },
}))

const NewsDialog = (props) => {
    const {open, setOpen, news} = props;
    const theme = useTheme();
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                aria-labelledby="News Dialog"
            >
                <DialogTitle id="news-dialog">{news.title}</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id={news.title}
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        style={{ color: theme.palette.text.primary}}
                    >
                        {news.text}
                    </DialogContentText>
                    {news.photo?(
                        <DialogContentText
                            id={news.title}
                            ref={descriptionElementRef}
                            tabIndex={-1}
                            style={{ color: theme.palette.text.primary}}
                        >
                            <img src={BASE_URL + news.photo} className={classes.photo} alt=""/>
                        </DialogContentText>
                    ):null}
                    {news.doc?(
                        <DialogContentText
                            id={news.title}
                            ref={descriptionElementRef}
                            tabIndex={-1}
                            style={{ color: theme.palette.text.primary}}
                        >
                            <Link to='#' className={classes.link} onClick={() => window.open(BASE_URL+news.doc)}>Click here to download the document</Link>
                        </DialogContentText>
                    ):null}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default NewsDialog;