export function sortArrayOfObjects(myArray, sortKey = "title") {
  // returns a sorted array of objects
  console.log(`sortkey: ${sortKey}`);
  if (myArray.length > 0) {
    const sortFunction = {
      // sortKey can be
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
    // ermittle typeof v. key anhand des ersten arrayelementes
    // -> fn for "string" or "number"
    const compareFunction = sortFunction[typeof myArray[0][sortKey]];
    return [...myArray].sort((firstItem, secondItem) => {
      return compareFunction(firstItem[sortKey], secondItem[sortKey]);
    }); // z.B. firstItem["title"], secondItem["title"]
  } // if (myArray)
  // if myArray has no length property, give an empty array back
  return [];
}

export function getTodayUS() {
  // returns current date in YYYY-MM-DD
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  // make sure single digits are preceded by "0"
  // add a "0" then take the last 2 chars in the string
  const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
  const day = (`0${currentDate.getDate()}`).slice(-2);

  return `${year}-${month}-${day}`;
}

// creates a relative date within past or coming week
// dateText has to be in YYYY-MM-DD
export function relativeWeekday(dateText) {
  let res = dateText;
  const today = new Date(getTodayUS());
  const noteDay = new Date(dateText);
  const dayGap = (noteDay - today) / 86400000;
  // console.log(dayGap); // >0 future days, <0 past days

  if (dayGap < 7 && dayGap > -7) {
    const thisWeekday = new Date().getDay();
    const weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    switch (dayGap) {
      // past week
      case -1:
        res = "yesterday";
        break;
      case -2:
        res = `last ${weekday[(7 + (thisWeekday - 2)) % 7]}`;
        break;
      case -3:
        res = `last ${weekday[(7 + (thisWeekday - 3)) % 7]}`;
        break;
      case -4:
        res = `last ${weekday[(7 + (thisWeekday - 4)) % 7]}`;
        break;
      case -5:
        res = `last ${weekday[(7 + (thisWeekday - 5)) % 7]}`;
        break;
      case -6:
        res = `last ${weekday[(7 + (thisWeekday - 6)) % 7]}`;
        break;

      // coming week
      case 1:
        res = "tomorrow";
        break;
      case 2:
        res = `coming ${weekday[(thisWeekday + 2) % 7]}`;
        break;
      case 3:
        res = `coming ${weekday[(thisWeekday + 3) % 7]}`;
        break;
      case 4:
        res = `coming ${weekday[(thisWeekday + 4) % 7]}`;
        break;
      case 5:
        res = `coming ${weekday[(thisWeekday + 5) % 7]}`;
        break;
      case 6:
        res = `coming ${weekday[(thisWeekday + 6) % 7]}`;
        break;

      default:
        res = "today";
        break;
    }
  }

  return res;
}

export function uniqueID() {
  return Math.floor(Date.now() * Math.random());
}
