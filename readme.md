# HowComplete.js

A Jquery plugin to which tells you that how much a user has filled your form or page. 

Assume you have 2 text inputs, one select input and one checkbox on your page
    
    <input type="text" id="input1" />
    <input type="text" id="input2" />
    <select id="select1">
        <option>hello</option>
        <option value="world">world</option>
    </select>
    <input type="checkbox" id="checkbox1" />
    <div class="complete-data"></div>

init plugin on any element of the page. This element can be the one on which you want to operate the result.

    $(".complete-data").howcomplete({
        elements: [{
            element: $("#input1"),
            weight: 0.2
        },
        {
            element: $("#input2"),
            weight: 0.2
        },
        {
            
        }]
    });