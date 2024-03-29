'use client'
import { useState } from "react";
import Country from "../models/country"
import { fetchFromCountriesGraph } from "../lib/fetcher";
import CountryDetails from "../models/countryDetails";

export interface CountriesProps {
    countryListItems: Country[]
}

export function Countries(props: CountriesProps) {
    const [countryCode, setCountryCode] = useState<string>(props.countryListItems[0].code);
    const [countryDetails, setCountryDetails] = useState<CountryDetails|null>(null);
    const [hasErrors, setHasErrors] = useState(false);
    const [cache, setCache] = useState<{[key:string] : CountryDetails}>({});

    function countryChangeHandler(selectedOption: React.ChangeEvent<HTMLSelectElement>)  {
        setCountryCode(selectedOption.target.value);
    }; 
    
    async function getDetailsClickHandlers() {
        if (cache[countryCode]) {
            setCountryDetails(cache[countryCode]);
            return;
        }
        var response = await fetchFromCountriesGraph({
            query: `query Country($id: ID!) {
                country(code: $id) {
                capital
                currency
              }
            }`,
            variables: {id:`${countryCode}`}             
        },'getCountryDetails').then((res) => {
            if (res.status!==200) {
                setHasErrors(true);
            }
            return res.json();
        });
        if (!response?.data?.country) {
            setHasErrors(true);
            return;
        }
        const ctryDetails=response.data.country;
        setCountryDetails(ctryDetails);
        cache[countryCode] = ctryDetails;
        setCache(cache);
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
        <input type='button' value='Get Details' data-testid='submit-button' onClick={getDetailsClickHandlers}></input>
        {
            hasErrors ?  
                <label className='error' data-testid='error-label'>Sorry an error has ocurred</label>
            : 
                countryDetails ? <>
                <label data-testid='capital-label'>Capital</label><label className='result' data-testid='capital-value-label'>{countryDetails.capital}</label>
                <label>Currency</label><label className='result' data-testid='currency-value-label'>{countryDetails.currency}</label>
                </> 
                : 
                <></>
        }
    </div>
}