PAGES = [
    {
        "path": /\/page\/home\/index\/en\/*/,
        "title": "Home",
    },
    {
        "path": /\/page\/movie\/index\/en\/*/,
        "title": "Searching ...",
    },
    {
        "path": /\/page\/contact\/index\/en\/*/,
        "title": "Contact",
    },
    {
        "path": /\/page\/faq\/index\/en\/*/,
        "title": "FAQ",
    },
    {
        "path": /\/page\/user\/profile\/en\/*/,
        "title": "Profile",
    },
    {
        "path": /\/page\/home\/index\/ar\/*/,
        "title": "الرئيسية",
    },
    {
        "path": /\/page\/movie\/index\/ar\/*/,
        "title": "بحث ...",
    },
    {
        "path": /\/page\/movie\/index\/ar\/1\/*/,
        "title": "بحث في قسم الافلام ...",
    },
    {
        "path": /\/page\/movie\/index\/en\/1\/*/,
        "title": "Searching in Movies ...",
    },
    {
        "path": /\/page\/movie\/index\/ar\/2\/*/,
        "title": "بحث في قسم المسلسلات ...",
    },
    {
        "path": /\/page\/movie\/index\/en\/2\/*/,
        "title": "Searching in Series ...",
    },
    {
        "path": /\/page\/contact\/index\/ar\/*/,
        "title": "اتصل بنا",
    },
    {
        "path": /\/page\/faq\/index\/ar\/*/,
        "title": "الاسئلة المتكررة",
    },
    {
        "path": /\/page\/user\/profile\/ar\/*/,
        "title": "الملف الشخصي",
    },
    {
        "path": /\/page\/user\/history\/en\/3\/*/,
        "title": "Favorites",
    },
    {
        "path": /\/page\/user\/history\/en\/5\/*/,
        "title": "Subscribed",
    },
    {
        "path": /\/page\/user\/history\/en\/2\/*/,
        "title": "Watch Later",
    },
    {
        "path": /\/page\/user\/history\/en\/1\/*/,
        "title": "History",
    },
    {
        "path": /\/page\/user\/history\/ar\/3\/*/,
        "title": "المفضلة",
    },
    {
        "path": /\/page\/user\/history\/ar\/5\/*/,
        "title": "الاشتراكات",
    },
    {
        "path": /\/page\/user\/history\/ar\/2\/*/,
        "title": "المشاهدة لاحقاً",
    },
    {
        "path": /\/page\/user\/history\/ar\/1\/*/,
        "title": "المشاهدات السابقة",
    },
    {
        "path": /\/page\/movie\/watch\/*/,
        "title": "Watching",
    }
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
                    title: page.title
                }));
            } else {
                let Name = null
                let EPS_SEASON = null
                try {
                    EPS_SEASON = document.querySelector(".blog table tbody tr td[align='center'] h5").innerText.toString().replace(/\s/g, '').replace("|", " , ")
                } catch { }
                try {
                    Name = document.querySelector(".blog table tbody tr td[align='center'] h2").innerText.toString().replace("[ With Translation ] Watch Trailer", "")
                } catch { }
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:2828/set", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({
                    onlyTitle: false,
                    name: Name,
                    epsAndSeason: EPS_SEASON
                }));
            }
        }
    }
    )
}, 3000);


