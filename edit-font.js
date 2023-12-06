function generateOptions(selectId) {
  const selectElement = document.getElementById(selectId);

  for (let i = 3; i <= 20; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectElement.add(option);
  }
}

function restrictCharLength(element) {
  element.addEventListener("input", function () {
    if (this.value.length > 1) {
      this.value = this.value.slice(0, 1); // Keep only the first character
    }
  });
}

function addCharEditor(width, height) {
  const main = document.getElementsByTagName("main")[0];
  const section = document.createElement("section");

  const charInput = document.createElement("input");
  charInput.classList.add("char-input");
  charInput.placeholder = "ch";
  restrictCharLength(charInput);

  const checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add("checkbox-container");
  checkboxContainer.style = `grid-template-columns: repeat(${width}, 1fr)`;

  const removeButton = document.createElement("button");
  removeButton.classList.add("close-button");
  removeButton.textContent = "X";
  removeButton.onclick = function () {
    this.parentElement.parentElement.removeChild(this.parentElement);
  };

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const bitInput = document.createElement("input");
      bitInput.type = "checkbox";
      checkboxContainer.appendChild(bitInput);
    }
  }

  section.appendChild(removeButton);
  section.appendChild(charInput);
  section.appendChild(checkboxContainer);
  main.appendChild(section);
}

function submitDimensionsForm() {
  const height = document.getElementById("height").value;
  const width = document.getElementById("width").value;

  addCharEditor(width, height);
}

function main() {
  generateOptions("height");
  generateOptions("width");
}

main();