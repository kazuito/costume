import React from "react";
import { CostumeData } from "../types";
import Editor from "./Editor";
import Home from "./Home";

const Page = (props: { page: string; setPage: any }) => {
  switch (props.page) {
    case "home":
      return <Home />;
    default:
      return <Editor page={props.page} setPage={props.setPage} />;
  }
};
export default Page;
