export function addStyle(element, styleObject) {
  if (!element || element.nodeType !== 1) {
    throw new Error(`addStyle(${element}, ${styleObject}) failed.`);
  }

  for (let property in styleObject) {
    if (styleObject.hasOwnProperty(property)) {
      element.style[property] = styleObject[property];
    }
  }
}
