let newFile = document.querySelector(".new");
let openFile = document.querySelector(".open");
let openModal = document.querySelector(".download");
let overlay = document.querySelector(".overlay");
let saveBtn = document.querySelector(".save_file");
let cancelBtn = document.querySelector(".cancel_file");
let modal = document.querySelector(".modal");
let title = document.querySelector("modal>input");

openModal.addEventListener("click", function () {
  let file_input = document.querySelector(".input");

  modal.classList.remove("modal_remove");
  overlay.style.display = "block";
  // Download file
  file_input.addEventListener('change', (e) => {
		title = e.target.value;
    console.log(title);
	});

  cancelBtn.addEventListener("click", function () {
    modal.classList.add("modal_remove");
    overlay.style.display = "none";
  });
});
saveBtn.addEventListener("click", function () {
  console.log(title);

  let totalSheets = document.querySelectorAll(".sheet");
  let activeSheet;
  for (let i = 0; i < totalSheets.length; i++) {
    // Make newly added sheet tab active
    if (totalSheets[i].classList.contains("active")) {
      activeSheet = i + 1;
      break;
    }
  }
  let jsonData = JSON.stringify(sheetDB);
  let file = new Blob([jsonData], { type: "application/json" }); // Convert to file like object
  let fileURL = URL.createObjectURL(file); // Convert to URL for anchor href

  let a = document.createElement("a");
  a.href = fileURL;
  console.log("1 time download");
  a.download = `${title}.json`; // Download attribute with filename
  a.click();
  modal.classList.add("modal_remove");
  overlay.style.display = "none";
});


openFile.addEventListener("click", function () {
  // Open file
  let inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.click();

  inputFile.addEventListener("change", function () {
    let fr = new FileReader(); // Let's read file content asynchronously

    let allFiles = inputFile.files; // List of all files
    let fileObj = allFiles[0]; // First file of list

    fr.readAsText(fileObj); // Reads file content
    fr.addEventListener("load", function () {
      // Once loaded the content is put in the result attribute
      sheetDB = JSON.parse(fr.result);
      console.log(sheetDB);

      for (let i = 0; i < rows; i++) {
        // Set individual properties for each cell of a single sheet
        for (let j = 0; j < cols; j++) {
          let elem = document.querySelector(
            `.grid .cell[rid='${i}'][cid='${j}']`
          );
          let value = sheetDB[i][j].value;
          elem.innerText = value;
        }
      }
    });
  });
});

newFile.addEventListener("click", function () {   // New file
  location.reload();
});