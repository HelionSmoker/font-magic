function copy(text) {
	navigator.clipboard.writeText(text).then(
		function () {
			console.log(`Copied: ${text}`);
		},
		function (err) {
			console.error("Could not copy text: ", err);
		}
	);
}

function showButtonSuccess(button, originalContent, successMsg = "Success!") {
	button.textContent = successMsg;
	setTimeout(() => {
		button.textContent = originalContent;
	}, 1000);
}

function generateOptions(selectId, lowerBound, upperBound) {
	const selectElement = document.getElementById(selectId);

	for (let i = lowerBound; i <= upperBound; i++) {
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

function addCharEditor() {
	const main = document.getElementsByTagName("main")[0];
	const section = document.createElement("section");
	const [width, height] = getDimensions();

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

function getDimensions() {
	const width = document.getElementById("width").value;
	const height = document.getElementById("height").value;
	return [width, height];
}

function importFont() {}

function exportFont() {
	const sections = [...document.getElementsByTagName("section")];
	const [width, height] = getDimensions();
	let font = {};

	sections.forEach((section) => {
		const inputs = section.querySelectorAll("input");
		const char = inputs[0].value;
		font[char] = Array.from({ length: height }, () => Array(width).fill(0));

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				// Add 1, since 'char' is the first input
				font[char][i][j] = Number(inputs[(i * width + j, 1)].checked);
			}
		}
	});

	copy(JSON.stringify(font, null));

	const exportButton = document.getElementById("export-button");
	showButtonSuccess(exportButton, "Export");
}

function main() {
	generateOptions("height", 3, 20);
	generateOptions("width", 3, 20);
}

main();
