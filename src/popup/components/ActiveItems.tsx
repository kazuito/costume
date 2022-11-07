import React, { useEffect, useState } from "react";

import { CostumeItem } from "../../options/types";
import { urlCheck } from "../../utils";

const ItemList = (props: { items: CostumeItem[] }) => {
  if (props.items.length === 0)
    return <div className="no-active">No active item</div>;
  else {
    return (
      <>
        {props.items.map((item) => {
          return (
            <li key={item.id} className="item">
              <div className="item-name">{item.name}</div>
              <div className="item-button-box">
                <button
                  className="material-symbols-rounded"
                  onClick={() => {
                    chrome.storage.local.get(["state"], (data) => {
                      chrome.storage.local
                        .set({
                          state: {
                            ...data.state,
                            lastPage: item.id,
                          },
                        })
                        .then(() => {
                          chrome.runtime.openOptionsPage();
                        });
                    });
                  }}
                >
                  edit_square
                </button>
              </div>
            </li>
          );
        })}
      </>
    );
  }
};

const ActiveItems = () => {
  const [activeItems, setActiveItems] = useState<CostumeItem[]>(() => []);

  useEffect(() => {
    chrome.tabs.query(
      {
        lastFocusedWindow: true,
        active: true,
      },
      (tabs) => {
        chrome.storage.local.get(["items"], (data) => {
          let filteredItems = data.items.filter((item: CostumeItem) => {
            if (!item.removed && urlCheck(tabs[0].url, item.url)) {
              return true;
            }
            return false;
          });
          setActiveItems(filteredItems);
        });
      }
    );
  }, []);

  return (
    <div className="active-section">
      <div className={`active-count ${activeItems.length === 0 && "zero"}`}>
        <div className="active-number">{activeItems.length}</div>
        <span>Active{activeItems.length > 1 && "s"}</span>
      </div>
      <ul className="active-list">
        <ItemList items={activeItems} />
      </ul>
    </div>
  );
};

export default ActiveItems;
