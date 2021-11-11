import { browser, element, by, Key } from 'protractor';
function sleep() {
  browser.driver.sleep(1500); // sleep for demonstration reasons
}
export class HomePage {
  navigateTo() {
    return browser.get('/');
  }

  getCardElements() {
    return element.all(by.css('.home-component__card'));
  }

  getFirstCardButtonElement() {
    return element(by.css('.home-component__card-button'));
  }

  getOpenModalElement() {
    return element(by.tagName('nz-modal'));
  }



  selectNextKey() {
    browser.actions().click(Key.ARROW_RIGHT).perform();
  }

  selectPrevKey() {
    browser.actions().sendKeys(Key.ARROW_LEFT).perform();
  }

  selectEscapeKey() {
    browser.actions().sendKeys(Key.ESCAPE).perform();
  }
}
