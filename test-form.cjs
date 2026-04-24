const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/Tour02');
  await page.waitForSelector('form');

  const date = new Date();
  date.setDate(date.getDate() + 5);
  const futureDate = date.toISOString().split('T')[0];

  await page.$eval('input[type="date"]', (el, val) => el.value = val, futureDate);
  await page.evaluate(() => {
    const el = document.querySelector('input[type="date"]');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const selects = await page.$$('select');
  if (selects.length >= 2) {
    await selects[0].select('10:00');
    await selects[1].select('es');
  }

  await page.$eval('input[type="number"]', el => el.value = '2');
  await page.evaluate(() => {
    const el = document.querySelector('input[type="number"]');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.$eval('input[type="email"]', el => el.value = 'test@example.com');
  await page.evaluate(() => {
    const el = document.querySelector('input[type="email"]');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Evaluate debug div
  const debugText = await page.$eval('#debug-fields', el => el.innerText);
  console.log('DEBUG TEXT:', debugText);

  await browser.close();
})();
