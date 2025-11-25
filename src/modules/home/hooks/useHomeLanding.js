import { useEffect, useMemo, useState } from "react";
import { homeApi } from "../../../services/home.api.js";

const initialState = {
  data: null,
  isLoading: true,
  error: null,
};

export const useHomeLanding = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let cancelled = false;
    setState(initialState);

    homeApi
      .getLanding()
      .then((data) => {
        if (cancelled) return;
        setState({ data, isLoading: false, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ data: null, isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      home: state.data,
      isLoading: state.isLoading,
      error: state.error,
    }),
    [state],
  );
};
