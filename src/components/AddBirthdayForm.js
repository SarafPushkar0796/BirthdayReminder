import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material'; // Import Material UI components
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { BirthdayContext } from './BirthdayContext';

const AddBirthdayForm = ({ onAddBirthday, editData, clearEditData }) => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const { addBirthday, updateBirthday } = useContext(BirthdayContext);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setDateOfBirth(dayjs(editData.dateOfBirth));
        }
    }, [editData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            const birthdayData = { name, dateOfBirth: dayjs(dateOfBirth).toISOString() };
            if (editData) {
                updateBirthday(editData.id, birthdayData);
                clearEditData();
            } else {
                addBirthday(birthdayData);
            }
            setName('');
            setDateOfBirth(null);
        }
    };

    const validateForm = () => {
        if (!name || !dateOfBirth) {
            setErrorMessage('Please enter a name and select a date of birth.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Stack spacing={3}>
                        <TextField
                            error={errorMessage ? true : false}
                            id="outlined-error-helper-text margin-normal"
                            helperText={errorMessage ? "Required" : ""}
                            label="Name"
                            margin="normal"
                            value={name}
                            onChange={(e) => {
                                setErrorMessage('')
                                setName(e.target.value)
                            }}
                        />

                        <DatePicker
                            error={errorMessage ? true : false}
                            id="outlined-error-helper-text margin-normal"
                            helperText={errorMessage ? "Required" : ""}
                            label="Date"
                            value={dateOfBirth}
                            onChange={(newValue) => {
                                setErrorMessage('');
                                setDateOfBirth(newValue);                                
                            }}
                        />
                    </Stack>
                    <Stack>
                        <Button type="submit" variant="contained">
                            {editData ? 'Update Birthday' : 'Add Birthday'}
                        </Button>
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </Stack>
                </Stack>
            </form>

        </LocalizationProvider>
    );
};

export default AddBirthdayForm;
