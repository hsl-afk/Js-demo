
const statesbycountry = {
    India: ["Gujarat", "Maharashtra"],
    USA: ["California", "Texas"]
};

const citiesbystates = {
    Gujarat: ["Surat", "Ahmedabad", "Navsari"],
    Maharashtra: ["Mumbai", "Pune"],
    California: ["Los Angeles", "San Francisco"],
    Texas: ["Houston", "Dallas"]
};

function updatestates(){
    const selectedcountry = document.getElementById("countries");
    const selectedstate = document.getElementById("states");
    const countryselected = selectedcountry.value;

    selectedstate.innerHTML = '<option value="">Select</option>';

    if(countryselected && statesbycountry[countryselected]){
        statesbycountry[countryselected].forEach(state => {
            const option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            selectedstate.appendChild(option);
    })
}
}

function updatecities(){
    const selectedState = document.getElementById("states");
    const cityselected = document.getElementById("cities");
    const stateselected = selectedState.value;

    cityselected.innerHTML = '<option value="">Select</option>';

     if(stateselected && citiesbystates[stateselected]){
        citiesbystates[stateselected].forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            cityselected.appendChild(option);
        })
     }
}
function storedata(){
    const formdata = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        gender: document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : "",
        hobbies: Array.from(document.querySelectorAll('input[name="hobby"]:checked')).map(checkbox => checkbox.value),
        country: document.getElementById("countries").value,
        state: document.getElementById("states").value,
        city: document.getElementById("cities").value
    };
    
    document.getElementById("demo").textContent = JSON.stringify(formdata);
    return formdata
}

function loadData() {
  const dtable = document.getElementById('dtable');
  const formdata = storedata();

  dtable.innerHTML = '';

  const headerRow = dtable.insertRow(0);
  const headerCell1 = headerRow.insertCell(0);
  const headerCell2 = headerRow.insertCell(1);
  headerCell1.textContent = 'Field';
  headerCell2.textContent = 'Value';

  const rows = [
    ['Name', formdata.name],
    ['Email', formdata.email],
    ['Gender', formdata.gender],
    ['Hobbies', formdata.hobbies.join(', ')],
    ['Country', formdata.country],
    ['State', formdata.state],
    ['City', formdata.city]
  ];

  rows.forEach(([label, value]) => {
    const row = dtable.insertRow();
    const cell0 = row.insertCell(0);
    const cell1 = row.insertCell(1);
    cell0.textContent = label;
    cell1.textContent = value || '—';
  });
}