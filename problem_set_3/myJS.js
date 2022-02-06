/*
* Excercise 1
*
*/
var click_count = 0;
document.querySelector('#color-block').addEventListener('click', changeColor);

/*
* Then write a function that changes the text and the color inside the div
*
*/
function changeColor() {
    //Write a condition determine what color it should be changed to
    click_count++;
    if (click_count % 2 == 1) {
        color_block = document.querySelector('#color-block');
        color_name = document.querySelector('#color-name');
        //change the background color using JS
        color_block.style.backgroundColor = '#ff00ff';
        //Change the text of the color using the span id color-name
        color_name.textContent = '#FF00FF';
    }
    else {
        //change the background color using JS
        color_block.style.backgroundColor = '#f08080';
        //Change the text of the color using the span id color-name
        color_name.textContent = '#F08080';
    }
}


/*
* For excercise 2, you need to write an event handler for the button id "convertsn"
* on mouse click. For best practice use addEventListener.
*
*/
document.querySelector('#convertbtn').addEventListener('click', convertTemp);

/*
* Then write a function that calculates Fahrenheit to Celsius and display it on the webpage
*
*/

function convertTemp() {
    //Calculate the temperature here
    ori_temp = document.querySelector('#f-input').value;
    temp = (ori_temp - 32) * 5 / 9;
    //Send the calculated temperature to HTML
    document.querySelector('#c-output').textContent = temp.toString();
}


