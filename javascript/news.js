// e7c492bde8a84dc6a2d4c87fb24f9a40

// const API_KEY = 'e7c492bde8a84dc6a2d4c87fb24f9a40';
// pub_578381fcd1745d025e1784b0fbc67ccc1f2cc
const API_KEY = 'pub_578381fcd1745d025e1784b0fbc67ccc1f2cc';


async function fetchLocation() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=7bd98f4e646df6');
        const data = await response.json();
        const countryCode = data.country.toLowerCase();
        console.log(countryCode)
        document.getElementById("location").innerText = `News for ${data.country}`;
        fetchWeeklyNews(countryCode);
        fetchMonthlyNews(countryCode);  
    } catch (error) {
        console.error('Error fetching location:', error);
        document.getElementById("location").innerText = "Unable to fetch location.";
    }
}

async function fetchWeeklyNews(country) {
    try {
        const response = await fetch(`https://newsdata.io/api/1/news?country=${country}&language=${country}&image=1&size=8&apikey=${API_KEY}`);
        const data = await response.json();
        
        if (Array.isArray(data.results)) {
            displayNews(data.results, "top-news");
            displayScrollImages(data.results, "scroll__content");
        } else {
            console.error("Unexpected data format:", data);
            document.getElementById("top-news").innerText = "No news available for this period.";
        }
    } catch (error) {
        console.error('Error fetching weekly news:', error);
    }
}

async function fetchMonthlyNews(country) {
    try {
        const response = await fetch(`https://newsdata.io/api/1/news?country=${country}&language=${country}&image=1&size=4&prioritydomain=top&apikey=${API_KEY}`);
        const data = await response.json();
        
        if (Array.isArray(data.results)) {
            displayNews(data.results, "monthly-news");
        } else {
            console.error("Unexpected data format:", data);
            document.getElementById("monthly-news").innerText = "No news available for this period.";
        }
    } catch (error) {
        console.error('Error fetching monthly news:', error);
    }
}

function displayNews(articles, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    articles.forEach(article => {
        const articleElem = document.createElement('div');
        articleElem.classList.add('news__article');

        // Title
        const titleElem = document.createElement('h3');
        titleElem.classList.add('news__title');
        titleElem.innerText = article.title;

        // Image
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('news__img-wrapper');
        const imageElem = document.createElement('img');
        imageElem.classList.add('news__image');
        imageElem.src = article.image_url || 'https://via.placeholder.com/150';
        imageElem.alt = 'Article Image';
        imageWrapper.appendChild(imageElem);

        // Content
        const subtitleElem = document.createElement('h3');
        subtitleElem.classList.add('news__subtitle');
        subtitleElem.innerText = article.source_id || 'Source Unknown';

        const descriptionElem = document.createElement('p');
        descriptionElem.classList.add('news__description');
        descriptionElem.innerText = article.description || 'No description available.';

        const websiteButton = document.createElement('a');
        websiteButton.href = article.link;
        websiteButton.target = '_blank';
        websiteButton.classList.add('news__btn');
        websiteButton.innerText = 'Read more';

        // Append content to article container
        articleElem.appendChild(titleElem);
        articleElem.appendChild(imageWrapper);
        articleElem.appendChild(subtitleElem);
        articleElem.appendChild(descriptionElem);
        articleElem.appendChild(websiteButton);

        // Append article to container
        container.appendChild(articleElem);
    });
}

function displayScrollImages(articles, containerClass) {
    const container = document.querySelector(`.${containerClass}`);
    container.innerHTML = ''; // Clear existing content

    articles.forEach((article, index) => {
        if (index >= 4) return; // Limit to 4 images for the scroll section

        const scrollItem = document.createElement('div');
        scrollItem.classList.add('scroll__item', `item${index + 1}`);

        const imageElem = document.createElement('img');
        imageElem.src = article.image_url || 'https://via.placeholder.com/150';
        imageElem.alt = article.title || 'News Image';

        scrollItem.appendChild(imageElem);
        container.appendChild(scrollItem);
    });
}

fetchLocation();
