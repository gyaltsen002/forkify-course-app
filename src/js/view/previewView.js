import View from './View.js';
import icons from '../../img/icons.svg';

export default class PreviewView extends View {
  _renderMainMarkup() {
    return this._data
      .map(el => {
        return this._markupElement(el);
      })
      .join('');
  }

  _markupElement(result) {
    const id = window.location.hash.slice(1);

    return `
          <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.url}" alt="${result.publisher}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title} ...</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="recipe__user-generated ${
                  result.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
    `;
  }
}
