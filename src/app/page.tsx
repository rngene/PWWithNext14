import type { Metadata } from 'next'
import { Countries } from '../components/countries'
import Country from '../models/country';
import { fetchFromCountriesGraph } from '../lib/fetcher';

 
export const metadata: Metadata = {
  title: 'Countries',
  description: 'Countries of the world',
}

export default async function Page() {
  
  const response  = await fetchFromCountriesGraph({
        query: '{ countries { name, code } }',
      }, 
      'getCountries').then((res) => res.json());

  const countries : Country[] = response.data.countries;

  return (
    <div>
      <h1>Countries of the world</h1>
      <Countries countryListItems={countries}></Countries>
    </div>
  )
}
