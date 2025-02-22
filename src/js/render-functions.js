export function renderImages(images) {
    return images
        .map((image) =>
            `<a href="${image.largeImageURL}" class="gallery-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
      <div class="info">
        <p class ="info-item">Likes <span class="info-amount">${image.likes}</span></p>
        <p class ="info-item">Views <span class="info-amount">${image.views}</span></p>
        <p class ="info-item">Comments <span class="info-amount">${image.comments}</span></p>
        <p class ="info-item">Downloads <span class="info-amount">${image.downloads}</span></p>
      </div>
    </a>`
        )
        .join("");
}

