for (let i = 0; i < allCells.length; i++) {  // to save the user entered "value" in database for later use
 
    allCells[i].addEventListener("blur", function () {
        let data = allCells[i].innerText;
        let address = addressInput.value;
        //console.log(address);
        console.log(allCells[i]);
        let rid = allCells[i].getAttribute("rid");
        let cid = allCells[i].getAttribute("cid");
       
        let cellObject = sheetDB[rid][cid];
        //cellObject.value = data;  
 
        if(cellObject.value == data){//  agar UI and DB ki value same h toh return karjao
            return;
        }
        if(cellObject.formula){  //agar cell ka formula pada  h DB mai toh  remove kardo formula ko and parent ke array mai jaa kar children remove kardo
           removeFormula(cellObject,address);
           formulaBar.value= "";   //formula bar khaali kar diya
        }
 
 
        cellObject.value=data;//sheetDB mai value attribute update kar diya kyuki baad mai formula evaluate mai kaam aayega
 
        updateChildren(cellObject);  //agar hum apni value change kar rhe h and if someone have included u in formula so u need to revaluate their value
    })
 }
 formulaBar.addEventListener("keydown", function (e) {    //yeh tab chalega jabb user formula bar mai formula type kar karke "enter" press kare
    if (e.key == "Enter" && formulaBar.value) {
       
        let currentFormula = formulaBar.value; // user ne jo formula diya voh "currentFormula" mai h
        
 
        let address=addressInput.value;  //jis cell par formula apply kar rhe h (address bar mai jo cell no. h)
 
 
        let {rid,cid}=getRIDCIDfromAddress(address)
        let cellObject=sheetDB[rid][cid]
        if(currentFormula!=cellObject.formula){ //agar phele wala formula ,current formula ke equal nhi h toh(i.e user ne formula update kar dia toh)
            
          removeFormula(cellObject,address)  // phele wale formula ko parent mai jaa kar children remove karenge
       }
 
        let value = evaluateFormula(currentFormula); //now evaluate formula
 
    
        setCell(value, currentFormula);  //UI mai value update kiya and DB  mai value and formulaupdate kardia
        setParentCHArray(currentFormula, address);//children set kardiye
 
        updateChildren(cellObject) //agar humne formula change kardia toh chidren bhi change ho gaye honge ..therefore we have revaluate them
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
          //   if(value==""){
          //      value=0;
          //   }
            formulaTokens[i] = value; //A1 ki jagah 10 aa gya and A2 ki jagah 20
        }
    }
    // till now=>[(,10,+,20,)]
    let evaluatedFormula = formulaTokens.join(" ");// ( 10 + 20 )
    
   //return eval(evaluatedFormula); //eval is function that solve all maths
    return infixEvaluation(evaluatedFormula);  // Evaluate
 }
 function setCell(value, formula) {  //this func sets value in UI  and  sets value and formula in sheetDB
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;  //For UI
 
 
    // For db update 
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDB[rid][cid].value = value;  //sets value in sheetDB
    sheetDB[rid][cid].formula = formula;  //sets formula in sheetDB
 }
 
 function findUICellElement() { // dom ke element ka reference aa rha h jo address bar mai h
    let address = addressInput.value;
    let ricidObj = getRIDCIDfromAddress(address);
    let rid = ricidObj.rid;
    let cid = ricidObj.cid;
    let uiCellElement =
        document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
    return uiCellElement;
 }
 
 function getRIDCIDfromAddress(address) {  //humare string form wale address de rhe h aur yeh func rid and cid ke indexes de rha h wapas
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
 }
 
 
 
 function setParentCHArray(formula, chAddress) {   // register yourself as children of the parent(cells that are appearing in the formula)
   
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid];
            parentObj.children.push(chAddress);
 
        }
    }
 }
 function updateChildren(cellObject) {  //(recursive func)Children se apne aap ko evaluate karao aur fir apne children ko evaluate karwao
    let children = cellObject.children;
    for (let i = 0; i < children.length; i++) {
        
        let chAddress = children[i];// children name nikale
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        
        let childObj = sheetDB[rid][cid];
       
        let chFormula = childObj.formula; // get formula of children
        let newValue = evaluateFormula(chFormula); //firse revaluate kiya
        SetChildrenCell(newValue, chFormula, rid, cid);//UI and DB mai update kiya
        updateChildren(childObj);  //apne children ke saath bhi kardo
    }
 }
 
 function SetChildrenCell(value, formula, rid, cid) {//this func sets value and formula of children cells in UI and sheetDB both
 
    let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value; //for ui
    sheetDB[rid][cid].value = value;  //for db
    
 }
 
 
 //formula se parent get karlo and then parent ke children  array mai jaa kar remove children and DB se "formula" remove kardia
 function removeFormula(cellObject,myName){  //(just opposite function of "setParentCHArray")
    let formula=cellObject.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid];
            let idx=parentObj.children.indexOf(myName);
             parentObj.children.splice(idx,1);  //"idx" se ek banda remove ho jayga
        }
    }
    cellObject.formula="";
 }