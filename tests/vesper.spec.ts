import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const visible = (page: Page) => page.locator('div.ion-page:not(.ion-page-hidden)');
async function clipboard(page: Page, fail = false) {
  await page.addInitScript((fail) => {
    (window as any).__copies = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (fail) throw new Error('Clipboard unavailable');
          (window as any).__copies.push(text);
        },
      },
    });
  }, fail);
}
async function unobscured(control: Locator) {
  await control.scrollIntoViewIfNeeded();
  await expect(control).toBeInViewport();
  await expect
    .poll(() =>
      control.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return hit === element || (hit !== null && element.contains(hit));
      }),
    )
    .toBe(true);
}
async function contentFits(page: Page) {
  const size = await visible(page)
    .locator('ion-content')
    .evaluate(async (content) => {
      const scroller = await (
        content as HTMLElement & { getScrollElement(): Promise<HTMLElement> }
      ).getScrollElement();
      return { width: scroller.clientWidth, content: scroller.scrollWidth };
    });
  expect(
    size.content,
    `Ionic scroller content ${size.content}px exceeds ${size.width}px`,
  ).toBeLessThanOrEqual(size.width);
}
async function labelsFit(page: Page) {
  const clipped = await visible(page)
    .locator('.vs-field label, .vs-button, .vs-brand__product, .nav a')
    .evaluateAll((elements) =>
      elements.flatMap((element) => {
        const box = element.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);
        const text = range.getBoundingClientRect();
        return text.left < box.left - 1 ||
          text.right > box.right + 1 ||
          text.top < box.top - 1 ||
          text.bottom > box.bottom + 1
          ? [{ label: element.textContent, box: box.toJSON(), text: text.toJSON() }]
          : [];
      }),
    );
  expect(clipped).toEqual([]);
}
async function axe(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((n) => n.target) })),
  ).toEqual([]);
}

test('Vesper light mobile foundation and shared parent brand load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-vs-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-vs-mode', 'mobile');
  await expect(page.locator('body')).toHaveClass(/vs-root/);
  await expect(visible(page).locator('.vs-brand__name')).toHaveText('VESPER');
  await expect(visible(page).locator('.vs-brand__descriptor')).toHaveText('MEDIA GROUP');
  await expect(visible(page).locator('.vs-brand__product')).toHaveText('Verbatim');
  expect(
    await visible(page)
      .locator('.vs-brand__mark')
      .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
  ).toBe(true);
});

for (const [id, control, eligible, blocked] of [
  ['workplace-v2', 'Audience', 'employees', 'press'],
  ['events-v2', 'Region', 'emea', 'global'],
]) {
  test(`${control} changes immediately revoke and restore status and copy eligibility`, async ({
    page,
  }) => {
    await clipboard(page);
    await page.goto(`/statements/${id}`);
    const scope = visible(page).getByRole('combobox', { name: control, exact: true });
    const badge = visible(page).locator('.wording-panel .vs-badge');
    await scope.selectOption(eligible!);
    await expect(badge).toHaveText('Ready to use');
    await expect(badge).toHaveClass(/vs-tone-success/);
    await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
    await scope.selectOption(blocked!);
    await expect(badge).toHaveText('Not for this use');
    await expect(badge).toHaveClass(/vs-tone-warning/);
    const copy = visible(page).getByRole('button', { name: 'Copy unavailable', exact: true });
    await expect(copy).toBeDisabled();
    await copy.evaluate((button: HTMLButtonElement) => {
      button.disabled = false;
      button.click();
    });
    expect(await page.evaluate(() => (window as any).__copies.length)).toBe(1);
    await scope.selectOption(eligible!);
    await expect(badge).toHaveClass(/vs-tone-success/);
    await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
    expect(await page.evaluate(() => (window as any).__copies.length)).toBe(2);
  });
}

test('manual fallback receives focus, clears the action bar and is revoked on scope change', async ({
  page,
}) => {
  await clipboard(page, true);
  await page.goto('/statements/workplace-v2');
  const audience = visible(page).getByRole('combobox', { name: 'Audience', exact: true });
  await audience.selectOption('employees');
  await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
  const manual = visible(page).getByLabel('Select and copy exact wording');
  await expect(manual).toBeFocused();
  await unobscured(manual);
  expect(
    await visible(page)
      .locator('.copy-bar')
      .evaluate((bar) => getComputedStyle(bar).position),
  ).toBe('static');
  await audience.selectOption('press');
  await expect(manual).toHaveCount(0);
  await expect(
    visible(page).getByRole('button', { name: 'Copy unavailable', exact: true }),
  ).toBeDisabled();
  await audience.selectOption('employees');
  await expect(manual).toHaveCount(0);
  await expect(visible(page).getByRole('button', { name: 'Copy exact wording' })).toBeEnabled();
});

test('copy success notice leaves primary action visible and unobscured', async ({ page }) => {
  await clipboard(page);
  await page.goto('/statements/company-v2');
  const copy = visible(page).getByRole('button', { name: 'Copy exact wording' });
  await copy.click();
  await expect(visible(page).getByRole('status')).toContainText('Exact approved wording copied');
  await unobscured(copy);
  const buttonBox = (await copy.boundingBox())!;
  const noticeBox = (await visible(page).locator('.copy-bar .notice').boundingBox())!;
  expect(noticeBox.y).toBeGreaterThanOrEqual(buttonBox.y + buttonBox.height);
});

test('request field required/error linkage and visible keyboard focus survive shared controls', async ({
  page,
}) => {
  await page.goto('/requests');
  await visible(page).getByRole('button', { name: 'Request wording', exact: true }).click();
  await expect(
    visible(page).getByRole('heading', { name: 'Request updated wording' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(visible(page).locator('.request-form select')).toBeFocused();
  await page.keyboard.press('Tab');
  const reason = visible(page).getByLabel('Reason');
  await expect(reason).toBeFocused();
  await expect(reason).toHaveAttribute('required', '');
  expect(
    await reason.evaluate(
      (field) =>
        field.matches(':focus-visible') &&
        getComputedStyle(field).outlineStyle !== 'none' &&
        parseFloat(getComputedStyle(field).outlineWidth) >= 2,
    ),
  ).toBe(true);
  await unobscured(reason);
  await visible(page).getByRole('button', { name: 'Save local request' }).click();
  await expect(reason).toHaveAttribute('aria-invalid', 'true');
  expect(
    await reason.evaluate((field) =>
      (field.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .some((id) => document.getElementById(id)?.textContent?.includes('Enter a reason')),
    ),
  ).toBe(true);
  await axe(page);
});

test('320, 390, 768 and 1440 layouts retain 48px controls and fit their viewport', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/statements/company-v2',
      '/statements/streaming-v2',
      '/requests',
      '/demo',
    ]) {
      await page.goto(path);
      await expect(visible(page).getByRole('heading', { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} at ${width}px`,
      ).toBe(true);
      await contentFits(page);
      const undersized = await visible(page)
        .locator('.vs-button, .vs-input, .nav a')
        .evaluateAll((controls) =>
          controls
            .filter((control) => control.getBoundingClientRect().height < 47.5)
            .map((control) => ({
              text: control.textContent,
              height: control.getBoundingClientRect().height,
            })),
        );
      expect(undersized, `${path} controls at ${width}px`).toEqual([]);
    }
  }
});

test('200% desktop reflow approximation: 1440x1000 reduced to 720x500 CSS viewport', async ({
  page,
}) => {
  // CSS viewport reduction models reflow at browser zoom; this is not a native zoom or device-keyboard test.
  await page.setViewportSize({ width: 720, height: 500 });
  await page.goto('/statements/company-v2');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await unobscured(visible(page).getByRole('button', { name: 'Copy exact wording' }));
  await page.goto('/requests');
  await visible(page).getByRole('button', { name: 'Request wording', exact: true }).click();
  await unobscured(visible(page).getByLabel('Reason'));
  await unobscured(visible(page).getByRole('button', { name: 'Save local request' }));
});

test('200% root text resizing keeps labels readable and actions reachable (not native browser zoom)', async ({
  page,
}) => {
  await clipboard(page);
  await page.goto('/statements/company-v2');
  // Increase root text size in each configured phone/desktop viewport; this does not simulate native browser zoom.
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  await contentFits(page);
  await labelsFit(page);
  // Native select text must fit too: its selected option is not measured by a label Range.
  const truncatedSelections = await visible(page)
    .locator('.scope select')
    .evaluateAll((controls) =>
      controls.flatMap((element) => {
        const select = element as HTMLSelectElement;
        const style = getComputedStyle(select);
        const context = document.createElement('canvas').getContext('2d')!;
        context.font = style.font;
        const needed =
          context.measureText(select.selectedOptions[0]!.text).width +
          parseFloat(style.paddingLeft) +
          parseFloat(style.paddingRight) +
          24;
        return needed > select.clientWidth ? [select.selectedOptions[0]!.text] : [];
      }),
    );
  expect(truncatedSelections).toEqual([]);
  const copy = visible(page).getByRole('button', { name: 'Copy exact wording' });
  await unobscured(copy);
  await copy.click();
  await expect(visible(page).getByRole('status')).toContainText('Exact approved wording copied');
  await visible(page).getByRole('link', { name: 'Local requests', exact: true }).click();
  await expect(visible(page)).toHaveCount(1);
  await expect(visible(page).getByRole('heading', { level: 1 })).toHaveText('Your requests');
  await visible(page).getByRole('button', { name: 'Request wording', exact: true }).click();
  await contentFits(page);
  await labelsFit(page);
  const reason = visible(page).getByLabel('Reason');
  await unobscured(reason);
  await reason.fill('Text resizing request remains usable');
  const save = visible(page).getByRole('button', { name: 'Save local request' });
  await unobscured(save);
  await save.click();
  await expect(visible(page).getByRole('status')).toContainText('No one was notified');
});

test('empty, invalid route and clipboard/storage failure states pass accessibility basics', async ({
  page,
}) => {
  for (const path of [
    '/?q=unfindable-phrase-9842',
    '/statements/not-a-version',
    '/missing-page',
    '/requests',
  ]) {
    await page.goto(path);
    await expect(visible(page).getByRole('heading', { level: 1 })).toBeVisible();
    await axe(page);
  }
  await clipboard(page, true);
  await page.goto('/statements/company-v2');
  await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
  await expect(visible(page).getByLabel('Select and copy exact wording')).toBeVisible();
  await axe(page);
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable');
    };
  });
  await page.goto('/requests');
  await visible(page).getByRole('button', { name: 'Request wording', exact: true }).click();
  await visible(page).getByLabel('Reason').fill('Need current wording');
  await visible(page).getByRole('button', { name: 'Save local request' }).click();
  await expect(visible(page).getByRole('alert')).toContainText('Browser storage is unavailable');
  await axe(page);
});

const legacy = {
  scope: { audience: 'partners', region: 'apac' },
  requests: [
    {
      id: 'legacy-1',
      topic: 'Company outlook',
      scope: { audience: 'partners', region: 'apac' },
      reason: 'Keep my original request — unchanged.',
      createdAt: '2025-10-20T12:00:00.000Z',
    },
  ],
};
test('legacy storage survives upgrade and reload, confirmed reset persists', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(
    (saved) => localStorage.setItem('ready-to-say-v1', JSON.stringify(saved)),
    legacy,
  );
  await page.goto('/requests');
  await page.reload();
  await expect(visible(page).locator('.request-card')).toContainText(legacy.requests[0]!.reason);
  await expect(visible(page).getByRole('combobox', { name: 'Audience', exact: true })).toHaveValue(
    'partners',
  );
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ready-to-say-v1')!))).toEqual(
    legacy,
  );
  await page.goto('/demo');
  await visible(page).getByRole('button', { name: 'Reset demo', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ready-to-say-v1')!))).toEqual(
    legacy,
  );
  await visible(page).getByRole('button', { name: 'Reset demo', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Yes, reset demo' }).click();
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ready-to-say-v1')!))).toEqual({
    scope: { audience: 'press', region: 'global' },
    requests: [],
  });
});

test('blocked storage reset stays honest and does not destroy saved requests', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(
    (saved) => localStorage.setItem('ready-to-say-v1', JSON.stringify(saved)),
    legacy,
  );
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Blocked');
    };
  });
  await page.goto('/demo');
  await visible(page).getByRole('button', { name: 'Reset demo', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Yes, reset demo' }).click();
  await expect(visible(page).getByRole('alert')).toContainText('session only');
  await visible(page).getByRole('link', { name: 'Statement library', exact: true }).click();
  await expect(visible(page)).toHaveCount(1);
  await expect(visible(page).getByRole('combobox', { name: 'Audience', exact: true })).toHaveValue(
    'press',
  );
  await page.goto('/requests');
  await expect(visible(page).locator('.request-card')).toContainText(legacy.requests[0]!.reason);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ready-to-say-v1')!))).toEqual(
    legacy,
  );
});

test('blocked storage reads and writes keep reload and reset usable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Blocked');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Blocked');
    };
  });
  await page.goto('/demo');
  await expect(visible(page).getByRole('alert')).toContainText('could not be loaded');
  await visible(page).getByRole('button', { name: 'Reset demo', exact: true }).click();
  await visible(page).getByRole('button', { name: 'Yes, reset demo' }).click();
  await expect(visible(page).getByRole('alert')).toContainText('session only');
  await page.reload();
  await expect(visible(page).getByRole('alert')).toContainText('could not be loaded');
  await visible(page).getByRole('link', { name: 'Statement library', exact: true }).click();
  await expect(visible(page)).toHaveCount(1);
  await expect(visible(page).getByRole('combobox', { name: 'Audience', exact: true })).toHaveValue(
    'press',
  );
});

test('renamed canonical wording copies byte-for-byte and safe-area action uses shared tokens', async ({
  page,
}) => {
  await clipboard(page);
  await page.goto('/statements/company-v2');
  await visible(page).getByRole('button', { name: 'Copy exact wording' }).click();
  expect(await page.evaluate(() => (window as any).__copies)).toEqual([
    'Vesper Media Group creates space for original ideas across digital publishing, streaming entertainment, podcasts, and live events. Our focus is thoughtful storytelling and meaningful connections with audiences.',
  ]);
  const bar = visible(page).locator('.copy-bar');
  expect(
    await bar.evaluate((element) => parseFloat(getComputedStyle(element).paddingBottom)),
  ).toBeGreaterThanOrEqual(16);
  expect(
    await page.evaluate(() =>
      Array.from(document.styleSheets).some((sheet) =>
        Array.from(sheet.cssRules).some(
          (rule) =>
            rule.cssText.includes('.vs-action-bar') &&
            rule.cssText.includes('env(safe-area-inset-bottom'),
        ),
      ),
    ),
  ).toBe(true);
  await unobscured(visible(page).getByRole('button', { name: 'Copy exact wording' }));
});
