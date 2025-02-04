const colors = require('colors');
const path = require('path');
const { accinfo, login, spin } = require('../../src/index'); // Adjust the path as necessary

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

exports.handler = async (event, context) => {
    try {
        let cookies = await login(username, password);
        let resp = await spin(cookies);
        if (typeof resp === 'undefined') throw new Error("Please wait until the timer runs out and try again later.");
        console.log(colors.info.bold("[ SCRIPT ] ") + colors.info(resp.message));
        await accinfo(cookies, true);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Tasks executed successfully." })
        };
    } catch (e) {
        console.log(colors.warn.bold("[ SCRIPT ] ") + colors.error(e.message));
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message })
        };
    }
};