//To make grid
let leftCol = document.querySelector(".left_col");
let topRow = document.querySelector(".top_row");
let grid = document.querySelector(".grid");
let addressInput = document.querySelector(".address-input"); // it gives current clicked cell address
let boldBtn = document.querySelector(".bold");
let underlineBtn = document.querySelector(".underline");
let italicBtn = document.querySelector(".italic");
let alignBtns = document.querySelectorAll(".align-container>*");
let fontSizeElem = document.querySelector(".font-size");
let formulaBar=document.querySelector(".formula-input");


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



let btnContainer = document.querySelector(".add-sheet_btn-container");   //sheet add karne wale btn ka selector

let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");
let sheetArray=[]
let sheetDB;


firstSheet.addEventListener("click", makeMeActive)
firstSheet.click();

btnContainer.addEventListener("click", function () {   //tab chalega jab ham add sheet karenge
   
    let AllSheets = document.querySelectorAll(".sheet");   //saari sheets aa gai
    let lastSheet = AllSheets[AllSheets.length - 1];     //saari sheets mai se last sheet choose kar li
    let Lastidx = lastSheet.getAttribute("idx");   //last sheet mai se last idx nikal lenge(idx string form mai  aayega)
    Lastidx = Number(Lastidx);               // String waale last idx ko number mai convert karlia ie "2" ko 2 bana diya
 
    let Newsheet = document.createElement("div");    // create sheet 
    Newsheet.setAttribute("class", "sheet");
    Newsheet.setAttribute("idx", `${Lastidx + 1}`);
    Newsheet.innerText = `Sheet ${Lastidx + 2}`;   //agar sheet ka idx 1 h toh voh sheet no.2 h
    sheetList.appendChild(Newsheet);                //append
 
    for (let i = 0; i < AllSheets.length; i++) {  //phle saari sheet tab ko unactive karna 
        AllSheets[i].classList.remove("active");
    }
    Newsheet.classList.add("active");      //jo new sheet banai usse active banana h
    // new sheet create 

    createSheet();
    sheetDB=sheetArray[Lastidx+1];
    setUI();


    Newsheet.addEventListener("click", makeMeActive)//isse saari newsheets par event listener add ho gya par 1st newsheet nhi h ...therefore humne specifically 1st sheet par event listener laga diya
 })
 
 
 
 function makeMeActive(e) {    //jis sheet par click kiya voh active ho jaaye

    let sheet = e.currentTarget;    // jis par evnt listener add hota h uss par currenttarget hota h
    let AllSheets = document.querySelectorAll(".sheet");
    for (let i = 0; i < AllSheets.length; i++) {
        AllSheets[i].classList.remove("active");
    }
    sheet.classList.add("active");
 
    let idx=sheet.getAttribute("idx")
    if(!sheetArray[idx]){
        createSheet();
    }
    sheetDB=sheetArray[idx];
    setUI();
 }
 
 


function createSheet(){

    let NewDB = [];   //sheet-databse is 2D aaray
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
            elem.innerText = "";
            row.push(cell);
        }
        NewDB.push(row);
    }
    sheetArray.push(NewDB);
}

function setUI(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let elem=document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
            let value=sheetDB[i][j].value;
            elem.innerText=value;
        }
    }
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

    //3rd Lec code(yeh tab chalega jab jab humm kisi ek cell ko bold/italic/underline ki property de then menu container mai uss btn ka color change ho jaaye and fir hum dusre cell par click kare jis par voh property nhi lagi ,usse menu container mai uss btn ka color wapas normal ho jaaye )    
        let cellObject = sheetDB[rid][cid];
        // toolbar cell sync 
        if (cellObject.bold == "normal") {
            boldBtn.classList.remove("active-btn");
        } else {
            boldBtn.classList.add("active-btn");
        }

        if (cellObject.underline == "none") {
            underlineBtn.classList.remove("active-btn");
        } else {
            underlineBtn.classList.add("active-btn");
        }

        if (cellObject.italic == "normal") {
            italicBtn.classList.remove("active-btn");
        } else {
            italicBtn.classList.add("active-btn");
        }
        
        if(cellObject.formula){   //formula h uss cell ke DB mai toh formular bar mai voh formula put kardo
            formulaBar.value=cellObject.formula;
        }else{   //agar DB mai nhi h koi formula uss cell ka toh formmula bar empty kardo
            formulaBar.value="";
        }


   })
}
allCells[0].click();  //by-default address-input A1 ka address dikha rha hoga



// *********formatting******
// Horizontal alignment
for (let i = 0; i < alignBtns.length; i++) {   //agar hum align button par click karenge toh chalega 
   alignBtns[i].addEventListener("click", function () {
       let alignment = alignBtns[i].getAttribute("class");
       let uiCellElement = findUICellElement();
       uiCellElement.style.textAlign = alignment;
   })
}

// font-size
fontSizeElem.addEventListener("change", function () {   //agar hum font size change karenge toh yeh chalega
   let val = fontSizeElem.value;
   let uiCellElement = findUICellElement();
   uiCellElement.style.fontSize = val + "px";
})



boldBtn.addEventListener("click", function () {// Jis bhi cell par click kare voh bold ho jaaye
   let uiCellElement=findUICellElement();


   let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetDB[rid][cid];
    if (cellObject.bold == "normal") {
        uiCellElement.style.fontWeight = "bold";  //cell ke UI mai change kiya
        boldBtn.classList.add("active-btn");  //boldbtn(i.e in menu container)  ke UI mai change kiya
        cellObject.bold = "bold";   //Obj mai change kiya
    } else {
        boldBtn.classList.remove("active-btn");
        uiCellElement.style.fontWeight = "normal";
        cellObject.bold = "normal";
    }
})

underlineBtn.addEventListener("click", function () {// Jis bhi cell par click kare voh bold ho jaaye
   let uiCellElement=findUICellElement();
  
   
   let cid = uiCellElement.getAttribute("cid");
   let rid = uiCellElement.getAttribute("rid");
   let cellObject = sheetDB[rid][cid];
   if (cellObject.underline == "none") {
       uiCellElement.style.textDecoration = "underline"; //cell ke UI mai change kiya
       underlineBtn.classList.add("active-btn"); //underlineBtn(i.e in menu container)  ke UI mai change kiya
       cellObject.underline = "underline";//Obj mai change kiya
   } else {
       underlineBtn.classList.remove("active-btn");
       uiCellElement.style.textDecoration = "none";
       cellObject.underline = "none"; 
   }
})

italicBtn.addEventListener("click", function () {// Jis bhi cell par click kare voh bold ho jaaye
   let uiCellElement=findUICellElement();
   
   let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetDB[rid][cid];
    if (cellObject.italic == "normal") {
        uiCellElement.style.fontStyle = "italic";//cell ke UI mai change kiya
        italicBtn.classList.add("active-btn"); //italicBtn(i.e. in menu container)  ke UI mai change kiya
        cellObject.italic = "italic";  //Obj mai change kiya
    } else {
        italicBtn.classList.remove("active-btn");
        uiCellElement.style.fontStyle = "normal";
        cellObject.italic = "normal";
    }

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