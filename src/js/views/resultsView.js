import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; // parcel@2 way

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMsg = 'No recipes found for your query! Please try it again!';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
