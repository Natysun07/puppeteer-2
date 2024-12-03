const { assert } = require("chai");

module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },
  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (link) => link.textContent);
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },
  putText: async function (page, selector, text) {
    try {
      const inputField = await page.$(selector);
      await inputField.focus();
      await inputField.type(text);
      await page.keyboard.press("Enter");
    } catch (error) {
      throw new Error(`Not possible to type text for selector: ${selector}`);
    }
  },
  selectPlace: async function (page, selector) {
    try {
      const availablePlaces = await page.$$(selector);
      assert(availablePlaces.length > 0);
      await availablePlaces[0].click();
    } catch (error) {
      throw new Error(`Failed to select place: ${selector}`);
    }
  },
  confirmReservation: async function (page) {
    try {
      await page.waitForSelector('button.acceptin-button');
      await page.click('button.acceptin-button');
      await page.waitForSelector('button.acceptin-button');
      await page.click('button.acceptin-button');
      const qrCode = await page.$('.ticket__info-qr');
      assert(qrCode !== null);
    } catch (error) {
      throw new Error("Failed to confirm reservation");
    }
  },
};
