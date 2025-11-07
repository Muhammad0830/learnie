"use client";
import GetStudents from "./provider";

const Page = () => {
  const somethign = GetStudents();
  console.log("students", somethign);

  return <div>Students Page</div>;
};

export default Page;
