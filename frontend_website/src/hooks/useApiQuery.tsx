"use client";
import { useCustomToast } from "@/context/CustomToastContext";
import api from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

// Let queryKey be compatible with TanStack: readonly unknown[]
type UseApiQueryOptions<T> = {
  key: string | readonly (string | number)[];

  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | "always";
  refetchOnWindowFocus?: boolean;

  queryOptions?: Omit<
    UseQueryOptions<T, Error, T, readonly unknown[]>,
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

  const { data, error, isLoading, refetch, isError } = useQuery<T>({
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
      showToast(
        "error",
        toastT("Error occured"),
        toastT("Internal server error")
      );
      hasShownError.current = true;
    }
  }, [error, showToast, toastT]);

  return { data, error, isLoading, refetch, isError };
};

export default useApiQuery;
