// Uppgift för moment 5, DT084G. Av Åsa Lindskog, sali1502.

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar

// Starta applikation
window.onload = init();
function init() {
    loadChannels();
    loadWelcomeText();

    //Skriv ut välkomsttext vid start av applikation
    function loadWelcomeText() {
        const welcomeText = document.getElementById("info");

        // Välkomstrubrik
        let newWelcomeHeadingEl = document.createElement("h2");
        let newWelcomeHeadingText = document.createTextNode("Välkommen till tablåer för Sveriges Radio!");
        newWelcomeHeadingEl.appendChild(newWelcomeHeadingText);

        // Välkomsttext
        let newWelcomeParagraphEl = document.createElement("p");
        let newWelcomeParagraphText = document.createTextNode("Denna webb-applikation använder Sveriges Radios öppna API för tablåer och program. Välj kanal till vänster för att visa tablå för denna kanal.");
        newWelcomeParagraphEl.appendChild(newWelcomeParagraphText);

        // Slå ihop
        welcomeText.appendChild(newWelcomeHeadingEl);
        welcomeText.appendChild(newWelcomeParagraphText);
    }
}

// Läs in kanaler från webbtjänst
function loadChannels() {
    const url = "https://api.sr.se/api/v2/channels/?format=json";

    // Anropa webbtjänst
    fetch(url)
        .then(response => response.json())
        .then(data => displayChannels(data.channels))
        .catch(error => console.log(error));
}

// Skapa meny --> skriv ut kanaler till skärmen
function displayChannels(channels) {
    const channelsEl = document.getElementById("mainnavlist");

    // Loopa igenom array och skapa <li>-element med title-attribut
    channels.forEach(channel => {
        let newLiEl = document.createElement("li");
        let newChannelEl = document.createTextNode(channel.name);
        newLiEl.title = channel.tagline;

        // Slå ihop
        newLiEl.appendChild(newChannelEl);

        // Händelsehanterare
        newLiEl.addEventListener("click", function () {
            loadPrograms(channel.id);
        });

        // Skriv ut kanaler till DOM
        channelsEl.appendChild(newLiEl);
    });
}

// Läs in program från webbtjänst med id från kanalmenyn
function loadPrograms(id) {
    const url = "https://api.sr.se/v2/scheduledepisodes?format=json&size=999&channelid=" + id + "";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayPrograms(data.schedule);
        })
        .catch(error => console.log(error));
}

// Skriv ut program till skärmen
function displayPrograms(programs) {
    const programsEl = document.getElementById("info");

    // Radera välkomsttext vid utskrivning av program
    programsEl.innerHTML = "";

    // Finns program att läsa ut?
    if (programs.length > 0) {

        // Radera tidigare program vid nya utskrivna program
        programsEl.innerHTML = "";

        // Loopa igenom array och skriv ut program till DOM
        programs.forEach(program => {

            // Utskriftsformat: <article><h2>Rubrik</h2><h5>Underrubrik</h5><h5>Starttid-Sluttid></h5><p>Beskrivning</p></article>
            let newArticleEl = document.createElement("article");

            // Rubrik
            let newHeadingEl = document.createElement("h2");
            let newHeadingText = document.createTextNode(program.title);
            newHeadingEl.appendChild(newHeadingText);

            // Underrubrik
            let newSubHeadingEl = document.createElement("h5");
            let newSubHeadingText = document.createTextNode(program.subtitle);
            newSubHeadingEl.appendChild(newSubHeadingText);

            // Starttid och sluttid
            let newDivEl = document.createElement("h5");
            let newStartTimeText = document.createTextNode(convertStartTime(program.starttimeutc));
            let newEndTimeText = document.createTextNode(convertEndTime(program.endtimeutc));
            newDivEl.appendChild(newStartTimeText);
            newDivEl.appendChild(newEndTimeText);

            // Beskrivning
            let newParagraphEl = document.createElement("p");
            let newDescriptionText = document.createTextNode(program.description);
            newParagraphEl.appendChild(newDescriptionText);

            // Slå ihop
            newArticleEl.appendChild(newHeadingEl);
            newArticleEl.appendChild(newSubHeadingEl);
            newArticleEl.appendChild(newDivEl);
            newArticleEl.appendChild(newParagraphEl);

            // Hämta aktuell tid för jämförelse med programs sluttid
            let tempCurrentTime = new Date().getTime();

            // Hämta programs sluttid för jämförelse med aktuell tid
            let tempProgramsEndTime = (program.endtimeutc.substring(6, 19));

            // Kontrollera om aktuellt tid är större än programs sluttid
            if (tempCurrentTime > tempProgramsEndTime) {
                programsEl.innerHTML = "";
            }

            // Kontrollera om det finns en underrubrik att skriva ut
            if (program.subtitle === undefined) {
                newSubHeadingEl.innerHTML = "";
            }

            // Skriv ut till DOM
            programsEl.appendChild(newArticleEl);

        });

    } else {
        programsEl.innerHTML = "Inga program sänds just nu...";
    }

    // Ta emot och konvertera programs starttid - returnera som formaterad textsträng
    function convertStartTime(dateStr) {
        let tempTime = new Date(parseInt(dateStr.substr(6)));

        let hours = tempTime.getHours();
        let minutes = tempTime.getMinutes();

        // Lägg till 0 om det behövs
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }

        // Skriv ut i formaterad form
        let formatedTime = hours + ":" + minutes + "-";
        return formatedTime;
    }

    // Ta emot och konvertera programs sluttid - returnera som formaterad textsträng
    function convertEndTime(dateStr) {
        let tempTime = new Date(parseInt(dateStr.substr(6)));

        let hours = tempTime.getHours();
        let minutes = tempTime.getMinutes();

        // Lägg till 0 om det behövs
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }

        // Skriv ut i formaterad form
        let formatedTime = hours + ":" + minutes;
        return formatedTime;
    }
}
