import axios from 'axios';

export async function fetchDataByCurrency(
  currencyId: number,
  startDate: string,
  endDate: string,
) {
  try {
    const uri = `https://api.nbrb.by/ExRates/Rates/Dynamics/${currencyId}?startDate=${startDate}&endDate=${endDate}`;

    const response = await axios.get(uri);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}
