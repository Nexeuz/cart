import { browser, logging } from 'protractor';
import { HomePage } from './home.po';

describe('workspace-project HomePage view', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should display a list of Products',  async () => {
    page.navigateTo();
     expect(await page.getCardElements().count()).toBe(10);
  });


  it('should open and add to cart a particular Product', () => {
    page.navigateTo();
    page.getFirstCardButtonElement().click();

    expect(page.getOpenModalElement()).toBeTruthy();
  });

});
