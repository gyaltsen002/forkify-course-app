import View from './View.js';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _nav = document.querySelector('.nav');
  _overlay = document.querySelector('.overlay');
  _recipeForm = document.querySelector('.add-recipe-window');

  _successMessage = 'New recipe addedd successfully!';

  constructor() {
    super();
    this.addRecipeEventHandlerModal();
    this.closeRecipeEventHandlerModal();
  }

  toggleEventClasses() {
    this._overlay.classList.toggle('hidden');
    this._recipeForm.classList.toggle('hidden');
  }

  addRecipeEventHandlerModal() {
    this._nav.addEventListener('click', e => {
      const btn = e.target.closest('.nav__btn--add-recipe');

      if (!btn) return;

      this.toggleEventClasses();
    });
  }

  closeRecipeEventHandlerModal() {
    const btn = document.querySelector('.btn--close-modal');

    const events = [btn, this._overlay];
    if (!btn) return;

    // Toggling on both the btn click and overlay click
    events.forEach(ev => {
      ev.addEventListener('click', this.toggleEventClasses.bind(this));
    });
  }

  uploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // "this" keyword is the parentElement in this case
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  clearingParent() {
    this._clear();
  }
}

export default new addRecipeView();
