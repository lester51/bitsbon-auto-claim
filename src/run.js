const {
    displayHeader,
    accinfo,
    login,
    spin
} = require('./src/index');
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTasks() {
    try {
        let cookies = await login(username, password);
        let resp = await spin(cookies);
        if (typeof resp === 'undefined') throw new Error("Please wait until the timer runs out and try again later.");
        console.log(colors.info.bold("[ SCRIPT ] ")+colors.info(resp.message))
        await accinfo(cookies, true);
    }
    catch(e) {
        console.log(colors.warn.bold("[ SCRIPT ] ")+colors.error(e.error))
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

async function run() {
    displayHeader();
    let cookies = await login(username, password);
    await accinfo(cookies);
    runEveryTenMinutes();
}

module.exports = run;