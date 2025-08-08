import ClientHomepage from "../components/ClientHomepage";
import { fetchMortgageRatesSSR } from '@/lib/utils/rates';

export default async function Home() {
  // Fetch rates server-side for better performance
  const initialRates = await fetchMortgageRatesSSR();

  return <ClientHomepage initialRates={initialRates} />;
}