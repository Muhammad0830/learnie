"use client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { useCustomToast } from "@/context/CustomToastContext";

type UrlType<TVariables> = string | ((variables: TVariables) => string);

export function useApiMutation<
  TResponse = unknown,
  TVariables = unknown
>(
  url: UrlType<TVariables>,
  method: "post" | "put" | "delete" = "post"
): UseMutationResult<TResponse, Error, TVariables> {
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();

  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const finalUrl = typeof url === "function" ? url(data) : url;
      const response = await api[method]<TResponse>(finalUrl, data);
      return response.data;
    },
    onError: (error: any) => { // eslint-disable-line
      showToast(
        "error",
        toastT("Failed to perform the action"),
        toastT("Internal server error")
      );
      throw new Error(error.message);
    },
  });
}
