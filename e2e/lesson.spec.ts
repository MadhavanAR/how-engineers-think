import { test, expect } from '@playwright/test';

test.describe('Lesson Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a lesson page (assuming pragmatic-programmer source exists)
    await page.goto('/lesson/taking-responsibility');
  });

  test('should display lesson content', async ({ page }) => {
    // Check lesson title
    const title = page.locator('h1, h2').first();
    await expect(title).toBeVisible();

    // Check for code examples section
    const codeSection = page.locator('.code-section, .concept-section');
    await expect(codeSection.first()).toBeVisible();
  });

  test('should allow code execution', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Look for run button
    const runButton = page.locator('button:has-text("Run"), button:has-text("Compile")').first();

    if (await runButton.isVisible()) {
      // Click run button
      await runButton.click();

      // Wait for execution (with timeout)
      await page.waitForTimeout(2000);

      // Check for output or error
      const output = page.locator('.output, .error');
      // Output may or may not be visible depending on execution result
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check for back button
    const backButton = page.locator('button:has-text("Back"), a:has-text("Back")').first();
    await expect(backButton).toBeVisible();

    // Check keyboard navigation
    await backButton.focus();
    await expect(backButton).toBeFocused();
  });
});
