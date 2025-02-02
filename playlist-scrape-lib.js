/* This script is the library version of the scraping script where it can be used in another file (use this one for commands)
Example use:
const { scrapePlaylist } = require("./playlist-scrape-lib.js {path to file} ")

-- other code --
scrapePlaylist('playboicarti');
-- other code --

*/

// Import required libraries
const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to scrape playlists from a YouTube channel
async function scrapeYouTubePlaylistsFromChannel(channelHandle) {
    console.log(`Starting to scrape playlists for channel: ${channelHandle}`);
    const channelPlaylistsUrl = `https://www.youtube.com/@${channelHandle}/playlists`;

    // Launch browser and open new page
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log(`Navigating to ${channelPlaylistsUrl}`);
    await page.goto(channelPlaylistsUrl, { waitUntil: 'networkidle2' });
    
    let playlistData = [];
    
    console.log('Starting auto-scroll to load all playlists...');
    await autoScrollPage(page);

    // Extract playlist titles and links
    console.log('Extracting playlist information...');
    playlistData = await page.evaluate(() => {
        let playlistTitles = [];
        let playlistLinks = [];
        let playlistElements = document.querySelectorAll('#items > yt-lockup-view-model');

        // Function to convert watch link to playlist link
        function convertToPlaylistUrl(url) {
            let modifiedUrl = url.replace('watch?', 'playlist?');
            modifiedUrl = modifiedUrl.replace(/\?.*?list=/, '?list=');
            return modifiedUrl;
        }

        while (playlistTitles.length !== playlistElements.length) {
            playlistElements.forEach(element => {
                const titleElement = element.querySelector('div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model-wiz__text-container > h3');
                const linkElement = element.querySelector('div > a');
                
                // Store playlist titles
                if (titleElement && !playlistTitles.includes(titleElement.getAttribute('title'))) {
                    const playlistTitle = titleElement.getAttribute('title');
                    playlistTitles.push(playlistTitle);
                }

                // Store playlist links
                if (linkElement) {
                    const playlistLink = linkElement.getAttribute('href');
                    playlistLinks.push("https://music.youtube.com" + convertToPlaylistUrl(playlistLink));
                }
            });
        }
        return [playlistTitles, playlistLinks];
    });

    console.log('Closing browser...');
    await browser.close();
    
    console.log(`Scraped ${playlistData[0].length} playlists successfully.`);
    return playlistData;
}

// Function to auto-scroll the page
async function autoScrollPage(page) {
    console.log('Auto-scrolling page to load all content...');

    await page.evaluate(() => {
        return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const scrollInterval = setInterval(() => {
                const scrollHeight = document.documentElement.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 1000);
        });
    });

    console.log('Auto-scroll completed.');
}

// Function to update JSON file with scraped playlists
async function scrapePlaylist(channelHandle) {
    const scrapedPlaylists = await scrapeYouTubePlaylistsFromChannel(channelHandle);
    let playlistDictionary = {};

    console.log('Creating playlist dictionary...');
    for (let i = 0; i < scrapedPlaylists[0].length; i++) {
        playlistDictionary[scrapedPlaylists[0][i]] = scrapedPlaylists[1][i];
    }

    console.log('Updating JSON file with new playlist data...');
    try {
        // Read existing JSON file
        const existingJsonData = JSON.parse(fs.readFileSync("src/config/presets.json", 'utf8'));
        console.log('Existing JSON data loaded successfully.');
        
        // Merge new playlists with existing data
        const mergedData = { ...existingJsonData, ...playlistDictionary };
        console.log('New playlist data merged with existing data.');
        
        // Convert merged data to JSON string
        const updatedJsonData = JSON.stringify(mergedData, null, 2);
        
        // Write updated data back to file
        fs.writeFileSync("src/config/presets.json", updatedJsonData);
        console.log('Updated data written to JSON file successfully!');
    } catch (error) {
        console.error('Error occurred while reading/writing JSON file:', error);
    }
}

module.exports = {
    scrapeYouTubePlaylistsFromChannel,
    scrapePlaylist
};
