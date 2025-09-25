import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Realizar una busqueda que no tenga resultados', async ({ page }) => {
  // Clic en el botón de búsqueda
  await page.getByRole('button', { name: 'Search (Ctrl+K)' }).click();
  
  // Llenar el campo de búsqueda
  const searchInput = page.getByPlaceholder('Search docs');
  await searchInput.fill('hascontent');

  // Activar la búsqueda presionando Enter
  await searchInput.press('Enter');

  // Playwright esperará automáticamente a que el elemento sea visible
  await expect(page.locator('.DocSearch-NoResults p')).toBeVisible();

// Ahora, verifica el texto
await expect(page.locator('.DocSearch-NoResults p')).toHaveText('No results for "hascontent"');
});

test('Limpiar el input de busqueda', async ({ page }) => {
  await page.getByRole('button', { name: 'Search' }).click();

  const searchBox = page.getByPlaceholder('Search docs');

  await searchBox.click();

  await searchBox.fill('somerandomtext');

  await expect(searchBox).toHaveValue('somerandomtext');

  await page.getByRole('button', { name: 'Clear the query' }).click();

  await expect(searchBox).toHaveAttribute('value', '');
});

test('Realizar una busqueda que genere al menos tenga un resultado', async ({ page }) => {
  await page.getByRole('button', { name: 'Search ' }).click();

  const searchBox = page.getByPlaceholder('Search docs');

  await searchBox.click();

  await page.getByPlaceholder('Search docs').fill('havetext');

  expect(searchBox).toHaveValue('havetext');

  // Verity there are sections in the results
  await page.locator('.DocSearch-Dropdown-Container section').nth(1).waitFor();
  const numberOfResults = await page.locator('.DocSearch-Dropdown-Container section').count();
  await expect(numberOfResults).toBeGreaterThan(0);
});
