gsap.registerPlugin(Flip);

document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

document.addEventListener('contextmenu', event => event.preventDefault());


// / Selectors 
const userInput = $('input:text');
const add = $('.add');
const todoList = $('.todo-list');
const filterStatus = $('.filter-status');
const filterActive = $('.active');
const pageHeader = $('.header');

const popUp = $('#myPopup');

$('.clear-all-btn').hide();


// assigning current date as the page heading 
function pageHeading() {
    const pageHeaderChild = pageHeader.children('h2');
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
    }
    var todayDate = today.toLocaleDateString('en-US', options);
    pageHeaderChild.text(todayDate);
}

pageHeading();

// adding functinality to the filter options 
filterStatus.each(function () {
    filterStatus.click(function () {
        var currentFilterStatus = $(this);
        var currentFilterStatusOption = currentFilterStatus.children('p');
        var optionText = currentFilterStatusOption.text();

        var state = Flip.getState(filterActive);
        filterActive.remove().appendTo(currentFilterStatus);
        Flip.from(state, {
            duration: 0.5,
            absolute: true,
            ease: 'elastic.out(0.9, 0.6)',
        });

        switch (optionText) {
            case 'Completed':
                completed();
                break;

            case 'Pending':
                pending();
                break;

            case 'All':
                all();
                break;

            default:
                break;
        }

    });
});



// Event Listeners
add.click(addDiv);
$(".clear-all-btn").click(function () {
    warning();
});
document.onload = showListItems();


todoList.click(function (e) {
    var clicked = e.target;
    var directParent = clicked.parentElement;

    if (clicked.classList.contains('trash')) {
        var childOfDirectParent = directParent.children[0];
        var innerChild = childOfDirectParent.children[1];
        var innerChildOfDivContDateAndinput = innerChild.children[0];
        var innerTextOfChild = innerChildOfDivContDateAndinput.innerText;
        deleteItem(innerTextOfChild, directParent);
    }

    if (clicked.classList.contains('check-box')) {
        completeOrNot();

        var childOfDirectParent = directParent.children[1];
        var innerChild = childOfDirectParent.children[0];
        var innerTextOfItem = innerChild.innerText;

        statusOfCurrentCheckBox(clicked, innerTextOfItem);
    }

});

add.mouseenter(function () {
    $('.fa-plus').removeClass('fa-plus-anime-end');
    $('.fa-plus').addClass('fa-plus-anime-start');
});

add.mouseleave(function () {
    $('.fa-plus').removeClass('fa-plus-anime-start');
    $('.fa-plus').addClass('fa-plus-anime-end');
});



// yeah the function works with event listener click 
function addDiv(e) {
    // prevent the page from refreshing 
    e.preventDefault();

    // create the divs' and lis' that we want to add and assign them their respective class 
    const div = document.createElement('div');
    div.setAttribute('class', 'list-items');

    const li = document.createElement('li');
    li.setAttribute('class', 'item');

    const divInsideLi = document.createElement('div');
    divInsideLi.setAttribute('class', ' liItem-date');

    const userInputPara = document.createElement('p');
    userInputPara.setAttribute('class', 'user-input-para');

    const creationDate = document.createElement('p');
    creationDate.setAttribute('class', 'current-date');
    var today = new Date();
    var options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }
    var todayDate = today.toLocaleDateString('en-US', options);

    creationDate.innerText = 'Created on: ' + todayDate;

    storeCreationDate(todayDate);

    const span = document.createElement('span');
    span.innerHTML = '<i class="fa-solid fa-trash"></i>';
    span.setAttribute('class', 'trash');

    // i have to give an index to each span evrytime its created
    // so that later on i can compare it with my array to delete any item 
    // that the user wants to be deleted 
    // also it must be triggered on clicking the span 

    // update: instead of assigning own class index to the span everytime, now targetting its parent div 
    // and getting its index which is called everytime the user clicks on delete.



    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('class', 'check-box');

    // we have to take the value that the user is entering as an input 
    var input = userInput.val();
    // send the input to save local data function 
    if (input.length <= 35 && input != '') {
        saveLocalData(input);
    }

    // if the user doent give any input then the list will not be created 
    if (input == '') {
        alert('Really! Are you sure you dont have any task to do?');
    } else if (input != '' && input.length <= 35) {
        // instead of giving our own value to the li innerhtml we have to take the input from user 
        // also prepending a checkbox for the user to check after completing a task 
        userInputPara.innerText = input;
        divInsideLi.appendChild(userInputPara);
        divInsideLi.appendChild(creationDate);
        li.appendChild(divInsideLi);
        li.prepend(checkBox);
        div.appendChild(li);
        div.appendChild(span);

        todoList.append(div);

        const activeParent = filterActive.parent();
        const activeParentStatus = activeParent.children('p').text();
        switch (activeParentStatus) {
            case 'Completed':
                completed();
                break;

            case 'Pending':
                pending();
                break;

            case 'All':
                all();
                break

            default:
                break;
        }

        $('.clear-all-btn').show();
        // after appending the list item we have to remove the text from the input box 
        userInput.val('');


    } else if (input.length >= 35) {
        alert("Slow down coach! Its always better to break down your tasks.");
        location.reload();
    }


}


// So now we have to store or save the inputs and everything on local storage
// so that when the user refreshes his website , the inputs stays the same

// we are going to create a local storage for this 
// lets do it in a function 
function saveLocalData(input) {
    // lets create a unassigned variable for now 
    var todoTasks;
    // i will have to check if my local storage already has anything stored in it 
    var checkData = localStorage.getItem('todoTasks');
    // if there is item stored in local storage then we will parse it, if not then we
    // will create an empty array to store all the inputs 
    if (checkData === null) {
        todoTasks = [];
    } else {
        todoTasks = JSON.parse(localStorage.getItem('todoTasks'));
    }

    // after parsing the array we will push the user inputs inside of it 
    todoTasks.push(input);

    // set the array to local storage after stringifying it because local storage takes only string values 
    localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
}

// now we have to get back the inputs to show to the user 
// so lets create a function for this 
function showListItems() {

    // lets store the array in a variable 
    var checkData = localStorage.getItem('todoTasks');

    if (checkData != null) {
        var x = JSON.parse(localStorage.getItem('todoTasks'));
        var creationDateData = JSON.parse(localStorage.getItem('creationDate'));



        // now run a for loop to input each item inside array one by one to be shown to user 
        for (var i = 0; i < x.length; i++) {
            // and each time create the div and li for each list item to be appended one after the other 
            const div = document.createElement('div');
            div.setAttribute('class', 'list-items');

            const li = document.createElement('li');
            li.setAttribute('class', 'item');

            const divInsideLi = document.createElement('div');
            divInsideLi.setAttribute('class', ' liItem-date');

            const userInputPara = document.createElement('p');
            userInputPara.setAttribute('class', 'user-input-para');

            const creationDate = document.createElement('p');
            creationDate.setAttribute('class', 'current-date');

            creationDate.innerText = 'Created on: ' + creationDateData[i];

            const span = document.createElement('span');
            span.innerHTML = '<i class="fa-solid fa-trash"></i>';
            span.setAttribute('class', 'trash');

            const checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('class', 'check-box');

            var input = x[i];

            userInputPara.innerText = input;
            divInsideLi.appendChild(userInputPara);
            divInsideLi.appendChild(creationDate);
            li.appendChild(divInsideLi);
            li.prepend(checkBox);
            div.appendChild(li);
            div.appendChild(span);
            todoList.append(div);
        }


        $('.clear-all-btn').show();


        $('.list-items').each(function () {
            var divIdx = $(this).index();
            var childElementOfDiv = $(this).children('li');
            var childOfLiItem = childElementOfDiv.children('.liItem-date');
            var childOfLiItemDate = childOfLiItem.children('.user-input-para');
            var contentOfChild = childOfLiItemDate.text();

            var childOfLi = childElementOfDiv.children('.check-box');


            if (localStorage.getItem('newInput') != null) {
                var x = JSON.parse(localStorage.getItem('newInput'));

                if (x[divIdx] == (contentOfChild + 'true')) {
                    childOfLi.prop('checked', true);
                } else {
                    childOfLi.prop('checked', false);
                }
            }

        });

        completeOrNot();
        pending();
    }
}

// when user clicks on del, we have to remove the list items 
// lets create a function for that 
function warning() {
    popUp.addClass('show');
    popUp.click(function () {
        popUp.removeClass('show');
        location.reload();

    });

    $('.clear-all-btn').click(function () {
        remove();
    });

}

function remove() {
    popUp.removeClass('show');
    $('.clear-all-btn').hide();
    var todoTasksData = JSON.parse(localStorage.getItem('todoTasks'));
    var arrayOfChildren = todoList.children();

    for (var i = 0; i < todoTasksData.length; i++) {
        const listChild = arrayOfChildren[i];

        if ($(listChild).hasClass('list-items') || $(listChild).hasClass('list-items finished')) {
            $('.list-items').addClass('moveLeft');

            setTimeout(() => {
                $('.list-items').remove();
                location.reload();
            }, 500);
        }
    }

    localStorage.clear();
}





function deleteItem(innerTextOfChild, directParent) {
    // first of all i have to get the array from local storage 
    var checkData = localStorage.getItem('todoTasks');
    var checkNewInputData = localStorage.getItem('newInput');
    var creationDateData = JSON.parse(localStorage.getItem('creationDate'));

    var x = JSON.parse(localStorage.getItem('todoTasks'));
    var indexOfInnertext = x.indexOf(innerTextOfChild);


    if (creationDateData != null) {

        creationDateData.splice(indexOfInnertext, 1);

        localStorage.setItem('creationDate', JSON.stringify(creationDateData));
    } else {
        return false;
    }

    // then check if the array is empty or not , if not empty then proceed or else return false 
    if (checkData != null) {
        // parsing the stringified array 
        var x = JSON.parse(localStorage.getItem('todoTasks'));
        // removing the element with the index of its parent as assigned in the previous function
        x.splice(x.indexOf(innerTextOfChild), 1);
        // setting the local storage with the remaining items in the array after splicing 
        localStorage.setItem('todoTasks', JSON.stringify(x));
        // then removing the parent element along with its child 
        directParent.setAttribute('class', 'moveLeft');
        setTimeout(() => {
            directParent.style.display = 'none';
        }, 500);

    } else {
        return false
    }

    if (checkNewInputData != null) {
        // parsing the stringified array 
        var b = JSON.parse(localStorage.getItem('newInput'))

        b.splice(indexOfInnertext, 1);

        localStorage.setItem('newInput', JSON.stringify(b));

    } else {
        return false
    }



}

function statusOfCurrentCheckBox(clicked, innerTextOfItem) {
    // so everytime i click on an checkbox, i have to get the index of the corresponding input or div
    // so that when we show the local stored items , we can target those specific divs and add functionality 

    var boolean = clicked.checked;

    // var grandParent = currentCheckBox.parents('.list-items');
    // var indexOfGrandParent = grandParent.index();

    if (boolean) {
        var w = 'true';


        var checkData = localStorage.getItem('newInput');

        if (checkData != null) {
            var x = JSON.parse(localStorage.getItem('todoTasks'));
            // var inputAsPerIdx = x[indexOfGrandParent];
            var checkInpt = innerTextOfItem + w;
            var indexOfInnerText = x.indexOf(innerTextOfItem);

            var k = JSON.parse(localStorage.getItem('newInput'));

            k[indexOfInnerText] = checkInpt;

            localStorage.setItem('newInput', JSON.stringify(k));
            pending();
        } else {
            var x = JSON.parse(localStorage.getItem('todoTasks'));
            // var inputAsPerIdx = x[indexOfGrandParent];
            var checkInpt = innerTextOfItem + w;

            var indexOfInnerText = x.indexOf(innerTextOfItem);

            // now to push this input as new input with the boolean and save it locally on another key 
            saveNewInput(checkInpt, indexOfInnerText);
            pending();
        }
    } else {
        var w = 'false';

        var checkData = localStorage.getItem('newInput');

        if (checkData != null) {
            var x = JSON.parse(localStorage.getItem('todoTasks'));
            // var inputAsPerIdx = x[indexOfGrandParent];
            var checkInpt = innerTextOfItem + w;
            var indexOfInnerText = x.indexOf(innerTextOfItem);
            var k = JSON.parse(localStorage.getItem('newInput'));

            k[indexOfInnerText] = checkInpt;

            localStorage.setItem('newInput', JSON.stringify(k));
            completed();

        } else {
            return false;
        }
    }

}

function saveNewInput(checkInpt, indexOfInnerText) {
    var newInput;
    var checkData = localStorage.getItem('newInput');
    if (checkData === null) {
        newInput = [];
    } else {
        newInput = JSON.parse(localStorage.getItem('newInput'));

    }


    if (newInput[indexOfInnerText] != checkInpt) {
        newInput[indexOfInnerText] = checkInpt;
        localStorage.setItem('newInput', JSON.stringify(newInput));
    } else {
        return false;
    }

}


function completeOrNot() {
    var listItems = $('.list-items');
    listItems.each(function () {
        var currentListItem = $(this);

        var inputInsideListItem = currentListItem.children('.item');
        var inputInsideItem = inputInsideListItem.children('.check-box');

        var statusofInputInside = inputInsideItem.is(':checked');

        if (statusofInputInside) {
            currentListItem.addClass('finished');
            inputInsideListItem.addClass('finished-line-thru');
        } else {
            currentListItem.removeClass('finished');
            inputInsideListItem.removeClass('finished-line-thru');
        }
    });
}

function completed() {

    var todoListChild = todoList.children('.list-items');

    todoListChild.each(function () {
        var currentListItem = $(this);
        if (currentListItem.attr('class') == 'list-items finished') {
            currentListItem.show();
        } else if (currentListItem.attr('class') != 'list-items finished') {
            currentListItem.hide();
        }
    });

}

function pending() {

    var todoListChild = todoList.children('.list-items');

    todoListChild.each(function () {
        var currentListItem = $(this);
        if (currentListItem.attr('class') == 'list-items finished') {
            currentListItem.hide();
        } else if (currentListItem.attr('class') != 'list-items finished') {
            currentListItem.show();
        }
    });
}


function all() {

    var todoListChild = todoList.children('.list-items');

    todoListChild.each(function () {
        var currentListItem = $(this);
        if (currentListItem.attr('class') == 'list-items finished') {
            currentListItem.show();
        } else if (currentListItem.attr('class') != 'list-items finished') {
            currentListItem.show();
        }
    });
}


function storeCreationDate(todayDate) {

    let savedDates;

    const creationDateData = JSON.parse(localStorage.getItem('creationDate'));

    if (creationDateData == null) {
        savedDates = [];
    } else {
        savedDates = JSON.parse(localStorage.getItem('creationDate'));
    }

    savedDates.push(todayDate);

    localStorage.setItem('creationDate', JSON.stringify(savedDates));

}





