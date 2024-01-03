import type { Metadata } from 'next'
import { Countries } from '../components/countries'
import Country from '../models/country';
 
export const metadata: Metadata = {
  title: 'Countries',
  description: 'Countries of the world',
}

export default async function Page() {
  
  const response  = await fetch(
    "https://countries.trevorblades.com/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: '{ countries { name, code } }',
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  const countries : Country[] = response.data.countries;

  return (
    <div>
      <h1>Countries of the world</h1>
      <Countries countryListItems={countries}></Countries>
    </div>
  )
}
