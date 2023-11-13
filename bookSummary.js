import { data } from './scripts.js'
import { books, authors} from './data.js'


/**
 * Shows an overlay of the selected book containing further information of the book including the publishing date and description.
 */
export const openBookOverlay = (event) => { // Schalk prefixes factory functions with "create".
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
            active = result
        }
    }
    
    if (active) {
        data.list.active.open = true
        data.list.blur.src = active.image
        data.list.image.src = active.image
        data.list.title.innerText = active.title
        data.list.subtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        data.list.description.innerText = active.description
    }
}

