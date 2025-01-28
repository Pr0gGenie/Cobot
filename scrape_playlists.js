// import modules
const pup = require('puppeteer');
const fs = require("fs");

async function scrapePlaylist(URL) {
    const browser = await pup.launch({headless:true});
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil:'networkidle2'})

    // Scroll to bottom
    await autoScroll(page)

    // Extract video titles & URLs
    console.log("Extracting Playlist....")
    const videos = await page.evaluate(() => {
        let videoTitles = [];
        let videoLinks = []
        const links = document.querySelectorAll('a');
        for (const link of links) {
            if (link.id === "video-title") {
                let videoUrl = link.href.split('&list=')[0]; // Remove playlist metadata
                videoTitles.push(link.title);
                videoLinks.push(videoUrl)
            }
        }

        // extract playlist title
        const titles = document.querySelector("#page-manager h1 > span");
        let playlist_title = titles.innerText;

        // convert [] to {}
        const videoList = Object.fromEntries(videoTitles.map((key, index) =>
            [key, videoLinks[index]]));

        return [playlist_title.replace(/\s+/g, '-'), videoList]
    });

    await browser.close();
    return videos;
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 400; 
            let timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}

const URL = "" // enter youtube playlist URL here
scrapePlaylist(URL).then((videos) => { // appends values to a json file in folder
    const values = JSON.stringify(videos[1], null, "\t").replaceAll("],\n\t\"", "],\n\n\t\"");
    try {
        fs.writeFileSync(`src/config/${videos[0]}.json`, values);
        console.log("File Created!");
    } catch (error) {
        console.error("Error writing file:", error);
    }
});

// this program scrapes the songs, but it doesn't access the playlist from your discord yet
// Next Step: get public playlist links from user's connected youtube account