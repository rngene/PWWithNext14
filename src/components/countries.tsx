'use client'
import Country from "../models/country"

export interface CountriesProps {
    countryListItems: Country[]
}

export const Countries : React.FC<CountriesProps> = (props : CountriesProps) => { 
    return <div>
          <label data-testid='country-label'>Country</label>
          <span>
            <select  data-testid='country-select'>
              {props.countryListItems.map(c => {
                  return <option value={c.code} key={c.code}>{c.name}</option>
              })}
            </select>
          </span>
    </div>
}