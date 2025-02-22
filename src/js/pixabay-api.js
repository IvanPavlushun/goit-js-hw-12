import axios from "axios";

const API_KEY = "48879708-f080042100b5dbafec10d9d0f";
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query, page = 1) {
    try {
        const params = new URLSearchParams({
            key: API_KEY,
            q: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            per_page: 20,
            page,
        });

        const { data } = await axios.get(`${BASE_URL}?${params}`);

        if (!data.hits.length) {
            throw new Error("No images found for this query.");
        }

        return data;
    } catch (error) {
        console.error("Error fetching images:", error.message);
        return { hits: [], totalHits: 0 };
    }
}