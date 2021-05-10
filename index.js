const puppeteer = require('puppeteer');

var url = process.argv[2];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(url);
  let retry = true;

  do {
    const redirectButton = await page.$('.cta-container > a');
    let value = redirectButton ? await redirectButton.evaluate(el => el.textContent) : null;
    if (value === 'Reservar') {
      let newUrl = await redirectButton.evaluate(el => el.getAttribute('href'));
      await page.goto(newUrl);
      await registerForPair(page);
      retry = false;
    }
    else {
      await page.reload();
    }
  } while (retry);
})();

async function registerForPair(page) {

  const shoeSize = process.argv[3];
  const user = process.argv[4] === 'JP';
  const cellPhone = user ? '1122548099' : '1151552666';
  const dni = user ? '40946804' : '37608037';

  // Fill Cellphone
  await page.$eval('#field11', (el, cellPhone) => { el.value = cellPhone; }, cellPhone);

  // Fill DNI
  await page.$eval('#field12', (el, dni) => { el.value = dni; }, dni);

  // Select shoe size
  const [button] = await page.$x(`//button[contains(., ${shoeSize})]`);
  await button.click();

  // Accept terms and conditions
  const termsAndConditionsButton = await page.$('#field27');
  await termsAndConditionsButton.click();

  // Click on register
  const registerButtonSection = await page.$('.event-book--actions');
  const registerButton = await registerButtonSection.$('button');
  await registerButton.click();
}