// DOM elements
const settingsMenu = document.querySelector(".settingsMenu");
const settingsInp = settingsMenu.querySelectorAll("input");
const main = document.querySelector("main");
const modal = document.querySelector("aside");
const addForm = document.querySelector("[js-submitform]");
const modalFieldTitle = document.querySelector("[js-modalField-title]");

// DOM events
addForm.addEventListener("submit", modalOpen);

// Functions
function openSettings() {
	// click on gear icon opens settings-menu and toggles tabindex of menu-items between -1 and 0
	settingsMenu.classList.toggle("open");
	settingsInp.forEach((c) => {
		return c.getAttribute("tabindex") === "-1"
			? c.setAttribute("tabindex", "0")
			: c.setAttribute("tabindex", "-1");
	});
}

function setTheme(inpEl) {
	const theme = inpEl.value;
	document.body.setAttribute("theme", theme);
}

function modalOpen(e) {
	e.preventDefault();
	main.classList.toggle("hidden");
	modal.classList.toggle("hidden");
	modalFieldTitle.value = addForm.querySelector("input").value;
}
/*
	// slide up modal
	// disable main
	// e.preventDefault();
*/
