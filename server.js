class Server {
    async startServer() {
        const colors = require('colors'); 
        const express = require('express');
        const run = require('./src/run');
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
            res.send('SERVER FOR BITBON FAUCET - AUTO FARM SCRIPT\nMADE\nBY\nHackMeSenpai(HMS)')
        });
        
        app.listen(port, async() => {;
            console.log(colors.verbose.bold("[ SERVER ]")+colors.info(` Server port ${port} exposed!`));
            run();
        });
    }
}

module.exports = new Server();