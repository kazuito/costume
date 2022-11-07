import React, { useEffect, useState } from "react";

import Page from "./components/Page";
import SideBar from "./components/SideBar";
import { debug } from "../utils/devtools";

const App = () => {
  const [page, setPage] = useState(() => "home");

  useEffect(() => {
    chrome.storage.local.get(["state"], (data) => {
      setPage(data.state.lastPage);
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.state) {
        setPage(changes.state.newValue.lastPage);
      }
    });
  }, []);

  useEffect(() => {
    debug.log("Page:", page);
  }, [page]);

  return (
    <div className="d-flex h-100">
      <style type="text/css">{`
      .nav-link.active {
        background-color: #2a313d !important;
        color : #abb2bf !important;
      }
      `}</style>
      <SideBar page={page} setPage={setPage} />
      <Page page={page} setPage={setPage} />
    </div>
  );
};

export default App;
