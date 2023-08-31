// The controller page to controll all the activites throughout the pages to remain funcitonality.
// The page to handle the data between VIEW page and MODEL page to have seamless flow of Data and Implimentation.

import * as model from './model.js';
import { NEW_RECIPE_TIMEOUT_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import bookmarksView from './view/bookmarksView.js';
import paginationView from './view/paginationView.js';
import addRecipeView from './view/addRecipeView.js';
import homeView from './view/homeView.js';

// import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

// The main Application executer/controller
const loadRecipe = async function () {
  try {
    // Getting the hashId from the window on clicking the URL
    const hashId = window.location.hash.slice(1);

    if (!hashId) return;

    // Rendering the buffer
    recipeView.renderBuffer();

    // 0) Update the results view
    resultsView.update(model.getDataPerPage());
    model.state.search.page = 1;

    // 1) Retrieving data from the Forkify API using async and await
    await model.getRecipeData(hashId);
    bookmarksView.update(model.state.bookmarks);
    // const recipe = model.state.recipe;

    if (!model.state.recipe) return;

    //2) Rendering the container on the recipe page
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Catching and logging the final error.
    recipeView.renderError();
  }
};

// Searching for the recipes
const searchRecipe = async function () {
  // Getting the search result
  try {
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderBuffer();

    // Mutating the state search data
    await model.searchRecipeData(query);

    resultsView.render(model.getDataPerPage());

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

// Handling the page buttons to go forward and backward
const paginationBtnHandler = function (gotoPage) {
  // Getting Array of 10 recipes on request
  resultsView.render(model.getDataPerPage(gotoPage));

  paginationView.render(model.state.search);
};

// Handling the view of the ingredients based on the newServings from the Model to the View
const servingViewHandler = function (newServing) {
  model.handleNewServingData(newServing);
  recipeView.update(model.state.recipe);
};

// Handling to either Add or remove the bookmark from model to present in the view
const addBookmarkHandler = function () {
  //Add bookmark
  if (!model.state.recipe.bookmarked) {
    model.handleAddBookmarks(model.state.recipe);
    // Remove bookmark
  } else {
    model.handleRemoveBookmarks(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks upon bookmark list icon hover
  bookmarksView.render(model.state.bookmarks);
};

// Controlling the bookmarks on load
const handleBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Handling the User uploaded recipes
const handleUpload = async function (uploadData) {
  // console.log(uploadData);
  try {
    // Buffer
    addRecipeView.renderBuffer();

    // Uploading the user recipe data
    await model.userUploadRecipe(uploadData);

    // Showing message
    addRecipeView.renderSuccess();

    // Changing the hashId in the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      // Removing the overlay and form
      addRecipeView.toggleEventClasses();

      // Rendering the updated bookmakrs
      bookmarksView.render(model.state.bookmarks);

      // Rendering the new user uploaded data
      recipeView.render(model.state.recipe);
      // console.log(model.state.recipe);
    }, NEW_RECIPE_TIMEOUT_SEC * 1000);
  } catch (err) {
    // console.error(err);
    addRecipeView.renderError(err.message ? err.message : err);
  }
};

// const handleHomeView = function() {
//   homeView.clearHome();
// }

// Intial functionlaity to handle the core functions to communicate between the MODEL and VIEW.
const init = function () {
  bookmarksView.addHandlerRender(handleBookmarks);
  recipeView.addEventRecipeHandlerRender(loadRecipe);
  recipeView.handleUpdateServingClick(servingViewHandler);
  recipeView.handleAddBookmark(addBookmarkHandler);
  searchView.addEventSearchListener(searchRecipe);
  paginationView.addClickHandler(paginationBtnHandler);
  addRecipeView.uploadRecipe(handleUpload);
  homeView.clearHome();
  console.log("Hey, how you doing, I'm you but in the future.");
};

init();
