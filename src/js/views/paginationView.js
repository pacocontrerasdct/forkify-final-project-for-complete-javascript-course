import View from './View';
import icons from 'url:../../img/icons.svg'; // parcel@2 way

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // EVENT LISTENED HERE BUT HANDLED IN THE CONTROLLER
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.page;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.searchPage;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are others
    if (currPage === 1 && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--next" data-page="${
          currPage + 1
        }">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev" data-page="${
          currPage - 1
        }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button>`;
    }
    // NOT in Page 1 and there are others
    if (currPage < numPages) {
      return `
        <button class="btn--inline pagination__btn--prev" data-page="${
          currPage - 1
        }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-page="${
          currPage + 1
        }">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;
    }
    // Only one page, no need of buttons
    return '';
  }
}

export default new PaginationView();
