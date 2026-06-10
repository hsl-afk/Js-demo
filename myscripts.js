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

  if (
    !formdata.name ||
    !formdata.email ||
    !formdata.gender ||
    !formdata.country ||
    !formdata.state ||
    !formdata.city
  ) {
    alert("Please fill all required fields before saving.");
    return false;
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
  document.getElementById("countries").value = "";
  document.getElementById("states").innerHTML =
    '<option value="">Select</option>';
  document.getElementById("cities").innerHTML =
    '<option value="">Select</option>';
  editingId = null;
  document.getElementById("saveBtn").textContent = "Save";
}

function renderTable() {
  const dtable = document.getElementById("dtable");

  if (!dtable) {
    return;
  }

  const currentPersons = getPersons();

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
    "Actions",
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
    ];

    values.forEach((value, index) => {
      const cell = row.insertCell(index);
      if (index === 8) {
        cell.innerHTML = `
          <button type="button" onclick="editPerson(${person.id})">Edit</button>
          <button type="button" onclick="deletePerson(${person.id})">Delete</button>
        `;  
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
      currentPersons[index] = { ...currentPersons[index], ...formdata, id: editingId };
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
  if (editingId === id) {
    resetForm();
  }e
}

function loadData() {
  renderTable();
}

loadData();