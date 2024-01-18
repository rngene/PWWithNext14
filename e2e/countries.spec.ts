import { test, expect } from 'next/experimental/testmode/playwright';

test.describe('Countries page content', () =>{
    test('has correct content', async({page}) => {
        await page.goto('/');
        await expect(page).toHaveTitle('Countries of the World');
        await expect(page.getByTestId('country-label')).toHaveText('Country');
    })
})