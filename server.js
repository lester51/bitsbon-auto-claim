class Server {
    async startServer() {
        const colors = require('colors');
        const path = require('path'); 
        const express = require('express');
        const {
            displayHeader,
            accinfo,
            login,
            ptcAds,
            spin
        } = require('./src/index');
        require('dotenv').config();
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
        
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function runTasks() {
            try {
                let cookies = await login(username, password);
                let resp = await spin(cookies);
                if (typeof resp.message === 'undefined') throw new Error("Please wait until the timer runs out and try again later.");
                console.log(colors.info.bold("[ SPIN ] ")+colors.info(resp.message))
                await accinfo(cookies, true);
            }
            catch(e) {
                console.log(colors.warn.bold("[ SCRIPT ] ")+colors.error(e.toString()))
                console.log(colors.warn.bold("[ SCRIPT ] ")+colors.warn("Reconnecting..."))
                await delay(60000);
                await runTasks();
            }
        }
        
        async function runEveryTenMinutes() {
            while (true) {
                await runTasks();
                await delay(600000);
            }
        }
        
        async function runPtcViewer() {
            while (true) {
                let cookies = await login(username, password);
                let res1 = await ptcAds(cookies);
                console.log(colors.info.bold("[ PTC ADS ]")+colors.info(res1))
                await accinfo(cookies, true)
            }
        }

        app.get('/', (req, res) => {
            res.send('SERVER FOR BITBON FAUCET - AUTO FARM SCRIPT\nMADE\nBY\nHackMeSenpai(HMS)')
        });
        
        app.listen(port, async() => {
            displayHeader();
            console.log(colors.verbose.bold("[ SERVER ]")+colors.info(` Server port ${port} exposed!`));
            let cookies = await login(username, password);
            await accinfo(cookies);
            runEveryTenMinutes();
            runPtcViewer();
        });
    }
}

module.exports = new Server();