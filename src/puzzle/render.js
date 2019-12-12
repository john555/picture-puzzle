export function render(containerId) {
  const wrapper = document.getElementById(containerId);

  if (!wrapper) {
    throw new Error(`Could not find HTML element with id: ${containerId}`);
  }

  wrapper.appendChild(this.stage);
}
