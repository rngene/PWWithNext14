import { test, expect } from 'next/experimental/testmode/playwright';
import { createJsonResponse, createJsonResponseWithStatus } from './test-utils';
import { countries } from './mocks/countries';
import { countryDetails } from './mocks/countryDetails';

test.describe('Countries page content', () => {
    test('has correct contnent', async({page, next}) => {
        next.onFetch(async (request) => { 
            return createJsonResponse({
                data: { countries },
            });            
        });         

        await page.goto('/');
        await expect(page).toHaveTitle('Countries of the world');
        await expect(page.getByTestId('country-label')).toHaveText('Country');
        await page.getByTestId('country-select').selectOption({label:'Test country 1'});
    });
});


test.describe('Country selection', () => {
    test('country is selected correctly and info is populated', async({page, next}) => {
        let requestBody: { variables: object} | null = null;
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId=='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });            
            }
            if (testId=='getCountryDetails') {
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

        await expect(page.getByTestId('capital-value-label')).toHaveText('test capital');
        await expect(page.getByTestId('currency-value-label')).toHaveText('test currency');
        expect((requestBody as any).variables.id).toBe('C2');
    });

    test('shows error when graph call fails', async({page, next}) => {
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId=='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });            
            }
            if (testId=='getCountryDetails') {
                return createJsonResponseWithStatus({
                    data: {  },
                }, 500);            
            }            
        });         

        await page.goto('/');
        await page.getByTestId('submit-button').click();
        await expect(page.getByTestId('error-label')).toBeVisible();
    }); 
    
    test('defaults to first country', async({page, next}) => {
        let requestBody: { variables: object} | null = null;
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId=='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });            
            }
            if (testId=='getCountryDetails') {
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

    test('caches graph call', async({page, next}) => {
        let numberOfGraphInvocations = 0;
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId=='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });            
            }
            if (testId=='getCountryDetails') {
                numberOfGraphInvocations++;
                return createJsonResponse({
                    data: { country: countryDetails },
                });            
            }            
        });         

        await page.goto('/');
        await page.getByTestId('submit-button').click();
        await page.getByTestId('submit-button').click();

        expect(numberOfGraphInvocations).toBe(1);
    });  
    
    test('shows error when graph call brings invalid data', async({page, next}) => {
        next.onFetch(async (request) => { 
            const testId = request.headers.get("data-testid");
            if (testId=='getCountries') {
                return createJsonResponse({
                    data: { countries },
                });            
            }
            if (testId=='getCountryDetails') {
                return createJsonResponse({
                    data: {  },
                });            
            }            
        });         

        await page.goto('/');
        await page.getByTestId('submit-button').click();
        await expect(page.getByTestId('error-label')).toBeVisible();
    });     
});
