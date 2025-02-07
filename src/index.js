const axios = require('axios');
const cheerio = require('cheerio');
const scrapingbee = require('scrapingbee');
const colors = require('colors/safe');
const qs = require('qs');
const baseUrl = 'https:/\/bitsbon.com';
const proccessingUrl = baseUrl+'/system/ajax.php';
const captchaUrl  = baseUrl+'/system/libs/captcha/request.php';
require('dotenv').config();

async function headlessBrowser(url,cookie) {
    let client = new scrapingbee.ScrapingBeeClient(process.env.API_KEY);
    let ck = cookie.split(';').reduce((acc, cook) => {
        let [name, value] = cook.split('=').map(c => c.trim());
        if (name && value) acc[name] = value;
        return acc;
    }, {});
    let res = await client.get({
        url: url,
        params: {
    	    'render_js': 'true',
    	    'wait': '30000',
    	    'json_response': 'true',
    	    'screenshot': 'true',
            'screenshot_full_page': 'true',
            'window_width': '375',
        },
        cookies: ck
    })
    return res;
}

async function solveCaptcha(ptcAdsList,config) {
    try {
  	    let headers = {
            'authority': 'bitsbon.com',
            'cookie': config.cookies,
            'origin': baseUrl,
            'referer': ptcAdsList[0],
            'x-requested-with': 'XMLHttpRequest',
        };
        let data1 = 'cID=0&pC='+config.captchaAns+'&rT=2';
  	    let data2 = 'a=proccessPTC&data='+config.sid+'&token='+config.token+'&captcha-idhf=0&captcha-hf='+config.captchaAns;
        let res1 = await axios.post(captchaUrl, data1, { headers });
        let res2 = await axios.post(proccessingUrl, data2, { headers });
        return res2.data.message;
    } catch (error) {
        return 'Error solving captcha:'+error;
    }
}

async function gemini(imgb64) {
    try {
  	    let data = {
            model: "gemini-2.0-flash-lite-preview-02-05",
            contents: [
                {
                    parts: [
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: imgb64
                            }
                        }, {
                            text: "This image has a captcha at the center. which of those 5 items are not same? solve it and give me the index (0-4) of the answer starts. no need to explain just the answer."
                        }
                    ]
                }
            ]
        };
        let res = await axios.post('https:/\/us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1', data);
        return parseInt(res.data.candidates[0].content.parts[0].text);
    } catch (error) {
        return 'Error fetching captcha: '+error;
    }
}

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
        let res2 = await axios.post(proccessingUrl, qs.stringify({
            a: 'login',
            token: form.value,
            access_key: key,
            username: uname,
            password: pass,
            pin: '',
            remember: 'on',
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
            console.log(colors.debug.bold("[ BALANCE ]")+colors.cyan(` Updated Coin Balance: ${accinfo2[0]} (${accinfo2[1]})`));
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
        console.log(colors.debug.bold("[ USER ]")+colors.cyan(` Logged In User: ${user}`));
        $('div[class="inner"] div div div').each((id,el)=>{
            arr1.push($(el).next().children('div').text());
        });
        let accinfo = arr1.filter(el=>el!=='');
        console.log(colors.debug.bold("[ INFO ]")+colors.cyan(` Membership Level: ${accinfo[2]}`));
        console.log(colors.debug.bold("[ BALANCE ]")+colors.cyan(` Coin Balance: ${accinfo[0]} (${accinfo[1]})`));
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
        let res2 = await axios.post(proccessingUrl, qs.stringify({
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

async function ptcAds(cookies) {
    try {
        cookies = cookies.join(' ');
	    let res1 = await axios.get('https:/\/bitsbon.com/ptc.html', { headers: { 'cookie': cookies} });
        let $ = cheerio.load(res1.data);
        let javascript = $('main').next().text();
        let ptcAds = res1.data.match(/opensite\(.*\);/g);
        ptcAds = ptcAds.map(el=>el.replace('opensite','opensite2'));
        let script = javascript.match(/function\s+opensite\s*\(.*?\{[^]*?\}/g)[0].replace('opensite','opensite2').replace(/remove\(a\)/g,'').replace(/, b/g,'').replace(/childWindow = open\((.*)\);/, 'return $1;');
        let ptcAdsList = [];
        for (let ptcUrl of ptcAds) ptcAdsList.push(eval(javascript+'\n'+script+'\n'+ptcUrl));
        let res2 = await axios.get(ptcAdsList[0], { headers: { 'cookie': cookies} });
        let res3 = await headlessBrowser(ptcAdsList[0],cookies);
        let decoder = new TextDecoder();
        let text = decoder.decode(res3.data);
        let dat = JSON.parse(text);
        let sid = dat.body.match(/var sid = '([^']+)'/)[1];
        let token = dat.body.match(/var token = '([^']+)'/)[1];
        let fullCookies = dat.cookies.map(el=>el.name+'='+el.value+';').join(' ');
        $ = cheerio.load(dat.body);
        let captchaHash = [];
        $('center div div[class="captcha-modal"] div[class="captcha-modal__icons"] .captcha-image').each((id,el)=>{
            captchaHash.push($(el).attr('icon-hash'))
        });
        let ans = await gemini(dat.screenshot);
        let res4 = await solveCaptcha(ptcAdsList,{
            captchaAns: captchaHash[ans],
            cookies: fullCookies,
            sid: sid,
            token: token
        });
        let matches = res4.match(/>([^<]+)</g);
        return matches ? matches.map(match => match.slice(1, -1).trim()).join(' ') : '';
    }
    catch(e) {
        //console.log(e)
        return {
 	        error: 'Something happened while making the request. Please try again.'
 	    }
 	}
}

module.exports = {
    displayHeader,
    accinfo,
    login,
    ptcAds,
    spin
}