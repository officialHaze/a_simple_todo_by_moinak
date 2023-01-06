
// Selectors 
const userInput = $('input:text');
const add = $('.add');
const todoList = $('.todo-list');




// Event Listeners
add.click(addDiv);
$("h2").click(remove);
document.onload = showListItems();
$('span').click(function () {
    const currentItem = $(this);
    return parentIdx(currentItem);
});

$('.check-box').click(function (e) {
    var currentCheckBox = $(this);
    var currentState = e.target;
    return statusOfCurrentCheckBox(currentState, currentCheckBox);
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
        alert('Please give a valid input');
    } else if (input != '' && input.length <= 35) {
        // instead of giving our own value to the li innerhtml we have to take the input from user 
        // also prepending a checkbox for the user to check after completing a task 
        li.innerHTML = input;
        li.prepend(checkBox);
        div.appendChild(li);
        div.appendChild(span);

        todoList.append(div);
        // after appending the list item we have to remove the text from the input box 
        location.reload();
        userInput.val('');

    } else if (input.length >= 35) {
        alert("Entered value is too large for a todo list");
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



        // now run a for loop to input each item inside array one by one to be shown to user 
        for (var i = 0; i < x.length; i++) {
            // and each time create the div and li for each list item to be appended one after the other 
            const div = document.createElement('div');
            div.setAttribute('class', 'list-items');




            const li = document.createElement('li');
            li.setAttribute('class', 'item');

            const span = document.createElement('span');
            span.innerHTML = '<i class="fa-solid fa-trash"></i>';
            span.setAttribute('class', 'trash');

            const checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('class', 'check-box');

            var input = x[i];

            li.innerHTML = input;
            li.prepend(checkBox);
            div.appendChild(li);
            div.appendChild(span);
            todoList.append(div);
        }


        $('.list-items').each(function () {
            var divIdx = $(this).index();
            var childElementOfDiv = $(this).children('li');
            var contentOfChild = childElementOfDiv.text();
            var childOfLi = childElementOfDiv.children('.check-box');


            if (localStorage.getItem('newInput') != null) {
                var p = JSON.parse(localStorage.getItem('newInput'));
                console.log(p);

                if (p[divIdx] == (contentOfChild + 'true')) {
                    console.log(p[divIdx]);
                    childOfLi.prop('checked', true);
                } else {
                    childOfLi.prop('checked', false);
                }
            }

        });



    }
}

// when user clicks on del, we have to remove the list items 
// lets create a function for that 
function remove() {
    localStorage.clear();
    location.reload();
}


function parentIdx(currentItem) {
    var parent = currentItem.parent();

    var parentIndex = parent.index();

    return deleteItem(parentIndex, parent);

}

function deleteItem(parentIndex, parent) {
    // first of all i have to get the array from local storage 
    var checkData = localStorage.getItem('todoTasks');
    var checkNewInputData = localStorage.getItem('newInput');
    console.log(checkData);

    // then check if the array is empty or not , if not empty then proceed or else return false 
    if (checkData != null) {
        // parsing the stringified array 
        var x = JSON.parse(localStorage.getItem('todoTasks'));
        // removing the element with the index of its parent as assigned in the previous function
        x.splice(parentIndex, 1);
        // setting the local storage with the remaining items in the array after splicing 
        localStorage.setItem('todoTasks', JSON.stringify(x));
        // then removing the parent element along with its child 
        parent.animate({
            left: '-=150%'
        }, 600, function () {
            parent.remove();
        });
    } else {
        return false
    }

    if (checkNewInputData != null) {
        // parsing the stringified array 
        var b = JSON.parse(localStorage.getItem('newInput'));
        // removing the element with the index of its parent as assigned in the previous function
        b.splice(parentIndex, 1);
        // setting the local storage with the remaining items in the array after splicing 
        localStorage.setItem('newInput', JSON.stringify(b));
    } else {
        return false
    }

}

function statusOfCurrentCheckBox(currentState, currentCheckBox) {
    // so everytime i click on an checkbox, i have to get the index of the corresponding input or div
    // so that when we show the local stored items , we can target those specific divs and add functionality 

    var boolean = currentState.checked;

    var grandParent = currentCheckBox.parents('.list-items');
    var indexOfGrandParent = grandParent.index();
    console.log(indexOfGrandParent);

    if (boolean) {
        var w = 'true';


        var checkData = localStorage.getItem('newInput');

        if (checkData != null) {
            var x = JSON.parse(localStorage.getItem('todoTasks'));
            var inputAsPerIdx = x[indexOfGrandParent];
            var checkInpt = inputAsPerIdx + w;
            var k = JSON.parse(localStorage.getItem('newInput'));

            k[indexOfGrandParent] = checkInpt;

            localStorage.setItem('newInput', JSON.stringify(k));
        } else {
            var x = JSON.parse(localStorage.getItem('todoTasks'));
            var inputAsPerIdx = x[indexOfGrandParent];
            var checkInpt = inputAsPerIdx + w;

            // now to push this input as new input with the boolean and save it locally on another key 
            saveNewInput(checkInpt, indexOfGrandParent);
        }
    } else {
        var w = 'false';

        var checkData = localStorage.getItem('newInput');

        if (checkData != null) {
            var x = JSON.parse(localStorage.getItem('todoTasks'));
            var inputAsPerIdx = x[indexOfGrandParent];
            var checkInpt = inputAsPerIdx + w;
            var k = JSON.parse(localStorage.getItem('newInput'));

            k[indexOfGrandParent] = checkInpt;

            localStorage.setItem('newInput', JSON.stringify(k));



        } else {
            return false;
        }
    }



}

function saveNewInput(checkInpt, indexOfGrandParent) {
    var newInput;
    var checkData = localStorage.getItem('newInput');
    if (checkData === null) {
        newInput = [];
    } else {
        newInput = JSON.parse(localStorage.getItem('newInput'));

    }


    if (newInput[indexOfGrandParent] != checkInpt) {
        newInput.push(checkInpt);
        localStorage.setItem('newInput', JSON.stringify(newInput));
    } else {
        return false;
    }

}


