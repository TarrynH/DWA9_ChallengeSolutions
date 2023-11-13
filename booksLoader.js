import { data } from './scripts.js'
import { books, authors, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

/**
 * When the button at the bottom of the page is clicked, it displays the next set of 36 books.
 */
export const showMoreButton = () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
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

        fragment.appendChild(element)
    }

    data.list.items.appendChild(fragment)
    page += 1
}
