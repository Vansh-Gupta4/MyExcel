for (let i = 0; i < allCells.length; i++) {
   // to save the user entered "value" in database for later use
   allCells[i].addEventListener("blur", function () {
       let data = allCells[i].innerText;
       let address = addressInput.value;
       console.log(address);
       console.log(allCells[i]);
       let rid = allCells[i].getAttribute("rid");
       let cid = allCells[i].getAttribute("cid");
       // let { rid, cid } = getRIDCIDfromAddress(address);
       let cellObject = sheetDB[rid][cid];
       cellObject.value = data;  //sheetDB mai value attribute update kar diya

   })
}

formulaBar.addEventListener("keydown", function (e) {    //yeh tab chalega jabb user formula bar mai formula type kar karke "enter" press kare
   if (e.key == "Enter" && formulaBar.value) {

       let currentFormula = formulaBar.value; // user ne jo formula diya voh "currentFormula" mai h

       let value = evaluateFormula(currentFormula); //now evaluate formula

       let address = addressInput.value;
       // given for which we are setting the formula -> ui,db update 
       setCell(value, currentFormula);

   }
})

function evaluateFormula(formula) {  //function to evaluate formula
   // For eg( A1 + A2 )

   let formulaTokens = formula.split(" ");  // [(,A1,+,A2,)]
   for (let i = 0; i < formulaTokens.length; i++) {
       let ascii = formulaTokens[i].charCodeAt(0);
       if (ascii >= 65 && ascii <= 90) {  // For A to Z
           let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
           let value = sheetDB[rid][cid].value;
           formulaTokens[i] = value; //A1 ki jagah 10 aa gya and A2 ki jagah 20
       }
   }
   // till now=>[(,10,+,20,)]
   let evaluatedFormula = formulaTokens.join(" ");// ( 10 + 20 )

   return eval(evaluatedFormula); //eval is function that solve all maths
}
function setCell(value, formula) {  //this func sets value and formula in UI and sheetDB both
   let uicellElem = findUICellElement();
   uicellElem.innerText = value;  //For UI
   // db update 
   let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
   sheetDB[rid][cid].value = value;  // for sheetDB
   sheetDB[rid][cid].formula = formula;
}