import puppeteer from 'puppeteer-extra';
import puppeteerCore from 'puppeteer-core';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PHARSE } from './pharse.mjs';
import path from 'path';
import clipboardy from 'clipboardy';
import fs from 'fs';

puppeteer.use(StealthPlugin());

global.baseURL = 'https://tgapp.herewallet.app/#tgWebAppData=user%3D%257B%2522id%2522%253A5092427392%252C%2522first_name%2522%253A%2522Milky%2522%252C%2522last_name%2522%253A%2522ID%2522%252C%2522username%2522%253A%2522MilkyID3%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D-1194890408985659543%26chat_type%3Dsender%26auth_date%3D1710647758%26hash%3Dcf5d6364c7287f3881840aecbd6aa64eb0616d6c3d25046e33a64968671ec2fd&tgWebAppVersion=7.0&tgWebAppPlatform=android&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%23f0f0f0%22%2C%22text_color%22%3A%22%23222222%22%2C%22hint_color%22%3A%22%23';

// utility
const wait = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
};

const logError = (error) => {
    fs.appendFileSync('error.log', `[${new Date().toISOString()}] ${error}\n`);
};

const countdown = (seconds) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(interval);
                resolve();
            } else {
                process.stdout.write(`Countdown: ${seconds} seconds remaining...\r`);
                seconds--;
            }
        }, 1000);
    });
};

const waitWithCountdown = async (milliseconds) => {
    const seconds = Math.ceil(milliseconds / 1000);
    await countdown(seconds);
};

const main = async () => {
    try {

        let running = true; // Variable to control the loop

        while (running) {
            for (let i = 0; i < PHARSE.length; i++) {
                let browser, page;
                try {
                    browser = await puppeteerCore.launch({
                        headless: true,
                        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                        
                    });

                    page = await browser.newPage();

                    const client = await page.target().createCDPSession();
                    await page.goto(baseURL);
                    console.log(await page.title());
                    await wait(2 * 2000);
                    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                    console.log("Halaman diperbarui");
                    await page.click('#root > div > div > button > p');
                    await wait(2 * 2000);

                    const textarea = await page.$('#root > div > div > div:nth-child(3) > label > textarea');

                    if (textarea) {
                        await textarea.type(PHARSE[i]);
                    } else {
                        console.error('Textarea tidak ditemukan.');
                    }

                    await wait(2 * 2000);

                    await page.click('#root > div > div > div:nth-child(4) > button');
                    await wait(10 * 2000);

                    await page.click('#root > div > div > button');
                    await wait(2 * 2000);

                    await page.click('#root > div > div > div > div > div:nth-child(4) > div:nth-child(2) > div');
                    await wait(2 * 2000);

                    await page.click('#root > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > button');
                    await wait(2 * 2000);

                    await page.click('#root > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) > button');
                    await waitWithCountdown(15 * 60 * 1000);
                    console.log("Time's up!");

                } catch (error) {
                    logError(`Error occurred: ${error}`);
                    if (browser) await browser.close();
                    continue;
                }

                await browser.close();
            }
            
            console.log('Waiting for next iteration...');
            await wait(3 * 60 * 1000);
        }
    } catch (error) {
        logError(`Unhandled error occurred: ${error}`);
    }
};

main();
