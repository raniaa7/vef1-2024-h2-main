async function fetchContent(category, type) {
    try {
        const response = await fetch(`data/${category}/${type}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${type} content for ${category}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching content:', error);
        document.getElementById('content').innerHTML = `<p style="color: red;">Error loading ${type} content for ${category}. Please try again later.</p>`;
    }
}

async function displayContent(category, type) {
    const contentDiv = document.getElementById("content");
    const contentTitleDiv = document.getElementById("content-title");

    if (!contentDiv || !contentTitleDiv) {
        console.error("Content or title element not found in the HTML");
        return;
    }

    contentDiv.innerHTML = '<p>Loading...</p>';
    contentTitleDiv.innerHTML = '';

    const data = await fetchContent(category, type);

    if (data) {
        contentDiv.innerHTML = '';
        contentTitleDiv.innerHTML = `<h2>${capitalizeFirstLetter(category)} - ${capitalizeFirstLetter(type)}</h2>`;
        
        if (type === 'keywords') {
            displayKeywords(data, contentDiv);
        } else if (type === 'lectures') {
            displayLectures(data, contentDiv);
        } else if (type === 'questions') {
            displayQuestions(data, contentDiv);
        }
    } else {
        contentDiv.innerHTML = '<p style="color: red;">Failed to load content.</p>';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayLectures(itemData, contentDiv) {
    if (Array.isArray(itemData.lectures)) {
        itemData.lectures.forEach(lecture => {
            const lectureTitle = document.createElement("h3");
            lectureTitle.textContent = lecture.title;
            contentDiv.appendChild(lectureTitle);

            lecture.content.forEach(subContent => {
                if (subContent.type === "text") {
                    const textContent = document.createElement("p");
                    textContent.textContent = subContent.data;
                    contentDiv.appendChild(textContent);
                } else if (subContent.type === "image") {
                    const image = document.createElement("img");
                    image.src = subContent.data;
                    image.alt = subContent.caption;
                    contentDiv.appendChild(image);
                    const caption = document.createElement("p");
                    caption.textContent = subContent.caption;
                    contentDiv.appendChild(caption);
                } else if (subContent.type === "code") {
                    const code = document.createElement("pre");
                    code.textContent = subContent.data;
                    contentDiv.appendChild(code);
                } else if (subContent.type === "quote") {
                    const quote = document.createElement("blockquote");
                    quote.textContent = subContent.data;
                    if (subContent.attribute) {
                        const author = document.createElement("footer");
                        author.textContent = subContent.attribute;
                        quote.appendChild(author);
                    }
                    contentDiv.appendChild(quote);
                }
            });
        });
    } else {
        console.error("Lectures data is not an array:", itemData.lectures);
    }
}

function displayKeywords(itemData, contentDiv) {
    if (Array.isArray(itemData.keywords)) {
        itemData.keywords.forEach(keyword => {
            const keywordTitle = document.createElement("h3");
            keywordTitle.textContent = keyword.title;
            contentDiv.appendChild(keywordTitle);

            if (keyword.english) {
                const english = document.createElement("p");
                english.textContent = `In English: ${keyword.english}`;
                contentDiv.appendChild(english);
            }

            const content = document.createElement("p");
            content.textContent = keyword.content;
            contentDiv.appendChild(content);
        });
    } else {
        console.error("Keywords data is not an array:", itemData.keywords);
    }
}

function displayQuestions(itemData, contentDiv) {
    if (Array.isArray(itemData.questions)) {
        itemData.questions.forEach(question => {
            const questionTitle = document.createElement("h3");
            questionTitle.textContent = question.question;
            contentDiv.appendChild(questionTitle);

            question.answers.forEach(answer => {
                const answerText = document.createElement("p");
                answerText.textContent = answer.answer;
                contentDiv.appendChild(answerText);
            });
        });
    } else {
        console.error("Questions data is not an array:", itemData.questions);
    }
}

document.getElementById('htmlButton').addEventListener('click', () => {
    showSubCategoryButtons('html');
});

document.getElementById('cssButton').addEventListener('click', () => {
    showSubCategoryButtons('css');
});

document.getElementById('jsButton').addEventListener('click', () => {
    showSubCategoryButtons('js');
});

function showSubCategoryButtons(category) {
    const subCategoryButtons = document.getElementById('subCategoryButtons');
    subCategoryButtons.style.display = 'block';

    document.getElementById('keywordsButton').onclick = () => displayContent(category, 'keywords');
    document.getElementById('lecturesButton').onclick = () => displayContent(category, 'lectures');
    document.getElementById('questionsButton').onclick = () => displayContent(category, 'questions');
}
