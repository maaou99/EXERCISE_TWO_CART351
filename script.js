/*
REFERENCES:
How to Create an HTML Dropdown Menu [+ Examples], https://blog.hubspot.com/website/html-dropdown
"to check if one of the dropdown option in select html tag is clicked js", chatGPT
all images are from adobe stock

*/

window.onload = function () {

    // Get a reference to the select element  
    let selectElement = document.getElementById("meal-choices")

    //if the choice from the dropdown has changes, excecute function selectMeal
    selectElement.addEventListener('change', selectMeal)

    //choosen meal
    let choosenMeal;
    let stepIndex = 0;
    let buttonNext = false

    //listens to when the user click on button to see the next step 

    document.getElementById('next-step').addEventListener("click", () => {
        stepIndex++
        buttonNext = true
        getJSON(getSteps)
       

    })

    getJSON(start)

    function getJSON(func) {
        //recieves a function as an input 
        //sends the json data to the function

        fetch('cooking.json')
            .then(res => res.json())
            .then(data => {
                func(data)

                //console.log(data)

            })
    }


    function start(info) {

        //dropdown menu contains JSON values
        for (let i = 0; i < info.MealsItems.length; i++) {

            //dropdown menu contain meal value in MealsItems object 
            document.getElementById(`option-${i + 1}`).innerHTML = info.MealsItems[i].Meal

        }
        drawGrid(8, 8, info)
    }


    function drawGrid(rows, cols, info) {
        const gridContainer = document.getElementById("grid-container");

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const gridCell = document.createElement("div");

                // Create an image element and set its source
                const image = document.createElement("img");

                //stores a random integer between 0 and 4 
                const imgNum = Math.floor(Math.random() * 4)

                //displays img from JSON object
                image.src = `${info.MealsItems[imgNum].gif_image}`;

                //changes image width
                image.style.width = "60px"

                gridCell.appendChild(image);
                gridContainer.appendChild(gridCell);
            }
        }
    }

    function selectMeal() {
        //from chatGPT

        // Get the selected option
        let selectedOption = selectElement.options[selectElement.selectedIndex];

        // Check which option was selected
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectedOption.value === `option-${i}`) {
                removeHomepage()

                //the meal is given a number
                choosenMeal = i

                //start displaying meal information
                getJSON(toMeal)

            }
        }
    }

    function toMeal(num) {

       // level(num.MealsItems[choosenMeal - 1])
        setLayout()
        


    }

    function setLayout() {
        
        //starts displaying each section in dashboard 

        let mealDashboard = document.getElementById('meal')

        setTimeout(() => {

            mealDashboard.style.display = "block"

               //displays steps
               getJSON(getSteps)
            //displays ingredients as images
            getJSON(getIngredients)

            //displays gif animation
            getJSON(getAnimation)

         

             //displays level and duration
             getJSON(levelDuration)

        }, 4500)

    }


    function getAnimation(data) {

        //place gif image in container and display on meal dashboard

        let animationDiv = document.getElementById("animation")
        //creates img div 
        let img = document.createElement('img')
        //places gif in img
        img.src = data.MealsItems[choosenMeal - 1].gif_image

        img.style.width = 150 + 'px'
        animationDiv.appendChild(img)

    }
 
    function getIngredients(data) {

        //displays ingredients in meal dashboard 

        
        let mealInfo = data.MealsItems[choosenMeal - 1]

        //stores solid ingredients
        let arrIngredients = mealInfo.Ingredients_img
        //stores ingredients for the sauce 
        let arrSauce = mealInfo.Sauce_img

        arrIngredients.forEach(element => {
            //for each element position the element one after the other in a grid

            positionImage(element)

        });

        arrSauce.forEach(element => {

            positionImage(element)

        })


    }



    function positionImage(element) {

        const container = document.getElementById('ingredients');
        const randomImage = document.createElement('img');
        randomImage.src = element; 
        randomImage.setAttribute('title', element)
        container.appendChild(randomImage);

    }

    function levelDuration(info) {
        
        let levelDiv = document.getElementById('level')

        //stores difficulty level
        let levelNum = info.MealsItems[choosenMeal - 1].Difficulty_level

   
        for (let i = 0; i < levelNum; i++) {

            //create a div with class of 'level' and append it into levelDiv
            const span = document.createElement("span")
            levelDiv.appendChild(span);

            //unicode symbol for a star
            span.innerHTML = "&#9733;"
        }

        let durationDiv = document.getElementById('duration')

        //displays the duration in durationDiv tag
        durationDiv.innerHTML = info.MealsItems[choosenMeal - 1].Duration

    }

    function getSteps(data) {

        if (buttonNext || !stepIndex) {
            displayStep(data)
        }
    }

    function displayStep(step) {
        let stepDiv = document.getElementById('steps')
        let steps = Object.values(step.MealsItems[choosenMeal - 1].Recipe)
        //console.log(step.MealsItems[choosenMeal - 1], stepIndex)
        const stepsModified = steps.filter((word) => {

            return word != 'enjoy';
        })

        if(document.getElementById("next-step").textContent === 'homepage'){
            console.log('enter')
             //get grid
        let grid = document.getElementById("grid-container")

        //get dropdown menu
        let dropdownMenu = document.getElementById("dropdown")
        grid.classList.remove("grid-opacity")
        grid.style.opacity = 1
        dropdownMenu.style.display = 'block'

        //the grid has been removed 4.5s after the user has chosen their meal
        grid.style.display = 'grid'

        let mealDashboard = document.getElementById('meal')

        mealDashboard.style.display = 'none'

        removeInfo('steps')
        removeInfo('ingredients')
        removeInfo('animation')
        removeInfo('level')
        removeInfo('duration')
       
        document.getElementById("next-step").innerHTML = "NEXT"
        
         
    
    }




        if (stepsModified.length <= stepIndex) {
            document.getElementById("next-step").innerHTML = 'homepage'
          
            //createHompageButton()
            stepIndex = 0
         
            return
        }

        

        stepDiv.innerHTML = stepsModified[stepIndex]
        buttonNext = false
        


    }

    function removeInfo(id){
        let divElement = document.getElementById(id);
        while (divElement.firstChild) {
           divElement.removeChild(divElement.firstChild);
        }
    }


    function removeHomepage() {
        //removes all elements from homepage

        //get grid
        let grid = document.getElementById("grid-container")

        //get dropdown menu
        let dropdownMenu = document.getElementById("dropdown")

        //the div has not been removed
        let removeDiv = false

        setTimeout(() => {
            //after clicking on the selcted option, it will remove the div
            dropdownMenu.style.display = 'none'
        }, 2000)

        setTimeout(() => {
            //reduces the opacity to 0 as an animation
            grid.classList.add("grid-opacity")

            grid.style.opacity = 0

        }, 2200)


        setTimeout(() => {
            //the div has a opacity of 0 so it now can be removed
            removeDiv = true
            if (removeDiv) {

                //the grid has been removed 4.5s after the user has chosen their meal
                grid.style.display = 'none'
            }
        }, 4500)



    }


}


