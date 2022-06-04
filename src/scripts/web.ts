import { renderTests, updateTest } from './renderer';
import { getTheme, themes, toggleTheme, updateThemeButton } from './theme';
import { tests } from './tests';

// Toggle theme on click
document.getElementById('themeBtn')?.addEventListener('click', () => {
    toggleTheme('themeBtn');
});

// Run all tests on load
window.onload = () => {
    document.body.classList.add('loaded');      
    for (const api in tests) {
        if (Object.prototype.hasOwnProperty.call(tests, api)) {
            const testSet = tests[api];

            renderTests('#apis', api, testSet);

            testSet.forEach(test => {
                test.test(test).then(() => {
                    updateTest('#apis', test);
                })
            })
        }
    }
};

const theme = getTheme();
document.body.classList.add(theme.id);
if(theme !== themes.dark)
{
    document.body.classList.remove(themes.dark.id);
    updateThemeButton('themeBtn', theme, themes.light);
}
else
{
    updateThemeButton('themeBtn', theme, themes.dark);
}
