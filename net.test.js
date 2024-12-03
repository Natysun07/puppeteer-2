const { selectPlace, confirmReservation } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://qamid.tmweb.ru/client/index.php");
});

afterEach(() => {
  page.close();
});

describe("qamid.tmweb.ru tests", () => {
  test("Reserve a place for tomorrow's session from the first available link", async () => {
    const selectorNav = 'body > nav > a:nth-child(2)';
    const selectorLi = 'a.movie-seances__time';
    const selectorPlace = '.buying-scheme .buying-scheme__chair_standart:not(.buying-scheme__chair_taken)';

    await page.click(selectorNav);
    await page.click(selectorLi);
    
    await selectPlace(page, selectorPlace);

    await confirmReservation(page);
  });

  test("Reserve a particular cinema hall in a weekend", async () => {
    const weekendSelector = '.page-nav__day_weekend';
    const linkSelector = 'a.movie-seances__time:not(.acceptin-button-disabled)';
    const h3Text = 'Красивый зал';
    const selectorPlace = '.buying-scheme .buying-scheme__chair_vip:not(.buying-scheme__chair_taken)';

    const weekendElement = await page.$(weekendSelector);
    await weekendElement.click();
  
    const linkClicked = await page.$$eval('div', (divs, linkSelector, h3Text) => {
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

    expect(linkClicked).toBe(true);

    await selectPlace(page, selectorPlace);

    await confirmReservation(page);
  });

  test("Trying to reserve already taken place (sad path case)", async () => {
    const selectorNav = 'body > nav > a:nth-child(2)';
    const selectorLi = 'a.movie-seances__time';
    const selectorBtn = '.acceptin-button';
    const selectorPlace = '.buying-scheme .buying-scheme__chair_taken';
  
    await page.click(selectorNav);
    await page.click(selectorLi);
    
    const takenPlaces = await page.$$(selectorPlace);
    await takenPlaces[0].click();
  
    const isDisabled = await page.$eval(
      selectorBtn,
      (button) => button.hasAttribute('disabled')
    );
    
    expect(isDisabled).toBe(true);
  });
});