
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

    document.getElementById("demo").textContent = JSON.stringify(formdata, null, 2);
}