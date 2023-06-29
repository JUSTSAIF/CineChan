const { ipcRenderer } = require('electron');

const downloadBu = document.getElementById('download');
const cancelBu = document.getElementById('cancel');
let VidId = null;

const createOption = (text, value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
}

const Sizeformater = bytes => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0
    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }
    return bytes.toFixed(2) + ' ' + units[unitIndex];
}


ipcRenderer.on('vidownloader-options', (event, data) => {
    const vidEle = document.getElementById('resolution');
    if (!vidEle) return;
    const tranEle = document.getElementById('translation');
    if (!tranEle) return;
    
    const { vid, tran, id, icon, title } = data
    VidId = id;
    document.getElementById("mv-img").src = icon;
    document.getElementById("title").textContent = title;

    vid.forEach(vid => {
        const option = createOption(`${vid.resolution} - ${vid.container}`, `${vid.videoUrl}`);
        vidEle.appendChild(option);
    });

    tran?.forEach(tran => {
        const option = createOption(`${tran.name} - ${tran.extention}`, `${tran.file}`);
        tranEle.appendChild(option);
    });

    if (tran) {
        document.getElementById('tran-option').classList.remove('hide')
        document.getElementById('sb').style.marginBottom = '0px';
    } else {
        document.getElementById('sb').style.marginBottom = '70px';
    }
});

downloadBu.addEventListener('click', () => {
    cancelBu.disabled = false;
    downloadBu.disabled = true;
    const SelectedVid = document.getElementById("resolution")
    const SelectedTran = document.getElementById("translation")
    ipcRenderer.send('download-path-dialog', {
        vid: SelectedVid?.value,
        tran: SelectedTran?.value,
        vidName: SelectedVid?.options[SelectedVid?.selectedIndex]?.textContent,
        tranName: SelectedTran?.options[SelectedTran?.selectedIndex]?.textContent,
        id: VidId
    });
});

cancelBu.addEventListener('click', () => {
    ipcRenderer.send('cancel-download', VidId);
    cancelBu.disabled = true;
    downloadBu.disabled = false;
    var progressBar = document.getElementById('progress-bar-inner')
    progressBar.textContent = "Canceled";
    progressBar.style.width = `100%`;
    progressBar.style.backgroundColor = "#ff4545";
});

ipcRenderer.on('downloadProgress', (event, percentage) => {
    if (cancelBu.disabled == false) {
        var progressBar = document.getElementById('progress-bar-inner')
        progressBar.textContent = '';
        if (percentage >= 100) {
            progressBar.textContent = 'Done';
            cancelBu.disabled = true;
            downloadBu.disabled = false;
        }
        progressBar.style.width = `${percentage}%`;
        progressBar.style.backgroundColor = "#4caf50";
    }
});

ipcRenderer.on('downloadSize', (event, downloadSize) => {
    var i = document.getElementById('size');
    i.textContent = `${Sizeformater(downloadSize)}`;
    i.style.display = "block";
});

ipcRenderer.on('dwn-path-exit', () => {
    cancelBu.disabled = true;
    downloadBu.disabled = false;
});