import { fetchImages } from "./js/pixabay-api";
import { renderImages } from "./js/render-functions";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

const lightbox = new SimpleLightbox(".gallery a");

let page = 1;
let query = "";

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    query = event.target.elements.searchQuery.value.trim();


    if (!query) {
        iziToast.warning({
            title: "Warning",
            message: "Please enter a search term!",
            position: "topRight",
        });
        return;
    }

    page = 1;
    loader.style.display = "block";
    gallery.innerHTML = "";
    loadMoreBtn.style.display = "none";

    try {
        const imagesData = await fetchImages(query, page);

        loader.style.display = "none";

        if (imagesData.hits.length === 0) {
            iziToast.error({
                title: "Error",
                message: "Sorry, there are no images matching your search query!",
                position: "topRight",
            });
            return;
        }

        gallery.innerHTML = renderImages(imagesData.hits);
        lightbox.refresh();

        if (imagesData.totalHits > 20) {
            loadMoreBtn.style.display = "block";
        }

        scrollPage();
    } catch (error) {
        loader.style.display = "none";
        iziToast.error({
            title: "Error",
            message: "An error occurred while fetching images!",
            position: "topRight",
        });
    }
});

loadMoreBtn.addEventListener("click", async () => {
    page += 1;
    loader.style.display = "block";
    loadMoreBtn.disabled = true;

    try {
        const imagesData = await fetchImages(query, page);

        loader.style.display = "none";
        loadMoreBtn.disabled = false;

        if (imagesData.hits.length === 0) {
            iziToast.error({
                title: "Error",
                message: "No more images available.",
                position: "topRight",
            });
            loadMoreBtn.style.display = "none";
            return;
        }

        gallery.insertAdjacentHTML('beforeend', renderImages(imagesData.hits)); // Додаємо нові зображення
        lightbox.refresh();

        if (imagesData.hits.length < 20) {
            loadMoreBtn.style.display = "none";
            iziToast.info({
                title: "End of results",
                message: "You've reached the end of the search results.",
                position: "topRight",
            });
        }

        scrollPage();
    } catch (error) {
        loader.style.display = "none";
        loadMoreBtn.disabled = false;
        iziToast.error({
            title: "Error",
            message: "An error occurred while fetching more images!",
            position: "topRight",
        });
    }
});

function scrollPage() {
    const galleryItem = gallery.querySelector(".gallery-item");
    if (galleryItem) {
        const { height } = galleryItem.getBoundingClientRect();
        window.scrollBy({
            top: height * 3,
            behavior: "smooth",
        });
    }
}

