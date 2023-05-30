import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; // parcel@2 way

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMsg = 'No bookmarks yet! Find a nice recipe and bookmark it!';
  message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
