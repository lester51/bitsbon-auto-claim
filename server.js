const express = require('express');
const colors = require('colors');
const path = require('path');
const { displayHeader, accinfo, login, spin } = require('./src/index');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config({
    path: path.resolve(__dirname, './.env')
});

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

// Serve a simple message
app.get('/', (req, res) => {
    res.send('SERVER FOR BITBON FAUCET - AUTO FARM SCRIPT\nMADE\nBY\nHackMeSenpai(HMS)');
});

// Endpoint to run tasks manually (for local testing)
app.get('/run-tasks', async (req, res) => {
    try {
        let cookies = await login(username, password);
        let resp = await spin(cookies);
        if (typeof resp === 'undefined') throw new Error("Please wait until the timer runs out and try again later.");
        console.log(colors.info.bold("[ SCRIPT ] ") + colors.info(resp.message));
        await accinfo(cookies, true);
        res.status(200).send("Tasks executed successfully.");
    } catch (e) {
        console.log(colors.warn.bold("[ SCRIPT ] ") + colors.error(e.message));
        res.status(500).send(e.message);
    }
});

// Start the server
app.listen(port, async () => {
    displayHeader();
    console.log(colors.verbose.bold("[ SERVER ]") + colors.info(` Server port ${port} exposed!`));
    let cookies = await login(username, password);
    await accinfo(cookies);
});