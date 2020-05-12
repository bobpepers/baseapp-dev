export const toggleColorTheme = (value: string) => {
    const rootElement = document.getElementsByTagName('body')[0];
    if (value === 'light') {
        rootElement && rootElement.classList.remove('dark-theme');
        rootElement && rootElement.classList.add('light-theme');
    } else {
        rootElement && rootElement.classList.remove('light-theme');
        rootElement && rootElement.classList.add('dark-theme');
    }
};
