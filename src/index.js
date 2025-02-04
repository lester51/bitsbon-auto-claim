const axios = require('axios');
const cheerio = require('cheerio');
const colors = require('colors/safe');
const qs = require('qs');
const baseUrl = 'https:/\/bitsbon.com';
const loginUrl = baseUrl+'/system/ajax.php';

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

function displayHeader() {
    process.stdout.write('\x1Bc');
    console.log(colors.silly('========================================'));
    console.log(colors.silly('=   Bitbon Faucet - Auto Farm Script   ='));
    console.log(colors.silly('=      Created by (HMS) lester51       ='));
    console.log(colors.silly('=     https://github.com/lester51      ='));
    console.log(colors.silly('========================================'));
    console.log();
}

async function login(uname, pass) {
    try {
        let res1 = await axios.get(baseUrl);
        let cookie = res1.headers['set-cookie'].map(el=>el.split(';')[0]+';');
        let cookies = cookie.join(' ');
        let $ = cheerio.load(res1.data);
        let form = $('form input[type="hidden"]').attr()
        let key = res1.data.match(/eval(.*)/g)[0].split('|')[138]; //150
        let res2 = await axios.post(loginUrl, qs.stringify({
            a: 'login',
            token: form.value,
            access_key: key,
            username: uname,
            password: pass,
            pin: '',
            remember: 'off',
            response: false
        }), {
            headers: {
   	            'cookie': cookies
            }
        });
        let cookie2 = res2.headers['set-cookie'].map(el=>el.split(';')[0]+';');
        let cookies2 = cookie2.join(' ');
        return [cookies, cookies2];
    }
    catch(e) {
 	    return {
 	        error: 'Something happened while making the request. Please try again.'
 	    }
 	}
}

async function accinfo(cookies, update) {
    try {
        let arr1 = [], arr2 = [];
        if (update) {
            let res3 = await axios.get(baseUrl, {
                headers: {
   	                'cookie': cookies[0]
                }
            });
            $ = cheerio.load(res3.data);
            $('div[class="inner"] div div div').each((id,el)=>{
                arr2.push($(el).next().children('div').text());
            });
            let accinfo2 = arr2.filter(el=>el!=='');
            console.log(colors.debug.bold("[ SCRIPT ]")+colors.cyan(` Updated Coin Balance: ${accinfo2[0]} (${accinfo2[1]})`));
            return;
        }
        else {
        let res1 = await axios.get(baseUrl, {
            headers: {
   	            'cookie': cookies[0]
            }
        });
        let $ = cheerio.load(res1.data);
        let user = $('div[class="user"] div span font').text()
        console.log(colors.debug.bold("[ SCRIPT ]")+colors.cyan(` Logged In User: ${user}`));
        $('div[class="inner"] div div div').each((id,el)=>{
            arr1.push($(el).next().children('div').text());
        });
        let accinfo = arr1.filter(el=>el!=='');
        console.log(colors.debug.bold("[ SCRIPT ]")+colors.cyan(` Membership Level: ${accinfo[2]}`));
        console.log(colors.debug.bold("[ SCRIPT ]")+colors.cyan(` Coin Balance: ${accinfo[0]} (${accinfo[1]})`));
        return;
        }
    }
    catch(e) {
        return {
 	        error: 'Something happened while making the request. Please try again.'
 	    }
    }
}

async function spin(cookies) {
    try {
        let res1 = await axios.get(baseUrl, {
            headers: {
   	            'cookie': cookies[0]
            }
        });
        let token = res1.data.match(/eval(.*)/g)[0].split('|')[91];
        let res2 = await axios.post(loginUrl, qs.stringify({
            a: 'getFaucet',
            token: token,
            challenge: false,
            response: false
        }), {
            headers: {
   	            'cookie': cookies[0]+cookies[1]
            }
        });
        return {
            number_drawn: res2.data.number,
            reward: res2.data.reward,
            message: res2.data.message.match(/i>(.*)\<a/g)[0].slice(3,-3),
            status: res2.data.status
        }
    }
    catch(e) {
 	    return {
 	        error: 'Something happened while making the request. Please try again.'
 	    }
 	}
}

module.exports = {
    displayHeader,
    accinfo,
    login,
    spin
}