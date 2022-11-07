import React from "react";

import Header from "./components/Header";
import ActiveItems from "./components/ActiveItems";

const App = (props: {}) => {
  return (
    <>
      <Header />
      <main>
        <ActiveItems />
      </main>
    </>
  );
};

export default App;
