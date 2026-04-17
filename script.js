// Define an array of words to ignore
const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];

// The main dictionary linking words to articles
const wordIndex = {};

// Function to process the raw CSV text
function processData(csvText) {
    Papa.parse(csvText, {
        header: true, // Uses the first row as object keys (authors, article-title, etc.)
        skipEmptyLines: true,
        complete: function(results) {
            const articles = results.data;
            buildIndex(articles);
        }
    });
}

// Function to clean and map words
function buildIndex(articles) {
    articles.forEach(article => {
        const title = article['article-title'];
        const doi = article['doi'];

        // Skip if data is missing
        if (!title) return;

        // 1. Tokenize and Normalize
        // Split by space, convert to lowercase, and remove non-alphabetical characters
        const rawWords = title.toLowerCase().split(/\s+/);

        rawWords.forEach(word => {
            const cleanWord = word.replace(/[^a-z]/g, '');

            // 2. Filter stop words and empty strings
            if (cleanWord.length > 0 && !stopWords.includes(cleanWord)) {
                
                // 3. Basic Stemming (removing trailing 's' for plurals)
                // Note: This is a simplistic approach; advanced stemming requires specialized libraries.
                let rootWord = cleanWord;
                if (rootWord.endsWith('s') && rootWord.length > 3) {
                    rootWord = rootWord.slice(0, -1);
                }

                // 4. Build the Map
                if (!wordIndex[rootWord]) {
                    wordIndex[rootWord] = [];
                }

                // Add the citation to this word's array if it isn't already there
                const citation = { title: title, doi: doi };
                
                // Prevent duplicate citations for the same word in a single title
                const exists = wordIndex[rootWord].find(c => c.doi === citation.doi);
                if (!exists) {
                    wordIndex[rootWord].push(citation);
                }
            }
        });
    });
    
    console.log("Parsing complete. Index ready:", wordIndex);
}

// Example of how to load the local file
fetch('data/citations.csv')
    .then(response => response.text())
    .then(csvText => processData(csvText));
