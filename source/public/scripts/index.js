// data object
// empty dates must be ""
// unchecked listItems must have donedate = ""
// creationdate is in ms
// other dates in YYYY-MM-DD
const LISTARR = [
	{
		id: 0,
		title: "aTitel",
		description:
			"A Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam quidem qui fugiat unde quam temporibus quis, aspernatur reprehenderit sunt vel sed, illo, autem neque nesciunt?Architecto harum necessitatibus dolor suscipit.",
		priority: 0,
		duedate: "2021-05-26",
		creationdate: 1623362400000,
		donedate: "2021-05-24",
	},
	{
		id: 1,
		title:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam quidem qui",
		description:
			"Z Aspernatur reprehenderit sunt vel sed, illo, autem neque nesciunt?Architecto harum necessitatibus dolor suscipit.",
		priority: 2,
		duedate: "",
		creationdate: 1624053600000,
		donedate: "",
	},
	{
		id: 2,
		title: "Kuchen backen",
		description: "B Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		priority: 3,
		duedate: "2021-06-15",
		creationdate: 1624053600300,
		donedate: "",
	},
];

/*
// global variables
*/
const ID = LISTARR.length;
const LOCALE = "de-CH";
let THEME = "dark";
let LISTSORT = "creationdate";
let SHOWDONE = true;

/*
DOMStrings
*/

//
// AppTitle Area
const visItemsCount = document.querySelector(".appTitle_visItemsCount");
const modDate = document.querySelector(".appTitle_modDate");

// settings dropdown
const settingsMenu = document.querySelector(".settingsMenu");
const settingsInp = settingsMenu.querySelectorAll("input");

// modal
const main = document.querySelector("main");
const modal = document.querySelector("aside");
const modalForm = document.querySelector("[js-modalform]");
const modalFieldTitle = modalForm.querySelector("[js-modalField-title]");
const modalSubmitBtn = modalForm.querySelector("button[type='submit']");

// addItem below list
const addForm = document.querySelector("[js-submitAddItem]");

// the List - outputting DATALIST
const articleList = document.querySelector("#ArticleList");

/*
DOM events
*/
addForm.addEventListener("submit", modalOpen);

/*
Functions
*/
function isItChecked(date) {}

function createListHTML(listObj) {
	// OBJ -> HTML-String
	if (listObj) {
		return listObj
			.map((listItem) => {
				let check = "";
				if (listItem.donedate) {
					check = "checked";
				}
				return `<li class="articleList_item" data-id="${listItem.id}">
				<input type="checkbox" ${check} aria-checked="${Boolean(check)}"/>
				<label>${
					listItem.donedate
						? listItem.donedate
						: listItem.duedate
						? listItem.duedate
						: "sometime" // empty due date = sometime
				}</label>
				<h2 class="articleList_itemTitle">
				${listItem.title}
				</h2>
				<p class="articleList_itemText">
				${listItem.description}
				</p>
				</li>`;
			})
			.join("");
	} // if (listObj)
	return '<p class="emptyApp">This list is empty.<br>Time to hammer-in some ToDos:</p>';
}

function renderList(arr = LISTARR, sortKey = LISTSORT, showDone = SHOWDONE) {
	// OBJ -> sort -> HTML-String
	articleList.innerHTML = ""; // safer than .innerHTML ?
	if (!showDone) {
		arr = arr.filter((current) => {
			return current["donedate"] === "";
		});
	}
	articleList.insertAdjacentHTML(
		"beforeend",
		createListHTML(sortArrayOfObjects(arr, sortKey))
	);
	updateAppTitle(arr.length);
}

// do something with checkbox interaction
function toggleDone(e) {
	const btnCheckbox = e.target.type;
	if (btnCheckbox) {
		const currentItem = e.target.closest(".articleList_item");
		// set checkbox attribute to checked if not existing
		currentItem.toggleAttribute("checked");

		// toggle aria-checked attribute
		let ariaValue;
		currentItem.getAttribute("aria-checked") === "true"
			? (ariaValue = "false")
			: (ariaValue = "true");
		currentItem.setAttribute("aria-checked", ariaValue);

		// toggle donedate of current item in LISTARR
		const currentID = currentItem.dataset.id;
		let doneValue;
		LISTARR[currentID].donedate ? (doneValue = "") : (doneValue = today());
		LISTARR[currentID].donedate = doneValue;
		renderList();
	}
}

function editItem() {}

function addItem() {}

function attachListEvents() {
	articleList.addEventListener("change", toggleDone);
	articleList.addEventListener("click", editItem);
}

function sortArrayOfObjects(myArray, sortKey = "title") {
	if (myArray.length > 0) {
		console.log(`sorting according: ${sortKey}`);
		console.log(`myArray: ${myArray}`);
		const sortFunction = {
			string: (a, b) => {
				// do not consider uppercase
				let sa = a.toLowerCase();
				let sb = b.toLowerCase();
				// sort "" empty string = "sometime" last
				if (!sa) {
					sa = "Z";
				}
				if (!sb) {
					sb = "Z";
				}
				return sa > sb ? 1 : sa < sb ? -1 : 0;
			},
			number: (a, b) => {
				return a - b;
			},
		};
		// ermittle typeof v. key-value anhand des ersten arrayelementes
		// -> fn for "string" or "number"
		const compareFunction = sortFunction[typeof myArray[0][sortKey]];
		// ...myArray für immutability. damit das original nicht sortiert wird
		return [...myArray].sort((firstItem, secondItem) => {
			return compareFunction(firstItem[sortKey], secondItem[sortKey]);
		}); // z.B. firstItem["price"], secondItem["price"]
	} // if (myArray)
}

function today() {
	// returns current date in YYYY-MM-DD
	const currentDate = new Date();
	return `${currentDate.getFullYear()}-${
		currentDate.getMonth() + 1
	}-${currentDate.getDate()}`;
}

function updateAppTitle(listLen) {
	visItemsCount.textContent = ` (${listLen})`;
	let d = new Date();
	modDate.textContent = d.toUTCString();
}

// init
renderList();
attachListEvents();

/*



dabbles



*/
function openSettings() {
	// click on … icon opens settings-menu and toggles tabindex of menu-items between -1 and 0
	settingsMenu.classList.toggle("open");
	settingsInp.forEach((c) => {
		return c.getAttribute("tabindex") === "-1"
			? c.setAttribute("tabindex", "0")
			: c.setAttribute("tabindex", "-1");
	});
}

function setTheme(inpEl) {
	THEME = inpEl.value;
	document.body.setAttribute("theme", THEME);
}

function setSort(inpEl) {
	LISTSORT = inpEl.value;
	console.log(LISTSORT);
	renderList();
}

function setFilter(inpEl) {
	SHOWDONE = inpEl.checked;
	inpEl.toggleAttribute("checked");
	console.log(SHOWDONE);
	renderList();
}

function modalOpen(e) {
	e.preventDefault();
	main.classList.toggle("hidden");
	modal.classList.toggle("open");
	modalFieldTitle.value = addForm.querySelector("input").value;
	modalSubmitBtn.focus();
}

function getDatepicker(inpEl) {
	console.log(inpEl.value);
}
