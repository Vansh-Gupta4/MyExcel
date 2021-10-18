for (let i = 0; i < allCells.length; i++) {
    // to save the user entered "value" in database for later use
    allCells[i].addEventListener("blur", function () {
        let data = allCells[i].innerText;
        let address = addressInput.value;
        console.log(address);
        console.log(allCells[i]);
        let rid = allCells[i].getAttribute("rid");
        let cid = allCells[i].getAttribute("cid");
       
        let cellObject = sheetDB[rid][cid];
        cellObject.value = data;  //sheetDB mai value attribute update kar diya
 
 
        updateChildren(cellObject);
    })
 }
 formulaBar.addEventListener("keydown", function (e) {    //yeh tab chalega jabb user formula bar mai formula type kar karke "enter" press kare
    if (e.key == "Enter" && formulaBar.value) {
       
        let currentFormula = formulaBar.value; // user ne jo formula diya voh "currentFormula" mai h
        
        let value = evaluateFormula(currentFormula); //now evaluate formula
 
        let address = addressInput.value;
        // given for which we are setting the formula -> ui,db update 
        setCell(value, currentFormula);
        setParentCHArray(currentFormula, address);
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
 
 
    // For db update 
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDB[rid][cid].value = value;  // for sheetDB
    sheetDB[rid][cid].formula = formula;
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
 
 function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
 }
 
 
 
 function setParentCHArray(formula, chAddress) {  
    // register yourself as children of the parent(cells that are appearing in the formula)
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
        
        let chAddress = children[i];// children name
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        
        let childObj = sheetDB[rid][cid];
       
        let chFormula = childObj.formula; // get formula of children
        let newValue = evaluateFormula(chFormula);
        SetChildrenCell(newValue, chFormula, rid, cid);
        updateChildren(childObj);
    }
 }
 function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    let uiCellElement =
    document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value; //for ui
    sheetDB[rid][cid].value = value;  //for db
    //sheetDB[rid][cid].formula = formula; //for db
 }