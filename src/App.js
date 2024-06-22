import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Grid, Alert, Snackbar } from '@mui/material';

import { ThemeProvider } from '@emotion/react';

import BirthdayProvider from './components/BirthdayContext';
import BirthdayList from './components/BirthdayList';

import CssBaseline from '@mui/material/CssBaseline';
import { fontUse } from './theme.js';

import { BirthdayContext } from './components/BirthdayContext';

function App() {
		
	const { birthdays } = useContext(BirthdayContext);
	const [notificationDenied, setNotificationDenied] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [showInstallPrompt, setShowInstallPrompt] = useState(false);

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

	// check for upcoming birthdays
	const checkUpcomingBirthdays = (birthdays) => {
		const today = new Date();
		const upcoming = birthdays.filter((birthday) => {
			const birthDate = new Date(birthday.dateOfBirth);
			const upcomingDate = new Date(today);
			upcomingDate.setDate(today.getDate() + 7); // Check for birthdays within the next week
			return (
				birthDate.getDate() === upcomingDate.getDate() &&
				birthDate.getMonth() === upcomingDate.getMonth()
			);
		});
		return upcoming;
	};

	// send notification for upcoming birthday
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
		}, 24 * 60 * 60 * 1000); // Check once a day

		return () => clearInterval(interval);
	}, [birthdays]);

	// For app installation
	useEffect(() => {
		const visited = localStorage.getItem('visited');
		if (!visited) {
			localStorage.setItem('visited', 'true');
			setShowInstallPrompt(true);
		}

		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setShowInstallPrompt(true);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		// cleanup function to remove the beforeinstallprompt event listener when the component is unmounted.
		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	}, []);

	const handleInstallClick = () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the install prompt');
				} else {
					console.log('User dismissed the install prompt');
				}
				setDeferredPrompt(null);
				setShowInstallPrompt(false);
			});
		}
	};

	const handleCloseSnackbar = () => {
		setShowInstallPrompt(false);
	};

	return (
		<BirthdayProvider>
			<ThemeProvider theme={ fontUse }>
				<CssBaseline />
				<div className="App">
					<AppBar position="static">
						<Toolbar variant="dense">
							<Typography variant="h6" color="inherit">
								Birthday Reminder
							</Typography>
						</Toolbar>
					</AppBar>
				</div>

				<Grid container rowSpacing={1} spacing={0.5} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Grid item xs={12} md={8}>
						<Box sx={{ padding: '20px' }}>
							<BirthdayList />
						</Box>
					</Grid>
				</Grid>

				{notificationDenied && (
					<Snackbar open={notificationDenied} autoHideDuration={6000}>
						<Alert severity="warning" sx={{ width: '100%' }}>
							Notifications are disabled. The app won't be able to remind you of upcoming birthdays.
						</Alert>
					</Snackbar>
				)}

				<Snackbar
					open={showInstallPrompt}
					onClose={handleCloseSnackbar}
					message="Install the App for quick access"
					action={
						<Button color="inherit" size="small" onClick={handleInstallClick}>
							INSTALL
						</Button>
					}
				/>
			</ThemeProvider>
		</BirthdayProvider>
	);
}

export default App;