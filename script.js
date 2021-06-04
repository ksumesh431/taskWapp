"use strict";
let colorBtn = document.querySelectorAll(".filter-color");
let mainArea = document.querySelector(".main-container");
let cross = document.querySelector(".fa-times");
let plus = document.querySelector(".pl");
let crossContainer = document.querySelector(".ex");
let body = document.body;

// let editableState=false;

let cColor = "#312F31";
let arr = [];
let crossState = false;
if (localStorage.getItem("allTasks")) {
    arr = JSON.parse(localStorage.getItem("allTasks"));

    for (let i = 0; i < arr.length; i++) {
        let { uid, text, colour } = arr[i];
        createTicket(text, colour, false, uid);
    }
}



for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function (obj) {
        let newColor = colorBtn[i].getAttribute("col");

        let allTickets = document.querySelectorAll(".ticket");
        allTickets.forEach(removefn);  //clears screen 
        function removefn(ticket) {
            ticket.remove();
        }
        arr = [];
        if (localStorage.getItem("allTasks")) {
            arr = JSON.parse(localStorage.getItem("allTasks"));

            for (let i = 0; i < arr.length; i++) {
                let { uid, text, colour } = arr[i];
                if (colour == newColor) {
                    createTicket(text, colour, false, uid);
                }
            }

            // for (let i = 0; i < arr.length; i++) {
            //     let { uid, text, colour } = arr[i];
            //     createTicket(text, colour, false, uid);
            // }
        }


    })
    colorBtn[i].addEventListener("dblclick", function (e) {
        let allTickets = document.querySelectorAll(".ticket");
        allTickets.forEach(removefn);  //clears screen 
        function removefn(ticket) {
            ticket.remove();
        }
        if (localStorage.getItem("allTasks")) {
            arr = JSON.parse(localStorage.getItem("allTasks"));

            for (let i = 0; i < arr.length; i++) {
                let { uid, text, colour } = arr[i];
                createTicket(text, colour, false, uid);
            }
        }
    })
}

plus.addEventListener("click", createModal);
crossContainer.addEventListener("click", manageState);


function createModal() {
    let arr = document.getElementsByClassName("modal_container");
    if (arr[0] == undefined) {
        let modal_container = document.createElement("div");
        modal_container.setAttribute("class", "modal_container");
        modal_container.innerHTML = `<div class="input_container">
        <textarea class="modal_input" placeholder="Enter your task here"></textarea>
    </div>
    <div class="filter_container">
        <div class="filter pink" cl="#D795AC"></div>
        <div class="filter blue" cl="#60CBDF"></div>
        <div class="filter green" cl="#92E6C8"></div>
        <div class="filter black" cl="#312F31"></div>
        <i class="fas fa-plus-square"></i>
    </div>`;


        body.appendChild(modal_container);
        handleModal(modal_container);

        document.addEventListener("keydown", function (obj) {
            if (obj.key == "Escape") {
                modal_container.remove();
            }
        })


    }
    else {
        body.removeChild(arr[0]);
    }
}
function handleModal(modal_container) {

    let filters = document.querySelectorAll(".filter_container .filter");
    let textArea = document.querySelector(".modal_input");
    let enterBtn = document.querySelector(".fa-plus-square");

    textArea.addEventListener("keydown", creation)

    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", function () {
            filters.forEach((ele) => {
                ele.classList.remove("border");
            }) //removes any border
            filters[i].classList.add("border");
            cColor = filters[i].getAttribute("cl");
            // console.log(cColor)
        })
    }
    function creation(obj) {
        if (obj.key == "Enter" && textArea.value != "") {
            // console.log("text", textArea.value, "colour", cColor);
            body.removeChild(modal_container);
            createTicket(textArea.value, cColor, true);
        }
    }
    enterBtn.addEventListener("click", function (e) {
        if (textArea.value.trim() == "") {
            alert("Enter some text to create note!");


        } else {
            body.removeChild(modal_container);
            createTicket(textArea.value, cColor, true);
        }
    })

    cColor = "#312F31";



}
function createTicket(text, colour, flag, id) {
    let uidfn = new ShortUniqueId();
    let uid = id || uidfn();
    let ticket = document.createElement("div");
    ticket.setAttribute("class", "ticket");
    ticket.innerHTML = `<div class="header" style="color:${colour}">
    </div>
    <div class="id-Container"><h3 class="uid">#${uid}</h3><img id="unlock" alt="unlock" src="images/lock2.png"/><img id="lock" alt="lock" src="images/lock.png"/></div>
    
    
    <div class="note_area" contenteditable="false">${text}</div>`;

    if (flag) {
        let obj = {
            uid, text, colour
        }
        arr.push(obj);
        let finalArr = JSON.stringify(arr);
        localStorage.setItem("allTasks", finalArr);
    }

    mainArea.appendChild(ticket);

    let noteHeader = ticket.querySelector(".uid");
    let noteBody = ticket.querySelector(".note_area");
    // noteHeader.addEventListener("click", removeTicket);
    noteBody.addEventListener("click", removeTicket);
    noteBody.addEventListener("keypress", editTask);



    let header = ticket.querySelector(".header");
    header.addEventListener("click", headerClick);



    let lock = ticket.querySelector("#lock");
    let unlock = ticket.querySelector("#unlock");
    // unlock.style.display="none";
    lock.addEventListener("click", function () {
        noteBody.contentEditable = "true";
        lock.style.display = "none"
        unlock.style.display = "block";
    })
    unlock.addEventListener("click", function () {
        let id = noteBody.parentNode.childNodes[2].innerText.split("#")[1];
        for (let i = 0; i < arr.length; i++) {
            let { uid } = arr[i];
            // console.log(id,uid);
            if (id == uid) {
                arr[i].text = noteBody.innerText;
                let finalArr = JSON.stringify(arr);
                localStorage.setItem("allTasks", finalArr);

                break;
            }
        }

    })
    unlock.addEventListener("click", function () {
        noteBody.contentEditable = "false";
        unlock.style.display = "none"
        lock.style.display = "block";
    })



}
function headerClick(e) {
    let header = e.currentTarget;
    let rotatingColor = header.getAttribute("style").split(":")[1].trim();
    let colorArr = ["#D795AC", "#60CBDF", "#92E6C8", "#312F31"];
    let idx = colorArr.indexOf(rotatingColor);
    let i = (idx + 1) % 4;
    rotatingColor = colorArr[i];

    let id = header.parentNode.childNodes[2].innerText.split("#")[1];
    for (let i = 0; i < arr.length; i++) {
        let { uid } = arr[i];
        // console.log(uid,id)
        if (id == uid) {
            arr[i].colour = rotatingColor;
            let newArr = JSON.stringify(arr);
            localStorage.setItem("allTasks", newArr);
            header.setAttribute("style", `color:${rotatingColor}`);
            break;
        }
    }


}
function manageState(e) {

    if (document.querySelector(".modal_container")) {
        document.querySelector(".modal_container").remove();
    }

    let crossContainer = e.currentTarget;
    if (crossState) {
        crossContainer.classList.remove("active");
    } else {
        crossContainer.classList.add("active");
    }
    crossState = !crossState;
}

// body.addEventListener("click",function(e){
//     // console.log(e.target);
// })

function removeTicket(e) {
    if (crossState) {
        let noteBody = e.currentTarget;
        let id = noteBody.parentNode.childNodes[2].innerText.split("#")[1];
        for (let i = 0; i < arr.length; i++) {
            let { uid } = arr[i];
            // console.log(id,uid);
            if (id == uid) {
                arr.splice(i, 1);
                let finalArr = JSON.stringify(arr);
                localStorage.setItem("allTasks", finalArr);
                noteBody.parentNode.remove();
                break;
            }
        }

    }
}
function editTask(e) {
    let noteBody = e.currentTarget;
    let id = noteBody.parentNode.childNodes[2].innerText.split("#")[1];
    for (let i = 0; i < arr.length; i++) {
        let { uid } = arr[i];
        // console.log(id,uid);
        if (id == uid) {
            arr[i].text = noteBody.innerText;
            let finalArr = JSON.stringify(arr);
            localStorage.setItem("allTasks", finalArr);

            break;
        }
    }
}


