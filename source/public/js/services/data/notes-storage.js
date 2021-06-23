// returns the data fetched by a GET request to the /notes route
export async function getNotes() {
  const response = await fetch("/notes");
  const data = await response.json();
  console.log("response v. getNotes");
  console.log(data);
  return data;
}

// returns the answer from a save 'notes' by a POST request to the /notes route
export async function saveNotes(notes) {
  const options = {
    method: "POST",
    body: JSON.stringify(notes),
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch("/notes", options);
  const data = await response.json();
  console.log("response v. saveNotes");
  console.log(data);
  return data;
}
