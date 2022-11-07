import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { CostumeData } from "../types";

const Container = styled.div`
  box-sizing: border-box;
  width: 200px;
  height: 100vh;
  overscroll-behavior: contain;
  transition: width 0.5s;

  @media (width<1000px) {
    width: 32px;

    &:hover {
      width: 200px;
    }
  }

  ::-webkit-scrollbar {
    background: #202124;
    width: 0.7rem;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(63, 63, 66);
  }
  ::-webkit-scrollbar-button {
    background: #323233;
    display: none;
  }
  ::-webkit-scrollbar-corner {
    background-color: #202124;
  }
`;

const SideBar = (props: { page: string; setPage: any }) => {
  const [items, setItems] = useState<Array<any>>(() => {
    return [];
  });
  useEffect(() => {
    chrome.storage.local.get(["items"], (storage) => {
      setItems(storage.items || []);
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.items) return;
      setItems(changes.items.newValue);
    });
  }, []);

  return (
    <Container className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark position-sticky top-0 bottom-0 overflow-auto ">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <span
            onClick={() => {
              props.setPage("home");
            }}
            className={`nav-link text-white ${
              props.page === "home" ? "active" : ""
            }`}
          >
            Home
          </span>
        </li>
        <hr />
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center"
            type="button"
            style={{ width: "24px", height: "24px", padding: "0" }}
            onClick={() => {
              let id = new Date().getTime().toString(36);
              let tmp = items;
              tmp.push({
                id: id,
                name: `New Item #${id.slice(5)}`,
                url: "",
                css: "",
                js: "",
                removed: false,
              });
              chrome.storage.local.set({ items: tmp });
              props.setPage(id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
        </div>

        {items.map((item) => {
          if (item.removed === true) return;
          return (
            <li
              key={`item-${item.id}`}
              className={`d-inline-block nav-item mw-100 overflow-hidden`}
              tabIndex={0}
              data-toggle="tooltip"
              data-placement="right"
              title={item.name}
            >
              <span
                onClick={() => {
                  props.setPage(item.id);
                }}
                className={`nav-link text-white text-nowrap ${
                  props.page === item.id ? "active" : ""
                }`}
                role={"button"}
              >
                {item.name}
              </span>
            </li>
          );
        })}
      </ul>
    </Container>
  );
};

export default SideBar;
