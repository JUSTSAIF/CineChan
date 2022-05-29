function GoTo(id, urls = []) {
    document.getElementById(id).addEventListener("click", function () {
        urls.forEach(url => {
            window.open(url, '_blank');
        });
    });
}


GoTo("newcin", ["https\:\/\/cinemana.shabakaty.com"]);
GoTo("oldcin", ["https\:\/\/cinemana2.shabakaty.com"]);
GoTo("aboutus", ["https://home.shabakaty.com/home/about-us"]);
GoTo("contactme", ["https://www.instagram.com/qq_iq", "https://github.com/JUSTSAIF"]);
