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
        generateBoard();
    } catch (error) {
        console.error("Error loading game data:", error);
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

// 3. Create a Draggable Tile
function createTile(word) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.innerText = word;

    // Random initial position
    const x = Math.random() * (workspace.clientWidth - 100);
    const y = Math.random() * (workspace.clientHeight - 40);
    tile.style.left = `${x}px`;
    tile.style.top = `${y}px`;

    // Interaction Events
    tile.addEventListener('mousedown', startDrag);
    tile.addEventListener('click', () => showCitations(word));

    workspace.appendChild(tile);
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

// Initial start
initGame();
