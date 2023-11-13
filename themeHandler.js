import { data, dayTheme, nightTheme } from './scripts.js'

/**
 * Changes the theme of the webpage to the user's chosen theme when submit is pressed.
 */
export const submitThemeSettings = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', nightTheme.background);
        document.documentElement.style.setProperty('--color-light', nightTheme.text);
    } else {
        document.documentElement.style.setProperty('--color-dark', dayTheme.text);
        document.documentElement.style.setProperty('--color-light', dayTheme.background);
    }
    
    data.settings.overlay.open = false
}
