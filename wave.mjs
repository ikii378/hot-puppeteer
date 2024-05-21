import puppeteer from 'puppeteer-extra';
import puppeteerCore from 'puppeteer-core';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EMAIL } from './email.mjs';
import { USERNAME } from './name.mjs';
import path from 'path';
import clipboardy from 'clipboardy';
import fs from 'fs';

puppeteer.use(StealthPlugin());

global.baseURL = 'https://walletapp.waveonsui.com/#tgWebAppData=user%3D%257B%2522id%2522%253A5500634824%252C%2522first_name%2522%253A%2522Chichi%2522%252C%2522last_name%2522%253A%2522_22%2522%252C%2522username%2522%253A%2522akhtarrichie%2522%252C%2522language_code%2522%253A%2522id%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D1775002931804411944%26chat_type%3Dsender%26auth_date%3D1716207060%26hash%3D62d261c8a1a7fd08cb599379c646a7fbdc874629a568739a6bfbb9cb1dbaf7e4&tgWebAppVersion=7.2&tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212d3b%22%2C%22section_bg_color%22%3A%22%231d2733%22%2C%22secondary_bg_color%22%3A%22%23151e27%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%237d8b99%22%2C%22link_color%22%3A%22%235eabe1%22%2C%22button_color%22%3A%22%2350a8eb%22%2C%22bugton_text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23242d39%22%2C%22accent_text_color%22%3A%22%2364b5ef%22%2C%22section_header_text_color%22%3A%22%2379c4fc%22%2C%22subtitle_text_color%22%3A%22%237b8790%22%2C%22destructive_text_color%22%3A%22%23ee686f%22%7D';
global.baseURLapillon = 'https://app.apillon.io/register/?REF=oMgpu';

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
        const pathToExtensionNoCaptcha = path.join(process.cwd(), './noCaptcha');
        const pathToExtensionUBlock = path.join(process.cwd(), './uBlock0.chromium');

        let running = true; // Variable to control the loop

        while (running) {
            for (let i = 0; i < USERNAME.length; i++) {
                let browser, page;
                try {
                    browser = await puppeteerCore.launch({
                        headless: false,
                        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                        args: [
                            `--disable-extensions-except=${pathToExtensionNoCaptcha},${pathToExtensionUBlock}`,
                            `--load-extension=${pathToExtensionNoCaptcha}`,
                            `--load-extension=${pathToExtensionUBlock}`,
                        ],
                    });

                    page = await browser.newPage();

                    const client = await page.target().createCDPSession();
                    await page.goto(baseURL);
                    console.log(await page.title());
                    
                    await wait(2 * 1000);
                    await page.click('#section-create-account\\ relative > div > div.body_button.absolute.bottom-12 > button.text-white.btn-login');

                    await wait(2 * 1000);
                    const textarea = await page.$('#section-login > div > div:nth-child(4) > label > textarea');

                    if (textarea) {
                        await textarea.type(USERNAME[i]);
                    } else {
                        console.error('Textarea tidak ditemukan.');
                    }

                    await wait(2 * 1000);
                    await page.click('#section-login > div > div.w-full.mt-auto > button');

                    await waitWithCountdown(5 * 60 * 1000);
                    console.log("Time's up!");

                } catch (error) {
                    logError(`Error occurred: ${error}`);
                    if (browser) await browser.close();
                    continue;
                }

                await browser.close();
            }
            
            console.log('Waiting for next iteration...');
            await wait(1 * 60 * 1000); // Menunggu selama 10 menit
        }
    } catch (error) {
        logError(`Unhandled error occurred: ${error}`);
    }
};

main();
