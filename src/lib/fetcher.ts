export async function fetchFromCountriesGraph(body: object, testId: string) : Promise<Response> {
    return fetch(
        "https://countries.trevorblades.com/graphql",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "data-testid": testId,
            "cache": "no-store" 
          },
        }
      )    
}