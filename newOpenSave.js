
let save = document.querySelector(".save");
let open = document.querySelector(".open");

save.addEventListener("click", function () {   // functionality -> download excel representation(excel is represented by 2d array..therefore pura 2d array ko save karna h ek file mai)
  

    const data = JSON.stringify(sheetDB);

    // now convert data into blob
    const blob = new Blob([data], { type: 'application/json' });// data ko file like object mai convert
    
    const url = window.URL.createObjectURL(blob);// convert it any type file into url
    let a = document.createElement("a");
    // content in that file
    a.href = url;
    
    a.download = "file.json";// file download as file.son
// anchor click
    a.click();
})



// input type file hoti h and change event mai  file ka name aata h
open.addEventListener("change", function () {  // downloaded file ko open karke read karta h 

    // files ka array hota h..therefore we can accept multiple files 
    let filesArray = open.files;//saari files mil gai

    let fileObj = filesArray[0]; //first file choose karli
    
    let fr = new FileReader();// file reader to read the file
   
    fr.readAsText(fileObj); // read as text (async code)
    fr.onload=function(){
    console.log(fr.result);
   }
    fr.addEventListener("load", function () {
        console.log(fr.result);
        
    })
    
    console.log("After");

    // ui init karna padega ab
})