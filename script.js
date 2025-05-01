document.addEventListener("DOMContentLoaded", function () {
    const dataMuseUrl = 'https://api.datamuse.com/words?sp=';
    
    const submitButton = document.querySelector('#submitButton');
    const responseField = document.querySelector('#responseField');
    let fuzzyChars = [];

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
            } else if(wordObj[i].color == 'yellow'){
                fuzzyChars.push(wordObj[i].char);
                formWordArr.push('?');
            }else { 
                formWordArr.push('?');
            }
        }
            console.log(formWordArr);
            console.log(fuzzyChars);

        while(responseField.firstChild){
            responseField.removeChild(responseField.firstChild);
        }
        getSuggestions(formWordArr.join(''));
    }


    const renderWordResponse = (res) => {
        if(!res){
            console.log(res.status);
            return;
        }
        if(!res.length){
            responseField.innerHTML = "<p>Try again!</p><p>There were no suggestions found!</p>";
            return;
        }
    
        // Filter results to only include words that contain ALL the fuzzy characters
        let filteredResults = res;
        
        if(fuzzyChars.length > 0) {
            filteredResults = res.filter(item => {
                // Check if the word includes all characters in fuzzyChars
                return fuzzyChars.every(char => item.word.includes(char));
            });
            
            console.log("Filtered results:", filteredResults);
            
            // If no words match our fuzzy filters, fall back to the original results
            if(filteredResults.length === 0) {
                console.log("No matches with fuzzy filters, showing all results");
                filteredResults = res;
            }
        }

        let wordList = [];
        for(let i = 0; i < Math.min(filteredResults.length, 10); i++){            
            wordList.push(`<li>${filteredResults[i].word}</li>`);
        }
        wordList = wordList.join("");
    
        responseField.innerHTML = `<p>Possible Guesses:</p><ol>${wordList}</ol>`;
    }

    submitButton.addEventListener('click', displaySuggestions);
});

   
    


