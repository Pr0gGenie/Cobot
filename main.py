'''
this file just scrapes a shit ton of playlists off youtube music just in case you feel like you don't have enough queries
it is completely random and general, use the playlist-scrape scripts for specifics

you can add more specific search in the search_queries list, for example, add "lofi playlists" if you want more random lofi playlists
or "hip hop playlists" and so on so forth

you need to have the library ytmusicapi installed, so use 'pip install ytmusicapi' for that

ONLY use this if you are admin and just want to increase the amount of random, general playlists, 
otherwise its lowkey useless and VERY inefficient and stupid
'''

from ytmusicapi import YTMusic
import json
import os
import time

# Initialize YouTube Music API
ytmusic = YTMusic()

# Path to the JSON file
json_file_path = "src/config/presets.json"

# Search queries to maximize album scraping
search_queries = [
    "lofi study playlists", "hip hop best", # New addition for fresher results
]

# Function to load existing JSON data
def load_existing_data():
    if os.path.exists(json_file_path):
        with open(json_file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

# Function to scrape albums from YouTube Music
def scrape_youtube_music_albums():
    print("📀 Scraping YouTube Music for playlists...")
    album_entries = {}

    for query in search_queries:
        print(f"🔍 Searching: {query}")
        try:
            search_results = ytmusic.search(query, filter="playlists", limit=500)
            time.sleep(3)  # Slightly longer sleep to prevent rate-limiting

            for item in search_results:
                if "browseId" in item:
                    title = item["title"]
                    url = f"https://music.youtube.com/browse/{item['browseId']}"
                    album_entries[title] = url

        except Exception as e:
            print(f"❌ Error scraping '{query}': {e}")

    print(f"✅ Scraped {len(album_entries)} albums.")
    return album_entries

# Function to update the JSON file without duplicates
def update_json():
    existing_data = load_existing_data()
    new_data = scrape_youtube_music_albums()

    # Avoid duplicates
    added_count = 0
    for title, url in new_data.items():
        if title not in existing_data:
            existing_data[title] = url
            added_count += 1

    # Save updated JSON
    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    print(f"💾 Added {added_count} new albums. Total in JSON: {len(existing_data)}")

# Run the script
update_json()