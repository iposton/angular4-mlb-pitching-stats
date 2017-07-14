import { DataApiPage } from './app.po';

describe('data-api App', () => {
  let page: DataApiPage;

  beforeEach(() => {
    page = new DataApiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
