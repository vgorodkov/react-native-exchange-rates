import {useState, useEffect} from 'react';
import axios, {AxiosResponse} from 'axios';

interface CurrencyInfo {
  Cur_ID: number;
  Cur_ParentID: number;
  Cur_Code: string;
  Cur_Abbreviation: string;
  Cur_Name: string;
  Cur_Name_Bel: string;
  Cur_Name_Eng: string;
  Cur_QuotName: string;
  Cur_QuotName_Bel: string;
  Cur_QuotName_Eng: string;
  Cur_NameMulti: string;
  Cur_Name_BelMulti: string;
  Cur_Name_EngMulti: string;
  Cur_Scale: number;
  Cur_Periodicity: number;
  Cur_DateStart: string;
  Cur_DateEnd: string;
}

interface FetchResult {
  data: CurrencyInfo;
  isLoading: boolean;
  error: string | null;
}

function useCurrencyInfo(currencyId: number): FetchResult {
  const [data, setData] = useState<CurrencyInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = `https://api.nbrb.by/exrates/currencies/${currencyId}`;

    const source = axios.CancelToken.source();

    setIsLoading(true);
    setError(null);

    axios
      .get(apiUrl, {cancelToken: source.token})
      .then((response: AxiosResponse<CurrencyInfo>) => {
        setData(response.data);
      })
      .catch((e: Error) => {
        if (axios.isCancel(e)) {
          // Request was canceled, no need to handle errors in this case
        } else {
          setError('An error occurred while fetching data.');
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
  }, [currencyId]);

  return {data, isLoading, error};
}

export default useCurrencyInfo;
