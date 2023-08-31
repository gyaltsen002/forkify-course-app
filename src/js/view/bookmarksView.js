import previewView from './previewView.js';

class BookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet! Please find a good recipe';
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
