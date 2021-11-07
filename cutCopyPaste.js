let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let ctrlKey;
document.addEventListener("keydown", (e) => {  //wherever any key presses
    ctrlKey = e.ctrlKey;   //returns true or false
   //  console.log(ctrlKey);
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
   //  console.log(ctrlKey);

})

for (let i =0;i < rows;i++) {
    for (let j = 0;j < cols;j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}


let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {   // Select cells range karna h

        if (!ctrlKey) {  //agar ctrl pressed h tabhi chalna h
           return;
        }
        if (rangeStorage.length >= 2) {
         defaultSelectedCellsUI();
         rangeStorage = [];
        }

        // UI
        cell.style.outline = "dashed 1px solid black";
        cell.style.outlineStyle= "dashed";
        console.log(cell.style);

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        console.log(rangeStorage);
    })
}

function defaultSelectedCellsUI() {      //sirf 2 cell select hoye
    for (let i = 0;i < rangeStorage.length;i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.outline = "0px";  //pichle 2 selected cell ko ui par normal kardia
    }
}

let cell = document.querySelectorAll(".grid .cell");
for (let i = 0;i < allCells.length;i++) {
    addListenerToAttachCellProperties(allCells[i]);
}


function addListenerToAttachCellProperties(cell) {

    cell.addEventListener("click", (e) => {
        let address = addressInput.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];
        console.log(cellProp);

        cell.innerText = cellProp.value;
        console.log(cell);
        cell.style.fontWeight=cellProp.bold;
        cell.style.fontStyle = cellProp.italic; 
        cell.style.textDecoration = cellProp.underline;
        cell.style.fontSize = cellProp.fontSize;
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.color;
        cell.style.backgroundColor = cellProp.bColor 
        cell.style.textAlign = cellProp.halign;
    })
}

let copyData = [];   //copied data store karne ke liye
copyBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2){
       return;
    } 
    copyData = [];

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        let copyRow = [];
        for (let j = stcol;j <= endcol;j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
      }
      // console.log(copyData);
      console.log("*********************",copyData);
    defaultSelectedCellsUI();
})

function decodeRIDCIDFromAddress(address) {
   // address -> "A1"
   let rid = Number(address.slice(1) - 1); // "1" -> 0
   let cid = Number(address.charCodeAt(0)) - 65; // "A" -> 65
   return [rid, cid];
}
pasteBtn.addEventListener("click" ,(e) => {    // Past cells data work

    if (rangeStorage.length < 2) {
       return;
    }

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    let address = addressInput.value; // Target cell ka address
    console.log(address);
    let [stRow, stCol] = decodeRIDCIDFromAddress(address);

console.log(stRow,stCol);
    // r -> refers copydata ke  row ko
    // c -> refers copydata col
    for (let i = stRow,r = 0;i <= stRow+rowDiff;i++,r++) {
       for (let j = stCol,c = 0;j <= stCol+colDiff;j++,c++) {
        //    console.log("dvcdsv");
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            console.log(cell);
            if (!cell) {   //agar cjab cell paste kar rhe ho and voh boundary se bahar ho toh uss cell ko ignore kardo
               continue;
            }

            // DB
            let data = copyData[r][c];
            console.log(data);
            let cellProp = sheetDB[i][j];
            console.log(cellProp);

            cellProp.value = data.value;
            console.log(cellProp.value);
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.color = data.color;
            cellProp.bColor = data.bColor;
            cellProp.halign = data.halign;
            console.log("##################",cellProp.backgroundColor,data.bColor)
            // UI
            cell.click();
        }
    }
})


cutBtn.addEventListener("click", (e) => {
    // console.log("inside ------------------------------------------------------------------");
    if (rangeStorage.length < 2){
        return;
    } 

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        for (let j = stcol;j <= endcol;j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            // DB
            let cellProp = sheetDB[i][j];
            console.log(cellProp);
            cellProp.value = "";
            cellProp.bold = "normal";
            cellProp.italic = "normal";
            cellProp.underline = "none";
            cellProp.fontSize = "16";
            cellProp.fontFamily = "sans-serif";
            cellProp.color = "black";
            cellProp.bColor = "none";
            cellProp.halign = "center";
            

            // UI
            cell.click();
            cell.style=""
        }
    }

    defaultSelectedCellsUI();
})

