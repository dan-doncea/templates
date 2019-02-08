let state = {
    articles: [],
    articleDetails: {
        title: null,
        content: null
    },
    isUserSubscribed: false
};

// INIT AND SUPPORT STUFF

const getFetchObject = (url) => {
    const fetchUrl = 'http://192.168.100.2:8080/' + url;
    return fetch(fetchUrl, {
        method : 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    });
}

const fetchObject = (url, method, body) => {
    const fetchUrl = 'http://192.168.100.2:8080/' + url;
    return fetch(fetchUrl, {
        method : method,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const findObjectInArrayById = (id, array) => {
    return array.find(object => object.id === id);
}

// INIT ARTICLES

getFetchObject("articles").then(response => {
    return response.json();
}).then(data => {
    let {articles} = state;
    articles = data.map(article => {
        return {
            id: uuidv4(),
            ...article
        }
    });
    populateArticles(articles);
});

populateArticles = (articles) => {
    articles.forEach(article => {
        let articleContent = document.createRange().createContextualFragment(
            '<div class="col-md-4 mb-5">' +
            '<div class="card h-100">' +
                '<div class="card-body custom-card-body">' + 
                '<img class="action-edit-icon" src="./assets/images/edit.png"/>' +
                '<img class="action-delete-icon" src="./assets/images/delete.png"/>' +
                '<h2 class="custom-card-title card-title">'+ article.title +'</h2>' +
                '<p class="card-text">'+ article.content +'</p>' +
            '</div>' + 
            '<div class="card-footer">' +
                '<a href="#" id="'+ article.id +'" name="see-more" class="btn btn-primary btn-sm">More Info</a>' +
            '</div>' +
            '</div>' +
            '</div>');

            document.getElementById('card-list').appendChild(articleContent);
            document.getElementById(article.id).addEventListener("click", () => {
                const {title, content} = findObjectInArrayById(article.id, articles);
                document.getElementById('selected-artice-title').textContent = title;
                document.getElementById('selected-artice-content').textContent = content;
            });
        })
}

// INIT USER
getFetchObject("user").then(response => {
    return response.json();
}).then(({subscribed}) => {
    state.isUserSubscribed = subscribed;
    if(subscribed) {
        createWebSocketForArticle();
    }
});

// CREATE WS FOR ARTICLE
createWebSocketForArticle = () => {
    new WebSocket('ws://192.168.100.2:8080/ws/articles')
        .addEventListener('message', (event) => {
            let article = event.data;
            article.id = uuidv4();
            state.articles.push(JSON.parse(article));
            document.getElementById("card-list").innerHTML = "";
            populateArticles(state.articles);
        });
}


// ADD ARTICLE

document.querySelector("#new-article-title").oninput = (event) => {
    state.articleDetails.title = event.target.value;
};

document.querySelector("#new-article-content").oninput = (event) => {
    state.articleDetails.content = event.target.value;
};

document.getElementById('submit-article').onclick = () => {
    fetchObject('article', 'POST', state.articleDetails).then(response => {
        if(response.status === 200 || response.status === 201) {
            document.getElementById('article-status').textContent = 'Article was added successfully.';
            document.getElementById('article-status').style.color = 'green';
        } else {
            document.getElementById('article-status').textContent = 'Article could not be added.';
            document.getElementById('article-status').style.color = 'red';
        }
    });
};