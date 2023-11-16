import {useState, useEffect} from 'react';
import axios, {AxiosResponse} from 'axios';
import {DataPoint} from '../data/mock';

interface FetchResult {
  data: DataPoint[];
  isLoading: boolean;
  error: string | null;
}

function useCurrencyDynamicsFetch(
  currencyId: number,
  startDate: string,
  endDate: string,
): FetchResult {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = `https://api.nbrb.by/ExRates/Rates/Dynamics/${currencyId}?startDate=${startDate}&endDate=${endDate}`;

    const source = axios.CancelToken.source();

    setIsLoading(true);
    setError(null);

    axios
      .get(apiUrl, {cancelToken: source.token})
      .then((response: AxiosResponse<DataPoint[]>) => {
        setData(response.data);
      })
      .catch((e: Error) => {
        if (axios.isCancel(e)) {
          // Request was canceled, no need to handle errors in this case
        } else {
          setError('An error occurred while fetching dynamics data.');
          console.error(e);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup: Cancel the request if the component unmounts
    return () => {
      source.cancel();
    };
  }, [currencyId, startDate, endDate]);

  return {data, isLoading, error};
}

export default useCurrencyDynamicsFetch;
