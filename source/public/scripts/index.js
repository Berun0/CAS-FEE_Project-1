// DOM Strings

function openSettings() {
	// click on gear icon opens settings-menu and toggles tabindex of menu-items between -1 and 0
	const settingsMenu = document.querySelector(".settingsMenu");
	settingsMenu.classList.toggle("open");
	const settingsInp = settingsMenu.querySelectorAll("input");
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
