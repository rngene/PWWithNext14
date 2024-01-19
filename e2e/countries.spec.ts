import { test, expect } from 'next/experimental/testmode/playwright';
import { createJsonResponse } from './test-utils';
import { countries } from './mocks/countries';
import { countryDetails } from './mocks/countryDetails';

test.describe('Countries page content', () => {
    test('has correct content', async ({page, next}) => {
        next.onFetch(async (request) => { 
            return createJsonResponse({
                data: { countries },
            });            
        });            
        await page.goto('/');
        await expect(page).toHaveTitle('Countries of the World');
        await expect(page.getByTestId('country-label')).toHaveText('Country');
        await page.getByTestId('country-select').selectOption({label: 'Test country 1'});
    })
})

test.describe('Country selection', () => {
    test('country dropdown selects and polulates infor correctly', async ({page, next}) => {
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId==='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==='getCountryDetails') {
                return createJsonResponse({
                    data: { country: countryDetails },
                });
            }            
        });            
        await page.goto('/');
        await page.getByTestId('country-select').selectOption('C2');

    })
})