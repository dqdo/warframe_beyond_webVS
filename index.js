let openSidebarId = null; // Current sidebar opened

// Sets the SVG path color for mods sidebar
function setSvgColor(color) {
  const svg = document.getElementById("anyPolarity");
  if (svg) {
    const paths = svg.getElementsByTagName("path");
    for (let i = 0; i < paths.length; i++) {
      paths[i].setAttribute("fill", color);
    }
  }
}

// Rotates SVG, specifically for the mods toggle
function rotateSvg(shouldRotate) {
  const svg = document.getElementById("anyPolarity");
  if (svg) {
    if (shouldRotate) {
      svg.classList.add("rotatedAnyPolarity");
    } else {
      svg.classList.remove("rotatedAnyPolarity");
    }
  }
}

let arcaneTimeouts = []; // To store the timeouts for arcane animation
// Animation for when the arcanes sidebar button is toggled
function arcaneIconAnimation(start) {
  const images = [
    "assets/images/arcanes/arcane_icon_inactive.png",
    "assets/images/arcanes/arcane_icon_active1.png",
    "assets/images/arcanes/arcane_icon_active2.png",
    "assets/images/arcanes/arcane_icon_active3.png",
    "assets/images/arcanes/arcane_icon_activefull.png",
  ];

  // Clear previous timeouts to prevent multiple animations running simultaneously.
  if (!start) {
    arcaneTimeouts.forEach((timeout) => clearTimeout(timeout));
    arcaneTimeouts = [];
  }

  // Play forward if start is true, meaning sidebar is on
  if (start) {
    // Interates through image array
    images.forEach((src, index) => {
      // stores the ID of each timeout in arcaneTimeouts that is set by setTimeout
      arcaneTimeouts.push(
        // setTimeout is a JavaScript function that executes a specified function after a certain amount of time (in milliseconds).
        setTimeout(() => {
          // Changes images src
          document.getElementById("arcaneIconImage").src = src;
        }, index * 80) // In milliseconds
      );
    });
  } else {
    // Play reverse if start is false, meaning sidebar is off
    images.reverse().forEach((src, index) => {
      arcaneTimeouts.push(
        setTimeout(() => {
          document.getElementById("arcaneIconImage").src = src;
        }, index * 80)
      );
    });
  }
}

// Makes the archon shard png glow
function archonShardGlow(shouldAffectArchonShard) {
  const img = document.getElementById("archonIconImageGlow");
  if (img) {
    if (shouldAffectArchonShard) {
      img.style.opacity = "1";
    } else {
      img.style.opacity = "";
    }
  }
}

function closeAllSidebars() {
  const sidebars = document.querySelectorAll(".sidebar"); // Get all elements that are in the sidebar class
  // Closes sidebars
  sidebars.forEach((sidebar) => {
    sidebar.classList.remove("open");
  });
  setSvgColor("#FF0000"); // Set SVG color to red when closing all sidebars, specifically for mods sidebar
  rotateSvg(false); // Reset SVG rotation for mods sidebar
  if (openSidebarId === "arcanesSidebar") {
    // Prevents the reverse animation from arcaneIconAnimation
    arcaneIconAnimation(false); // Stop arcane animation only if arcanesSidebar was open
  }
  if (openSidebarId === "archonSidebar") {
    archonShardGlow(false);
  }

  moveModGrid();

  openSidebarId = null; // Null since sidebars are closed
}

function toggleSidebar(
  id,
  shouldAffectSvg,
  shouldAffectArcanes,
  shouldAffectArchonShard
) {
  const sidebar = document.getElementById(id);

  // If a different sidebar is open, close all sidebars
  if (openSidebarId && openSidebarId !== id) {
    closeAllSidebars();
  }

  // If the same sidebar is already open and the click is from a slot image, do not close it
  if (openSidebarId === id && isSlot) {
    return; // Prevent toggling (off) if the same sidebar is already open due to a slot click.
  }

  // Resets previous slot style, this is so when toggling off the sidebar buttons, the slot will be unhighlighted.
  resetSlotStyles(slotImages);

  // Toggle the sidebar open/close
  const isOpen = sidebar.classList.toggle("open");

  // Update SVG if required
  if (shouldAffectSvg) {
    setSvgColor(isOpen ? "#00FF00" : "#FF0000"); // Set SVG color to green when opening the sidebar, red when closing
    rotateSvg(isOpen); // Rotate SVG when opening the sidebar
  }

  // Update arcane animation if required
  if (shouldAffectArcanes) {
    arcaneIconAnimation(isOpen); // Start or stop the arcane animation based on the sidebar state
  }

  // Update archon glow if required
  if (shouldAffectArchonShard) {
    archonShardGlow(isOpen);
  }

  // Update the openSidebarId
  openSidebarId = isOpen ? id : null;

  // Moves mod slots to accomodate for space.
  moveModGrid();
}

// Toggle buttons for sidebars
document.getElementById("modsToggleButton").addEventListener("click", () => {
  isSlot = false; // Reset flag for sidebar button click
  modsToggle();
});

document.getElementById("arcanesToggleButton").addEventListener("click", () => {
  isSlot = false; // Reset flag for sidebar button click
  arcanesToggle();
});

document.getElementById("archonToggleButton").addEventListener("click", () => {
  isSlot = false; // Reset flag for sidebar button click
  archonShardsToggle();
});

function modsToggle() {
  toggleSidebar("modsSidebar", true, false, false);
}

function arcanesToggle() {
  toggleSidebar("arcanesSidebar", false, true, false);
}

function archonShardsToggle() {
  toggleSidebar("archonSidebar", false, false, true);
}

// Toggles the dropdown options
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  const content = dropdown.querySelector(".dropdown-content");
  const statsContent = document.querySelector(".stats-dropdown-content");

  // Essentially the toggle to the dropdown button
  if (content.classList.contains("show")) {
    content.classList.remove("show");
  } else {
    const dropdowns = document.getElementsByClassName("dropdown-content");

    // Closes all other dropdowns and shows only the selected dropdown
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove("show");
    }

    content.classList.add("show");
    statsContent.classList.remove("show");
  }
}

// Aquires the original text of the dropdown button.
document.querySelectorAll(".dropbutton").forEach((button) => {
  button.setAttribute("data-original-content", button.innerHTML);
});

// Whichever option is picked, it will appear on the button
function setDropdownOption(event, buttonId, optionText) {
  event.preventDefault();
  const button = document.getElementById(buttonId);
  const arrowImg = button.querySelector("#downArrowImg");
  const option = event.currentTarget;
  const optionImg = option.querySelector("img");
  const svg = option.querySelector("svg");
  const auraSlot = document.querySelector("#auraSlot");
  const exilusSlot = document.querySelector("#exilusSlot");
  const archonSlots = document.querySelector(".archonContainer");
  const arcaneSlots = document.querySelector("#arcaneSlotOne");
  const arcaneSlotsTwo = document.querySelector("#arcaneSlotTwo");
  const ability = document.querySelector(".abilityContainer");
  let auraImage = document.querySelector(".modSlotContainer img:nth-child(2)");

  // Clear existing button text except the arrow image
  button.innerHTML = "";

  // Create a new span element for the option text
  const textSpan = document.createElement("span");
  textSpan.innerText = optionText;

  // Styling text to match with button CSS
  const buttonStyles = window.getComputedStyle(button);
  textSpan.style.fontFamily = buttonStyles.fontFamily;
  textSpan.style.fontSize = buttonStyles.fontSize;
  textSpan.style.color = buttonStyles.color;
  textSpan.style.pointerEvents = "none";

  // Regular expression to match the button IDs from auraPolarityFilter to modNinePolarityFilter.
  const modPolarityFilterRegex =
    /^(auraPolarityFilter|exilusPolarityFilter|modTwoPolarityFilter|modThreePolarityFilter|modFourPolarityFilter|modFivePolarityFilter|modSixPolarityFilter|modSevenPolarityFilter|modEightPolarityFilter|modNinePolarityFilter)$/;

  // Append the option image if it exists.
  if (optionImg && !modPolarityFilterRegex.test(buttonId)) {
    const newImg = document.createElement("img");
    newImg.src = optionImg.src;
    newImg.style.height = "0.625rem";
    newImg.style.width = "0.625rem";
    newImg.style.marginRight = "0.188rem";
    newImg.style.pointerEvents = "none";
    button.appendChild(newImg);
  }

  // Specific if statement for the mod slots.
  // if the buttonId is equal to any of the strings in Regex then it is true.
  if (optionImg && modPolarityFilterRegex.test(buttonId)) {
    const newImg = document.createElement("img");
    newImg.src = optionImg.src;
    newImg.style.height = "0.938rem";
    newImg.style.width = "0.938rem";
    newImg.style.marginRight = "0.188rem";
    newImg.style.pointerEvents = "none";
    button.appendChild(newImg);
  }

  if (svg) {
    const newSVG = svg.cloneNode(true);
    newSVG.style.height = "0.938rem";
    newSVG.style.width = "0.938rem";
    newSVG.style.marginRight = "0.188rem";
    newSVG.style.pointerEvents = "none";
    button.appendChild(newSVG);
  }

  // Append the text span and the arrow image
  button.appendChild(textSpan);
  button.appendChild(arrowImg);

  // Adjust slots according to what is selected in Build Type
  if (optionText === "Warframe" && buttonId === "buildTypeSelect") {
    auraSlot.classList.add("show");
    exilusSlot.classList.add("show");
    arcaneSlots.classList.add("show");
    arcaneSlotsTwo.classList.add("show");
    archonSlots.classList.add("show");
    ability.classList.add("show");
    auraImage.src = "assets/images/mods/IconAura.png";
    resetOptions();
    resetSlotStyles(slotImages);
    clearSearchbar();
    closeAllSidebars();
    generateModSlots(9);
  } else if (optionText === "Melee Weapon" && buttonId === "buildTypeSelect") {
    auraSlot.classList.add("show");
    exilusSlot.classList.add("show");
    auraImage.src = "assets/images/mods/IconStance.png";
    arcaneSlots.classList.remove("show");
    arcaneSlotsTwo.classList.add("show");
    archonSlots.classList.remove("show");
    ability.classList.remove("show");
    resetOptions();
    resetSlotStyles(slotImages);
    clearSearchbar();
    closeAllSidebars();
    generateModSlots(9);
  } else if (buttonId === "buildTypeSelect") {
    exilusSlot.classList.add("show");
    auraSlot.classList.remove("show");
    arcaneSlots.classList.remove("show");
    arcaneSlotsTwo.classList.add("show");
    archonSlots.classList.remove("show");
    ability.classList.remove("show");
    resetOptions();
    resetSlotStyles(slotImages);
    clearSearchbar();
    closeAllSidebars();
    generateModSlots(9);
  }
  // Close the dropdown after an option is selected
  const dropdownContent = button.parentElement.querySelector(
    ".dropdown-content, .stats-dropdown-content"
  );
  if (dropdownContent) {
    dropdownContent.classList.remove("show");
  }
}

function clearSearchbar() {
  const searchbars = document.querySelectorAll(".searchbar");
  searchbars.forEach((searchbar) => {
    searchbar.value = "";
  });
}

// Reset any selected dropdown option.
function resetOptions() {
  document.querySelectorAll(".dropbutton").forEach((button) => {
    const originalContent = button.getAttribute("data-original-content");
    button.innerHTML = originalContent;
  });
}

// Ensures that clicking outside of a dropdown button will close any open dropdowns.
window.onclick = function (event) {
  if (!event.target.matches(".dropbutton")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

// Dropdown toggle specifically for stats panel. This is so that dropdowns from other panels don't close.
function statsToggleDropdown(id) {
  const dropdown = document.getElementById(id);
  const content = dropdown.querySelector(".stats-dropdown-content");
  const generalDropdowns = document.getElementsByClassName("dropdown-content");

  // Toggle the dropdown content visibility
  if (content.classList.contains("show")) {
    content.classList.remove("show");
  } else {
    const dropdowns = document.getElementsByClassName("stats-dropdown-content");

    // Close all other dropdowns and show only the selected dropdown
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove("show");
    }
    for (let i = 0; i < generalDropdowns.length; i++) {
      generalDropdowns[i].classList.remove("show");
    }

    content.classList.add("show");
  }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".statsDropdownButton")) {
    const dropdowns = document.getElementsByClassName("stats-dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains("show")) {
        dropdowns[i].classList.remove("show");
      }
    }
  }
};

// Opens the modal specifically for a new build.
function openNewBuildModal(modalID, buildTypeSelectedID) {
  const modal = document.getElementById(modalID);
  const overlay = document.getElementById("overlay");
  const alert = document.getElementById("buildTypeAlert");
  const buildTypeSelectButton = document.getElementById(buildTypeSelectedID);
  const selectedText = buildTypeSelectButton.textContent.trim();
  const searchBarText = document.getElementById("modalSearchbar");

  // Must select an option from the Build Type dropdown in order for the modal to show or else an alert message will show up.
  if (selectedText !== "Select") {
    overlay.classList.add("active");
    modal.classList.add("active");
    closeAllSidebars();
    searchBarText.placeholder = `Search for ${selectedText}`;
  } else {
    alert.classList.add("show");
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2000);
  }
}

// Closes modal (usually from a click of a button)
function closeModal(modalID) {
  const modal = document.getElementById(modalID);
  const overlay = document.getElementById("overlay");
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function openAbilitiesModal(event, modalID) {
  const clickedDiv = event.currentTarget; // This gets the element that triggered the event
  const spanElement = clickedDiv.querySelector("span"); // Get the span inside the clicked div
  const abilityNumText = document.getElementById("abilityNum");

  abilityNumText.innerText = spanElement.innerText;

  const modal = document.getElementById(modalID);
  const overlay = document.getElementById("overlay");

  closeAllSidebars();

  overlay.classList.add("active");
  modal.classList.add("active");
}

// Get all ability divs and corresponding descriptions
const abilities = document.querySelectorAll(".ability");
const abilityDescriptions = document.querySelectorAll(".abilityDescription");

// Loop through each ability div
abilities.forEach((ability, index) => {
  // Add event listener for mouseenter
  ability.addEventListener("mouseenter", () => {
    // Show the corresponding ability description
    const description = abilityDescriptions[index];
    description.style.display = "block";

    // Adjust the position of the description relative to the ability
    const rect = ability.getBoundingClientRect(); // Gets the size and position of the .ability  relative to the viewport
    description.style.top = `${rect.bottom}px`;
    description.style.left = `${rect.right - 45}px`;
  });

  // Add event listener for mouseleave (when mouse leaves div)
  ability.addEventListener("mouseleave", () => {
    // Hide all ability descriptions on mouse leave
    abilityDescriptions.forEach((desc) => {
      desc.style.display = "none";
    });
  });
});

// Increments item rank
function incrementValue() {
  const input = document.getElementById("numberInput");
  let value = parseInt(input.value, 10);
  const max = input.max;

  if (isNaN(value)) {
    value = 0; // Default to 0 if value is NaN
  }

  // Increment the value
  value += 1;

  // Ensure the value stays within the range
  if (value > max) {
    value = max;
  }

  // Update the input value and spans
  input.value = value;

  updateSpanNumber(
    "maxCapacity",
    input.classList.contains("orokinActive") ? value * 2 : value
  );
  // If the orokin reactor is active, then the current value of the input (the number inside the item rank) is doubled.
  updateSpanNumber(
    "currentCapacity",
    input.classList.contains("orokinActive") ? value * 2 : value
  );
}

function decrementValue() {
  const input = document.getElementById("numberInput");
  let value = parseInt(input.value, 10);
  const min = input.min;

  if (isNaN(value)) {
    value = 0; // Default to 0 if value is NaN
  }

  // Decrement the value
  value -= 1;

  // Ensure the value stays within the range
  if (value < min) {
    value = min;
  }

  // Update the input value and spans
  input.value = value;
  updateSpanNumber(
    "maxCapacity",
    input.classList.contains("orokinActive") ? value * 2 : value
  );

  // If the orokin reactor is active, then the current value of the input (the number inside the item rank) is doubled.
  updateSpanNumber(
    "currentCapacity",
    input.classList.contains("orokinActive") ? value * 2 : value
  );
}

// When the user manually types in the input (item rank), this checks if the values are within the min and max range.
function validateInput() {
  const input = document.getElementById("numberInput");
  let value = parseInt(input.value, 10);
  const max = input.max;
  const min = input.min;

  // Over the max = max
  if (value > max) {
    value = max;
    // Lower than the min = min
  } else if (value < min) {
    value = min;
  } else if (isNaN(value)) {
    value = 0; // Default to 0 if value is NaN
  }
  input.value = value;
  updateSpanNumber(
    "maxCapacity",
    input.classList.contains("orokinActive") ? value * 2 : value
  );
  updateSpanNumber(
    "currentCapacity",
    input.classList.contains("orokinActive") ? value * 2 : value
  );
}

// Converts a span to a number
function spanToNum(span) {
  const spanElement = document.getElementById(span);
  const spanText = spanElement.textContent;
  return Number(spanText);
}

// Updates that span with a number (usually from the spanToNum function)
function updateSpanNumber(span, newNumber) {
  const spanElement = document.getElementById(span);
  spanElement.textContent = newNumber;
}

function checkAndUpdateReactor() {
  const orokinReactorToggle = document.querySelector(".orokinReactorToggle");
  const input = document.getElementById("numberInput");

  if (orokinReactorToggle.classList.contains("active")) {
    input.classList.add("orokinActive");
  } else {
    input.classList.remove("orokinActive");
  }

  // Ensure the current value is within the new min and max range
  validateInput();
}

// Toggles the orokin reactor
document
  .querySelector(".orokinReactorToggle")
  .addEventListener("click", function () {
    this.classList.toggle("active");
    checkAndUpdateReactor();
  });

// When there is a change, checks if the orokin reactor is active
document.addEventListener("DOMContentLoaded", checkAndUpdateReactor);

// Toggles the Apply Conditonals
document
  .querySelector(".conditionalToggle")
  .addEventListener("click", function () {
    this.classList.toggle("active");
  });

// Move elements if a sidebar is open for visability
function moveModGrid() {
  const modGrid = document.querySelector(".modGridContainer");
  const sidebars = document.querySelectorAll(".sidebar.open");
  const arcanes = document.querySelector(".arcanesContainer");
  const archons = document.querySelector(".archonContainer");

  // No sidebars open
  if (sidebars.length === 0) {
    modGrid.classList.remove("active");
    arcanes.classList.remove("active");
    archons.classList.remove("active");
  }
  // A sidebar open
  else {
    modGrid.classList.add("active");
    arcanes.classList.add("active");
    archons.classList.add("active");
  }
}

// previousSlot keeps track of the previous slot that was clicked.
let previousSlot = null;

const modSlot = document.querySelectorAll(".modSlotContainer img:nth-child(1)");
const arcaneSlot = document.querySelectorAll(".arcaneSlot img");
const archonSlot = document.querySelectorAll(".archonSlot img");
const slotImages = [...modSlot, ...arcaneSlot, ...archonSlot];
const modsSidebar = document.querySelector("#modsSidebar");
const arcanesSidebar = document.querySelector("#arcanesSidebar");
const archonSidebar = document.querySelector("#archonSidebar");

// isSlot tracks if a slot is clicked.
let isSlot = false;

// Sets up build slot event listeners
function setupSlotListeners() {
  const modSlot = document.querySelectorAll(
    ".modSlotContainer img:nth-child(1)"
  );
  const arcaneSlot = document.querySelectorAll(".arcaneSlot img");
  const archonSlot = document.querySelectorAll(".archonSlot img");
  const slotImages = [...modSlot, ...arcaneSlot, ...archonSlot];

  // Add new listeners to all slot images
  slotImages.forEach((slotImage) => {
    slotImage.addEventListener("click", handleSlotClick);
  });
}

// If a build slot is clicked, then it will be highlighted. Only one slot can be highlighted at a time.
function handleSlotClick() {
  // Mark that a slot is clicked
  isSlot = true;

  // Get the updated slot images
  const modSlot = document.querySelectorAll(
    ".modSlotContainer img:nth-child(1)"
  );
  const arcaneSlot = document.querySelectorAll(".arcaneSlot img");
  const archonSlot = document.querySelectorAll(".archonSlot img");
  const slotImages = [...modSlot, ...arcaneSlot, ...archonSlot];

  // Reset style for previously selected slot
  resetSlotStyles(slotImages);

  // Apply the correct style to the currently clicked element
  if (Array.from(modSlot).includes(this)) {
    this.style.filter = "brightness(0) invert(1)";
    if (openSidebarId !== "modsSidebar") {
      modsToggle();
    }
  } else if (Array.from(arcaneSlot).includes(this)) {
    this.style.opacity = "70%";
    if (openSidebarId !== "arcanesSidebar") {
      arcanesToggle();
    }
  } else if (Array.from(archonSlot).includes(this)) {
    this.style.opacity = "90%";
    if (openSidebarId !== "archonSidebar") {
      archonShardsToggle();
    }
  }

  // Update the previousSlot
  previousSlot = this;
}

// Unhighlights slots
function resetSlotStyles(slotImages) {
  // Reset the style for the previously highlighted slot
  if (previousSlot) {
    if (
      Array.from(
        document.querySelectorAll(".modSlotContainer img:nth-child(1)")
      ).includes(previousSlot)
    ) {
      previousSlot.style.filter = "";
    } else if (
      Array.from(document.querySelectorAll(".arcaneSlot img")).includes(
        previousSlot
      )
    ) {
      previousSlot.style.opacity = "";
    } else if (
      Array.from(document.querySelectorAll(".archonSlot img")).includes(
        previousSlot
      )
    ) {
      previousSlot.style.opacity = "";
    }
  }
}

setupSlotListeners();

// HTML for a basic mod slot
function createModSlot(id) {
  return `
    <div class="modSlots">
      <div class="modPolaritySelector">
        <div class="dropdown" id="${id}Polarity">
          <button onclick="toggleDropdown('${id}Polarity')" class="dropbutton" id="${id}PolarityFilter">
            <span>--- </span>
            <img id="downArrowImg" src="assets/images/misc/down-arrow-svgrepo-com.svg" />
          </button>
          <div class="dropdown-content">
            <a id="topOption" href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '--- ')">
              <span>---</span>
            </a>
            <a href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/madurai_symbol.png" />
            </a>
            <a href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/vazarin_symbol.png" />
            </a>
            <a href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/naramon_symbol.png" />
            </a>
            <a href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/zenurik_symbol.png" />
            </a>
            <a href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/penjaga_symbol.png" />
            </a>
            <a href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/unairu_symbol.png" />
            </a>
            <a id="bottomOption" href="#" onclick="setDropdownOption(event, '${id}PolarityFilter', '')">
              <img src="assets/images/mods/polarities/umbra_symbol.png" />
            </a>
          </div>
        </div>
      </div>
      <div class="modSlotContainer">
        <img src="assets/images/mods/mod_slot.png" onclick="modsToggle()">
      </div>
    </div>
  `;
}

// Generates mod slots (9 mod slots specifically)
function generateModSlots(numberOfSlots) {
  const container = document.querySelector(".modGridContainer");

  const nums = [
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];

  if (container) {
    container.innerHTML = ""; // Clear any existing content

    // Loop to create each HTML mod slot
    for (let i = 2; i <= numberOfSlots; i++) {
      container.innerHTML += createModSlot(`mod${nums[i]}`);
    }
  }

  // Update Event Build Slot Listeners
  setupSlotListeners();
}
