// framework used ==> jQuery and jQuery UI

/* create an array of months and year with their span numbers
loop through the array and them to the date element */
let months = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
const yearArray =  {
    '2022' : {'january': 6, 'february': 2, 'march': 2, 'april': 5, 'may': 7, 'june': 3, 'july': 5, 'august': 1, 'september': 4, 'october': 6, 'november': 2, 'december': 4},
    '2023' : {'january': 7, 'february': 3, 'march': 3, 'april': 6, 'may': 1, 'june': 4, 'july': 6, 'august': 2, 'september': 5, 'october': 7, 'november': 3, 'december': 5},
    '2024' : {'january': 1, 'february': 4, 'march': 5, 'april': 1, 'may': 3, 'june': 6, 'july': 1, 'august': 4, 'september': 7, 'october': 2, 'november': 5, 'december': 7},
    '2025' : {'january': 3, 'february': 6, 'march': 6, 'april': 2, 'may': 4, 'june': 7, 'july': 2, 'august': 5, 'september': 1, 'october': 3, 'november': 6, 'december': 1},
    '2026' : {'january': 4, 'february': 3, 'march': 2, 'april': 5, 'may': 7, 'june': 3, 'july': 5, 'august': 1, 'september': 4, 'october': 6, 'november': 2, 'december': 4},
    '2027' : {'january': 5, 'february': 3, 'march': 2, 'april': 5, 'may': 7, 'june': 3, 'july': 5, 'august': 1, 'september': 4, 'october': 6, 'november': 2, 'december': 4}
}
const yearLocalStorage = {'2022': 'event22', '2023': 'event23', '2024': 'event24', '2025': 'event25'}

// All Functions

/**
 * accepts the current year as its parameter
 * loops through yearStorage and returns the value of the index corresponding with the current year
 */

function getYearStorage(currentyear) {
    $.each(yearLocalStorage, function(index, value) {
        if (currentyear == index) {
            currentYearStorage = value;
        }
    })
    return  currentYearStorage
}



let alltodoList = ''
function getLocalStorageData(yearStorage) {
    alltodoList = JSON.parse(window.localStorage.getItem(yearStorage))
    todoListMonths = []
    todoListDay = []
    todoListDate = []
    todoListEvent = []
    todoListReminder = []
    todoListID = []
    todoListDone = []
    $.each(alltodoList, function(index, value) {
        todoListMonths.push(alltodoList[index].reminderDate.split(' ')[2])
        todoListDay.push(alltodoList[index].reminderDate.split(' ')[1])
        todoListDate.push(alltodoList[index].reminderDate.split(' ')[0].slice(0,-1))
        todoListEvent.push(alltodoList[index].category)
        todoListReminder.push(alltodoList[index].reminderName)
        todoListID.push(alltodoList[index].id)
        todoListDone.push(alltodoList[index].done)
    })
}

function getCurrentYearData() {
    $.each(yearArray, function(index, value) {
        if (currentYearName == index) {
            currentYearData = value
        }
    })
}

/*
    Setting the numbers to be added to each month by the number of days in each month
    create a function that loops through each month element
    for each month create an iteration depending on it's days that add numbers into the month
    create a monthlenght variable that determines the iteration
    default monthlenght is 31
    create an array for months of 30 days
    get the id of each month element and compare with february which is 28
    add a div element to the beggining of each month for spaning with css so that date 1 can start from the accurate day
    create a for loop that adds number to the date depending on monthlenght variable
*/
function addNumberOfDatesToMonth() {
    $('.month').each(function() {
        let month30 = ['april', 'june', 'september', 'november']
        let monthlength = 31
        let id = $(this).attr('id')
        if (id == 'february') {
            monthlength = 28
        } else if (month30.includes(id)) {
            monthlength = 30
        }
        let boolean = true
        for (i = 0; i <= monthlength; i++) {
            if (boolean) {
                $('#' + id +' .dates').append('<div class="date"></div>')
                boolean = false
                continue
            }
            $('#' + id +' .dates').append('<div class="date">' + i + '</div>')
        }
    })
}

function highlightUserDate() {
    let userFullDate = new Date().toDateString()
    let userDate = userFullDate.split(' ')
    let userDay = ''
    if (currentYearName == userDate[3]) {
        $('.month').each(function() {
            let month = $(this).attr('id').slice(0,3)
            if (month == userDate[1].toLowerCase()) {
                $(this).children('.dates').children().each(function() {
                    if ($(this).text() == userDate[2]) {
                        $(this).addClass('userDate')
                    }
                })
            }

        })
    }
    let angle = 0
    function linearRotate() {
        $('.userDate').css('background-image', 'linear-gradient('+ angle + 'deg, #423ca3, #954545, transparent)')
        angle += 30
        if(angle == 330) {
            angle = 0
        }
    }
    setInterval(linearRotate, 500)
}

function monthSpanner(yearData) {
    $.each(yearData, function(index, value) {
        $('#' + index +' .dates>div:nth-of-type(8)').removeClass()
        $('#' + index +' .dates>div:nth-of-type(8)').addClass('span span-'+ value)
    })
}

function saveToStorage(yearStorage) {
    let submitted = false
    if (category && reminderName) {
        pushEventDetail = JSON.parse(window.localStorage.getItem(yearStorage))
        if (!pushEventDetail || !pushEventDetail.length) {
            id = 1
        } else {
            console.log(pushEventDetail);
            id = parseInt(pushEventDetail[pushEventDetail.length-1].id) + 1
        }
        let done = false
        var eventDetail = {'id': id, 'reminderDate':reminderDate, 'category':category, 'reminderName':reminderName, 'done': done}
        if(pushEventDetail) {
            pushEventDetail.push(eventDetail)
            window.localStorage.setItem(yearStorage , JSON.stringify(pushEventDetail))
            submitted = true
        } else {
            window.localStorage.setItem(yearStorage , JSON.stringify([eventDetail]))
            submitted = true
        }
    } else {
        alert('one is empty')
    }
    if (submitted) {
        $('#days').dialog('close')
        updateReminder()
        outlineEventDates()
        alert('data saved successfully')
    } else {
        alert('data not saved.\nAll data are not filled')
    }
    return false;
}

function updateReminder() {
    getLocalStorageData(currentYearStorage)
    
    $('.todoList .content').html('')
    $.each(todoListMonths, function(index, value) {
        let done = ''
        let markIcon = 'mark_icon.png'
        if (todoListDone[index]) {
            done = 'markAsDone'
            markIcon = 'unmark_icon.png'
        }
        $('.todoList .'+ value).append('<div class="eventContent '+done+'" id="'+todoListID[index]+'"><span>' + todoListDay[index] +' '+ todoListDate[index] +' -->  </span>' + todoListEvent[index] + ': '+ todoListReminder[index] + '<span><img src="'+markIcon+'" class="optionTodo" id="mark" title="Mark as done"> <img src="delete_icon.png" class="optionTodo" id="delete" title="Delete"></span> </div>')
    })
    /**
     * set all months to show
     * loop through the content of each month, if empty, get the id and set its h3 to hiden
     */
    $('.todoList h3').show()
    let emptyCounter = 0
    $('.todoList .content').each(function() {
        if ($(this).html() == '') {
            let emptyClass = $(this).attr('class').split(' ')[1]
            let emptyh3 = '#todo-' + emptyClass
            $(emptyh3).hide()
            emptyCounter += 1
        }
    })
    if (emptyCounter == 12) {
        $('.emptyInfo').show()
      $('.emptyInfo').html('<h4 id="emptyInfo">No event added yet. \n Add a Todo event to see their lists here</h4>')
    } else {
      $('.emptyInfo').hide()
    }

}

/**
 * Adding new category to the list of categories
 * get the list of categories in the list
 * get the list of categories from the localStorage with repeatition removed
 * loop through each categories, check if its not in the list of initial categories
 * add them into the option just befor the last in the DOM
 */
 function addNewEvent () {
    let eventArray = []
    $('option').each(function() {
        eventArray.push($(this).val()) 
    })
    let norepeatTodoListEvent = [...new Set(todoListEvent)]
    $.each(norepeatTodoListEvent, function(index, value) {
    if(!eventArray.includes(value)) {
        $('#categories #others').before('<option value="'+ value +'">' + value +'</option>')
    }
    })
}

function outlineEventDates() {
    $('.date.outline').removeClass('outline')
    getLocalStorageData(currentYearStorage)
    $.each(todoListDate, function(index, value) {
        $('#' + todoListMonths[index] + ' .date').each(function () {
            let tooltipReminder = todoListReminder[index]
            let tooltipEvent = todoListEvent[index]
            if ($(this).html() == value) {
                fullDate = value +' '+ todoListMonths[index].slice(0, 3)+ ', ' + currentYearName + ' 00:00:00'
                dateCountDown(fullDate)
                $(this).addClass('outline')
                if (daysToGo < 0) {
                    $(this).attr("title", tooltipEvent + ' --> ' + tooltipReminder + '\n' + daysToGo * (-1) + ' days ago' )
                }
                else if (daysToGo > 0) {
                    $(this).attr("title", tooltipEvent + ' --> ' + tooltipReminder + '\n' + daysToGo + ' days to go' )
                }
                else {$(this).attr("title", tooltipEvent + ' --> ' + tooltipReminder + '\n It is today' )}
                
                // $(this).attr('content', fullDate)
            }
        })
    })
}
$('.outline').tooltip()
$('.optionTodo').tooltip()

function removeOutline() {
    $('.date.outline').removeClass('outline')
}

function redSundays () {
    $('.date').removeAttr('style')
    $.each(yearArray[currentYearName], function(index, value) {
        value = 16 - value
        $('#'+index+' .dates>div:nth-child(7n+'+value+')').css('color', 'red')
    })
}

function dateCountDown(Pdate) {
    let eventday = new Date(Pdate).getTime()
    let currentDate = new Date().getTime()
    let gap = (eventday - currentDate) / 1000
    daysToGo = Math.floor(gap / 60 / 60 / 24)

}



/*
- create global array viarable of all data needed
- initiate a function to fetch data from localStorage
*/
let id
let pushEventDetail = []
let todoListDate = []
let todoListDay = []
let todoListMonths = []
let todoListEvent = []
let todoListReminder = []
let todoListID = []
let todoListDone = []
let currentYearName = $('#currentYear').html()
let currentYearData = yearArray[currentYearName]
var dateSelector = ''
let fullDate
let daysToGo
let reminderName = $('.reminderName input').val()
let category = $('#categories').val()
let reminderDate = $('.full-date').html()
let currentYearStorage = 'event22'



$('.years').dialog({
    autoOpen: false,
    title: 'select year',
    width: 300
})

// insert the days names and icon
months.forEach(element => {
    $('.dates').append('<div>' + element.slice(0,3) + '</div>')
});
// insert the maximize icon into each month
$('.month-name').each(function () {
    $(this).append('<div class="maximize"><img src="maximize.svg"></div>')
})

addNumberOfDatesToMonth()
monthSpanner(currentYearData)
redSundays()

getLocalStorageData(currentYearStorage)
outlineEventDates()

/*
toggling the maximize and minimize icon when expanded
when the maximize icon is clicked
get its month by getting the id of its parent
change the icon by each clicks
*/
$('.maximize').click(function() {
    let parentElement = $(this).parent().parent()
    parentElement.toggleClass('bigShow')
    if (parentElement.attr('class').length > 5) {
        $(this).html('<img id="minimize" src="minimize.svg">')
    }
    else {
        $(this).html('<img src="maximize.svg">')
    }
})

$('.yearName h1').click(function() {
    $('.years').dialog('open')
})

$('.years li').click(function() {
    currentYearName = $(this).html()
    $('#currentYear').html(currentYearName)
    $('.years').dialog('close')
    getCurrentYearData()
    monthSpanner(currentYearData)
    currentYearStorage = getYearStorage(currentYearName)
    getLocalStorageData(currentYearStorage)
    redSundays()
    highlightUserDate()
    removeOutline()
    outlineEventDates()
    updateReminder()
})

highlightUserDate()

// initiate an accordion from the jQuery UI to show the todo list
$('.todoList').accordion({
    collapsible : true,
    active: false,
    heightStyle: 'content'
})
// initiate a dialog form the jQuery UI to add a todo
$('#days').dialog({
    autoOpen: false,
    title: 'Add a To-Do list',
    width: 600,
    height: 400
})

/*
 - getting the day and month of each date clicked
 - declare variable dateSelector as global viarable
 - get month name from the id of its parent
 - to get the day, get the span length of the first div as an integer add it to the date clicked so to assume all date starts from sunday. for indexing purpose, subtract 1 then take the modulus by number of days which is 7.
 use the value as index to get the date from the month array
 - format the date and insert into the DOM
 - get data from local storage to display custom event previously used by user
 - run the add event function
 - turn on the dialog box
 - make the input for others hidden
 */
$('.date').click(function() {
    dateSelector = $(this)
    let date = $(this).html()
    let intDate = parseInt(date)
    let monthName = $(this).parent().parent().attr("id")
    let monthSpan = parseInt($('#' + monthName + ' .span').css('grid-column').split(' ')[1])
    let dayIndex = (monthSpan + intDate - 1) % 7
    let dayName = months[dayIndex]
    $('.full-date').html(date +', '+ dayName +' '+monthName)
    getLocalStorageData(currentYearStorage)
    addNewEvent()
    $('#days').dialog('open')
    $('.others').hide()
})

// make the input of others appear when others is selected from the list
$('#categories').change(function() {
    if ($(this).val() == 'Others') {
        $('.others').show()
    }
})
/*
- get the value of the others input, add it to the option list and set it as the value of the categories
- get the datas and initiate submitted to false to check if .....
- if all datas are input save them as an array to eventDetail else raise an alert 
    - if no data in localStorage, the else part runs
    - if data are in localStorage, get all the data into an array, push the new event into the array and modify the localStorage
    - set submitted to true
- if submitted, close the dialog box and alert submitted
- highlight the date of the event
 */

$('input:submit').click(function() {
    let newCategory = $('.others input').val()
    if (newCategory) {
        let newCategoryValue = '<option value="'+ newCategory +'">' + newCategory +'</option>'
        $('#categories #others').before(newCategoryValue)
        $('#categories').val(newCategory)
    }
    reminderName = $('.reminderName input').val()
    category = $('#categories').val()
    reminderDate = $('.full-date').html()
    saveToStorage(currentYearStorage)
    updateReminder()
    return false
})

/**
 * reset all variable to empty
 * loop through each array from the localStorage and append each data their array
 */

//  when menu icon is clicked, slide out the menu div
$('.todoIcon').click(function() {
    $('.todoContainer').toggleClass('right50')
    updateReminder()
})
/**
 * get data from local storage
 * first clear the content of the todos
 * loop through the months array, select the corresponding month from the DOM and add the formatted value into the content
 */

$('.outline').click(function() {
    fullDate = $(this).attr('content')
    dateCountDown(fullDate)

})
dateCountDown(fullDate)

$(document).on('click','#delete', function() {
    let parentId = parseInt($(this).parent().parent().attr('id'));
    pushEventDetail = []
    $.each(alltodoList, function(index, value) {   
            if (alltodoList[index].id == parentId) {
                console.log('hehe')
                return;
            }
        pushEventDetail.push(value)

    })
    window.localStorage.setItem(currentYearStorage , JSON.stringify(pushEventDetail))
    updateReminder()
    outlineEventDates()
})
$(document).on('click','#mark', function() {
    let parentId = parseInt($(this).parent().parent().attr('id'));
    $(this).attr('src', ($(this).attr('src') == 'mark_icon.png'? 'unmark_icon.png': 'mark_icon.png'))
    $.each(alltodoList, function(index, value) {
        if (alltodoList[index].id == parentId) {

            value.done = !value.done
        }
    })
    window.localStorage.setItem(currentYearStorage , JSON.stringify(alltodoList))
    updateReminder()
})

