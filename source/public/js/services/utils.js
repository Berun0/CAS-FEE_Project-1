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
