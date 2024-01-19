import type { Metadata } from 'next'
import { Countries } from '../components/countries'

 
export const metadata: Metadata = {
  title: 'Countries of the World'

}

export default async function Page() {
  
 

  return ( <div>
    <Countries></Countries>
  </div>
  )
}
