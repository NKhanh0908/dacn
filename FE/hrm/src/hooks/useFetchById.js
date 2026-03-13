import { useEffect, useState } from "react";

export const useFetchById = (apiFunc, id, config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchById = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFunc(id, config);
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

    fetchById();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, loading, error };
};