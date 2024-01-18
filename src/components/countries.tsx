import Country from "../models/country"

export interface CountriesProps {
    countryListItems: Country[]
}

export function Countries(props: CountriesProps) {
    return <div className="main">
        <label data-testid='country-label'>Country</label>
        <span>
            <select data-testid='country-select'>
                {props.countryListItems.map(c => {
                    return <option key={c.code} value={c.code}>{c.name}</option>
                })}
            </select>
        </span>
    </div>
}