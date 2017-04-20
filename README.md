# CityQuest

This is the source code of a sightseeing app written in Ionic 2, AngularJS and NodeJS.

The GitHub repository has 3 actively used branches. The **master** branch has the latest stable version, the **fix** branch contains the latest versions, which may be unstable. The **marci07iq** branch, and other branches for user names are just temporary storage for the user.

How to test the Ionic 2 app:

1. First of all, you should have `npm` installed.
2. Clone the repository to a directory in your local environment
3. Run the `npm install` command to install all required dependencies
4. Change the server location in `src/providers/ServerIpProvider.ts:16`, and the database location in `server/app.js:37`
5. Run the server by opening a command-line interface in the `server` folder and launch the server with the database login parameters `node app.js <username> <password> <port>`
6. Run the Ionic app by typing `ionic serve` in your local directory

**Techtábor project of Balázs Németh and Marcell Szakály, 2016-2017**
