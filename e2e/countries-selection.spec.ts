import { test, expect } from 'next/experimental/testmode/playwright';
import { createJsonResponse } from './test-utils';
import { countries } from './mocks/countries';
import { countryDetails } from './mocks/countryDetails';

test.describe('Countries selection', async () => {
    test('populates properties correctly', async ({ page, next }) => {

        next.onFetch((request) => {
            const testId = request.headers.get("data-testid");
            if (testId==="getCountries") {
                    return createJsonResponse({
                        data: { countries },
                    });
            }
            if (testId==="getCountryDetails") {
                const url = new URL(request.url);
                    return createJsonResponse({
                        data: { country: countryDetails },
                    });
            }            
            return 'continue';
          });

        await page.goto('/');
        await page.getByTestId('country-select').selectOption('C2');
        await page.getByTestId('submit-button').click();

        await expect(page.getByTestId('capital-label')).toHaveText('test capital');
        await expect(page.getByTestId('currency-label')).toHaveText('test currency');        
    });
});