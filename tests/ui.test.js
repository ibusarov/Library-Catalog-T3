const { expect, test } = require("@playwright/test")
const pageUrl = "http://localhost:3000"

test('Verify "All Books" link is visible', async ({page}) => {
    await page.goto(pageUrl)
    await page.waitForSelector('nav.navbar')

    const allBooksLink = await page.$('a[href="/catalog"]')
    const isLinkVisible = await allBooksLink.isVisible()

    expect(isLinkVisible).toBe(true)
})

test('Verify Login button is visible', async ({page}) => {
    await page.goto(pageUrl)
    await page.waitForSelector('nav.navbar')

    const loginButton = await page.$('a[href="/login"]')
    const isButtonVisible = await loginButton.isVisible()

    expect(isButtonVisible).toBe(true)
})

test('Verify Regisgter button is visible', async ({page}) => {
    await page.goto(pageUrl)
    await page.waitForSelector('nav.navbar')

    const registerButton = await page.$('a[href="/register"]')
    const isButtonVisible = await registerButton.isVisible()

    expect(isButtonVisible).toBe(true)
})

test('Verify "All Books" link is visiblea after user login', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');  

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBookLinkVisible = await allBooksLink.isVisible();

    expect(isAllBookLinkVisible).toBe(true);

})

test('Verify "My Books" link is visiblea after user login', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');  

    const myBooksLink = await page.$('a[href="/profile"]');
    const isMyBookLinkVisible = await myBooksLink.isVisible();

    expect(isMyBookLinkVisible).toBe(true);

})

test('Verify "Add Book" link is visiblea after user login', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');  

    const addBookLink = await page.$('a[href="/create"]');
    const isAddBookLinkVisible = await addBookLink.isVisible();

    expect(isAddBookLinkVisible).toBe(true);

})

test('Verify "Email addrsss" is visiblea after user login', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');  

    await expect(page.getByText('Welcome, peter@abv.bg')).toBeVisible();

})

test('Login with valid credentials', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]'); 
    
    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe('http://localhost:3000/catalog');
    
})

test('Login with invalid credentials', async ({page}) => {
    await page.goto('http://localhost:3000/login');    
    await page.click('input[type="submit"]'); 
    
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');

})

test('Login with invalid password', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.click('input[type="submit"]'); 
    
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');

})

test('Register with valid data', async ({page}) => {
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="email"]', 'test@abv.bg');
    await page.fill('input[name="password"]', '12345678');
    await page.fill('input[name="password"]', '12345678');
    await page.click('input[type="submit"]'); 
    
    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe('http://localhost:3000/register');
    
})

test('Add book with correct data', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.click('a[href="/create"]');
    
    await page.waitForSelector('#create-form');

    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form input[type="submit"]');

    await page.waitForURL('http://localhost:3000/catalog');

    expect(page.url()).toBe('http://localhost:3000/catalog');

});

test('Add book with empty title field', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.click('a[href="/create"]');
    
    await page.waitForSelector('#create-form');

    // await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    // await page.click('#create-form input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })

    await page.$('a[href="/create"]');

    expect(page.url()).toBe('http://localhost:3000/create');

});


test('Login and verify all books are displayed ', async ({page}) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.waitForSelector('.dashboard');

    const bookElements = await page.$$('.other-books-list li');
    expect(bookElements.length).toBeGreaterThan(0);    

});


test('Verify redirection of logout link after user login ', async ({page}) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const logoutLink = await page.$('a[href="javascript:void(0)"]');
    await logoutLink.click();

    const redirectURL = page.url();
    expect(redirectURL).toBe('http://localhost:3000/catalog');     

});

test('Login and navigate to Details page', async ({page}) => {

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.click('a[href="/catalog"]');

    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const detailsPageTitle = await page.textContent('.book-information h3');
    expect(detailsPageTitle).toBe('Test Book');    

});

