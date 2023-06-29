function GoTo(id, urls = []) {
    document.getElementById(id).addEventListener("click", function () {
        urls.forEach(url => {
            window.open(url, '_blank');
        });
    });
}

GoTo("cin", ["https://cinemana.shabakaty.com"]);
GoTo("aboutus", ["https://home.shabakaty.com/home/about-us"]);
GoTo("contactme", ["https://www.instagram.com/qq_iq", "https://github.com/JUSTSAIF"]);
GoTo("dwonload-tool", ["https://drive.google.com/file/d/1cPNUpg-hjkIh49a_cpE5ksWLlzEoT0kT/view?usp=drive_link"]);