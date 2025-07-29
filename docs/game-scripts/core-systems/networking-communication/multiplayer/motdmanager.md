---
id: motdmanager
title: MOTD Manager
description: Message of the Day management system for downloading and displaying game announcements
sidebar_position: 1

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# MOTD Manager

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `MotdManager` class handles the Message of the Day system for Don't Starve Together. It downloads, caches, and manages announcements including patch notes, skin previews, Twitch integration content, and general news. The system provides organized content delivery to players through the game's main menu interface.

## Usage Example

```lua
-- Check if MOTD is enabled
if TheMotdManager:IsEnabled() then
    print("MOTD system is active")
end

-- Get current MOTD data
local motd_info, sorted_keys = TheMotdManager:GetMotd()

-- Check for updates
if TheMotdManager:IsNewUpdateAvailable() then
    print("New game update available!")
end

-- Get patch notes
local patch_notes = TheMotdManager:GetPatchNotes()
print("Latest patch:", patch_notes.data.title)
```

## Core Methods

### MotdManager:IsEnabled() {#is-enabled}

**Status:** `stable`

**Description:**
Checks if the MOTD system is enabled for the current platform. Currently only enabled for Steam and Rail platforms.

**Returns:**
- (boolean): True if MOTD is enabled, false otherwise

**Example:**
```lua
if TheMotdManager:IsEnabled() then
    TheMotdManager:Initialize()
end
```

### MotdManager:Initialize() {#initialize}

**Status:** `stable`

**Description:**
Initializes the MOTD system by loading cached data and starting the download process for fresh content.

**Example:**
```lua
TheMotdManager:Initialize()
```

### MotdManager:IsLoadingMotdInfo() {#is-loading-motd-info}

**Status:** `stable`

**Description:**
Checks if the MOTD system is currently downloading or processing content.

**Returns:**
- (boolean): True if loading, false when complete

**Example:**
```lua
if not TheMotdManager:IsLoadingMotdInfo() then
    -- Safe to access MOTD data
    local motd_data = TheMotdManager:GetMotd()
end
```

## Content Management

### MotdManager:GetMotd() {#get-motd}

**Status:** `stable`

**Description:**
Returns the current MOTD information and sorted content keys for display ordering.

**Returns:**
- (table): MOTD information table
- (table): Array of sorted content keys

**Example:**
```lua
local motd_info, sorted_keys = TheMotdManager:GetMotd()
for i, key in ipairs(sorted_keys) do
    local content = motd_info[key]
    print(content.data.title, content.data.category)
end
```

### MotdManager:SetMotdInfo(info, live_build) {#set-motd-info}

**Status:** `stable`

**Description:**
Updates the MOTD information with new content and build version data.

**Parameters:**
- `info` (table): New MOTD information
- `live_build` (number): Current live build number

### MotdManager:GetPatchNotes() {#get-patch-notes}

**Status:** `stable`

**Description:**
Retrieves the most recent patch notes content, prioritizing the first patch notes category item.

**Returns:**
- (table): Patch notes content table with data and metadata

**Example:**
```lua
local patch_notes = TheMotdManager:GetPatchNotes()
if patch_notes then
    print("Latest patch:", patch_notes.data.title)
    print("Description:", patch_notes.data.description)
    if patch_notes.meta.is_new then
        print("This is new content!")
    end
end
```

### MotdManager:IsNewUpdateAvailable() {#is-new-update-available}

**Status:** `stable`

**Description:**
Checks if a newer game version is available compared to the current client version.

**Returns:**
- (boolean): True if an update is available, false otherwise

**Example:**
```lua
if TheMotdManager:IsNewUpdateAvailable() then
    -- Display update notification to player
    print("New game version available!")
end
```

## Download Management

### MotdManager:DownloadMotdInfo(max_retries) {#download-motd-info}

**Status:** `stable`

**Description:**
Downloads fresh MOTD information from the server with retry logic for failed attempts.

**Parameters:**
- `max_retries` (number): Maximum number of download attempts

### MotdManager:LoadCachedMotdInfo() {#load-cached-motd-info}

**Status:** `stable`

**Description:**
Loads previously cached MOTD information from persistent storage to provide offline content.

### MotdManager:Save() {#save}

**Status:** `stable`

**Description:**
Saves current MOTD information to persistent storage for caching.

## Content Interaction

### MotdManager:MarkAsSeen(boxid) {#mark-as-seen}

**Status:** `stable`

**Description:**
Marks a specific MOTD content item as seen by the player, updating its metadata and saving the state.

**Parameters:**
- `boxid` (string): Unique identifier for the content item

**Example:**
```lua
-- Mark patch notes as seen when player views them
TheMotdManager:MarkAsSeen("patch_notes_123")
```

### MotdManager:IsImageLoaded(cell_id) {#is-image-loaded}

**Status:** `stable`

**Description:**
Checks if an image has been downloaded and cached for a specific content cell.

**Parameters:**
- `cell_id` (string): Content cell identifier

**Returns:**
- (boolean): True if image is loaded, false otherwise

**Example:**
```lua
if TheMotdManager:IsImageLoaded("skin_preview_456") then
    -- Display the cached image
end
```

## Event Handling

### MotdManager:SetLoadingDone() {#set-loading-done}

**Status:** `stable`

**Description:**
Marks the MOTD loading process as complete and triggers the global event for UI updates.

### MotdManager:AddOnMotdDownloadedCB(ent, cb_fn) {#add-on-motd-downloaded-cb}

**Status:** `stable`

**Description:**
Registers a callback function to be executed when MOTD downloading is complete.

**Parameters:**
- `ent` (Entity): Entity to listen for the event
- `cb_fn` (function): Callback function to execute

**Example:**
```lua
TheMotdManager:AddOnMotdDownloadedCB(TheGlobalInstance, function(event_data)
    if event_data.success then
        print("MOTD loaded successfully")
        -- Update UI with new content
    else
        print("MOTD loading failed")
    end
end)
```

## Data Processing

### MotdManager:MakeSortedKeys(motd_info) {#make-sorted-keys}

**Status:** `stable`

**Description:**
Processes MOTD information to create a sorted list of content keys based on category priority, group order, and newness.

**Parameters:**
- `motd_info` (table): Raw MOTD information

**Returns:**
- (table): Array of sorted content keys

## Image Management

### MotdManager:LoadCachedImages() {#load-cached-images}

**Status:** `stable`

**Description:**
Loads all cached images for MOTD content that has associated image files.

### MotdManager:GetImagesToDownload() {#get-images-to-download}

**Status:** `stable`

**Description:**
Determines which images need to be downloaded and assigns available image slots to content.

**Returns:**
- (table): Queue of images to download with assigned file slots

## Content Categories

The MOTD system organizes content into categories with specific display priorities:

### Category Order
1. **patchnotes** (Priority 1): Game update announcements and patch notes
2. **skins** (Priority 2): New skin releases and cosmetic content
3. **twitch** (Priority 3): Twitch integration and streaming-related content
4. **news** (Priority 4): General game news and announcements
5. **none** (Priority 100): Uncategorized content

### Content Structure

```lua
content_item = {
    id = "unique_identifier",
    data = {
        title = "Content Title",
        description = "Content description text",
        category = "patchnotes",
        group_order = 1,
        image_url = "https://example.com/image.jpg",
        no_image = false,
        hidden = false
    },
    meta = {
        is_new = true,
        last_seen = 1234567890,
        image_file = "box1"
    }
}
```

## Configuration Constants

### MAX_RETRIES
**Value:** `4`
**Description:** Maximum number of retry attempts for MOTD downloads

### MAX_IMAGE_RETRIES
**Value:** `1`
**Description:** Maximum retry attempts for image downloads

### MAX_IMAGE_FILES
**Value:** `10`
**Description:** Maximum number of cached image files

### CACHE_FILE_NAME
**Value:** `"motd_info"` or `"motd_info_dev"`
**Description:** Persistent storage filename (varies by build type)

## Error Handling

The MOTD system includes comprehensive error handling:

- **Network Failures**: Automatic retry with exponential backoff
- **Parsing Errors**: Graceful fallback to cached content
- **Missing Images**: Content display without images when unavailable
- **Corrupted Cache**: Automatic cache rebuilding on detection

## Platform Integration

### Steam Platform
- Integrates with Steam's content delivery system
- Respects Steam's connectivity status
- Uses Steam's image caching mechanisms

### Rail Platform
- Similar functionality adapted for Rail platform requirements
- Platform-specific content delivery endpoints
- Rail-compatible image management

## Performance Considerations

### Image Optimization
- Limits concurrent image downloads
- Implements image slot management
- Provides progressive loading for better user experience

### Memory Management
- Automatic cleanup of old cached content
- Efficient JSON parsing and storage
- Controlled memory footprint for image data

## Integration

The MOTD Manager integrates with:
- **Main Menu UI**: Content display and interaction
- **Network System**: Content downloading and synchronization
- **Persistent Storage**: Caching and offline functionality
- **Event System**: UI update notifications
- **Platform Services**: Steam/Rail integration

## Related Modules

- [Frontend](./frontend.md): Main menu and UI integration
- [JSON](./json.md): Data parsing and encoding
- [Networking](./networking.md): Content download system
