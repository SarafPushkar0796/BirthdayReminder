import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Stack } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EditBirthdayDialog = ({ open, handleClose, birthdayData, updateBirthday }) => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);

    useEffect(() => {
        if (birthdayData) {
            setName(birthdayData.name);
            setDateOfBirth(dayjs(birthdayData.dateOfBirth));
        }
    }, [birthdayData]);

    const handleSubmit = () => {
        const updatedBirthday = {
            ...birthdayData,
            name,
            dateOfBirth: dateOfBirth.toISOString(),
        };
        updateBirthday(birthdayData.id, updatedBirthday);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Birthday</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Birth"
                            value={dateOfBirth}
                            onChange={(newValue) => setDateOfBirth(newValue)}
                        />
                    </LocalizationProvider>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBirthdayDialog;