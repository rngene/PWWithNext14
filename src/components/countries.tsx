'use client'
import { useState } from "react"
import Country from "../models/country"
import CountryDetails from "../models/countryDetails";
import { fetchFromCountriesGraph } from "../lib/fetcher";

export interface CountriesProps {
    countryListItems: Country[]
}

export function Countries(props: CountriesProps) {
    const [countryCode, setCountryCode] = useState('');
    const [countryDetails, setCountryDetails] = useState<CountryDetails|null>(null);

    function countryChangeHandler(selectedOption: React.ChangeEvent<HTMLSelectElement>)  {
        setCountryCode(selectedOption.target.value);
    }; 
    
    async function getDetailsClickHandler() {
        var response = await fetchFromCountriesGraph({
            query: `query Country($id: ID!) {
                country(code: $id) {
                capital
                currency
              }
            }`,
            variables: {id:`${countryCode}`}             
        },'getCountryDetails').then((res) => {      
            return res.json();
        });
        
        const ctryDetails = response.data.country;
        setCountryDetails(ctryDetails);
    }
    
    return <div className="main">
        <label data-testid='country-label'>Country</label>
        <span>
            <select data-testid='country-select' onChange={countryChangeHandler}>
                {props.countryListItems.map(c => {
                    return <option key={c.code} value={c.code}>{c.name}</option>
                })}
            </select>
        </span>
        <input type='button' value='Get Details' data-testid='submit-button' onClick={getDetailsClickHandler}></input>
        <label>Capital</label><label className='result' data-testid='capital-value-label'>{countryDetails?.capital}</label>
    </div>
}