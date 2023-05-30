import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { errorHandler } from './helpers.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECS } from './config.js';

console.log('Ready...');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    // 1) update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) load recipe
    await model.loadRecipe(id);

    // 3) render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(`${err}`);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) get search query
    const query = searchView.getQuery();

    if (!query) return;
    resultsView.renderSpinner();

    // 2) loading search list
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe servings in state
  model.updateServings(newServings);
  // render recipe with NEW amounts
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // add/ remove bookmark
  model.state.recipe.bookmarked
    ? model.removeBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);

  // update recipe view with Bookmark state
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarksRender = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlResetForm = function () {
  // reset 'add recipe' form
  addRecipeView.render();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload NEW recipe data
    await model.uploadRecipe(newRecipe);

    // render NEW recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderMessage();

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // update url id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECS * 1000);
  } catch (err) {
    console.error('BOOM!!! ', err);
    recipeView.renderError(err.message);
  }
};

// EVENT HANDLED HERE (INIT) BUT LISTENED IN THE VIEW
// THIS IS CALLED 'THE SUBSCRIBER'
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksRender);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
