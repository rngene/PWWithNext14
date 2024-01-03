import { test } from 'next/experimental/testmode/playwright';

//test.describe('Countries selection', async () => {
    test('populates properties correctly', async ({ page, next }) => {

        const mock=`{
            "data": {
              "countries": [
                {
                  "name": "Country1",
                  "code": "C1"
                }
              ]
            }
          }`;

        next.onFetch((request) => {
            const url = new URL(request.url);
            //if (url.pathname === '/graphql') {
                return new Response(JSON.stringify({
                    data: {
                        countries: [
                            {
                                name: "Country1",
                                code: "C1"
                            }                            
                        ]
                    },
                  }), {
                  headers: {
                    'content-type': 'application/json',
                  }
                }
                );
            //}
      
            //return 'continue';
          });

        await page.goto('/');
        await page.getByTestId('country-select').selectOption('C1');
    });
//});