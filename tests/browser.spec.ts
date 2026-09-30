import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const data: { versions: { id: string; text: string }[] } = JSON.parse(
  readFileSync(new URL('../src/data/statements.json', import.meta.url), 'utf8'),
);
const visible = (page: Page) => page.locator('div.ion-page:not(.ion-page-hidden)');
async function settled(page: Page) {
  await expect(visible(page)).toHaveCount(1);
}
async function clipboard(page: Page, fail = false) {
  await page.addInitScript(
    ({ fail }) => {
      (window as any).__copies = [];
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            if (fail) throw new Error('Clipboard permission denied');
            (window as any).__copies.push(text);
          },
        },
      });
    },
    { fail },
  );
}
test('search, verify approved version beneath draft, copy exact text and browser back', async ({
  page,
}) => {
  await clipboard(page);
  await page.goto('/');
  await visible(page).getByRole('searchbox').fill('direction');
  const card = visible(page).getByRole('link', { name: /Our direction/ });
  await expect(card).toContainText('Version 2');
  await card.click();
  await settled(page);
  await expect(visible(page).getByRole('heading', { name: 'Approval record' })).toBeVisible();
  await expect(visible(page).getByText('Permitted use', { exact: true })).toBeVisible();
  await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
  await expect(visible(page).getByRole('status')).toContainText('Exact approved wording copied');
  expect(await page.evaluate(() => (window as any).__copies)).toEqual([
    data.versions.find((v) => v.id === 'company-v2')!.text,
  ]);
  await visible(page).getByRole('combobox', { name: 'View version' }).selectOption('company-v3');
  await settled(page);
  await expect(visible(page).getByRole('button', { name: 'Copy unavailable' })).toBeDisabled();
  await expect(
    visible(page).getByRole('link', { name: /Open current approved wording/ }),
  ).toBeVisible();
  await page.goBack();
  await settled(page);
  await page.goBack();
  await settled(page);
  await expect(visible(page).getByRole('searchbox')).toHaveValue('direction');
});
for (const [id, reason] of [
  ['streaming-v2', 'Expired on'],
  ['company-v1', 'Superseded by'],
  ['publishing-v1', 'withdrawn'],
  ['workplace-v2', 'press audience'],
  ['events-v2', 'global region'],
  ['podcasts-v3', 'Not effective until'],
]) {
  test(`ineligible copy blocked: ${id}`, async ({ page }) => {
    await clipboard(page);
    await page.goto(`/statements/${id}`);
    await expect(visible(page).getByRole('button', { name: 'Copy unavailable' })).toBeDisabled();
    await expect(visible(page).locator('.alert')).toContainText(reason);
    // Bypassing the disabled attribute still must not bypass the domain check in the action.
    await visible(page)
      .getByRole('button', { name: 'Copy unavailable' })
      .evaluate((button: HTMLButtonElement) => {
        button.disabled = false;
        button.click();
      });
    expect(await page.evaluate(() => (window as any).__copies)).toEqual([]);
  });
}
test('replacement and scope changes provide usable wording', async ({ page }) => {
  await page.goto('/statements/company-v1');
  await visible(page).getByRole('link', { name: 'Open approved replacement' }).click();
  await settled(page);
  await expect(visible(page).getByRole('button', { name: 'Copy exact wording' })).toBeEnabled();
  await page.goto('/statements/events-v2');
  await visible(page).getByRole('combobox', { name: 'Region', exact: true }).selectOption('emea');
  await expect(visible(page).getByRole('button', { name: 'Copy exact wording' })).toBeEnabled();
  await page.reload();
  await expect(visible(page).getByRole('combobox', { name: 'Region', exact: true })).toHaveValue(
    'emea',
  );
});
test('expired recovery validates and persists requests; confirmed reset restores defaults', async ({
  page,
}) => {
  await page.goto('/statements/streaming-v2');
  await visible(page).getByRole('combobox', { name: 'Region', exact: true }).selectOption('apac');
  await visible(page).getByRole('button', { name: 'Request updated wording' }).click();
  await visible(page).getByRole('button', { name: 'Save local request' }).click();
  await expect(visible(page).getByRole('alert')).toContainText('Enter a reason');
  await visible(page).getByLabel('Reason').fill('Need a current launch statement for tomorrow.');
  await visible(page).getByRole('button', { name: 'Save local request' }).click();
  await expect(visible(page).getByRole('status')).toContainText('No one was notified');
  await visible(page)
    .getByRole('link', { name: /Local requests/ })
    .click();
  await page.reload();
  await expect(visible(page).locator('.request-card')).toContainText(
    'Need a current launch statement',
  );
  await expect(visible(page).locator('.request-card')).toContainText('apac');
  await visible(page).getByRole('link', { name: 'Demo info' }).click();
  await settled(page);
  await visible(page).getByRole('button', { name: 'Reset demo', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Cancel', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Reset demo', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Yes, reset demo' }).click();
  await page.goto('/requests');
  await expect(visible(page).getByRole('heading', { name: 'No local requests yet' })).toBeVisible();
  await page.goto('/');
  await expect(visible(page).getByRole('combobox', { name: 'Region', exact: true })).toHaveValue(
    'global',
  );
});
test('clipboard failure offers exact manual wording', async ({ page }) => {
  await clipboard(page, true);
  await page.goto('/statements/company-v2');
  await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
  await expect(visible(page).getByRole('status')).toContainText('Clipboard access failed');
  await expect(visible(page).getByLabel('Select and copy exact wording')).toHaveValue(
    data.versions.find((v) => v.id === 'company-v2')!.text,
  );
});
test('empty search and unavailable direct routes recover', async ({ page }) => {
  await page.goto('/?q=zzzz-no-matching-phrase');
  await expect(
    visible(page).getByRole('heading', { name: 'No matching statements' }),
  ).toBeVisible();
  await visible(page).getByRole('button', { name: 'Clear filters' }).click();
  await expect(visible(page).locator('.card')).toHaveCount(8);
  for (const path of ['/statements/missing-version', '/missing-page']) {
    await page.goto(path);
    await page.reload();
    await expect(
      visible(page).getByRole('heading', { name: 'Statement unavailable' }),
    ).toBeVisible();
  }
});
test('storage failure keeps honest session-only requests', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable');
    };
  });
  await page.goto('/requests');
  await visible(page).getByRole('button', { name: 'Request wording', exact: true }).click();
  await visible(page).getByLabel('Reason').fill('Session-only request');
  await visible(page).getByRole('button', { name: 'Save local request' }).click();
  await expect(visible(page).getByRole('status')).toContainText('session only');
  await expect(visible(page).getByRole('alert')).toContainText('Browser storage is unavailable');
});
test('main pages fit viewport and pass automated accessibility basics', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of [
    '/',
    '/statements/company-v2',
    '/statements/streaming-v2',
    '/requests',
    '/demo',
  ]) {
    await page.goto(path);
    await expect(visible(page).getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(errors).toEqual([]);
    expect(
      result.violations,
      `${path}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});

test('search preserves the selected topic', async ({ page }) => {
  await page.goto('/');
  await visible(page)
    .getByRole('combobox', { name: 'Topic', exact: true })
    .selectOption('Company outlook');
  await visible(page).getByRole('searchbox').fill('direction');
  await expect(visible(page).getByRole('combobox', { name: 'Topic', exact: true })).toHaveValue(
    'Company outlook',
  );
  await page.reload();
  await expect(visible(page).locator('.card')).toHaveCount(1);
});

test('narrow phone has no horizontal overflow and primary action remains reachable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of [
    '/',
    '/statements/company-v2',
    '/statements/streaming-v2',
    '/requests',
    '/demo',
  ]) {
    await page.goto(path);
    await expect(visible(page).getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.goto('/statements/company-v2');
  const button = visible(page).getByRole('button', { name: 'Copy exact wording' });
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeInViewport();
});
test('keyboard reaches skip link, scope and copy action with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await clipboard(page);
  await page.goto('/');
  await settled(page);
  await visible(page).getByRole('heading', { level: 1 }).waitFor();
  await visible(page).getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(visible(page).getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  // The skip target places keyboard users before the scope controls.
  await expect(
    visible(page).getByRole('combobox', { name: 'Audience', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(visible(page).getByRole('combobox', { name: 'Region', exact: true })).toBeFocused();
  await page.goto('/statements/company-v2');
  await settled(page);
  const button = visible(page).getByRole('button', { name: 'Copy exact wording' });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(visible(page).getByRole('status')).toContainText('Exact approved wording copied');
});
