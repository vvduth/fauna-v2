import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL 
export const getRandomAnimalCard = async () => {
    console.log('Fetching random animal card from:', `${BASE_URL}/random/card`);
    try {
        const response = await axios.get(`${BASE_URL}/random/card`);
        
        return response.data.data;
    } catch (error) {
        console.error('Error fetching random animal card:', error);
        throw error;
    }
}