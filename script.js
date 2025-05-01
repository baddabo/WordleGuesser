document.addEventListener("DOMContentLoaded", function () {
    const dataMuseUrl = 'https://api.datamuse.com/words?';
    const queryParams = 'rel_jja=';
    
    const submitButton = document.querySelector('#submitButton');
    const responseField = document.querySelector('#responseField');

    const getSuggestions = async (query) => {
        const endpoint = `${dataMuseUrl}${queryParams}${query}`;
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

    const displaySuggestions = (event) => {
        event.preventDefault();
        const inputs = document.querySelectorAll('input[name="input"]');
        const inputArray = Array.from(inputs);
        const inputChars = inputArray.map(input => input.value);
        const wordQuery = inputChars.join('').toString();
        
        while(responseField.firstChild){
            responseField.removeChild(responseField.firstChild);
        }
        getSuggestions(wordQuery);
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
    
        let wordList = [];
        for(let i = 0; i < Math.min(res.length, 10); i++){
            wordList.push(`<li>${res[i].word}</li>`);
        }
        wordList = wordList.join("");
    
        responseField.innerHTML = `<p>Possible Guesses:</p><ol>${wordList}</ol>`;
    }

    submitButton.addEventListener('click', displaySuggestions);
    });

   
    


