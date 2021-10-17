//To make grid
let leftCol = document.querySelector(".left_col");
let topRow = document.querySelector(".top_row");
let grid = document.querySelector(".grid");
let addressInput = document.querySelector(".address-input"); // it gives current clicked cell address
let boldBtn = document.querySelector(".bold");
let underlineBtn = document.querySelector(".underline");
let italicBtn = document.querySelector(".italic");

let rows = 100;
let cols = 26;

for (let i = 0; i < rows; i++) {   //create 100 rows
   let colBox = document.createElement("div");  
   colBox.innerText = i + 1;
   colBox.setAttribute("class", "box");
   leftCol.appendChild(colBox);
}
for (let i = 0; i < cols; i++) {   //create cols from A to Z
   let cell = document.createElement("div");
   cell.innerText = String.fromCharCode(65 + i);  //String.fromCharCode will convert number into string
   cell.setAttribute("class", "cell");// setAttribute
   topRow.appendChild(cell);
}

for (let i = 0; i < rows; i++) {   // for making grid
   let row = document.createElement("div");
   row.setAttribute("class", "row");
   for (let j = 0; j < cols; j++) {
       let cell = document.createElement("div");
      //  cell.innerText=`${String.fromCharCode(65 + j)}  ${i+1}`
       cell.setAttribute("class", "cell");
       cell.setAttribute("rid", i);   //to set address of itself in html in form of row-id and col-id
       cell.setAttribute("cid", j);
       cell.setAttribute("contenteditable", "true"); 
       row.appendChild(cell);
   }
   grid.appendChild(row);
}



let allCells = document.querySelectorAll(".grid .cell");  //".querySelectorAll(".grid .cell")" top par isliye nhi kiya kyuki tab grid cells nhi bane thai...agar tab karte toh error de deta 
for (let i = 0; i < allCells.length; i++) {
   allCells[i].addEventListener("click", function () {    //yeh function tab chalega tab hum kisi cell par click karenge and yeh uss cell ka address , address bar mai dikha dega 
        // address get karna h current cell
        let rid = allCells[i].getAttribute("rid");   //abhi string form mai aayenge 
        let cid = allCells[i].getAttribute("cid");
        rid = Number(rid);    //no. form mai convert karlia
        cid = Number(cid);
        let address =
            `${String.fromCharCode(65 + cid)}${rid + 1}`;    //String.fromCharCode will convert number into string(65+cid will give ABCD....and rid+1 will give column number)
      // alert(address);
      //   ************yha tak address mil gya*****************

        
        addressInput.value = address;   //address input mai address chala gya

   })
}
allCells[0].click();  //by-default address-input A1 ka address dikha rha hoga



boldBtn.addEventListener("click", function () {// Jis bhi cell par click kare voh bold ho jaaye
   let uiCellElement=findUICellElement();
   uiCellElement.style.fontWeight="bold";
})
underlineBtn.addEventListener("click", function () {// Jis bhi cell par click kare voh bold ho jaaye
   let uiCellElement=findUICellElement();
   uiCellElement.style.textDecoration="underline";
})
italicBtn.addEventListener("click", function () {// Jis bhi cell par click kare voh bold ho jaaye
   let uiCellElement=findUICellElement();
   uiCellElement.style.fontStyle="italic";
})



function findUICellElement() {    //jis bhi cell par click kare toh uska address return karde
   let address = addressInput.value;
   let ricidObj = getRIDCIDfromAddress(address);
   let rid = ricidObj.rid;
   let cid = ricidObj.cid;
   let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
   return uiCellElement;
}
function getRIDCIDfromAddress(address) {  
   let cid = Number(address.charCodeAt(0)) - 65;   //eg. "A" wale col ko yeh cid=0 mai convert kar deta h
   let rid = Number(address.slice(1)) - 1;  //eg. "1" wali row ko yeh 0 mai convert kardeta h
   return { "rid": rid, "cid": cid };   //object return karta h
}