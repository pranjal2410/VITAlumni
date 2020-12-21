import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { useSnackbar } from "notistack";
import {getToken} from "../authentication/cookies";
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DialogContentText from "@material-ui/core/DialogContentText";
import useTheme from "@material-ui/core/styles/useTheme";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const branches = [
    "Computer Engineering",
    "Electronics & Telecommunication Engineering",
    "Mechanical Engineering",
    "Instrumentation Engineering",
    "Civil Engineering",
    "Chemical Engineering"
]

export const EditProfile = ({ open, setOpen }) => {
    const theme = useTheme();
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        contact: null,
        email: '',
        birthday: '',
        graduation: null,
    });
    const [grad, setGrad] = useState(new Date());
    const [spinner, setSpinner] = useState(true);
    const [selectedDate, handleDateChange] = useState(new Date());
    const [branch, setBranch] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [errors, setErrors] = useState({
        nameError: false,
        contactError: false,
        editError: false,
    });

    useEffect(() => {
        axios({
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            url: '/portal/edit-profile/'
        }).then(res => {
            setValues({
                ...values,
                first_name: res.data.user_data.first_name,
                last_name: res.data.user_data.last_name,
                contact: res.data.user_data.contact,
                email: res.data.user_data.email,
                graduation: res.data.user_data.graduation,
                birthday: res.data.user_data.birthday
            });
            handleDateChange(new Date(res.data.user_data.birthday));
            if(res.data.user_data.branch !== null)
                setBranch(res.data.user_data.branch);
            if(res.data.user_data.graduation !== null)
                setGrad(new Date(res.data.user_data.graduation));
            return values;
        }).then(val => {
            setSpinner(false);
        }).catch(error => {
            console.log(error);
        })
    }, [open])

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    const handleSubmit = () => {
        if (values.first_name === null || values.first_name === '' || values.last_name === null || values.last_name === '') {
            setErrors({...errors, nameError: true})
            return;
        }
        if (values.contact === null || values.contact === '') {
            setErrors({...errors, contactError: true})
            return;
        }
        if(!(errors.nameError || errors.contactError))
        {
            enqueueSnackbar('Sending data....', {variant: "info", key: 'try_edit'})
            axios({
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Token ${getToken()}`,
                },
                data: {
                    'first_name': values.first_name,
                    'last_name': values.last_name,
                    'contact': values.contact,
                    'email': values.email,
                    'birthday': selectedDate.getUTCFullYear() + "-" + (selectedDate.getUTCMonth()+1) + "-" + selectedDate.getUTCDate(),
                    'branch': branch,
                    'graduation': grad.getUTCFullYear() + "-" + (grad.getUTCMonth()+1) + "-" + grad.getUTCDate(),
                },
                url: '/portal/edit-profile/'
            }).then(response => {
                closeSnackbar('try_edit')
                setErrors({...errors, editError: false});
                setOpen(false);
                enqueueSnackbar('Profile edited successfully!', { variant: 'success', key: 'edit_success'})
                setTimeout(() => closeSnackbar('edit_success'), 3000);
            }).catch(error => {
                closeSnackbar('try_edit')
                setErrors({...errors, editError: true});
                enqueueSnackbar('Failed to edit profile', { variant: 'error', key: 'edit_error'})
                setTimeout(() => closeSnackbar('edit_error'), 3000)
            })
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-edit">
                {spinner?(
                    <div style={{
                        display: 'flex',
                        '& > * + *': {
                            marginLeft: theme.spacing(2),
                        },
                        justifyContent: 'center',
                    }}>
                        <CircularProgress />
                    </div>
                ):(
                    <>
                        <DialogTitle id="form-dialog-edit">Edit Profile</DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ color: theme.palette.text.primary }}>
                                You can edit your profile details anytime you want!
                            </DialogContentText>
                            <TextField
                                id="first_name"
                                variant="outlined"
                                label="First Name"
                                type="text"
                                defaultValue={values.first_name}
                                name="first_name"
                                margin="normal"
                                error={errors.nameError || errors.editError}
                                helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                onChange={handleChange}
                            />
                            <TextField
                                id="last_name"
                                variant="outlined"
                                label="Last Name"
                                type="text"
                                name="last_name"
                                margin="normal"
                                defaultValue={values.last_name}
                                onChange={handleChange}
                                error={errors.nameError || errors.editError}
                                helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                autoFocus
                                style={{ marginLeft: "20px" }}
                            />
                            <Typography component='h2' variant='h6'>
                                NOTE :- If you edit your name, you can't change it again for 60 days.
                            </Typography>
                            <TextField
                                id="contact"
                                variant="outlined"
                                label="Contact Number"
                                type="number"
                                name="contact"
                                defaultValue={values.contact}
                                margin="normal"
                                error={errors.contactError || errors.signUpError}
                                helperText={errors.contactError?"Enter a valid contact":errors.signUpError?"Invalid credentials":null}
                                onChange={handleChange}
                                autoFocus
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    clearable
                                    value={selectedDate}
                                    placeholder="Enter your birth date"
                                    inputVariant={'outlined'}
                                    onChange={date => handleDateChange(date)}
                                    minDate={new Date(1950, 5, 1)}
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    style={{ marginLeft: "20px" }}
                                />
                            </MuiPickersUtilsProvider>
                            <TextField
                                id="branch"
                                name="branch"
                                label="Select Branch"
                                select
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                autoFocus
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
                                />
                            </MuiPickersUtilsProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} color="primary">
                                Edit Details
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}
