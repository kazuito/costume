import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import prettier from "prettier/standalone";
import parserPostcss from "prettier/parser-postcss";
import parserBabel from "prettier/parser-babel";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";

import { CostumeItem } from "../types";

const EditorTab = (props: {
  tab: string;
  setItem: any;
  item: any;
  items: any;
}) => {
  useEffect(() => {
    chrome.storage.local.get(["items"], (storage) => {
      for (let [i, itm] of storage.items.entries()) {
        if (itm.id === props.item.id) {
          props.setItem({ ...itm, index: i });
        }
      }
    });
  }, [props.tab]);

  switch (props.tab) {
    case "url":
      return (
        <CodeMirror
          value={props.item.url}
          theme={"dark"}
          onChange={(value, viewUpdate) => {
            props.setItem((prevItem: any) => {
              return {
                ...prevItem,
                url: value,
              };
            });
          }}
          onKeyUp={(e) => {
            let tmp = props.items;
            tmp[props.item.index].url = props.item.url;
            chrome.storage.local.set({ items: tmp });
          }}
        />
      );

    case "css":
      return (
        <CodeMirror
          value={props.item.css}
          extensions={[css()]}
          theme={"dark"}
          onChange={(value, viewUpdate) => {
            props.setItem((prevItem: any) => {
              return {
                ...prevItem,
                css: value,
              };
            });
          }}
          onKeyUp={(e) => {
            let tmp = props.items;
            tmp[props.item.index].css = props.item.css;
            chrome.storage.local.set({ items: tmp });
          }}
          onKeyDown={(e) => {
            if (e.altKey && e.key === "f") {
              e.preventDefault();
              // Formatting CSS
              let formatted = prettier.format(props.item.css, {
                parser: "css",
                plugins: [parserPostcss],
              });
              props.setItem((prev: any) => {
                return {
                  ...prev,
                  css: formatted,
                };
              });
            }
          }}
        />
      );
    case "js":
      return (
        <CodeMirror
          value={props.item.js}
          extensions={[javascript()]}
          theme={"dark"}
          onChange={(value, viewUpdate) => {
            props.setItem((prevItem: any) => {
              return {
                ...prevItem,
                js: value,
              };
            });
          }}
          onKeyUp={(e) => {
            let tmp = props.items;
            tmp[props.item.index].js = props.item.js;
            chrome.storage.local.set({ items: tmp });
          }}
          onKeyDown={(e) => {
            if (e.altKey && e.key === "f") {
              e.preventDefault();
              // Formatting JavaScript
              let formatted = prettier.format(props.item.js, {
                parser: "babel",
                plugins: [parserBabel],
              });
              props.setItem((prev: any) => {
                return {
                  ...prev,
                  js: formatted,
                };
              });
            }
          }}
        />
      );
    default:
      return <>ERROR</>;
  }
};

const NameInput = styled.input`
  border: none;
  padding: 0;
  background: inherit;
  outline: none;
`;

const Editor = (props: { page: string; setPage: any }) => {
  const [tab, setTab] = useState(() => "");
  const [items, setItems] = useState<Array<CostumeItem>>(() => []);
  const [item, setItem] = useState(() => {
    let result = {
      id: "",
      name: "",
      url: "",
      css: "",
      js: "",
      removed: false,
      index: 0,
    };
    chrome.storage.local.get(["items"], (storage) => {
      for (let [i, itm] of storage.items.entries()) {
        if (itm.id === props.page) {
          result = { ...itm, index: i };
        }
      }
    });
    return result;
  });

  useEffect(() => {
    chrome.storage.local.get(["items", "state"], (data) => {
      setItems(data.items);
      setTab(data.state.lastTab || "url");
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (!changes.items) return;
      changes.items && setItems(changes.items.newValue);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["items", "state"], (storage) => {
      for (let [i, itm] of storage.items.entries()) {
        if (itm.id === props.page) {
          setItem({ ...itm, index: i });
        }
      }

      // Set last page
      chrome.storage.local.set({
        state: {
          ...storage.state,
          lastPage: props.page,
        },
      });
    });
  }, [props.page]);

  useEffect(() => {
    chrome.storage.local.get(["state"], (storage) => {
      chrome.storage.local.set({
        state: {
          ...storage.state,
          lastTab: tab,
        },
      });
    });
  }, [tab]);

  return (
    <div
      className="bg-light d-flex flex-column flex-grow-1"
      style={{ height: "100vh" }}
    >
      <div
        className="px-3 pt-2 d-flex flex-column justify-content-between"
        style={{ height: 100 }}
      >
        <div className="d-flex mb-1 w-100 justify-content-between">
          <NameInput
            style={{ fontSize: "1.5rem" }}
            placeholder="Title"
            value={item.name}
            onInput={(e) => {
              setItem((prevItem) => {
                return {
                  ...prevItem,
                  name: (e.target as HTMLInputElement).value,
                };
              });
              let tmp = items;
              tmp[item.index].name = (e.target as HTMLInputElement).value;
              chrome.storage.local.set({ items: tmp });
              props.setPage(item.id);
            }}
          />
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-dark"
              onClick={(e) => {
                let tmp = items;
                tmp[item.index].removed = true;
                chrome.storage.local.set({ items: tmp });
                props.setPage("home");
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <ul className="nav nav-tabs" style={{ border: "none" }}>
          <li className="nav-item">
            <span
              className={`nav-link ${tab === "url" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              aria-current="page"
              onClick={() => {
                setTab("url");
              }}
            >
              URL
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${tab === "css" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              aria-current="page"
              onClick={() => {
                setTab("css");
              }}
            >
              CSS
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${tab === "js" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              aria-current="page"
              onClick={() => {
                setTab("js");
              }}
            >
              JavaScript
            </span>
          </li>
        </ul>
      </div>
      <div style={{ flexGrow: 1, position: "relative", background: "#282c34" }}>
        <EditorTab setItem={setItem} item={item} items={items} tab={tab} />
      </div>
    </div>
  );
};

export default Editor;
