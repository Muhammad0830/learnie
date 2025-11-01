"use client";

import { useEffect } from "react";

export default function Home() {
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3001/notes");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div></div>
    </div>
  );
}
