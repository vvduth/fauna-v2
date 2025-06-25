export function hexCodeRandom() {
    // Generate a random hex color code
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0')}`;
}