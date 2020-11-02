import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import MomentUtils from '@date-io/moment';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

export const SignUp = ({ open, setOpen }) => {
    const [fromDate, handleFromDate] = useState(new Date());
    const [toDate, handleToDate] = useState(new Date());
    const [values, setValues] = useState({
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirmPassword: null,
        contact: null,
        branch: null,
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
        console.log(values, fromDate, toDate);
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
                <DialogTitle id="form-dialog-login">SignUp</DialogTitle>
                <DialogContent>
                    <TextField
                        id="first_name"
                        variant="outlined"
                        label="First Name"
                        type="text"
                        name="first_name"
                        margin="normal"
                        onChange={handleChange}
                        autoFocus
                        required
                    />
                    <TextField
                        id="last_name"
                        variant="outlined"
                        label="Last Name"
                        type="text"
                        name="last_name"
                        margin="normal"
                        onChange={handleChange}
                        autoFocus
                        style={{ marginLeft: "20px" }}
                        required
                    />
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
                        id="contact"
                        variant="outlined"
                        label="Contact Number"
                        type="number"
                        name="contact"
                        margin="normal"
                        onChange={handleChange}
                        autoFocus
                        required
                    />
                    <TextField
                        id="branch"
                        variant="outlined"
                        label="Branch Name"
                        type="text"
                        name="branch"
                        margin="normal"
                        onChange={handleChange}
                        autoFocus
                        style={{ marginLeft: "20px" }}
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
                    <TextField
                        id="confirm_password"
                        variant="outlined"
                        label="Confirm Password"
                        margin="normal"
                        type={visible? "text":"password"}
                        name="confirm_password"
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
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            views={["year", "month"]}
                            label="From"
                            helperText="Academic year start"
                            value={fromDate}
                            onChange={handleFromDate}
                            color={'primary'}
                            margin="normal"
                        />
                        <DatePicker
                            views={["year", "month"]}
                            label="End"
                            helperText="Academic year end"
                            value={toDate}
                            onChange={handleToDate}
                            color={'primary'}
                            margin="normal"
                            style={{ marginLeft: "20px" }}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        SignUp
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
