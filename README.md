
# Birthday Reminder

Birthday Reminder is a React application that helps you keep track of birthdays and sends notifications to remind you of upcoming birthdays. The app can also be installed as a Progressive Web App (PWA) for easy access.


## Features

- Add, Edit, and Delete Birthdays: Easily manage a list of birthdays.
- Notifications: Get reminders for upcoming birthdays.
- Search Functionality: Quickly find a birthday by name.
- PWA Installation: Install the app on your device for quick access.
- Export/Import Data: Export birthdays to a CSV file and import from a CSV file.
- GitHub Actions CI/CD: Automatically deploy the app to GitHub Pages on every push to the main branch.


## Installation

Clone repository

```bash
  git clone https://github.com/SarafPushkar0796/BirthdayReminder.git
  cd BirthdayReminder
```
Install dependencies

```bash
  npm install
```

Run the app locally

```bash
  npm start
```
    
## Deployment

This project is set up to deploy automatically to GitHub Pages using GitHub Actions. On every push to the main branch, the application will be built and deployed.

```bash
  npm run build
  npm run deploy
```


## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?


## Usage/Examples

Adding a Birthday
- Enter the name and date of birth in the form.
- Click the "Add Birthday" button.

Editing a Birthday
- Click the "Edit" button on the birthday card.
- Modify the details in the dialog box and click "Update".

Deleting a Birthday
- Click the "Delete" button on the birthday card.
- Confirm the deletion in the dialog box.

Exporting/Importing Birthdays
- Click the "Export" / "Import" button.
- A CSV file with your birthdays will be downloaded or can be uploaded respectively.


## Notifications

- The app requests notification permissions on the first visit.
- Notifications are sent for upcoming birthdays within the next week.
- If notifications are denied, an alert is shown informing the user that notifications won't be available.

## PWA Installation

- When you visit the app for the first time, a snackbar with an "Install" button will appear.
- Click "Install" to add the app to your home screen or desktop.
## License

[MIT](https://choosealicense.com/licenses/mit/)

