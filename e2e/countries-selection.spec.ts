import { test, expect } from 'next/experimental/testmode/playwright';
import { createJsonResponse, createJsonResponseWithStatus } from './test-utils';
import { countries } from './mocks/countries';
import { countryDetails } from './mocks/countryDetails';

test.describe('Countries selection', async () => {
    test('populates properties correctly', async ({ page, next }) => {
        let requestBody=null;

        next.onFetch(async (request) => {
         
            const testId = request.headers.get("data-testid");
            if (testId==="getCountries") {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==="getCountryDetails") {
                requestBody = await request.json();
                return createJsonResponse({
                    data: { country: countryDetails },
                });

            }            
            return 'continue';
          });

        await page.goto('/');
        await page.getByTestId('country-select').selectOption('C2');
        await page.getByTestId('submit-button').click();
        expect(requestBody?.variables?.id).toBe('C2');

        await expect(page.getByTestId('capital-label')).toHaveText('test capital');
        await expect(page.getByTestId('currency-label')).toHaveText('test currency');        
    });

    test('shows error when graph call fails', async({page,next}) => {
        next.onFetch((request) => {
            const testId = request.headers.get("data-testid");
            if (testId==="getCountries") {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==="getCountryDetails") {
                return createJsonResponseWithStatus({
                    data: { countries }
                    }, 500);
            }            
            return 'continue';
          });
          await page.goto('/');
          await page.getByTestId('country-select').selectOption('C2');
          await page.getByTestId('submit-button').click();
          await expect(page.getByTestId('error-label')).toBeVisible();
    })

    test('shows error when graph call brings invalid data', async({page,next}) => {
        next.onFetch((request) => {
            const testId = request.headers.get("data-testid");
            if (testId==="getCountries") {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==="getCountryDetails") {
                return createJsonResponse({
                    data: {  },
                });
            }           
            return 'continue';
          });
          await page.goto('/');
          await page.getByTestId('country-select').selectOption('C2');
          await page.getByTestId('submit-button').click();
          await expect(page.getByTestId('error-label')).toBeVisible();
    }) 
    
    test('caches graph call', async ({ page, next }) => {
        
        let numberOfGraphInvocations = 0;

        next.onFetch(async (request) => {

         
            const testId = request.headers.get("data-testid");
            if (testId==="getCountries") {
                return createJsonResponse({
                    data: { countries },
                });
            }
            if (testId==="getCountryDetails") {
                numberOfGraphInvocations++;
                return createJsonResponse({
                    data: { country: countryDetails },
                });

            }            
            return 'continue';
          });

       await page.goto('/');
       await page.getByTestId('submit-button').click();
       await page.getByTestId('submit-button').click();
       expect(numberOfGraphInvocations).toBe(1);
     
    });    
});