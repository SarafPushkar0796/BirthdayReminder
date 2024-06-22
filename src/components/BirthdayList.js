import React, { useContext, useState, useEffect } from 'react';
import {
    Alert,
    Stack,
    Card,
    CardContent,
    CardActions,
    Input,
    Button,
    Grid,
    Container,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ButtonGroup,
    Snackbar
} from '@mui/material';

// import DeleteIcon from '@mui/icons-material/Delete';
import { Edit, Delete, FileUpload, FileDownload } from '@mui/icons-material';
import { BirthdayContext } from './BirthdayContext';
import AddBirthdayForm from './AddBirthdayForm';
import EditBirthdayDialog from './EditBirthdayDialog';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const BirthdayList = (dateOfBirth) => {
    const { birthdays, setBirthdays, deleteBirthday, updateBirthday } = useContext(BirthdayContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [editData, setEditData] = useState(null);
    const [deleteId, setDeleteId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [notificationDenied, setNotificationDenied] = useState(false);

    const checkUpcomingBirthdays = (birthdays) => {
        const today = new Date();
        const upcoming = birthdays.filter((birthday) => {
            const birthDate = new Date(birthday.dateOfBirth);

            // Set birthDate to this year's birthday date
            birthDate.setFullYear(today.getFullYear());

            // If the birthday already passed this year, check the next year
            if (birthDate < today) {
                birthDate.setFullYear(today.getFullYear() + 1);
            }

            const daysDifference = (birthDate - today) / (1000 * 60 * 60 * 24);

            return daysDifference <= 7 && daysDifference >= 0;
        });

        return upcoming;
    };


    // Notification request
    const requestNotificationPermission = () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'denied') {
                    setNotificationDenied(true);
                }
            });
        }
    };

    const sendNotification = (upcomingBirthdays) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            upcomingBirthdays.forEach((birthday) => {
                new Notification('Upcoming Birthday', {
                    body: `Don't forget ${birthday.name}'s birthday is coming up!`,
                    icon: '/path/to/icon.png', // Optional: Add an icon for the notification
                });
            });
        }
    };

    useEffect(() => {
        requestNotificationPermission();

        const interval = setInterval(() => {
            const upcoming = checkUpcomingBirthdays(birthdays);
            if (upcoming.length > 0) {
                sendNotification(upcoming);
            }
        }, 60 * 60 * 1000); // Check once a day

        return () => clearInterval(interval);
    }, [birthdays]);

    // Function to handle exporting the data as CSV
    const handleExport = () => {
        const csv = Papa.unparse(birthdays); // Convert JSON data to CSV format using PapaParse
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); // Create a Blob from the CSV string
        saveAs(blob, 'birthdays.csv'); // Trigger a file download
    };

    // Function to handle importing the data from CSV
    const handleImport = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (result) => {
                const importedBirthdays = result.data.map(birthday => ({
                    id: uuidv4(),
                    ...birthday,
                    dateOfBirth: new Date(birthday.dateOfBirth).toISOString(), // Ensure proper date format
                }));
                setBirthdays([...birthdays, ...importedBirthdays]);
            },
        });
    };

    const handleEditBirthday = (birthday) => {
        setEditData(birthday);
        setOpenEditDialog(true);
    };

    const handleDeleteBirthday = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        deleteBirthday(deleteId);
        setOpenDeleteDialog(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditData(null);
    };

    // Calculate age
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;

        const today = new Date();
        const birthDate = new Date(dateOfBirth);

        if (isNaN(birthDate)) {
            return null; // Invalid date format
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Search birthdays
    const filteredBirthdays = birthdays.filter((birthday) => {
        const searchQueryLower = searchQuery.toLowerCase();
        return birthday.name.toLowerCase().includes(searchQueryLower);
    });

    return (
        <Stack spacing={4}>
            <AddBirthdayForm />
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="h5">Birthdays</Typography>

                    {/* Import/Export CSV */}
                    <ButtonGroup size="small" variant="outlined" aria-label="Basic button group">
                        <Button startIcon={<FileUpload />}>
                            <label htmlFor="import-file-input">
                                <Input
                                    id="import-file-input"
                                    type="file"
                                    accept=".csv, text/csv"
                                    style={{ display: 'none' }}
                                    onChange={handleImport}
                                />
                                Import
                            </label>
                        </Button>
                        <Button startIcon={<FileDownload />} onClick={handleExport}>
                            Export
                        </Button>
                    </ButtonGroup>
                </Stack>

                {/* Search Box */}
                <TextField
                    label="Search Birthdays"
                    type="search"
                    onChange={(event) => setSearchQuery(event.target.value.toLowerCase())}
                />

                {filteredBirthdays.length > 0 ? (
                    filteredBirthdays.map((birthday) => (
                        <Card variant="outlined" key={birthday.id}>
                            <CardContent>
                                <Typography gutterBottom variant="subtitle1">{birthday.name} • {calculateAge(birthday.dateOfBirth)} years old</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    DOB: {dayjs(birthday.dateOfBirth).format('DD-MM-YYYY')}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" variant="outlined" startIcon={<Edit />} color="info" onClick={() => handleEditBirthday(birthday)}>Edit</Button>
                                <Button size="small" variant="outlined" startIcon={<Delete />} color="error" onClick={() => handleDeleteBirthday(birthday.id)}>Delete</Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Alert severity="info">No birthdays found.</Alert>
                )}
            </Stack>
            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this birthday?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Birthday */}
            {editData && (
                <EditBirthdayDialog
                    open={openEditDialog}
                    handleClose={handleEditDialogClose}
                    birthdayData={editData}
                    updateBirthday={updateBirthday}
                />
            )}

            {notificationDenied && (
                <Snackbar open={notificationDenied} autoHideDuration={6000}>
                    <Alert severity="warning" sx={{ width: '100%' }}>
                        Notifications are disabled. The app won't be able to remind you of upcoming birthdays.
                    </Alert>
                </Snackbar>
            )}
        </Stack>
    );
};

export default BirthdayList;