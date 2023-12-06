// Yellow to gray
const COLORS = generateColorBridge([255, 205, 87], [104, 99, 90], 4);

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

function interpolate(start, end, step, totalSteps) {
	return start + ((end - start) * step) / totalSteps;
}

function generateColorBridge(rgb1, rgb2, steps) {
	let colorBridge = [`rgb(${rgb2.join(",")})`];

	for (let step = 0; step <= steps; step++) {
		let interpolatedColor = [
			Math.round(interpolate(rgb1[0], rgb2[0], step, steps)),
			Math.round(interpolate(rgb1[1], rgb2[1], step, steps)),
			Math.round(interpolate(rgb1[2], rgb2[2], step, steps)),
		];
		colorBridge.push(`rgb(${interpolatedColor.join(", ")})`);
	}

	return colorBridge;
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

function createCharInput() {
	const result = document.createElement("input");
	
	result.classList.add("char-input");
	result.placeholder = "ch";
	restrictCharLength(result);
	
	return result;
}

function createRemoveButton() {
	const result = document.createElement("button");
	
	result.classList.add("close-button");
	result.textContent = "X";
	result.onclick = function () {
		this.parentElement.parentElement.removeChild(this.parentElement);
	};

	return result;
}

function createCounter(colorOptionCount) {
	const result = document.createElement("button");
	let counter = 0;

	result.textContent = counter;
	result.classList.add("bit-counter")

	result.addEventListener("mousedown", function (event) {
		if (event.button === 2) {
			// Right mouse button
			if (counter - 1 >= 0) {
				counter--;
			}
		} else if (event.button === 0) {
			// Left mouse button
			counter++;
		}

		result.textContent = counter;
		result.style.backgroundColor = COLORS[counter % colorOptionCount];

		let color = counter % colorOptionCount > 0 ? "black" : "white";
		result.style.color = color;
	});

	// Prevent context menu on right-click
	result.addEventListener("contextmenu", function (event) {
		event.preventDefault();
	});

	return result
}

function createCountersContainer() {
	const result = document.createElement("div");
	const [width, height] = getDimensions();

	result.classList.add("counters-container");
	result.style = `grid-template-columns: repeat(${width}, 1fr)`;

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			result.appendChild(createCounter(COLORS.length));
		}
	}

	return result
}

function addCharEditor() {
	const main = document.getElementsByTagName("main")[0];
	const section = document.createElement("section");

	section.appendChild(createRemoveButton());
	section.appendChild(createCharInput());
	section.appendChild(createCountersContainer());
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
		const char = section.querySelector("input").value;
		const counters = section.querySelectorAll(".bit-counter");
		font[char] = Array.from({ length: height }, () => Array(width).fill(0));

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				font[char][i][j] = counters[i * width + j].textContent;
			}
		}
	});

	copy(JSON.stringify(font, null));

	const exportButton = document.getElementById("export-button");
	showButtonSuccess(exportButton, "Export");
}

function main() {
	generateOptions("height", 4, 20);
	generateOptions("width", 3, 20);
}

main();
