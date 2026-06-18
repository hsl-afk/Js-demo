const statesbycountry = {
  India: ["Gujarat", "Maharashtra"],
  USA: ["California", "Texas"],
};

let persons = [];
let editingId = null;

const citiesbystates = {
  Gujarat: ["Surat", "Ahmedabad", "Navsari"],
  Maharashtra: ["Mumbai", "Pune"],
  California: ["Los Angeles", "San Francisco"],
  Texas: ["Houston", "Dallas"],
};

function updatestates() {
  const selectedcountry = document.getElementById("countries");
  const selectedstate = document.getElementById("states");
  const countryselected = selectedcountry.value;

  selectedstate.innerHTML = '<option value="">Select</option>';

  if (countryselected && statesbycountry[countryselected]) {
    statesbycountry[countryselected].forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      selectedstate.appendChild(option);
    });
  }
  updatecities();
}

function updatecities() {
  const selectedState = document.getElementById("states");
  const cityselected = document.getElementById("cities");
  const stateselected = selectedState.value;
  cityselected.innerHTML = '<option value="">Select</option>';
  if (stateselected && citiesbystates[stateselected]) {
    citiesbystates[stateselected].forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      cityselected.appendChild(option);
    });
  }
}
function getPersons() {
  return persons;
}

function savePersons(nextPersons) {
  persons = nextPersons;
}

function storedata() {
  const formdata = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    gender: document.querySelector('input[name="gender"]:checked')
      ? document.querySelector('input[name="gender"]:checked').value
      : "",
    hobbies: Array.from(
      document.querySelectorAll('input[name="hobby"]:checked'),
    ).map((checkbox) => checkbox.value),
    country: document.getElementById("countries").value,
    state: document.getElementById("states").value,
    city: document.getElementById("cities").value,
  };

  formdata.timestamp = new Date().toLocaleString();

  document.getElementById("reqname").textContent = "";
  document.getElementById("reqemail").textContent = "";
  document.getElementById("reqgender").textContent = "";
  document.getElementById("reqcountry").textContent = "";
  document.getElementById("reqstate").textContent = "";
  document.getElementById("reqcity").textContent = "";

  if (!formdata.name) {
    document.getElementById("reqname").textContent = "*required";
    return;
  }
  if (!formdata.email) {
    document.getElementById("reqemail").textContent = "*required";
    return;
  }
  if (!formdata.gender) {
    document.getElementById("reqgender").textContent = "*required";
    return;
  }
  if (formdata.country == "Select") {
    document.getElementById("reqcountry").textContent = "*required";
    return;
  }
  if (!formdata.state) {
    document.getElementById("reqstate").textContent = "*required";
    return;
  }
  if (!formdata.city) {
    document.getElementById("reqcity").textContent = "*required";
    return;
  }

  return formdata;
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.querySelectorAll('input[name="gender"]').forEach((item) => {
    item.checked = false;
  });
  document.querySelectorAll('input[name="hobby"]').forEach((item) => {
    item.checked = false;
  });
  document.getElementById("countries").value = "Select";
  document.getElementById("states").innerHTML =
    '<option value="">Select</option>';
  document.getElementById("cities").innerHTML =
    '<option value="">Select</option>';
  editingId = null;
  document.getElementById("saveBtn").textContent = "Save";
}

function renderTable(personList = getPersons()) {
  const dtable = document.getElementById("dtable");

  if (!dtable) {
    return;
  }

  const currentPersons = Array.isArray(personList) ? personList : getPersons();

  dtable.innerHTML = "";

  const headerRow = dtable.insertRow(0);
  [
    "Name",
    "Email",
    "Gender",
    "Hobbies",
    "Country",
    "State",
    "City",
    "Created",
    "Edit",
    "Delete",
  ].forEach((label, index) => {
    const headerCell = headerRow.insertCell(index);
    headerCell.textContent = label;
  });

  currentPersons.forEach((person) => {
    const row = dtable.insertRow(dtable.rows.length);
    const values = [
      person.name || "--",
      person.email || "--",
      person.gender || "--",
      Array.isArray(person.hobbies) ? person.hobbies.join(", ") : "--",
      person.country || "--",
      person.state || "--",
      person.city || "--",
      person.timestamp || "--",
      "",
      "",
    ];

    values.forEach((value, index) => {
      const cell = row.insertCell(index);
      if (index >= 8) {
        cell.innerHTML = `<button type="button" id="editBtn" onclick="editPerson(${person.id})">Edit</button>`;

        if (index === 9) {
          cell.innerHTML = `<button type="button" id="deleteBtn" onclick="deletePerson(${person.id})">Delete</button>`;
        }
      } else {
        cell.textContent = value;
      }
    });
  });
}

function savePerson() {
  const formdata = storedata();
  if (!formdata) {
    return false;
  }

  const currentPersons = getPersons();

  if (editingId) {
    const index = currentPersons.findIndex((person) => person.id === editingId);
    if (index !== -1) {
      currentPersons[index] = {
        ...currentPersons[index],
        ...formdata,
        id: editingId,
      };
    }
  } else {
    currentPersons.push({ ...formdata, id: Date.now() });
  }

  savePersons(currentPersons);
  renderTable();
  resetForm();
}

function editPerson(id) {
  const person = getPersons().find((item) => item.id === id);
  if (!person) {
    return;
  }

  document.getElementById("name").value = person.name || "";
  document.getElementById("email").value = person.email || "";
  document.getElementById("countries").value = person.country || "";
  updatestates();
  document.getElementById("states").value = person.state || "";
  updatecities();
  document.getElementById("cities").value = person.city || "";

  document.querySelectorAll('input[name="gender"]').forEach((item) => {
    item.checked = item.value === person.gender;
  });
  document.querySelectorAll('input[name="hobby"]').forEach((item) => {
    item.checked =
      Array.isArray(person.hobbies) && person.hobbies.includes(item.value);
  });
  editingId = id;
  document.getElementById("saveBtn").textContent = "Update";
}

function deletePerson(id) {
  if (!window.confirm("Delete this record?")) {
    return;
  }

  const updatedPersons = getPersons().filter((person) => person.id !== id);
  savePersons(updatedPersons);
  renderTable();
  renderSearchResults();
  renderSortResults();
  if (editingId === id) {
    resetForm();
  }
  document.getElementById("searchbox").value = "";
}

// function renderSearchResults(personList = []) {
//   const searchResult = document.getElementById("searchResult");
//   if (!searchResult) {
//     return;
//   }

//   searchResult.innerHTML = "";
//   if (!personList.length) {
//     return;
//   }

//   const table = document.createElement("table");
//   table.className = "records-table search-results-table";
//   table.border = "1";
//   table.cellPadding = "8";

//   const headerRow = table.insertRow();
//   [
//     "Name",
//     "Email",
//     "Gender",
//     "Hobbies",
//     "Country",
//     "State",
//     "City",
//     "Created",
//   ].forEach((label) => {
//     const th = document.createElement("th");
//     th.textContent = label;
//     headerRow.appendChild(th);
//   });

//   personList.forEach((person) => {
//     const row = table.insertRow();
//     const values = [
//       person.name || "--",
//       person.email || "--",
//       person.gender || "--",
//       Array.isArray(person.hobbies) ? person.hobbies.join(", ") : "--",
//       person.country || "--",
//       person.state || "--",
//       person.city || "--",
//       person.timestamp || "--",
//     ];

//     values.forEach((value) => {
//       const cell = row.insertCell();
//       cell.textContent = value;
//     });
//   });

//   searchResult.appendChild(table);
// }

// function renderSortResults(personList = []) {
//   const sortResult = document.getElementById("sortResult");
//   if (!sortResult) {
//     return;
//   }

//   sortResult.innerHTML = "";
//   if (!personList.length) {
//     return;
//   }

//   const table = document.createElement("table");
//   table.className = "records-table sort-results-table";
//   table.border = "1";
//   table.cellPadding = "8";

//   const headerRow = table.insertRow();
//   [
//     "Name",
//     "Email",
//     "Gender",
//     "Hobbies",
//     "Country",
//     "State",
//     "City",
//     "Created",
//   ].forEach((label) => {
//     const th = document.createElement("th");
//     th.textContent = label;
//     headerRow.appendChild(th);
//   });

//   personList.forEach((person) => {
//     const row = table.insertRow();
//     const values = [
//       person.name || "--",
//       person.email || "--",
//       person.gender || "--",
//       Array.isArray(person.hobbies) ? person.hobbies.join(", ") : "--",
//       person.country || "--",
//       person.state || "--",
//       person.city || "--",
//       person.timestamp || "--",
//     ];

//     values.forEach((value) => {
//       const cell = row.insertCell();
//       cell.textContent = value;
//     });
//   });

//   sortResult.appendChild(table);
// }

(function initLiveSearch() {
  const sb = document.getElementById("searchbox");
  if (!sb) return;
  sb.addEventListener("input", search);
  sb.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      sb.value = "";
      search();
    }
  });
})();

function search() {
  const searchTerm = document
    .getElementById("searchbox")
    .value.trim()
    .toLowerCase();
  const records = Array.isArray(getPersons()) ? getPersons() : [];
  const searchResult = document.getElementById("searchResult");

  if (!searchTerm) {
    renderTable(records);
    if (searchResult) {
      searchResult.innerHTML = "<p>search by Anything</p>";
    }
    return;
  }

  const filteredRecords = records.filter((item) => {
    const stack = [
      item.name,
      item.email,
      item.gender,
      item.country,
      item.state,
      item.city,
      Array.isArray(item.hobbies) ? item.hobbies.join(" ") : "",
    ]
      .join(" ")
      .toLowerCase();

    return stack.includes(searchTerm);
  });

  renderTable(records);

  if (!filteredRecords.length) {
    if (searchResult) {
      searchResult.innerHTML = `<p>No results for "${searchTerm}".</p>`;
    }
    return;
  }

  if (searchResult) {
    searchResult.innerHTML = `<p>Showing ${filteredRecords.length} match${
      filteredRecords.length === 1 ? "" : "es"
    } for "${searchTerm}".</p>`;
    renderTable(filteredRecords);
  }
}

function objsorting() {
  const records = Array.isArray(getPersons()) ? [...getPersons()] : [];
  const sortOrder =
    document.querySelector('input[name="sortOrder"]:checked')?.value ||
    "Ascending";

  const sortedRecords = [...records].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  if (sortOrder === "descending") {
    sortedRecords.reverse();
  }

  const sortResult = document.getElementById("sortResult");
  if (!sortedRecords.length) {
    if (sortResult) {
      sortResult.innerHTML = "<p>No records to sort yet.</p>";
    }
    return;
  }

  if (sortResult) {
    sortResult.innerHTML = `<p>Sorted ${sortOrder.toLowerCase()} by name.</p>`;
    renderTable(sortedRecords);
  }
}

function loadData() {
  renderTable();
} 
loadData();

function clearbox() {
  document.getElementById("searchbox").value = "";
  renderTable();
}
