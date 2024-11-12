// if ('BackgroundFetchManager' in self) {
//     navigator.serviceWorker.ready.then(async (swReg) => {
//         const bgFetch = await swReg.backgroundFetch.fetch('my-fetch', ['/ep-5.mp3', 'ep-5-artwork.jpg'], {
//             title: 'Episode 5: Interesting things.',
//             icons: [{
//                 sizes: '300x300',
//                 src: '/ep-5-icon.png',
//                 type: 'image/png',
//             }],
//             downloadTotal: 60 * 1024 * 1024,
//         });
//     });
// }


const loadNotes = async () => {
    const resp = await fetch("https://rateeb.dasfmi.com/api/notes");
    const { data } = await resp.json();
    return data;
}

setInterval(async () => {
    const notes = await loadNotes()
    localStorage.setItem("notes", JSON.stringify({
        createdAt: new Date().getTime(),
        notes: notes
    }))
}, 10 * 60 * 1000);