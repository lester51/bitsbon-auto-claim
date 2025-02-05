const express = require('express');
const colors = require('colors');
const { displayHeader, accinfo, login } = require('./src/index');
require('dotenv').config();

class Server {
    async startServer() {
        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        const port = process.env.PORT || 3000;

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

        const app = express();

        app.get('/', (req, res) => {
            res.send('SERVER FOR BITBON FAUCET - AUTO FARM SCRIPT\nMADE\nBY\nHackMeSenpai(HMS)');
        });

        app.listen(port, async () => {
            displayHeader();
            console.log(colors.verbose.bold("[ SERVER ]") + colors.info(` Server port ${port} exposed!`));
            let cookies = await login(username, password);
            await accinfo(cookies);
        });
    }
}

module.exports = new Server();