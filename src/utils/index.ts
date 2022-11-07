export function urlCheck(tabUrl: string | undefined, itemUrl: string) {
  if (!tabUrl || itemUrl === "" || tabUrl.match(/^chrome/)) {
    return false;
  }
  const urlRegex = new RegExp(`^(${itemUrl.replace(/\n\r?/g, "|")})$`);
  return urlRegex.test(tabUrl);
}

/**
 * Create Element
 */
export function create(tag: string, options?: any): HTMLElement {
  let tagBody = document.createElement(tag);
  let attrKeys = Object.keys(options);
  for (let key of attrKeys) {
    switch (key.toLowerCase()) {
      case "_text": {
        tagBody.innerText = options[key];
        break;
      }
      case "_html": {
        tagBody.innerHTML = options[key];
        break;
      }
      case "_children": {
        options[key].forEach((child: HTMLElement) => {
          tagBody.appendChild(child);
        });
        break;
      }
      case "_on": {
        let eventKeys = Object.keys(options[key]);
        eventKeys.forEach((eventKey) => {
          tagBody.addEventListener(eventKey, options[key][eventKey]);
        });
        break;
      }
      default:
        tagBody.setAttribute(key, options[key]);
        break;
    }
  }
  return tagBody;
}
