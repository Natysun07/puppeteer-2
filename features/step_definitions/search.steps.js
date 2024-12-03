const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After, setDefaultTimeout } = require("cucumber");
const { selectPlace, confirmReservation } = require("../../lib/commands.js");

setDefaultTimeout(50000);

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given('I am on the {string} page', async function (url) {
  await this.page.goto(url);
});

When('I navigate to the movie session page', async function () {
  const selectorNav = 'body > nav > a:nth-child(2)';
  await this.page.click(selectorNav);
});

When('I select the first available session time', async function () {
  const selectorLi = 'a.movie-seances__time';
  await this.page.click(selectorLi);
});

When('I select the first available place', async function () {
  const selectorPlace = '.buying-scheme .buying-scheme__chair_standart:not(.buying-scheme__chair_taken)';
  await this.page.waitForSelector(selectorPlace);
  await selectPlace(this.page, selectorPlace);
});

When('I confirm the reservation', async function () {
  await confirmReservation(this.page);
});

When('I navigate to the weekend movie session page', async function () {
  const weekendSelector = '.page-nav__day_weekend';
  await this.page.click(weekendSelector);
});

When('I select the VIP session', async function () {
  const linkSelector = 'a.movie-seances__time:not(.acceptin-button-disabled)';
  const h3Text = 'Красивый зал';

  const linkClicked = await this.page.$$eval('div', (divs, linkSelector, h3Text) => {
    for (const div of divs) {
      const h3 = div.querySelector('h3');
      const link = div.querySelector(linkSelector);
      
      if (h3 && h3.textContent.includes(h3Text) && link) {
        link.click();
        return true;
      }
    }
    return false;
  }, linkSelector, h3Text);

  expect(linkClicked).to.be.true;
});

When('I select the first available VIP place', async function () {
  const selectorPlace = '.buying-scheme .buying-scheme__chair_vip:not(.buying-scheme__chair_taken)';
  await this.page.waitForSelector(selectorPlace);
  await selectPlace(this.page, selectorPlace);
});

When('I select not available place', async function () {
  const selectorPlace = '.buying-scheme .buying-scheme__chair_taken';
  await this.page.waitForSelector(selectorPlace);
  const takenPlaces = await this.page.$$(selectorPlace);
  await takenPlaces[0].click();
});

Then('The submission button should be inactive', async function () {
  const selectorBtn = '.acceptin-button';
  const isDisabled = await this.page.$eval(
    selectorBtn,
    (button) => button.hasAttribute('disabled')
  );

  expect(isDisabled).to.be.true;
});

Then('I should see the QR code for the reservation', async function () {
  const qrCode = await this.page.$('.ticket__info-qr');
  expect(qrCode).to.not.be.null;
});