
let btnContainer = document.querySelector(".add-sheet_btn-container");   //sheet add karne wale btn ka selector
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");


btnContainer.addEventListener("click", function () {
   
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
   Newsheet.addEventListener("click", makeMeActive)//isse saari newsheets par event listener add ho gya par 1st newsheet nhi h ...therefore humne specifically 1st sheet par event listener laga diya
})

firstSheet.addEventListener("click", makeMeActive)

function makeMeActive(e) {    //jis sheet par click kiya voh active ho jaaye
   
   let sheet = e.currentTarget;    // jis par evnt listener add hota h uss par currenttarget hota h
   let AllSheets = document.querySelectorAll(".sheet");
   for (let i = 0; i < AllSheets.length; i++) {
       AllSheets[i].classList.remove("active");
   }
   sheet.classList.add("active");
}