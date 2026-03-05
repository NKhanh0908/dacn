import { useEffect, useState } from "react";

export const useGetData = (apiFunc, params = {}, config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFunc(params, config);
        if (isMounted) {
          setData(res?.data ?? res);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data || err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};
