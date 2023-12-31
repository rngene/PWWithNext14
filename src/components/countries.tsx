'use client'
import { useState } from "react";
import Country from "../models/country"
import CountryDetails from "../models/countryDetails";
import { fetchFromCountriesGraph } from "../lib/fetcher";

export interface CountriesProps {
    countryListItems: Country[]
}

export function Countries(props : CountriesProps) { 
  const [countryCode, setCountryCode] = useState<string>(props.countryListItems[0].code);
  const [countryDetails, setCountryDetails] = useState<CountryDetails|null>(null); 
  const [hasErrors, setHasErrors] = useState(false);
  const [cache, setCache] = useState<{[key: string]: CountryDetails}>({});

  function countryChangeHandler(selectedOption: React.ChangeEvent<HTMLSelectElement>)  {
    setCountryCode(selectedOption.target.value);
  };   
  
  async function  getDetailsClickHandler() {
    if (cache[countryCode]) {
      setCountryDetails(cache[countryCode]);
      return;
    }
    setHasErrors(false);

    var response = await fetchFromCountriesGraph({
          query: `query Country($id: ID!) {
                country(code: $id) {
                capital
                currency
              }
            }`,
          variables: {id:`${countryCode}`}   
        },
        'getCountryDetails'
    ).then((res) => {
      if (res.status!==200) {
        setHasErrors(true);
      }
      return res.json();
    });

    if (!response?.data?.country) {
      setHasErrors(true);
    } else {
      const ctryDetails=response.data.country;
      setCountryDetails(ctryDetails);
      cache[countryCode] = ctryDetails;
      setCache(cache);
    }
  }

return <div className="main">
      <label data-testid='country-label'>Country</label>
      <span>
        <select onChange={countryChangeHandler}  data-testid='country-select'>
          {props.countryListItems.map(c => {
              return <option value={c.code} key={c.code}>{c.name}</option>
          })}
        </select>
      </span>
      <input type='button' value='Get Details' data-testid='submit-button' onClick={getDetailsClickHandler}></input>
      {hasErrors ? 
        <label className='error' data-testid='error-label'>Sorry an error has ocurred</label>
        :
        countryDetails ? 
         <>
          <label>Capital</label><label className='result' data-testid='capital-label'>{countryDetails.capital}</label>
          <label>Currency</label><label className='result' data-testid='currency-label'>{countryDetails.currency}</label>
         </>
        : 
         <></> }      
  </div>
}