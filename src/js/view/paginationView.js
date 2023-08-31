import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addClickHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      // const childClosest = e.target
      let btnChild = e.target.closest('.btn--inline');

      if (!btnChild) return;

      const gotoPage = Number(btnChild.dataset.goto);
      handler(gotoPage);
    });
  }

  _renderMainMarkup() {
    const numPages = Math.ceil(
      this._data.recipes.length / this._data.noOfPagesPerClick
    );
    const currentPage = this._data.page;

    // First page and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // Other pages
    if (currentPage < numPages) {
      return `
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return `
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${currentPage - 1}</span>
          </button>
      `;
    }

    // Invalid number pages
    if (currentPage > numPages) {
      return `No pages found.`;
    }

    // Only one page
    return '';
  }
}

export default new PaginationView();
