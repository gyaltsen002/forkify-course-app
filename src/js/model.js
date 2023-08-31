// Import the Global Url, helper functions
import { API_URL, PAGES_PER_CLICK, KEY } from './config.js';
// import { getAPI, sendAPI } from './helpers.js';
import { AJAX } from './helpers.js';

// Copying the recipe to form our own data
export const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    page: 1,
    noOfPagesPerClick: PAGES_PER_CLICK,
  },
  bookmarks: [],
};

const convertDataObject = function (data) {
  const resRecipe = data.recipe;

  // Storing and mutating the data without changing the original data to avoid errors
  return {
    title: resRecipe.title,
    url: resRecipe.image_url,
    publisher: resRecipe.publisher,
    sourceUrl: resRecipe.source_url,
    id: resRecipe.id,
    cookingTime: resRecipe.cooking_time,
    ingredients: resRecipe.ingredients,
    servings: resRecipe.servings,
    ...(resRecipe.key && { key: resRecipe.key }),
  };
};

export const getRecipeData = async function (id) {
  try {
    // 1) Retrieve data from helper js and config js of getAPI and API_URL
    const { data } = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // const { data } = await res.json();

    // if (!(await getAPI(`${API_URL}/${id}`).status)) throw new Error(``);
    state.recipe = convertDataObject(data);

    // Checking the state recipe to see if its bookmarked or not for it to be loaded in the page
    if (state.bookmarks.some(bookEl => state.recipe.id === bookEl.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    // Throwing the error to next handler
    throw err;
  }
};

export const searchRecipeData = async function (query) {
  try {
    // Setting the search query
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Mutating the state recipe search object to get the search results
    state.search.recipes = data.recipes.map(rec => {
      return {
        id: rec.id,
        url: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;

    // console.log(state.search.recipes);
    if (state.search.recipes.length <= 0) throw new Error('No data.');
  } catch (err) {
    throw err;
  }
};

export const getDataPerPage = function (page = state.search.page) {
  // console.log(page);
  state.search.page = page;
  const start = (page - 1) * state.search.noOfPagesPerClick; // Gets 0
  const end = page * state.search.noOfPagesPerClick; // Gets 10

  // state.search.page = 1;
  return state.search.recipes.slice(start, end);
};

// Updating the ingredients/quantity based on the serving user clicks.
export const handleNewServingData = function (newServing) {
  // Formula: serving = (serving * newServing) / state.recipe.servings
  if (newServing < 1) return;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity ? (ing.quantity = ing.quantity) : (ing.quantity = 1);

    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });

  state.recipe.servings = newServing;
};

// Setting the bookmark items on local storage
const storeLocalBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Adding the recipe we recieve from controller to be bookmark.
export const handleAddBookmarks = function (recipe) {
  if (!state.bookmarks) return;

  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeLocalBookmark();
};

// Removing the bookmark from the Array based on the id
export const handleRemoveBookmarks = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  storeLocalBookmark();
};

// Getting the user input/upload recipes
export const userUploadRecipe = async function (newUploadRecipe) {
  try {
    const uploadArr = Object.entries(newUploadRecipe)
      .filter(elem => {
        if (elem[0].startsWith('ingredient') && elem[1] !== '') return elem;
      })
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong inputs on ingredients! Please try the correct format.'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: newUploadRecipe.cookingTime,
      image_url: newUploadRecipe.image,
      publisher: newUploadRecipe.publisher,
      servings: newUploadRecipe.servings,
      source_url: newUploadRecipe.sourceUrl,
      title: newUploadRecipe.title,
      ingredients: uploadArr,
    };

    const { data } = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = convertDataObject(data);
    handleAddBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

// localStorage.clear();

const init = function () {
  const bookmarksLocalStorage = localStorage.getItem('bookmarks');

  if (bookmarksLocalStorage) {
    state.bookmarks = JSON.parse(bookmarksLocalStorage);
  }
};
init();

// localStorage.clear();
