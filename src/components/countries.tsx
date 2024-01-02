'use client'
import Country from "../models/country"

export interface CountriesProps {
    countryListItems: Country[]
}

export const Countries : React.FC<CountriesProps> = (props : CountriesProps) => { 
    return <div>
        <h2>Countries list</h2>      <span>
          <select  data-testid='country-select'>
            {props.countryListItems.map(c => {
                return <option value={c.code} key={c.code}>{c.name}</option>
            })}
          </select>
      </span>
    </div>
}