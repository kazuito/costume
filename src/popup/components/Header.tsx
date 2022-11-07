import React from "react";

const Header = () => {
  return (
    <header>
      <div className="top-logo">
        <img src="img/logo-color-black.svg" alt="" />
      </div>
      <div
        id="option-icon"
        className="material-symbols-rounded"
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        settings
      </div>
    </header>
  );
};

export default Header;
