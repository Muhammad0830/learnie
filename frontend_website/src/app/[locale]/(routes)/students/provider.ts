"use client";
import useApiQuery from "@/hooks/useApiQuery";

export default function GetStudents() {
  const { data, error } = useApiQuery("/users?role='student'", {
    key: "Students",
  });

  if (error) {
    console.error("error fetching students", error);
  }

  console.log("data", data);
  return data;
}
