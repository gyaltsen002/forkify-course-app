import icons from '../../img/icons.svg';

class homeView {
  _searchResults = document.querySelector('.search-results');
  _recipeView = document.querySelector('.recipe');

  _homeBtn = document.querySelector('.header__logo');

  clearHome() {
    this._homeBtn.addEventListener('click', () => {
      const location = window.location.href.split('#');
      window.location.href = location[0];
      this._searchResults.innerHTML = '';
      this._recipeView.innerHTML = `
            <div class="message">
            <div>
                <svg>
                <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>Start by searching for a recipe or an ingredient. Have fun!</p>
            </div>
      `;
    });
  }
}

export default new homeView();
