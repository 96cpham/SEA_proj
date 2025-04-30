/**
 * Data Catalog Project Starter Code - SEA Stage 2
 */

let allData = []; // Stores all data globally for filtering

const file = fetch('dpr_park_facility_site_2020.csv')
  .then((response) => response.text())
  .then((data) => {
    const formedArr = csvToArr(data); // Parse CSV into an array of objects
    allData = formedArr; // Save the full dataset globally
    showCards(formedArr); // populates all the cards initially
  })
  .catch((error) => console.error('Error fetching the CSV file: ', error));

////////////////////////////////////////////////////////////////////////////
//functions creats array of objects, ones object per row in CSV file
function csvToArr(stringValue) {
  const rows = stringValue
    .trim()
    .split('\n')
    .map((row) => row.split(','));

  const headers = rows.shift();
  console.log("Headers: ", headers); 

  const uniqueFacilities = new Set(); // filters out items that have same FacilityID
  const formedArr = rows
    .map((row) => {
      const object = {};
      headers.forEach((key, index) => (object[key] = row[index]));
      return object;
    })
    .filter((item) => {
      if (uniqueFacilities.has(item.FacilityID)) {
        return false; // Skip duplicates
      }
      uniqueFacilities.add(item.FacilityID);
      return true; // Keep unique entries
    });

  console.log("Data parsed: ", formedArr); 
  return formedArr;
}
////////////////////////////////////////////////////////////////////////////
//function adds cards the page to display the data in the array
function showCards(data) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear existing cards
  const templateCard = document.querySelector(".card");

  // Group data by ParkName
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.ParkName]) {
      acc[item.ParkName] = [];
    }
    acc[item.ParkName].push(item);
    return acc;
  }, {});

  // Create cards for each park
  Object.keys(groupedData).forEach((parkName) => {
    const parentCard = templateCard.cloneNode(true); // Clones the template card
    parentCard.style.display = "block";
    parentCard.querySelector("h3").textContent = parkName; 

    const zipCode = groupedData[parkName][0].ZipCode; // Use the ZipCode of the first facility
    parentCard.querySelector("h5").textContent = `Zip Code: ${zipCode}`;

    const facilityList = parentCard.querySelector("ul");
    facilityList.innerHTML = ""; // Clear existing list items

    // Create subcards for each facility
    groupedData[parkName].forEach((facility) => {
      const facilityItem = document.createElement("li");
      facilityItem.innerHTML = `${facility.FacilityName}<br>Facility ID: ${facility.FacilityID}`;
      facilityList.appendChild(facilityItem);
    });

    // Add "See More" button only if there are more than 3 bullet points
    const listItems = facilityList.querySelectorAll("li");
    if (listItems.length > 3) {
      const seeMoreButton = document.createElement("button");
      seeMoreButton.className = "see-more-btn";
      seeMoreButton.textContent = "See More";
      seeMoreButton.onclick = () => toggleSeeMore(seeMoreButton);
      parentCard.querySelector(".card-content").appendChild(seeMoreButton);
    }

    cardContainer.appendChild(parentCard); 
  });
}

////////////////////////////////////////////////////////////////////////////
function toggleSeeMore(button) {
  const card = button.closest(".card");
  const listItems = card.querySelectorAll("ul li");
  const isExpanded = button.textContent === "See Less";

  listItems.forEach((item, index) => {
    if (index >= 3) {
      item.style.display = isExpanded ? "none" : "list-item";
    }
  });

  button.textContent = isExpanded ? "See More" : "See Less";
}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);
///////////////////////////////////////////////////////////////////////////
/*   TECHNICAL INTERVIEW PORTION
function filterOut(){
  const filteredArr = new arr[];
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  for i = 0; i > formedArr.size; i++ in formedArr {
    if (searchTerm != zipcode){
      filteredArr[i] = formedArr

      }
  }
   // Retrieve the text from the filterInput search bar 
   const filterText = document.getElementById('filterInput').value.toLowerCase()
   // rest of your function below: 
   
}
//check input
//create new array
//check all object zipcodes if there is any overlap
//any objects that do not match the input will be put into the new array
//items that are kept will be put into a new array and sent to showCads function
*/

////////////////////////////////////////////////////////////////////////////
function filterCards() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  console.log("Search Term:", searchTerm); 

  // If the search bar is empty, show all data
  if (searchTerm.trim() === "") {
    console.log("Showing all data"); 
    showCards(allData); // Re-render all cards
    return;
  }

  // Filter the data based on the zip code or park name
  const filteredData = allData.filter(
    (item) =>
      item.ParkName.toLowerCase().includes(searchTerm) || 
      item.ZipCode.includes(searchTerm) 
  );

  console.log("Filtered Data:", filteredData); 
  showCards(filteredData); // Re-render cards with filtered data
}
