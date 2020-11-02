import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import useTheme from "@material-ui/core/styles/useTheme";

export const Login = ({ open, setOpen }) => {
    const theme = useTheme();
    const [values, setValues] = useState({
        email: null,
        password: null,
    });
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.id]: e.currentTarget.value
        })
    }

    const handleSubmit = () => {
        console.log(values);
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
                <DialogTitle id="form-dialog-login">Login</DialogTitle>
                <DialogContent>
                    <DialogContentText color={theme.palette.text.primary}>
                        You can login into this portal if you have registered on this portal, with a valid email address.
                    </DialogContentText>
                    <TextField
                        id="email"
                        variant="outlined"
                        label="Email Address"
                        type="email"
                        name="email"
                        margin="normal"
                        onChange={handleChange}
                        fullWidth
                        autoFocus
                        required
                    />
                    <TextField
                        id="password"
                        variant="outlined"
                        label="Password"
                        margin="normal"
                        type={visible? "text":"password"}
                        name="password"
                        onChange={handleChange}
                        InputProps={{
                            endAdornment:
                            <IconButton
                                aria-label="Toggle visibility"
                                onClick={() => setVisible(!visible)}
                            >
                                {visible? <Visibility /> : <VisibilityOff /> }
                            </IconButton>
                        }}
                        fullWidth
                        autoFocus
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
