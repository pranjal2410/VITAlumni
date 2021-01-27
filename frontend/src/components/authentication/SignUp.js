import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import {getToken, setCookie} from "./cookies";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from "@material-ui/core/MenuItem";
import DialogContentText from "@material-ui/core/DialogContentText";

const branches = [
    "Computer Engineering",
    "Electronics & Telecommunication Engineering",
    "Mechanical Engineering",
    "Instrumentation Engineering",
    "Civil Engineering",
    "Chemical Engineering"
]

export const SignUp = ({ open, setOpen, setOTP }) => {
    const [values, setValues] = useState({
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirmPassword: null,
        contact: null,
        branch: 'Computer Engineering',
    });
    const [stage, setStage] = useState(0);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [grad, setGrad] = useState(new Date());
    const [birthday, handleDateChange] = useState(new Date());
    const [errors, setErrors] = useState({
        nameError: false,
        contactError: false,
        emailError: false,
        passwordError: false,
        confirmPasswordError: false,
        signUpError: false,
    })
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setStage(0);
    }, [open])

    const handleChange = (e) => {
        if(!!e.target.id) {
            setValues({
                ...values,
                [e.target.id]: e.target.value
            })
        } else {
            setValues({
                ...values,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleSubmit = (e) => {
        if (values.first_name === null || values.first_name === '' || values.last_name === null || values.last_name === '') {
            setErrors({...errors, nameError: true})
            return;
        }
        if (values.contact === null || values.contact === '') {
            setErrors({...errors, contactError: true})
            return;
        }
        if (values.email === null || values.email === '') {
            setErrors({...errors, emailError: true})
            return;
        }
        if (values.password === null || values.password === '') {
            setErrors({...errors, passwordError: true})
            return;
        }
        if (values.confirmPassword !== values.password) {
            setErrors({...errors, confirmPasswordError: true})
            return;
        }
        if(!(errors.passwordError || errors.emailError || errors.confirmPasswordError || errors.nameError || errors.emailError))
        {
            enqueueSnackbar('Sending data....', {variant: "info", key: 'try_signUp'})
            axios({
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    user: {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        contact: values.contact,
                        email: values.email,
                        password: values.password,
                        birthday: birthday.getUTCFullYear() + "-" + (birthday.getUTCMonth()+1) + "-" + birthday.getUTCDate(),
                    },
                    email: values.email,
                    graduation: grad.getUTCFullYear() + "-" + (grad.getUTCMonth()+1) + "-" + grad.getUTCDate(),
                    branch: values.branch
                },
                url: '/auth/register/'
            }).then(response => {
                closeSnackbar('try_signUp')
                setCookie(response.data.token, 'token');
                setCookie(response.data.is_otp_verified, 'verification');
                setErrors({...errors, signUpError: false});
                setOpen(false);
                enqueueSnackbar('Signed Up Successfully!', { variant: 'success', key: 'signUp_success'})
                setTimeout(() => closeSnackbar('signUp_success'), 2000);
                setOTP(true);
                setCookie(response.data.is_otp_verified, 'verification')
                enqueueSnackbar('Sending OTP...', {variant: 'info', key: 'send-otp'})
                axios({
                    method: 'GET',
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type" : "application/json",
                        "Authorization": `Token ${getToken()}`,
                    },
                    url: '/auth/verify-otp/'
                }).then(response => {
                    closeSnackbar('send-otp')
                    enqueueSnackbar('OTP sent to your email Successfully!', {variant: 'success', key: 'success-send'})
                    setTimeout(() => closeSnackbar('success-send'), 2000)
                }).catch(error => {
                    closeSnackbar('resend')
                    enqueueSnackbar('Failed to send OTP', {variant: 'error', key: 'fail-send'})
                    setTimeout(() => closeSnackbar('fail-send'), 2000)
                })
            }).catch(error => {
                closeSnackbar('try_signUp')
                setErrors({...errors, signUpError: true});
                enqueueSnackbar('Failed to Register', { variant: 'error', key: 'signUp_error'})
                setTimeout(() => closeSnackbar('signUp_error'), 2000)
            })
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
                <DialogTitle id="form-dialog-login">SignUp</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can sign up with the email registered in your college's database
                    </DialogContentText>
                    {stage===0?(
                        <>
                            <TextField
                                id="first_name"
                                variant="outlined"
                                label="First Name"
                                type="text"
                                name="first_name"
                                margin="normal"
                                error={errors.nameError || errors.signUpError}
                                helperText={errors.nameError?"Enter a valid name":errors.signUpError?"Invalid credentials":null}
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
                                error={errors.nameError || errors.signUpError}
                                helperText={errors.nameError?"Enter a valid name":errors.signUpError?"Invalid credentials":null}
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
                                helperText={errors.emailError?"Enter a valid email address":errors.signUpError?"Invalid credentials":null}
                                fullWidth
                                required
                            />
                            <TextField
                                id="contact"
                                variant="outlined"
                                label="Contact Number"
                                type="number"
                                name="contact"
                                fullWidth
                                margin="normal"
                                error={errors.contactError || errors.signUpError}
                                helperText={errors.contactError?"Enter a valid contact":errors.signUpError?"Invalid credentials":null}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                id="password"
                                variant="outlined"
                                label="Password"
                                margin="normal"
                                type={visible? "text":"password"}
                                error={errors.passwordError || errors.signUpError}
                                helperText={errors.passwordError?"Enter a valid password":errors.signUpError?"Invalid credentials":null}
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
                                required
                            />
                            <TextField
                                id="confirmPassword"
                                variant="outlined"
                                label="Confirm Password"
                                margin="normal"
                                type={visible? "text":"password"}
                                name="confirmPassword"
                                error={errors.confirmPasswordError || errors.signUpError}
                                helperText={errors.confirmPasswordError?"Passwords do not match!":errors.signUpError?"Invalid credentials":null}
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
                                required
                            />
                            <Button
                                fullWidth
                                margin="normal"
                                onClick={() => {
                                    setStage(stage+1);
                                }}
                                variant="contained"
                                color='primary'
                            >
                                Next
                            </Button>
                        </>
                    ):(
                        <>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    clearable
                                    value={birthday}
                                    label="Date of Birth"
                                    placeholder="Enter your birth date"
                                    inputVariant={'outlined'}
                                    onChange={date => handleDateChange(date)}
                                    minDate={new Date(1950, 5, 1)}
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    fullWidth
                                    autoFocus
                                />
                            </MuiPickersUtilsProvider>
                            <TextField
                                id="branch"
                                name="branch"
                                label="Select Branch"
                                select
                                value={values.branch}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            >
                                {branches.map((branch, i) => {
                                    return (
                                        <MenuItem key={i} value={branch}>
                                            {branch}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    views={["year", "month"]}
                                    label="Graduation Date"
                                    value={grad}
                                    onChange={setGrad}
                                    inputVariant={'outlined'}
                                    margin="normal"
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </>
                    )}
                </DialogContent>
                {stage===0?(
                    <DialogActions/>
                ):(
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button type='submit' onClick={handleSubmit} color="primary">
                            SignUp
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
}
