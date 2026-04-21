let wordIndex = {};

async function loadGameData() {
    try {
        // Load the JSON you made in Colab
        const response = await fetch('./word_data.json');
        wordIndex = await response.json();
        
        console.log("Game data loaded! Unique words available:", Object.keys(wordIndex).length);
        
        // Now you can safely start the game logic
        startGame();
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

loadGameData();
    .then(response => response.text())
    .then(csvText => processData(csvText));
