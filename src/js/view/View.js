import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // Show the recipe details after getting the inputs as data
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const recipes = this._renderMainMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', recipes);
  }

  // Method to update only the changes made between the currentHTML and newHTML
  update(data) {
    this._data = data;

    const updatedMarkup = this._renderMainMarkup();

    const newDom = document
      .createRange()
      .createContextualFragment(updatedMarkup);
    // console.log(newDom);
    // Converting every NodeElement to HTMLElement and storing it in an Array.
    const changedElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    changedElements.forEach(function (changedEl, i) {
      const currentEl = curElements[i];

      // Update the changed TEXT inside the childNode having only text not elements or anysort
      if (
        !changedEl.isEqualNode(currentEl) &&
        changedEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEl.textContent = changedEl.textContent;
      }

      // Updating the changed ATTRIBUTES
      if (!changedEl.isEqualNode(currentEl)) {
        Array.from(changedEl.attributes).forEach(attr =>
          currentEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  // CLear the element before adding the HTML
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Rendering the buffer
  renderBuffer() {
    const buffer = `<div class="spinner">
                          <svg>
                            <use href="${icons}#icon-loader"></use>
                          </svg>
                    </div>`;

    this._clear();
    // Inserting the buffer
    this._parentElement.insertAdjacentHTML('afterbegin', buffer);
  }

  // Functionality to append error message in the page
  renderError(error = this._errorMessage) {
    const err = `<div class="error">
                    <div>
                      <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                      </svg>
                    </div>
                    <p>${error}</p>
                  </div>`;

    // console.log(err);
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', err);
  }

  // Functionality to append success messages if needed
  renderSuccess(success = this._successMessage) {
    const successEl = `<div class="message">
                      <div>
                        <svg>
                          <use href="${icons}_icon-smile"></use>
                        </svg>
                      </div>
                      <p>${success}</p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', successEl);
  }
}
