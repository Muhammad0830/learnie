"use client";
import { useCustomToast } from "@/context/CustomToastContext";
import api from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface ServerErrorData {
  error: string;
}

interface ApiErrorResponse {
  data: ServerErrorData;
  status: number;
}

interface ApiAxiosError extends Error {
  response?: ApiErrorResponse;
  isAxiosError?: boolean;
}

type UseApiQueryOptions<T> = {
  key: string | readonly (string | number)[];

  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | "always";
  refetchOnWindowFocus?: boolean;

  queryOptions?: Omit<
    UseQueryOptions<T, ApiAxiosError, T, readonly unknown[]>,
    "queryKey" | "queryFn"
  >;
};

const useApiQuery = <T,>(
  url: string,
  {
    key,
    enabled = true,
    staleTime = 0,
    refetchOnMount = "always",
    refetchOnWindowFocus = true,
    queryOptions,
  }: UseApiQueryOptions<T>
) => {
  const { showToast } = useCustomToast();
  const toastT = useTranslations("Toast");
  const hasShownError = useRef(false);

  const { data, error, isLoading, refetch, isError } = useQuery<
    T,
    ApiAxiosError
  >({
    queryKey: Array.isArray(key) ? [...key] : [key], // ✅ make sure it's an array
    queryFn: async () => {
      const response = await api.get(url);
      return response.data;
    },
    retry: 1,
    enabled,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus,
    ...queryOptions,
  });

  useEffect(() => {
    if (error && !hasShownError.current) {
      if (error.response?.data?.error) {
        showToast("error", error.response?.data?.error);
      } else {
        showToast(
          "error",
          toastT("Error occured"),
          toastT("Internal server error")
        );
      }
      hasShownError.current = true;
      console.error("error", error.response?.data?.error);
    }

    if (data && hasShownError.current) {
      hasShownError.current = false;
    }
  }, [error, showToast, toastT, data]);

  return { data, error, isLoading, refetch, isError };
};

export default useApiQuery;
