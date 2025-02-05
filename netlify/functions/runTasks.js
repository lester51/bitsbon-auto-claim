// netlify/functions/runTasks.js
const colors = require('colors');
const { login, spin, accinfo } = require('../../src/index'); // Adjust the path as necessary
require('dotenv').config();

exports.handler = async (event, context) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    try {
        let cookies = await login(username, password);
        let resp = await spin(cookies);
        if (typeof resp.message === 'undefined') throw new Error("Please wait until the timer runs out and try again later.");
        console.log(colors.info.bold("[ SCRIPT ] ") + colors.info(resp.message));
        await accinfo(cookies, true);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Tasks run successfully' }),
        };
    } catch (e) {
        console.log(colors.warn.bold("[ SCRIPT ] ") + colors.error(e.message));
        console.log(colors.warn.bold("[ SCRIPT ] ") + colors.warn("Reconnecting..."));
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
};