import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { submitThemeSettings } from './themeHandler.js';
import {searchBooks} from './filterBooks.js'
import {openBookOverlay} from './bookSummary.js'
import {showMoreButton} from './booksLoader.js'

let page = 1;
let matches = books


/**
 * Object that stores html elements to allow for easier readability and so as not to repeatedly query html elements throughout the code.
 * If an element's ID or structure changes, you only need to update it in this object.
 */
export const data = {
    header: {
        search: document.querySelector('[data-header-search]'),
        settings: document.querySelector('[data-header-settings]'),
    },
    list: {
        items: document.querySelector('[data-list-items]'),
        message: document.querySelector('[data-list-message]'),
        button: document.querySelector('[data-list-button]'),
        active: document.querySelector('[data-list-active]'),
        blur: document.querySelector('[data-list-blur]'),
        image: document.querySelector('[data-list-image]'),
        title: document.querySelector('[data-list-title]'),
        subtitle: document.querySelector('[data-list-subtitle]'),
        description: document.querySelector('[data-list-description]'),
        close: document.querySelector('[data-list-close]'),
    },
    search: {
        overlay: document.querySelector('[data-search-overlay]'),
        form: document.querySelector('[data-search-form]'),
        title: document.querySelector('[data-search-title]'),
        genres: document.querySelector('[data-search-genres]'),
        authors: document.querySelector('[data-search-authors]'),
        cancel: document.querySelector('[data-search-cancel]'),
    },
    settings: {
        overlay: document.querySelector('[data-settings-overlay]'),
        form: document.querySelector('[data-settings-form]'),
        theme: document.querySelector('[data-settings-theme]'),
        cancel: document.querySelector('[data-settings-cancel]')
    }
}

class BookPreview extends HTMLElement {
    connectedCallback() {
        this.generatePreview()   
    }

    generatePreview() {
        const starting = document.createDocumentFragment()
            for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)
    
            element.innerHTML = `
                <img
                class="preview__image"
                src="${image}"
                />
                
                <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
                </div>
            `
            starting.appendChild(element)
        }
        data.list.items.appendChild(starting)
    }
}
customElements.define('book-preview', BookPreview)

// const createBookPreview = (function () { // IIFE Immediately Invoked Function Expression
//     return {
//         generatePreview: () => {
//             const starting = document.createDocumentFragment()
//             for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
//             const element = document.createElement('button')
//             element.classList = 'preview'
//             element.setAttribute('data-preview', id)
    
//             element.innerHTML = `
//                 <img
//                 class="preview__image"
//                 src="${image}"
//                 />
                
//                 <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[author]}</div>
//                 </div>
//             `
//             starting.appendChild(element)
//             }

//         data.list.items.appendChild(starting)
//         }
//     }
// })()

// createBookPreview.generatePreview()



const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)


for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

data.search.genres.appendChild(genreHtml)


const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

/**
 * Loops through authors object and creates options for each author then adds it to the author list.
 */
for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

data.search.authors.appendChild(authorsHtml)


/**
 * Object containing the color values of the text and background for the day theme.
 */
export const dayTheme = {
        text: '10, 10, 20',
        background: '255, 255, 255'
    }

/**
 * Object containing the color values of the text and background for the night theme.
 */
export const nightTheme = {
        text: '10, 10, 20', 
        background: '255, 255, 255'
    }


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    data.settings.theme.value = 'night'
    document.documentElement.style.setProperty('--color-dark', nightTheme.background);
    document.documentElement.style.setProperty('--color-light', nightTheme.text);
} else {
    data.settings.theme.value = 'day'
    document.documentElement.style.setProperty('--color-dark', dayTheme.text);
    document.documentElement.style.setProperty('--color-light', dayTheme.background);
}

data.list.button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
data.list.button.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

data.list.button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

/**
 * Closes the search overlay without implementing search criteria.
 */
const cancelSearch = () => {
    data.search.overlay.open = false
}
data.search.cancel.addEventListener('click', cancelSearch)


/**
 * Closes the settings overlay without changing the theme.
 */
const cancelSettings = () => {
    data.settings.overlay.open = false
}
data.settings.cancel.addEventListener('click', cancelSettings)


/**
 * Opens search overlay where you can search for specific book criteria.
 */
const openSearchOverlay = () =>{
    data.search.overlay.open = true 
    data.search.title.focus()
}
data.header.search.addEventListener('click', openSearchOverlay)


/**
 * Opens settings overlay where you can toggle between light and dark themes.
 */
const openSettingsOverlay = () => {
    data.settings.overlay.open = true 
}
data.header.settings.addEventListener('click', openSettingsOverlay)


/**
 * Closes book overlay.
 */
const closeBookOverlay = () => {
    data.list.active.open = false
}
data.list.close.addEventListener('click', closeBookOverlay)



data.settings.form.addEventListener('submit', submitThemeSettings)

data.search.form.addEventListener('submit', searchBooks)

data.list.button.addEventListener('click', showMoreButton)

data.list.items.addEventListener('click', openBookOverlay)