import previewView from './previewView.js';

class ResultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We could not find recipes for your query. Please try again.';
  _successMessage = '';
}

export default new ResultsView();
