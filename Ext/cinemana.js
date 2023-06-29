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

// Run A func if the Video Id exists in url
function isUrlVideo(TrueCallback = () => { }, FalseCallback = () => { }) {
    var url = window.location.href;
    var regexParam = /\?lastEpisodeVideoID=(\d+)/;
    var regexId = /https:\/\/cinemana.shabakaty.com\/video\/(\w{2})\/(\d+)/;
    var paramMatch = regexParam.exec(url);
    var idMatch = regexId.exec(url);

    if (paramMatch) {
        var videoId = paramMatch[1];
        TrueCallback(videoId);
        return videoId;
    } else if (idMatch) {
        var videoId = idMatch[2];
        TrueCallback(videoId);
        return videoId;
    }

    FalseCallback(videoId)
    return false;
}

const CreateDownBu = (id) => {
    var button = document.createElement('button');
    button.textContent = 'Download Video';
    button.style.backgroundColor = '#DDDDDD';
    button.style.color = '#474747';
    button.style.position = 'fixed';
    button.style.top = '10%';
    button.style.right = '20px';
    button.style.cursor = 'pointer';
    button.id = "cin-vid-downloader";

    button.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:2828/vidownload", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ id: isUrlVideo() }));
    });

    var targetElement = document.querySelector('body');
    if (targetElement) {
        targetElement.appendChild(button);
    }
}

setInterval(() => {
    isUrlVideo(id => {
        BU = document.getElementById("cin-vid-downloader")
        if (BU !== null) {
            BU.style.display = "block"
            BU.value
        } else {
            CreateDownBu(id)
        }
    }, () => {
        BU = document.getElementById("cin-vid-downloader")
        if (BU !== null) {
            BU.style.display = "none"
        }
    })

    const CurPath = window.location.href.split(".com")[1];
    if (document.visibilityState === 'visible') {
        PAGES.forEach(page => {
            if (page.path.test(CurPath) === true) {
                if (page.title !== "Watching") {
                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://localhost:2828/set", true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify({
                        onlyTitle: true,
                        title: `${page.title}`,
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
                        Name = document.querySelector("h1.title").innerText.toString().replace(/\s/g, ' ')
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
    }
}, 5000);

window.addEventListener('load', isUrlVideo((id) => {
    buEle = document.getElementById("cin-vid-downloader")
    if (buEle !== null) {
        buEle.style.display = "block"
    } else {
        CreateDownBu(id)
    }
}))