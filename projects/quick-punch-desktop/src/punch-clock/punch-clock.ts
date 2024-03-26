import puppeteer, { Browser, Frame, Page, TimeoutError } from 'puppeteer';
import {
  CannotLoginException,
  InputFormErrorException,
  LoginNotFoundException,
} from './punch-clock-errors';

interface PunchClockDetails {
  username: string;
  pin: string;
  dayCode?: string;
  action?: string;
}

const SELECTORS = {
  formSubmit: 'button#ok',
  formStatus: 'div#statusWindow span#statusLabel',
  inputPersonnelNumber: 'input#badgeno',
  inputPin: 'input#pincode',
  selectAction: 'select#req_code',
  selectDayCode: 'select#codeid',
};

const ATOSS = {
  timeTrackingUrl: 'https://atoss.greentube.com/SES/time?Lang=en',
};

export class PunchClockController {
  private static instance: PunchClockController;

  private constructor() {}

  public static getInstance(): PunchClockController {
    if (!PunchClockController.instance) {
      PunchClockController.instance = new PunchClockController();
    }
    return PunchClockController.instance;
  }

  public async punchClock(loginDetails: PunchClockDetails): Promise<void> {
    const { browser, page } = await this.setupBrowser();
    try {
      await page.goto(ATOSS.timeTrackingUrl);
      const elementHandle = await page.waitForSelector('iframe');

      if (elementHandle) {
        const iframe = await elementHandle.contentFrame();
        await this.fillAndSubmitForm(iframe, page, loginDetails);
        await this.checkFormStatus(iframe);
      } else {
        throw new LoginNotFoundException(
          `Login is unavailable in the ATOSS page.`
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private async setupBrowser(
    headless: boolean = false
  ): Promise<{ browser: Browser; page: Page }> {
    const browser: Browser = await puppeteer.launch({ headless });
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    return { browser, page };
  }

  private async fillAndSubmitForm(
    iframe: Frame,
    page: Page,
    loginDetails: PunchClockDetails
  ): Promise<void> {
    await iframe.waitForSelector(SELECTORS.formSubmit, { timeout: 20000 });
    await iframe.type(SELECTORS.inputPersonnelNumber, loginDetails.username);
    await page.keyboard.press('Tab');
    await iframe.type(SELECTORS.inputPin, loginDetails.pin);

    if (loginDetails.action) {
      const actionExists = await iframe.$(SELECTORS.selectAction);
      if (actionExists) {
        await page.keyboard.press('Tab');
        await iframe.select(SELECTORS.selectAction, loginDetails.action);
      }
    }

    if (loginDetails.dayCode) {
      const dayCodeExists = await iframe.$(SELECTORS.selectDayCode);
      if (dayCodeExists) {
        await page.keyboard.press('Tab');
        await iframe.select(SELECTORS.selectDayCode, loginDetails.dayCode);
      }
    }

    await page.keyboard.press('Enter');
  }

  private async checkFormStatus(iframe: Frame): Promise<void> {
    try {
      await iframe.waitForSelector(SELECTORS.formStatus, { timeout: 5000 });
      const statusMessage = await iframe.$eval(
        SELECTORS.formStatus,
        (element) => element.textContent.trim()
      );
      throw new InputFormErrorException('', `${statusMessage}`);
    } catch (error) {
      if (error instanceof TimeoutError) {
        console.log('Login successful, continuing flow...');
      } else if (error instanceof InputFormErrorException) {
        console.error(error.message);
        throw error;
      } else {
        throw new CannotLoginException(`${error}`);
      }
    }
  }
}
