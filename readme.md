# HowComplete.js

A Jquery plugin to which tells you that how much a user has filled your form or page. You might want to tell user that he has filled the page just 35% or you can use the plugin to show user some derived metric like virality score or profile strength.

# Demo

Try <a href="http://www.slideshare.net/upload" title="Demo">Uploading to SlideShare</a> for a demo (Look for discoverability bar after selecting a file)

or try this https://jsfiddle.net/hiteshsharma/w1mzc52o/

# Installation

    bower install howcomplete.js

# Usage

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
            weight: 0.4,
            evaluate: function(data){ //data is {words: 2, value: "x y"}
                var wordCount = data.words.length;
                //divide a weight of 1 as per the data. Contribution to 
                // total weight will be calculated by the plugin
                return (wordCount > 4 ? 4 : wordCount)/4;
            }
        },
        {
            element: $("#input2"),
            weight: 0.4,
            evaluate: function(data){
                return data.words.length;
            }
        },
        {
            element: $("#select1"),
            weight: 0.2, //total weight of all elements should be 1
            evaluate: function(data){
                if(data.value == "hello"){
                    return 1
                }
                retrn 0.5;
            }
        }],
        calculateOn: "keyup change paste",
        evaluateOnInit: true,
        togglePoints: [
            {
                between: [0, 0.25],
                classname: "red"
            },
            {
                between: [0.25, 0.75],
                classname: "blue"
            },
            {
                between: [0.75, 1],
                classname: "green"
        }],
        onchange: function(value){//value is total weight
            alert(value);
        }
    });
