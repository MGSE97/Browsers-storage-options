export interface ITheme {
    id: string;
    name: string;
    icon: string;
}

export const themes : { [key: string]: ITheme } = {
    light: {
        id: 'light',
        name: 'Light',
        icon: '🌞'
    }, 
    dark: {
        id: 'dark',
        name: 'Dark',
        icon: '🌛'
    }
};

export const toggleTheme = (btnId: string | undefined) => {
    if(document.body.classList.contains(themes.dark.id)) {
        // Switch to light theme
        document.body.classList.remove(themes.dark.id);
        document.body.classList.add(themes.light.id)

        updateThemeButton(btnId, themes.light, themes.dark);

        window.localStorage.setItem('theme', themes.light.id)
    }
    else {
        // Switch to dark theme
        document.body.classList.remove(themes.light.id)
        document.body.classList.add(themes.dark.id)
        
        updateThemeButton(btnId, themes.dark, themes.light)
        
        window.localStorage.setItem('theme', themes.dark.id)
    }
}

export const updateThemeButton = (btnId: string | undefined, theme: ITheme, nextTheme: ITheme) => {
    if(!btnId) return
    const btn = document.getElementById(btnId);
    if(!btn) return
    
    btn.innerText = theme.icon
    btn.setAttribute('title', `Switch to ${nextTheme.name} theme`)
}

export const getTheme = () : ITheme => {
   const value = window.localStorage.getItem('theme')
    if(value)
        return themes?.[value] || themes.dark
    return themes.dark
}  