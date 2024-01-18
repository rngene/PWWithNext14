import { test, expect } from 'next/experimental/testmode/playwright';
import { createJsonResponse } from './test-utils';
import { countries } from './mocks/countries';

test.describe('Countries page content', () =>{
    test('has correct content', async({ page ,next}) => {
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