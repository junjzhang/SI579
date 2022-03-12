/**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 *
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 *
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */
function groupBy(objects, property) {
  // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
  // value for property (obj[property])
  if (typeof property !== "function") {
    const propName = property;
    property = (obj) => obj[propName];
  }

  const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
  for (const object of objects) {
    const groupName = property(object);
    //Make sure that the group exists
    if (!groupedObjects.has(groupName)) {
      groupedObjects.set(groupName, []);
    }
    groupedObjects.get(groupName).push(object);
  }

  // Create an object with the results. Sort the keys so that they are in a sensible "order"
  const result = {};
  for (const key of Array.from(groupedObjects.keys()).sort()) {
    result[key] = groupedObjects.get(key);
  }
  return result;
}

// Initialize DOM elements that will be used.
const outputDescription = document.querySelector("#output_description");
const wordOutput = document.querySelector("#word_output");
const showRhymesButton = document.querySelector("#show_rhymes");
const showSynonymsButton = document.querySelector("#show_synonyms");
const wordInput = document.querySelector("#word_input");
const savedWords = document.querySelector("#saved_words");

// Stores saved words.
const savedWordsArray = [];

/**
 * Makes a request to Datamuse and updates the page with the
 * results.
 *
 * Use the getDatamuseRhymeUrl()/getDatamuseSimilarToUrl() functions to make
 * calling a given endpoint easier:
 * - RHYME: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
 * - SIMILAR TO: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
 *
 * @param {String} url
 *   The URL being fetched.
 * @param {Function} callback
 *   A function that updates the page.
 */
function datamuseRequest(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then(
      (data) => {
        // This invokes the callback that updates the page.
        callback(data);
      },
      (err) => {
        console.error(err);
      }
    );
}

/**
 * Gets a URL to fetch rhymes from Datamuse
 *
 * @param {string} rel_rhy
 *   The word to be rhymed with.
 *
 * @returns {string}
 *   The Datamuse request URL.
 */
function getDatamuseRhymeUrl(rel_rhy) {
  return `https://api.datamuse.com/words?${new URLSearchParams({
    rel_rhy: wordInput.value,
  }).toString()}`;
}

/**
 * Gets a URL to fetch 'similar to' from Datamuse.
 *
 * @param {string} ml
 *   The word to find similar words for.
 *
 * @returns {string}
 *   The Datamuse request URL.
 */
function getDatamuseSimilarToUrl(ml) {
  return `https://api.datamuse.com/words?${new URLSearchParams({
    ml: wordInput.value,
  }).toString()}`;
}

/**
 * Add a word to the saved words array and update the #saved_words `<span>`.
 *
 * @param {string} word
 *   The word to add.
 */
function addToSavedWords(word) {
  // You'll need to finish this...
  savedWordsArray.push(word);
  savedWords.innerText = savedWordsArray.join(", ");
}

// Add additional functions/callbacks here.
/**
Display the Datamuse “rhymes with” results for the search term (the  URL that needs to be called by fetch() is already provided by the getDatamuseRhymeUrl() function)
Show the header "Words that rhyme with {the word you’re searching}:"
While the results are loading (while we are waiting for data from the DataMuse API), show the text "...loading"
If there are no results, show the text "(no results)" where the results would typically be
Group the results by the number of syllables (you might want to use the groupBy function that we give below in order to do this). The number of syllables should be in an h3, with a separate <ul> for each grouping.
 */

function createSaveButton(word) {
  saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.addEventListener("click", () => addToSavedWords(word));
  saveButton.classList.add("btn", "btn-outline-success", "btn-sm");
  return saveButton;
}

function updateRhymeOutput(data) {
  wordOutput.innerHTML = "";
  if (data.length === 0) {
    wordOutput.innerHTML = "(no results)";
  } else {
    wordGroups = groupBy(data, "numSyllables");
    for (const key of Object.keys(wordGroups)) {
      h3 = document.createElement("h3");
      h3.innerText = `Syllables: ${key}`;
      wordOutput.appendChild(h3);
      wordList = document.createElement("ul");
      for (const word of wordGroups[key]) {
        item = document.createElement("li");
        item.innerText = word.word;
        saveButton = createSaveButton(word.word);
        item.appendChild(saveButton);
        wordList.appendChild(item);
      }
      wordOutput.appendChild(wordList);
    }
  }
}

function updateSynonymOutput(data) {
  wordOutput.innerHTML = "";
  if (data.length === 0) {
    wordOutput.innerHTML = "(no results)";
  } else {
    wordList = document.createElement("ul");
    for (const word of data) {
      item = document.createElement("li");
      item.innerText = word.word;
      saveButton = createSaveButton(word.word);
      item.appendChild(saveButton);
      wordList.appendChild(item);
    }
    wordOutput.appendChild(wordList);
  }
}

function updateTitle(description) {
  outputDescription.innerText = `Words ${description} ${wordInput.value}`;
  wordOutput.innerText = "...loading";
}

// Add event listeners here.
wordInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    updateTitle("that rhyme with");
    datamuseRequest(getDatamuseRhymeUrl(), updateRhymeOutput);
  }
});

showRhymesButton.addEventListener("click", () => {
  updateTitle("that rhyme with");
  datamuseRequest(getDatamuseRhymeUrl(), updateRhymeOutput);
});

showSynonymsButton.addEventListener("click", () => {
  updateTitle("with a meaning similar to");
  datamuseRequest(getDatamuseSimilarToUrl(), updateSynonymOutput);
});

window.addEventListener("load", () => {
  // Add the saved words to the page.
  savedWords.innerText = "(none)";
});
