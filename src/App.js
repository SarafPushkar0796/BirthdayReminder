import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Grid, Alert, Snackbar } from '@mui/material';

import { ThemeProvider } from '@emotion/react';

import BirthdayProvider from './components/BirthdayContext';
import BirthdayList from './components/BirthdayList';

import CssBaseline from '@mui/material/CssBaseline';
import { fontUse } from './theme.js';

function App() {
		
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [showInstallPrompt, setShowInstallPrompt] = useState(false);	

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