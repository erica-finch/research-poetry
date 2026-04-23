// Configuration and State
let wordIndex = {};
const fillerWords = ['the', 'the', 'is', 'is', 'and', 'and', 'of', 'in', 'to', 'with', 'a', 'on', 'for', 'at', 'by', 'from', 'it', 'was', 'ing', 's'];
const workspace = document.getElementById('workspace');
const citationList = document.getElementById('citation-list');
const placeholder = document.querySelector('.placeholder');

// 1. Load the Pre-processed JSON
async function initGame() {
    try {
        const response = await fetch('./data/word_data.json');
        wordIndex = await response.json();

        // Check URL for shared data
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('poem');

        if (sharedData) {
            loadSharedPoem(sharedData);
        } else {
            generateBoard();
        }
    } catch (error) {
        console.error("Error initializing game:", error);
    }
}

function loadSharedPoem(encodedData) {
    try {
        const boardState = JSON.parse(atob(encodedData));
        workspace.innerHTML = ''; 
        
        boardState.forEach(data => {
            // Destructure the array: first item is word, second is x, third is y
            const [word, x, y] = data; 
            
            const tile = createTile(word);
            tile.style.left = `${x}px`;
            tile.style.top = `${y}px`;
        });
    } catch (e) {
        console.error("Invalid share link. Loading random board.", e);
        generateBoard();
    }
}
// 2. Select Words and Create Tiles
function generateBoard() {
    workspace.innerHTML = ''; // Clear current board
    
    // Get a random sample of research words
    const researchKeys = Object.keys(wordIndex);
    const selectedResearch = researchKeys.sort(() => 0.5 - Math.random()).slice(0, 25);
    
    // Combine with fillers
    const allSessionWords = [...selectedResearch, ...fillerWords];

    allSessionWords.forEach(word => {
        createTile(word);
    });
}

function createTile(word) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.innerText = word;

    // Default random position (will be overridden if loading a shared poem)
    const x = Math.random() * (workspace.clientWidth - 100);
    const y = Math.random() * (workspace.clientHeight - 40);
    tile.style.left = `${x}px`;
    tile.style.top = `${y}px`;

    tile.addEventListener('mousedown', startDrag);
    tile.addEventListener('touchstart', startDrag, { passive: false });
    tile.addEventListener('click', () => showCitations(word));

    workspace.appendChild(tile);
    return tile; // CRITICAL: This allows other functions to manipulate the tile
}

// 4. Drag Logic
function startDrag(e) {
    const tile = e.target;
    let shiftX = e.clientX - tile.getBoundingClientRect().left;
    let shiftY = e.clientY - tile.getBoundingClientRect().top;

    tile.style.zIndex = 1000; // Move to front

    function moveAt(pageX, pageY) {
        let newX = pageX - workspace.getBoundingClientRect().left - shiftX;
        let newY = pageY - workspace.getBoundingClientRect().top - shiftY;
        
        tile.style.left = `${newX}px`;
        tile.style.top = `${newY}px`;
    }

    function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        tile.onmouseup = null;
    };
}

// 5. Citation Logic
function showCitations(word) {
    // Basic normalization to find the root key in JSON
    const root = word.toLowerCase();
    const citations = wordIndex[root] || [];

    if (placeholder) placeholder.style.display = 'none';
    citationList.innerHTML = '';

    if (citations.length === 0) {
        citationList.innerHTML = '<li>No specific research link for this filler word.</li>';
        return;
    }

    citations.forEach(art => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${art.doi}" target="_blank">${art.title}</a>`;
        citationList.appendChild(li);
    });
}

// Event Listeners for Buttons
document.getElementById('refresh-btn').addEventListener('click', generateBoard);
document.getElementById('share-btn').addEventListener('click', () => {
    const tiles = document.querySelectorAll('.tile');
    const boardState = [];

    tiles.forEach(tile => {
        // Store as [word, x, y] to save character space
        boardState.push([
            tile.innerText, 
            parseInt(tile.style.left), 
            parseInt(tile.style.top)
        ]);
    });

    // Convert the array to a string and encode
    const serialized = btoa(JSON.stringify(boardState));
    const shareUrl = `${window.location.origin}${window.location.pathname}?poem=${serialized}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        const shareBtn = document.getElementById('share-btn');
        const originalText = shareBtn.innerText;
        shareBtn.innerText = "Link Copied!";
        setTimeout(() => { shareBtn.innerText = originalText; }, 2000);
    });
});

// Initial start
initGame();
