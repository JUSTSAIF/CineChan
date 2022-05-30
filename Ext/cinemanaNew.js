PAGES = [
    {
        "path": /\/home*/,
        "title": "Viewing Home Page",
    },
    {
        "path": /\/new-releases*/,
        "title": "Viewing New Releases Page",
    },
    {
        "path": /\/popular*/,
        "title": "Viewing Popular Page"
    },
    {
        "path": /\/movies*/,
        "title": "Searching for Movies"
    },
    {
        "path": /\/series*/,
        "title": "Searching for Series"
    },
    {
        "path": /\/animations*/,
        "title": "Searching for Anime"
    },
    {
        "path": /\/continue-watching*/,
        "title": "Viewing Continue Watching Page"
    },
    {
        "path": /\/watchlist*/,
        "title": "Viewing Watchlist Page"
    },
    {
        "path": /\/favorites*/,
        "title": "Viewing Favorites Page"
    },
    {
        "path": /\/subscribed*/,
        "title": "Viewing Subscribed Page"
    },
    {
        "path": /\/history*/,
        "title": "Viewing History Page"
    },
    {
        "path": /\/settings*/,
        "title": "Editing Profile"
    },
    {
        "path": /\/faq*/,
        "title": "Viewing FAQ Page"
    },
    {
        "path": /\/search*/,
        "title": "Searching ..."
    },
    {
        "path": /\/video*/,
        "title": "Watching"
    },
]

setInterval(() => {
    const CurPath = window.location.href.split(".com")[1];
    PAGES.forEach(page => {
        if (page.path.test(CurPath) === true) {
            if (page.title !== "Watching") {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:2828/set", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({
                    onlyTitle: true,
                    title: page.title,
                    name: null,
                    epsAndSeason: null
                }));
            } else {
                let Name = null
                let EPS_SEASON = null
                try {
                    EPS_SEASON = document.querySelector("p.ng-star-inserted").innerText.toString().replace(/\s/g, '').replace("|", " , ")
                } catch { }
                try {
                    Name = document.querySelector("h1.title").innerText.toString().replace(/\s/g, '')
                } catch { }
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:2828/set", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({
                    onlyTitle: false,
                    name: Name,
                    epsAndSeason: EPS_SEASON,
                    title: null
                }));
            }
        }
    }
    )
}, 3000);