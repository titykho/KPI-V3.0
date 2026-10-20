

  let brand, items,category = []; // GLOBAL ITEM NAME
  const MySrp = 0.60;
  let rPRICE = 0;

  let masterPermit = [];
  let GetToken, ACCESS_TOKEN = '';
        //let ACCESS_TOKEN ='';
        // token database to get new token variable
        const tokenName =
            'https://dl.dropboxusercontent.com/scl/fi/a1x40x537t6s7xwq9rho4/TokenAccess.json?rlkey=6doc8qb7m7bxhqugqgp7z3soa&st=wppelt13&raw=1'
        // Permission DataBase
        const dropboxUrl =
            'https://dl.dropboxusercontent.com/scl/fi/ymupy00vfmq37ved8leav/permision.json?rlkey=dhqb82d8z43t0hnmv0ezr8smp&st=31usehvw&raw=1';

        funcName();


        function funcName() {
            fetch(tokenName)
                .then(response => response.json())
                .then(jsonToken => {
                    let Dtoken = JSON.parse(JSON.stringify(jsonToken));
                    ACCESS_TOKEN = Dtoken[0].Token;
                }).catch(error => console.error("Error fetching TOKEN:", error));
        }
// start reading program *****************

        let GetEmail = '';
        let xfound = false;
        const storeData = localStorage.getItem('MyPermision')
        if (storeData !== null) {
            const myData = JSON.parse(storeData)
            GetEmail = myData.userEmail;
            try {
                const parseData = JSON.parse(storeData);
                GetEmail = parseData.userEmail;
                document.querySelector('.permision').style.display = 'none';
                ///// localstore true else not functioning


                loadDataPermit(GetEmail, myData);

            } catch (error) {
                alert("error dito")
                console.log("key exit ", error);
            }

        } else {
            let clearPermit = [];
            addPermission();
                const MyForm = document.getElementById("MyPermssion");
                MyForm.addEventListener('submit', e => {
                        event.preventDefault();
                        const formData = new FormData(event.target);
                        const alldata = Object.fromEntries(formData.entries());
                        alldata.permission = false;
                        alldata.pricefor = 1;
                        alldata.terms = 0;
                        alldata.count = 1;
                        alldata.permit = false;
                        alldata.date = new Date();
                  //      alert(` Wait for your Approval of  "${alldata.userEmail}"`)
                        document.querySelector('.image').innerHTML= ` Wait for your Approval of  "${alldata.userEmail}"`;
                        document.querySelector('.permision').style.display = 'none';
        //  *******  server side
                        clearPermit = masterPermit.find(key1 => key1.userEmail === alldata.userEmail)
                        if (clearPermit) {        /// edit specific value of object
                                clearPermit.count += 1;
                                clearPermit.permit = true;
                                if (clearPermit.count > 3){
                                    alert("You Have More Than 3 Devices Being Use Ask Your Administrator..");
                                    return;
                                }else{
                                    uploadJsonWithFetch(masterPermit).then(result =>{
                                         if(result) {
                                            // console.log("true ", result)
                                            alldata.count = clearPermit.count
                                            alldata.permit = true;
                                            localStorage.setItem('MyPermision', JSON.stringify(alldata))  
                                         }
                                         else {
                                            // console.log("false", result)
                                            // alert("dito ba eto " + result)
                                            // alert("Ask Your Administrator Token is Expired....");
                                            document.querySelector('.image').innerHTML= ` Ask Your Administrator Token is Expired! and to New  New Devices....`;
                                            return;
                                         }
                                        });        
                                    }
                        }else{
                                uploadJsonWithFetch(masterPermit).then(result =>{ 
                                    if(result) {
 
                                        alldata.permit = true;
                                         masterPermit.push(alldata); 
                                         uploadJsonWithFetch(masterPermit)
                                         localStorage.setItem('MyPermision', JSON.stringify(alldata))
                                    }
                                    else{
                                        alldata.permit = false;
                                        masterPermit.push(alldata);
                                        alert("Ask Administrator Server is Close...")
                                    
                                       localStorage.setItem('MyPermision', JSON.stringify(alldata))
                                    }
                                });
                        }
                    }, {
                        once: true
                    })
        }


        function loadDataPermit(xGetEmail, mydata) {
            let myfile,myfile2 = [];
            fetch(dropboxUrl)
                .then(response => response.json())
                .then(jsonData => {
                    let DataPermit = JSON.parse(JSON.stringify(jsonData));
                    myfile = [...DataPermit];
                   // myfile2 = myfile.find(key => key.userEmail === xGetEmail);
                    let see = myfile.some(user => user.userEmail === xGetEmail && user.permission === true)
                    if (see === true) {
                          myfile2 = myfile.find(key => key.userEmail === xGetEmail && key.permission === true)
                          rPRICE = myfile2.pricefor;  /// price for adding cost  

                         document.querySelector('.image').innerHTML= "You are Now Authorized to View..";
                          getJSONcategory();
                          getJSONbrand();
                          getJSONitems();
                          return true
                    } else {
                        if (myfile.some(user => user.userEmail === xGetEmail && user.permission === false)) {
                            // window.alert("Wait for Permission Approval .......")
                            document.querySelector('.image').innerHTML= "Wait for Approval For...";

                        } else if (myfile.some(user => user.userEmail !== xGetEmail && user.permission === false)) {

                            document.querySelector('.image').innerHTML= "Ask Your Admin for Email : " + xGetEmail + " and Permission Approval .....";
                            mydata.permit = true;
                            myfile.push(mydata);
                            uploadJsonWithFetch(myfile);

                        } else {
                            document.querySelector('.image').innerHTML= "Wait for Approval For...";
                            // alert("Wait for Approval For..." + xGetEmail)
                            return;
                        }
                        return false;
                        //if file has localstore and not yes found in master all file
                    }
                }).catch(error => console.error("Error fetching JSON:", error));
        }

        function addPermission() {   /// server side data base
            fetch(dropboxUrl)
                .then(response => response.json())
                .then(jsonData => {
                    let DataPermit = JSON.parse(JSON.stringify(jsonData));
                    masterPermit = [...DataPermit];
                }).catch(error => console.error("Error fetching JSON:", error));
        }




        async function uploadJsonWithFetch(myData) {
            const url = 'https://content.dropboxapi.com/2/files/upload';
            const jsonString = JSON.stringify(myData, null, 2);

            // Dropbox expects file metadata passed via the 'Dropbox-API-Arg' header
            const dropboxArgs = {
                path: '/exports/permision.json',
                mode: 'overwrite',
                autorename: false,
                mute: false
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                        'Dropbox-API-Arg': JSON.stringify(dropboxArgs),
                        'Content-Type': 'application/octet-stream' // Required by Dropbox Content API
                    },
                    body: jsonString
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Dropbox API error: ${errorText}`);
                }

                const result = await response.json();
                //console.log('File uploaded successfully via fetch!', result);
                return true;
            } catch (error) {
                console.error('Upload failed:', error);
                //alert("Token Accessible Has Expired ask Administrator..")
                return false;
            }
         }

//  ************************   main program  *********************888

// getJSONcategory();
// getJSONbrand();
// getJSONitems();


function getJSONitems(){
    //const dropboxUrl ='https://dl.dropboxusercontent.com/scl/fi/998tf3rypwb4kidt396d8/items.json?rlkey=h4gebw2odff7tbktvs9ki64sl&st=fccps9wz&raw=1';
    const dropboxUrl ="https://dl.dropboxusercontent.com/scl/fi/998tf3rypwb4kidt396d8/items.json?rlkey=h4gebw2odff7tbktvs9ki64sl&st=htups6st&raw=1"
    //https://www.dropbox.com/scl/fi/998tf3rypwb4kidt396d8/items.json?rlkey=h4gebw2odff7tbktvs9ki64sl&st=zlgmpg0k&dl=0

    fetch(dropboxUrl)
      .then(response => response.json())
      .then(jsonData => {
        let jsonData1=JSON.parse(JSON.stringify(jsonData));
      
        items = [...jsonData1];
        // console.log("json string ",myitem)    // console.log("JSON Data:", jsonData);
      })
      .catch(error => console.error("Error fetching JSON:", error));
}

//https://www.dropbox.com/scl/fi/v7yf90wau5mce5iamcpok/brand.json?rlkey=04guyov5k6sqmq88caczt2qla&st=i1usyq1n&&raw=1
function getJSONbrand(){
const dropboxUrl= 'https://dl.dropboxusercontent.com/scl/fi/v7yf90wau5mce5iamcpok/brand.json?rlkey=04guyov5k6sqmq88caczt2qla&st=3p6lpyfg&raw=1'
fetch(dropboxUrl)
  .then(response => response.json())
  .then(jsonData => {
    let jsonData1=JSON.parse(JSON.stringify(jsonData));
     
     brand = [...jsonData1];
      brand.sort();
    // console.log("json string ",myitem)    // console.log("JSON Data:", jsonData);
  })
  .catch(error => console.error("Error fetching JSON:", error));
}

function getJSONcategory(){
const dropboxUrl= 'https://dl.dropboxusercontent.com/scl/fi/gfmaqxh87yt9om7qthq6m/category.json?rlkey=di2ky1i8td20kz9gc8x6s2yvy&st=wlp957qv&raw=1'
//const dropboxUrl= 'https://dl.dropboxusercontent.com/scl/fi/v7yf90wau5mce5iamcpok/brand.json?rlkey=04guyov5k6sqmq88caczt2qla&st=3p6lpyfg&raw=1'
fetch(dropboxUrl)
  .then(response => response.json())
  .then(jsonData => {
    let jsonData1=JSON.parse(JSON.stringify(jsonData));  
     category = [...jsonData1];
      category.sort();
    // console.log("json string ",myitem)    // console.log("JSON Data:", jsonData);
  })
  .catch(error => console.error("Error fetching JSON:", error));
}

// **************************  items search ***********************88

function saveclick(){
    let myx='';
    myx = document.getElementById("mysearch").value.toUpperCase(); 
    ViewItem2(items,myx);
}


function ViewItem2(data1,LookItem) {
const myimage = document.querySelector(".image");
//   const output = document.querySelector("box1");
  //data1.sort((a,b) => a.partno.localeCompare(b.partno))
  data1.sort((a,b) => a.brand.localeCompare(b.brand) || a.category.localeCompare(b.category) || a.partno.localeCompare(b.partno));
  myimage.innerHTML = "";

        data1.forEach((data1, index) => {             
               if(data1.partno.toUpperCase().includes(LookItem) || data1.desrip.toUpperCase().includes(LookItem)){
                        const row = document.createElement("div");
                        const formatted = retailPrice(Math.round( (data1.price * rPRICE)/5)*5);                     
                        row.className='boxes'
                        row.dataset.index = index; 
                        row.style.borderColor=`${data1.active ? "black":"red"}`;
                        row.innerHTML = `<img src=${data1.photo}>
                        <p>PART NO: ${data1.partno}
                        <br>BRAND: ${data1.brand} <br> <span style="color:blue; font-weight:bold; background-color:white">PRICE: ${formatted} </span> <br>  ${data1.desrip} </p> `

                        row.addEventListener("click", function() {  
                                      let  nsrp = con_price(Math.round((data1.price / MySrp)/5)*5); 
                                      let xprice =con_price(Math.round( (data1.price * rPRICE)/5)*5);                                   

                                      const description = capitalizeWords(data1.desrip);
                                          document.getElementById('customAlert').style.display = 'block';
                                          document.getElementById("photoimg").src = data1.photo+'&sz=s1500';
                                          document.getElementById('p0').innerText= `BRAND : ${data1.brand}`;
                                          document.getElementById('p1').innerText= `PART NO : ${data1.partno}`;
                                          document.getElementById('p2').innerText= `PRICE : ${xprice},    SRP : ${nsrp}`;
                                          document.getElementById('p3').innerText= `DESCRIPTION : ${description}`; 
                                          document.getElementById('p4').innerText= `CATEGORY : ${data1.category}`; 
                                          document.getElementById("p5").innerText =`AVAILABLE : ${data1.active ? "YES":"NO"}`;
                                          document.getElementById("p5").style.color =`${data1.active ? "black":"red"}`;                                           
                         });
                        myimage.appendChild(row);   
                   
                }
            } )  
} 

function retailPrice(retail){
           return retail = retail.toLocaleString('en-US', {  // format numerica no.
                    minimumFractionDigits: 2,
                     maximumFractionDigits: 2
              });
}
function con_price(nPrice){
           return nPrice = nPrice.toLocaleString('en-US', {  // format numerica no.
                    minimumFractionDigits: 2,
                     maximumFractionDigits: 2
              });
    }          
// ************************888   brand ******************************8

function ViewBrand2(data1,LookItem) {
const myimage = document.querySelector(".image");
//   const output = document.querySelector("box1");
//  data1.sort((a,b) => a.brand.localeCompare(b.brand));
   data1.sort((a,b) => a.brand.localeCompare(b.brand) || a.category.localeCompare(b.category) ||a.partno.localeCompare(b.partno));
  myimage.innerHTML = "";
        data1.forEach((data1, index) => {             
               if(data1.brand.includes(LookItem)){
                        const row = document.createElement("div");
                        const formatted = retailPrice(Math.round( (data1.price * rPRICE)/5)*5);

                        row.className='boxes'
                        row.dataset.index = index; 
                        row.style.borderColor=`${data1.active ? "black":"red"}`;
                        row.innerHTML = `<img src=${data1.photo}>
                        <p>PART NO: ${data1.partno}
                        <br>BRAND: ${data1.brand} <br> <span style="color:blue; font-weight:bold; background-color:white">PRICE: ${formatted} </span> <br>  ${data1.desrip} </p> `

                        row.addEventListener("click", function() {
                                      let  nsrp = con_price(Math.round((data1.price / MySrp)/5)*5); 
                                      let xprice =con_price(Math.round( (data1.price * rPRICE)/5)*5);
                                      const description = capitalizeWords(data1.desrip);
                                          document.getElementById('customAlert').style.display = 'block';
                                          document.getElementById("photoimg").src = data1.photo+'&sz=s1500';
                                          document.getElementById('p0').innerText= `BRAND : ${data1.brand}`;
                                          document.getElementById('p1').innerText= `PART NO : ${data1.partno}`;
                                          document.getElementById('p2').innerText= `PRICE : ${xprice},   SRP : ${nsrp}`; 
                                          document.getElementById('p3').innerText= `DESCRIPTION : ${description}`; 
                                          document.getElementById('p4').innerText= `CATEGORY : ${data1.category}`; 
                                          document.getElementById("p5").innerText =`AVAILABLE : ${data1.active ? "YES":"NO"}`; 
                                          document.getElementById("p5").style.color =`${data1.active ? "black":"red"}`;
  
                                         });
                        myimage.appendChild(row);   
                   
                }
            } ) 
   
} 

function closeCustomAlert() {
        document.getElementById('customAlert').style.display = 'none';
}


function toggleBrand(){
const btn2= document.querySelector(".ListBrand")
    btn2.style.display = btn2.style.display === "none" ? "block" : "none";
  const listContainer = document.getElementById("mybList");
  listContainer.innerHTML = "";
  brand.forEach(brand => {
        const li = document.createElement("li");
        li.textContent = brand;
        li.style.cursor = 'pointer'; // Make it look clickable
        li.addEventListener('click', function() {
                const value = this.textContent; 
                document.querySelector('.image').innerHTML= value;
                ViewBrand2(items,value)
            });
    listContainer.appendChild(li);
  });
}

// ********************************  category ****************************

function ViewCategory2(data1,LookItem) {
const myimage = document.querySelector(".image");
//   const output = document.querySelector("box1");
//  data1.sort((a,b) => a.partno.localeCompare(b.partno));
   data1.sort((a,b) => a.category.localeCompare(b.category) || a.brand.localeCompare(b.brand) || a.partno.localeCompare(b.partno));
  myimage.innerHTML = "";

        data1.forEach((data1, index) => {             
               if(data1.category.includes(LookItem)){
                        const row = document.createElement("div");
                        row.className='boxes'
                        const formatted = retailPrice(Math.round( (data1.price * rPRICE)/5)*5);                    
                        row.dataset.index = index;
                        row.style.borderColor=`${data1.active ? "black":"red"}`; 
                        row.innerHTML = `<img src=${data1.photo}>
                        <p>PART NO: ${data1.partno}
                        <br>BRAND: ${data1.brand} <br> <span style="color:blue; font-weight:bold; background-color:white">PRICE: ${formatted} </span> <br>  ${data1.desrip} </p> `

                        row.addEventListener("click", function() {
                                      let  nsrp = con_price(Math.round((data1.price / MySrp)/5)*5); 
                                      let xprice =con_price(Math.round( (data1.price * rPRICE)/5)*5);                                   
                                      const description = capitalizeWords(data1.desrip);
                                          document.getElementById('customAlert').style.display = 'block';
                                          document.getElementById("photoimg").src = data1.photo+'&sz=s1500';
                                          document.getElementById('p0').innerText= `BRAND : ${data1.brand}`;
                                          document.getElementById('p1').innerText= `PART NO : ${data1.partno}`;
                                          document.getElementById('p2').innerText= `PRICE : ${xprice},     SRP : ${nsrp}`;
                                          document.getElementById('p3').innerText= `DESCRIPTION : ${description}`; 
                                          document.getElementById('p4').innerText= `CATEGORY : ${data1.category}`; 
                                          document.getElementById("p5").innerText =`AVAILABLE : ${data1.active ? "YES":"NO"}`;   
                                          document.getElementById("p5").style.color =`${data1.active ? "black":"red"}`;                                                                                      
                                })
                       myimage.appendChild(row);     
                }
            } )       
} 


function toggleCategory(){
let myvalue='';
const btn2= document.querySelector(".ListCategory")
    btn2.style.display = btn2.style.display === "none" ? "block" : "none";

  const listContainer = document.getElementById("mycList");
  listContainer.innerHTML = "";
  category.forEach(category => {
        const li = document.createElement("li");
        li.textContent = category;   
        li.style.cursor = 'pointer'; // Make it look clickable
        li.addEventListener('click', function() {
                const value = this.textContent; 
                myvalue=value;
                ViewCategory2(items,myvalue)
            });
    listContainer.appendChild(li);  
  });
}


function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
