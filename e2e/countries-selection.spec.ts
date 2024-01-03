import { test } from 'next/experimental/testmode/playwright';
import { createJsonResponse } from './test-utils';
import { countries } from './mocks/countries';

test.describe('Countries selection', async () => {
    test('populates properties correctly', async ({ page, next }) => {

        next.onFetch((request) => {
            const testId = request.headers.get("data-testid");
            if (testId==="getCountries") {
                const url = new URL(request.url);
                    return createJsonResponse({
                        data: { countries },
                    });
            }
            return 'continue';
          });

        await page.goto('/');
        await page.getByTestId('country-select').selectOption('C1');
    });
});