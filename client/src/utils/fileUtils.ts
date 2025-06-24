import { type Region } from "../types/region";

export const saveRegionsToFile = (regions: Record<string, Region>): void => {
    const dataStr = JSON.stringify(regions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const loadRegionsFromFile = (file: File): Promise<Record<string, Region>> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const regions = JSON.parse(event.target?.result as string);
                resolve(regions);
            } catch (error) {
                reject(new Error('Failed to parse regions file.'));
            }
        };
        reader.onerror = () => {
            reject(new Error('Failed to read regions file.'));
        };
        reader.readAsText(file);
    });
};