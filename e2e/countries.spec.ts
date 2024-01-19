import { test, expect } from 'next/experimental/testmode/playwright';
import { createJsonResponse, createJsonResponseWithStatus } from './test-utils';
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
        let requestBody: { variables: object} | null = null;
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId==='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==='getCountryDetails') {
                requestBody = await request.json();
                return createJsonResponse({
                    data: { country: countryDetails },
                });
            }            
        });            
        await page.goto('/');
        await expect(page.getByTestId('capital-label')).not.toBeVisible();
        await expect(page.getByTestId('error-label')).not.toBeVisible();

        await page.getByTestId('country-select').selectOption('C2');
        await page.getByTestId('submit-button').click();
        expect((requestBody as any).variables.id).toBe('C2');

        await expect(page.getByTestId('capital-value-label')).toHaveText('test capital');
        await expect(page.getByTestId('currency-value-label')).toHaveText('test currency');
    });
    test('shows error when graph call fails', async ({page, next}) => {
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId==='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==='getCountryDetails') {
                return createJsonResponseWithStatus({
                    data: { country: countryDetails },
                }, 500);
            }            
        });            
        await page.goto('/');
        await expect(page.getByTestId('capital-label')).not.toBeVisible();
        await page.getByTestId('country-select').selectOption('C2');
        await page.getByTestId('submit-button').click();
        await expect(page.getByTestId('error-label')).toBeVisible();
    });    
    test('caches graph call', async ({page, next}) => {
        let numberOfGraphInvocations = 0;
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId==='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==='getCountryDetails') {
                numberOfGraphInvocations++;
                return createJsonResponse({
                    data: { country: countryDetails },
                });
            }            
        });            
        await page.goto('/');
        
        await page.getByTestId('country-select').selectOption('C2');
        await page.getByTestId('submit-button').click();
        await page.getByTestId('submit-button').click();
        expect(numberOfGraphInvocations).toBe(1);

    });
    test('defaults to first country', async ({page, next}) => {
        let requestBody: { variables: object} | null = null;
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId==='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==='getCountryDetails') {
                requestBody = await request.json();
                return createJsonResponse({
                    data: { country: countryDetails },
                });
            }            
        });            
        await page.goto('/');
        await page.getByTestId('submit-button').click();

        expect((requestBody as any).variables.id).toBe('C1');

    });    

})