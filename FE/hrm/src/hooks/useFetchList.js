import { useEffect, useState } from "react";

export const useFetchList = (apiFunc, query = {}, config = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchList = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFunc(query, config);
        if (isMounted) {
          setData(res?.data ?? []);
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

    fetchList();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(query)]);

  return { data, loading, error };
};