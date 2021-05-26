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
		creationdate: 16,
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
		creationdate: 17,
		donedate: "",
	},
	{
		id: 2,
		title: "Kuchen backen",
		description: "B Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		priority: 3,
		duedate: "2021-06-15",
		creationdate: 18,
		donedate: "",
	},
];

/*
// global variables
*/
let NEWID = LISTARR.length;
const LOCALE = "de-CH";
let THEME = "dark";
let LISTSORT = "creationdate";
let SHOWDONE = true;

/*
DOM elements
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

const modalTitle = modal.querySelector("[data-js='modaltitle']");
const modalDescription = modal.querySelector("[data-js='modaldescription']");
const radio = new Array(4);
radio[0] = modal.querySelector("[data-js-radio='0']");
radio[1] = modal.querySelector("[data-js-radio='1']");
radio[2] = modal.querySelector("[data-js-radio='2']");
radio[3] = modal.querySelector("[data-js-radio='3']");
const modalDatepicker = modal.querySelector("#datepicker");
const modalCancelBtn = modal.querySelector(".btn_cancel");
const modalSaveBtn = modal.querySelector("button[type='submit']");

// addItem below list
const addItemForm = document.querySelector("[js-submitAddItem]");

// the List - outputting DATALIST
// get to the stuff inside via bubbling
const articleList = document.querySelector("#ArticleList");

/*
DOM events
*/
addItemForm.addEventListener("submit", newListItem);
articleList.addEventListener("change", toggleDone);
articleList.addEventListener("click", editItem);
modalCancelBtn.addEventListener("click", updateListItem);
modalSaveBtn.addEventListener("click", updateListItem);

/*
Functions
*/

function createListHTML(listObj) {
	// OBJ -> HTML-String
	if (listObj) {
		return listObj.map((listItem) => {
			let check = "";
			if (listItem.donedate) {
				check = "checked";
			}
			return `<li class="articleList_item" data-id="${listItem.id}">
				<input type="checkbox" ${check} aria-checked="${Boolean(check)}"/>
				<label>${listItem.donedate
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
	return "<p class='emptyApp'>This list is empty.<br>Time to hammer-in some Topics:</p>";
}

function renderList(arr = LISTARR, sortKey = LISTSORT, showDone = SHOWDONE) {
	// OBJ -> sort -> HTML-String
	articleList.innerHTML = ""; // safer than .innerHTML ?
	// if "done"-Filter is not pressed filter arr to only uncompleted notes
	if (!showDone) {
		// eslint-disable-next-line no-param-reassign
		arr = arr.filter((current) => {
			return current.donedate === "";
		});
	}
	// render the html using sorted arr
	articleList.insertAdjacentHTML(
		"beforeend",
		createListHTML(sortArrayOfObjects(arr, sortKey)),
	);
	updateAppTitle(arr.length);
}

// do something with checkbox interaction
function toggleDone(e) {
	const hotArea = e.target.type; // checkbox is assumed to be only element with a type attribute
	if (hotArea) {
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
		const currentID = +currentItem.dataset.id;
		let doneValue;
		LISTARR[currentID].donedate ? (doneValue = "") : (doneValue = getTodayUS());
		LISTARR[currentID].donedate = doneValue;
		renderList();
	}
}

function editItem(e) {
	const hotArea = e.target.classList.contains("articleList_itemTitle")
		|| e.target.classList.contains("articleList_itemText");
	if (hotArea) {
		const currentID = +e.target.closest(".articleList_item").dataset.id;
		const currentItem = LISTARR[currentID];
		renderModal(currentItem);
		modalToggleVisibility(e);
	}
}

function renderModal(listItem) {
	if (listItem) {
		console.log("renderModal_ListItem:");
		console.log(listItem);
		modalTitle.value = listItem.title;
		modalDescription.value = listItem.description;
		const { priority } = listItem;
		radio[priority].checked = true;
		modalDatepicker.value = listItem.duedate;
		// store id of listItem in modal head
		// modal.setAttribute("data-id", listItem["id"]);
		modal.dataset.id = listItem.id;
	}
}

function updateListItem(e) {
	e.preventDefault(); // do not reload page from form
	// get id of listItem displayed in modal
	const id = +modal.dataset.id; // cast to number
	// get out if cancel has been clicked
	if (e.currentTarget.classList.contains("btn_cancel")) {
		// if modal shows an item, which has not been in LISTARR
		// decrement NEWID
		if (NEWID > LISTARR.length) {
			NEWID--;
		}
		modalToggleVisibility(e);
		return;
	}
	const currentItem = LISTARR[id];
	console.log("updateListItem_currentItem:");
	console.log(currentItem);
	// else target is save button
	// read all elements in modal form
	const title = modalTitle.value;
	const description = modalDescription.value;
	const duedate = modalDatepicker.value;
	let creationdate = 0;
	let donedate = 0;
	// if modal shows an item, which is not in LISTARR
	if (!currentItem) {
		// set new creation- & donedates
		creationdate = Date.now(); // sets it in [ms]
		donedate = "";
	} else {
		// else don't alter creation- & donedates
		creationdate = currentItem.creationdate;
		donedate = currentItem.donedate;
	}
	const priority = +radio.filter((c) => {
		// returns an array with all radios that are checked
		return c.checked;
	})[0].value; // get the value from the first in array (there is only one, anyway)

	const listItem = {
		id,
		title,
		description,
		priority,
		duedate,
		donedate,
		creationdate,
	};
	console.log("updateListItem_listItem:");
	console.log(listItem);

	// if we're editing a item in LISTARR,
	// don't just push the new one at the end of LISTARR. Replace instead.
	if (currentItem) {
		// replace listItem in LISTARR
		console.log("this is editing a current item");
		LISTARR[id] = listItem;
	} else {
		// add listItem at the end of LISTARR
		LISTARR.push(listItem);
	}
	console.log(LISTARR);

	// render the list
	renderList();
	// close the modal
	modalToggleVisibility(e);
}
function newListItem(e) {
	e.preventDefault(); // do not reload page from form
	// initialize default listItem
	const id = NEWID;
	NEWID++;
	const input = addItemForm.querySelector("input").value;
	const title = input ? input.match(/[a-z]/gi).join("") : ""; // set the title to empty or a regex filtered value of the input-field
	const description = "";
	const priority = 0;
	const duedate = "";
	const donedate = "";
	const creationdate = "";

	const newItem = {
		id,
		title,
		description,
		priority,
		duedate,
		creationdate,
		donedate,
	};
	renderModal(newItem);
	modalToggleVisibility(e);
}

function sortArrayOfObjects(myArray, sortKey = "title") {
	// returns a sorted array of objects
	// sortKey can be
	if (myArray.length > 0) {
		console.log(`sorting according: ${sortKey}`);
		const sortFunction = {
			string: (a, b) => {
				console.log("sorting strings");
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
				console.log("sorting biggest to smallest numbers");
				return b - a;
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

function getTodayUS() {
	// returns current date in YYYY-MM-DD
	const currentDate = new Date();
	return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
		}-${currentDate.getDate()}`;
}

function updateAppTitle(listLen) {
	visItemsCount.textContent = ` (${listLen})`;
	const d = new Date();
	modDate.textContent = d.toLocaleDateString(LOCALE, {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
}

// init
renderList();

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

function modalToggleVisibility(e) {
	e.preventDefault(); // do not reload page from form

	main.classList.toggle("hidden");
	modal.classList.toggle("open");
}
