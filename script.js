document.addEventListener("DOMContentLoaded", function () {
    const dataMuseUrl = 'https://api.datamuse.com/words?sp=';
    
    const submitButton = document.querySelector('#submitButton');
    const responseField = document.querySelector('#responseField');

    //Fetch data from Datamuse API and extract as a JSON
    const getSuggestions = async (query) => {
        const endpoint = `${dataMuseUrl}${query}`;
        console.log(endpoint);
        
        try {
            const response = await fetch(endpoint, {cache: 'no-cache'});
            if(response.ok){
                const jsonResponse = await response.json();
                renderWordResponse(jsonResponse);
                console.log(jsonResponse);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Clear responseField and repopulate it with latest Datamuse API call based on user input
    const displaySuggestions = (event) => {
        event.preventDefault();
        const inputs = document.querySelectorAll('input[name="input"]');
        const inputArray = Array.from(inputs);
        const inputChars = inputArray.map(input => input.value);
        const wordQuery = inputChars.join('').toString();

        //write logic to associate chars and colors, and then pass wordQuery (or other variable)
        //into getSuggestions()
        const colors = document.querySelectorAll('select[name="color"]');
        const colorArray = Array.from(colors).map(select => select.value);
        console.log(colorArray);

        const wordObj = inputChars.map((value, index) => ({
            char: value,
            color: colorArray[index]
        }));

        console.log(wordObj);

        //now with Array of chars/colors, create logic for dataMuse query
        let formWordArr = []
        
        for(let i = 0; i < wordObj.length; i++){
            if(wordObj[i].color == 'green'){
                formWordArr.push(wordObj[i].char);
            } else{
                formWordArr.push('?');
            }
        }
            console.log(formWordArr);

        while(responseField.firstChild){
            responseField.removeChild(responseField.firstChild);
        }
        getSuggestions(formWordArr.join(''));
    }


    //Formatting Datamuse JSON to the responseField
    const renderWordResponse = (res) => {
        if(!res){
            console.log(res.status);
            return;
        }
        if(!res.length){
            responseField.innerHTML = "<p>Try again!</p><p>There were no suggestions found!</p>";
            return;
        }
    
        let wordList = [];
        for(let i = 0; i < Math.min(res.length, 10); i++){
            wordList.push(`<li>${res[i].word}</li>`);
        }
        wordList = wordList.join("");
    
        responseField.innerHTML = `<p>Possible Guesses:</p><ol>${wordList}</ol>`;
    }

    submitButton.addEventListener('click', displaySuggestions);
    });

   
    


