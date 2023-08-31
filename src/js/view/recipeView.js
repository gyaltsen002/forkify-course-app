// Importing the icons and fractional library
import icons from 'url:../../img/icons.svg';
// import { Fraction } from 'fractional';
import fracty from 'fracty';
import View from './View.js';

// The main RecipeView class for reusable code
class RecipeView extends View {
  // Private Global variables
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one.';
  _successMessage = '';

  // Updating the Servings
  handleUpdateServingClick(handler) {
    // Event delegation.
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();

      // Selecting the increase or decrease serving button.
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      // Getting the value of the serving on click using the dataset attribute
      const gotoValue = +btn.dataset.goTo;
      handler(gotoValue);
    });
  }

  // Adding the bookmark
  handleAddBookmark(handler) {
    // Event delegation
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      // Getting the bookmark button
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;
      handler();
    });
  }

  // Looping through the ingredients from the recipe object
  _getIngredients(ingr) {
    return `<li class="recipe__ingredient">
                    <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${
                      ingr.quantity ? fracty(ingr.quantity).toString() : ''
                    }</div>
                    <div class="recipe__description">
                      <span class="recipe__unit">${
                        ingr.unit ? ingr.unit : ''
                      }</span>
                      ${ingr.description}
                    </div>
            </li>`;
  }

  // Function to handle event listener of changing the url and loading the page
  addEventRecipeHandlerRender(render) {
    ['hashchange', 'load'].forEach(function (ev) {
      window.addEventListener(ev, render);
    });
  }

  // Getting the main HTML markup on the ".recipe" container
  _renderMainMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.url}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button data-go-to="${
                this._data.servings - 1
              }" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-go-to="${
                this._data.servings + 1
              }" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            ?.map(ingr => this._getIngredients(ingr))
            .join('')}   
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }
}

export default new RecipeView();
