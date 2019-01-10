/*
    Final Project 
    Michelle Monteith
    CSC 337 Fall 2018
    
    Client side code for Canine Quest. Processes all input
    before sending it to the server. Also handles the screenshot
    slideshow.
*/
"use strict";

(function() {	

    let slideIndex;

	window.onload = function() {
        document.getElementById("left-arrow").onclick = plusDivs;
        document.getElementById("right-arrow").onclick = plusDivs;
        document.getElementById("submit").onclick = processNewReview;

        slideIndex = 1;
        showDivs(slideIndex);
        getReviews();
	};

    /**
        When the submit button is clicked, all input boxes are validated.
        Requirements:
            Name is letters only, no numbers or punctuation.
            Rating is a number 1-5.
            Review text has no profanity.
    */
    function processNewReview(){
        let name = document.getElementById("name").value;
        let rate = parseInt(document.getElementById("rating").value);
        let text = document.getElementById("reviewtext").value;

        // Validation
        let error = "";
        if(!/^[a-zA-Z]+$/.test(name)){
            error += "Invalid name\n";
        }if(rate > 5 || rate < 1){
            error += "Rating must be between 1-5 (inclusive)\n";
        }

        // Check if the review passed all validation.
        // Alert with success and POST to server if valid, otherwise alert with error.
        if(error != ""){
            alert("ERROR: Couldn't process review: \n" + error);
        }else{
            postReview(name, rate, text);
            clearInputs();
            setTimeout(getReviews, 100);
        }
    }

    /**
        POST review to the server.
    */
    function postReview(name, rate, text){
        const message = {name: name, rate: rate, review: text};
        const fetchOptions = {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(message)
        };

        let url = "http://localhost:3000/";
        fetch(url, fetchOptions)
            .then(checkStatus)
            .then(function(responseText) {
                // Final validation check done on server.
                if(responseText == "Profanity Check Failure"){
                    alert("ERROR: Review contains profanity. \
                        Please remove bad language and try again.");
                }if(responseText == "Success"){
                    alert("Thank you for your review! :)");
                }
            })
            .catch(function(error) {
                console.log(error);
        });
    }

    /**
        GET reviews from the server.
    */
    function getReviews(){
        let url = "http://localhost:3000/";
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                setReviews(JSON.parse(responseText).reviews);
            })
        .catch(function(error) {
            console.log(error);
        });
    }

    /**
        Sets up the reviews section.
    */
    function setReviews(data){
        let reviews = document.getElementById("reviewsec");
        reviews.innerHTML = "";

        console.log(data);
        for(let i = 0; i < data.length; i++){ 
            let entry = document.createElement("div");
            entry.classList.add("review");

            let text = document.createElement("p");
            text.innerHTML = data[i]["review"];
            text.classList.add("reviewtext");

            let tag = document.createElement("p");
            let nam = document.createElement("span");
            nam.innerHTML = data[i]["name"];
            tag.innerHTML = "- ";
            tag.appendChild(nam);
            tag.innerHTML += ", " + data[i]["rate"]+"/5";

            entry.appendChild(text);
            entry.appendChild(tag);

            reviews.appendChild(entry);
        }
    }


    /**
        Clears review input fields
    */
    function clearInputs(){
        document.getElementById("name").value = "";
        document.getElementById("rating").value = "";
        document.getElementById("reviewtext").value = "";
    }

    /**
        Screenshot slideshow controls
        Code from W3Schools
    */
    function plusDivs() {
        let n;
        if(this.id == "left-arrow"){
            n = -1;
        }else{
            n = 1;
        }
        showDivs(slideIndex += n);
    }

    /**
        Moves the screenshots images into display
        Code from W3Schools
    */
    function showDivs(n) {
        let images = document.getElementsByClassName("ss");

        if (n > images.length) {
            slideIndex = 1;
        }if (n < 1) {
            slideIndex = images.length;
        }

        for (let i = 0; i < images.length; i++) {
            images[i].style.display = "none";  
        }
        images[slideIndex-1].style.display = "block";  
    }

    /**
        Returns the response text if the status is in the 200s
        otherwise rejects the promise with a message including the status
    */
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else if (response.status == 404) {
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(new Error("Sorry, we couldn't find that page")); 
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
})();
