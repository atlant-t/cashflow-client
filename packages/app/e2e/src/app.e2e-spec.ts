import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  beforeEach(() => {
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    const loggingEntry: Partial<logging.Entry> = {
      level: logging.Level.SEVERE,
    };
    expect(logs).not.toContain(jasmine.objectContaining(loggingEntry));
  });
});
