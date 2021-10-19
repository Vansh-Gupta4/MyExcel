let newFile = document.querySelector(".new");
let openFile = document.querySelector(".open");
let saveFile = document.querySelector(".download");

saveFile.addEventListener("click", function () {
  // Download file
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
  a.download = `Sheet${activeSheet}.json`; // Download attribute with filename
  a.click();
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

newFile.addEventListener("click", function () {
  // New file
  let NewDB = [];   //it is 2D array
  for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
          let cell = {    //starting mai initial properties daal diye obj mai
              bold: "normal",
              italic: "normal",
              underline: "none",
              hAlign: "center",
              fontFamily: "sans-serif",
              fontSize: "16",
              color: "black",
              bColor: "none",
              value:"",
              formula:"",
              children:[]
          }
          let elem = document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
          elem.innerText = ""; //UI clear kardia kyuki nayi sheet banai h
          row.push(cell);
      }
      NewDB.push(row);
  }
  sheetArray.push(NewDB);//3d array bann gya
});