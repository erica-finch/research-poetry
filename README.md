# Research Poetry Game

An interactive browser game that turns research citations into magnetic poetry. Users can drag research-themed words to create poems and click on tiles to explore the original published papers.

## How to Use This Template
This repository is designed as a tool for libraries, research offices, and others to showcase the research of their faculty.

### 1. Set Up Your Game
1. **Fork this Repository**: Click the **Fork** button at the top right to create your own copy.
2. **Enable GitHub Pages**:
   - Go to **Settings** > **Pages**.
   - Under **Branch**, select `main` and `/ (root)`.
   - Click **Save**. 
   - Your site will be live at `https://<your-username>.github.io/research-poetry/` in a few minutes.

### 2. Customize the Research Words
You can replace the default words with your own institution's data using the Python tool.

**Step A: Generate your Data**
Use our python script to convert your citation spreadsheet into the required game format. Clicking the Google Colab link will open the script in Colab and let you run it.
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/erica-finch/research-poetry/blob/main/tools/data_generator.ipynb)

1. Upload a CSV of your publications (must include columns for `title` and `doi`).
2. Run the script cells in order.
3. It will automatically download a file named `word_data.json`.

**Step B: Update the Game**
1. In your GitHub repository, go to the `data` folder.
2. Click **Add file** > **Upload files**.
3. Upload your new `word_data.json`.
4. Click **Commit changes**.

---

## Project Structure
* `index.html` - The main interface and layout.
* `style.css` - Custom styling, including the "NOSM U" blue palette and mobile responsiveness.
* `script.js` - Interactive logic for dragging, sharing, and citation retrieval.
* `data/word_data.json` - The database of words and their associated research links.
* `tools/data_generator.ipynb` - The Python script for processing new data.
* `bibliography.html` - A static list of all citations included in the game.

## Mobile Functionality
This game is intended for desktop or tablet. It doesn't scale well to mobile screens.

## Credits
Built by [Erica Finch](https://github.com/erica-finch) using Google Gemini.
Powered by NOSM U faculty research.

Feel free to use and adapt this template for your own institution.
