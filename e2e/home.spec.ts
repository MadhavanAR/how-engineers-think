import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display sources', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/How Engineers Think/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('How Engineers Think');

    // Check that sources are displayed
    const sources = page.locator('.source-card');
    await expect(sources.first()).toBeVisible();
  });

  test('should navigate to source page when clicking a source card', async ({ page }) => {
    await page.goto('/');

    // Click first source card
    const firstSource = page.locator('.source-card').first();
    await firstSource.click();

    // Should navigate to source page
    await expect(page).toHaveURL(/\/source\//);
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Check for skip link
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).not.toBeVisible();

    // Focus skip link
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeVisible();

    // Check main content has proper ID
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(header).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(header).toBeVisible();
  });
});
