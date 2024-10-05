import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {  
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});

test('display-notifications-factorial', async ({ page }) => {
    await page.goto('/');
    await page.click('#site-a');
    const notificationLocator = page.locator('.uk-notification-message');

    await expect(notificationLocator.nth(1)).toHaveText(/Going to factorials in 3s.../);
    await page.waitForTimeout(1000);

    await expect(notificationLocator.nth(2)).toHaveText(/Going to factorials in 2s.../);
    await page.waitForTimeout(1000);

    await expect(notificationLocator.nth(3)).toHaveText(/Going to factorials in 1s.../);
    await page.waitForTimeout(1000); 
});

test('display-notifications-fibonacci', async ({ page }) => {
    await page.goto('/');
    await page.click('#site-b');
    const notificationLocator = page.locator('.uk-notification-message');

    await expect(notificationLocator.nth(1)).toHaveText(/Going to fibonacci in 3s.../);
    await page.waitForTimeout(1000);

    await expect(notificationLocator.nth(2)).toHaveText(/Going to fibonacci in 2s.../);
    await page.waitForTimeout(1000);

    await expect(notificationLocator.nth(3)).toHaveText(/Going to fibonacci in 1s.../);
    await page.waitForTimeout(1000); 
});

test('go-to-site-A', async ({page})=>{
  await page.goto('/');
  await page.click('#site-a');
  await page.waitForURL('http://127.0.0.1:8080/site_a.html');
  expect(page.url()).toBe('http://127.0.0.1:8080/site_a.html');
});

test('go-to-site-B', async ({page})=>{
  await page.goto('/');
  await page.click('#site-b');
  await page.waitForURL('http://127.0.0.1:8080/site_b.html');
  expect(page.url()).toBe('http://127.0.0.1:8080/site_b.html');
});

test('go-to-home-page', async ({page})=>{
  await page.goto('http://127.0.0.1:8080/site_a.html');
  await page.getByRole('link', {name: 'Home'}).click();
  await page.waitForURL('http://127.0.0.1:8080/');
  expect(page.url()).toBe('http://127.0.0.1:8080/');
});

test('nav-bar-links', async ({ page }) => {
  await page.goto('https://loremipsum.io/font-generator');
  await page.getByRole('link', { name: 'Lorem Ipsum' }).nth(0).click();
  await page.waitForURL('https://loremipsum.io/');
  expect(page.url()).toBe('https://loremipsum.io/');
});

test('nav-bar-links-1', async ({ page }) => {
  await page.goto('https://loremipsum.io/');
  await page.getByRole('link', { name: 'Font Generator' }).nth(0).click();
  await page.waitForURL('https://loremipsum.io/font-generator');
  expect(page.url()).toBe('https://loremipsum.io/font-generator');
});

test('generate-text', async ({ page }) => {
  await page.goto('https://loremipsum.io/');
  await page.getByRole('button', { name: 'Generate' }).click();
  const generatedText = await page.locator('#text').textContent();
  expect(generatedText).toContain('Lorem ipsum odor amet');
});

test('footer-links', async ({ page }) => {
  await page.goto('https://loremipsum.io/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  await page.getByRole('link', { name: 'Privacy Policy' }).click();
  await expect(page).toHaveURL('https://loremipsum.io/privacy-policy');
});