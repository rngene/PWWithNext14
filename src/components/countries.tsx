'use client'
import { useState } from "react";
import Country from "../models/country"
import CountryDetails from "../models/countryDetails";

export interface CountriesProps {
    countryListItems: Country[]
}

function getCountryQuery(countryCode : string) {
  return `
  {"query":"query ($code: ID!) {\n  country(code: $code) {\n    capital\n    currency\n  }\n}","variables":{"code":"US"}}
  `
}

export function Countries(props : CountriesProps) { 

  const [countryCode, setCountryCode] = useState<string>(props.countryListItems[0].code);
  const [countryDetails, setCountryDetails] = useState<CountryDetails|null>(null); 
  const [hasErrors, setHasErrors] = useState(false);

  function countryChangeHandler(selectedOption: React.ChangeEvent<HTMLSelectElement>)  {
    setCountryCode(selectedOption.target.value);
  };   
  
  async function  getDetailsClickHandler() {
    setHasErrors(false);
        var response = await fetch(
          "https://countries.trevorblades.com/graphql",
          {
            method: "POST",
            body: JSON.stringify({
              query: `query Country($id: ID!) {
                    country(code: $id) {
                    capital
                    currency
                  }
                }`,
              variables: {id:`${countryCode}`}   
            }),
            headers: {
              "Content-Type": "application/json",
              "data-testid": "getCountryDetails"
            },
          }
        ).then((res) => {
          if (res.status!==200) {
            setHasErrors(true);
          }
          return res.json();
        });

        if (!response?.data?.country) {
          setHasErrors(true);
        } else {
          setCountryDetails(response.data.country);
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