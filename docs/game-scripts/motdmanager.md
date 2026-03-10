---
id: motdmanager
title: Motdmanager
description: Manages downloading, caching, and displaying MOTD (Message of the Day) data—including patch notes, skins, news, and Twitch content—for the DST client.
tags: [network, ui, caching, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 7f03ad29
system_scope: network
---

# Motdmanager

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`MotdManager` is a singleton-like component responsible for fetching, parsing, caching, and serving Message of the Day (MOTD) data. It downloads structured JSON content (e.g., patch notes, skins, news, Twitch stream info) from a remote server, handles offline caching via `TheSim:GetPersistentString` / `SavePersistentString`, and supports image downloads. It integrates with the UI via the `widgets/redux/templates` module and exposes data to screens like the main menu and skins browser. It does not attach directly to entities; instead, it is typically instantiated as `TheMotdManager` in the main script.

## Usage example
```lua
TheMotdManager = require "motdmanager"
TheMotdManager:Initialize()
if TheMotdManager:IsNewUpdateAvailable() then
    print("New patch notes available")
end
local motd_info, sorted_keys = TheMotdManager:GetMotd()
```

## Dependencies & tags
**Components used:** None (no component-based interactions)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `motd_info` | table | `{}` | Parsed MOTD data by box ID (e.g., `ID_<guid>`). Each entry has `.data` and `.meta` subtables. |
| `motd_sorted_keys` | table | `{}` | Ordered list of box IDs, sorted by category, group order, and title. |
| `live_build` | number | `-1` | Server-provided live build version used to detect updates. |
| `isloading_motdinfo` | boolean | `true` | `true` while MOTD info is still being loaded or downloaded. |

## Main functions
### `IsEnabled()`
* **Description:** Checks whether the MOTD system is enabled (only on Steam or Rail platforms).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if enabled, otherwise `false`.

### `Initialize()`
* **Description:** Kickstarts the MOTD system by loading cached data and initiating the network fetch.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not throw; fails gracefully if network is unavailable.

### `IsLoadingMotdInfo()`
* **Description:** Returns whether MOTD info is still being loaded.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if loading is in progress.

### `SetMotdInfo(info, live_build)`
* **Description:** Updates the internal MOTD data and sorts it. Limits stored boxes to `MAX_IMAGE_FILES` (`10`).
* **Parameters:**  
  - `info` (table) — Raw MOTD data after parsing and restructuring.  
  - `live_build` (string | number) — Server build version for update detection.
* **Returns:** Nothing.

### `GetMotd()`
* **Description:** Returns the current MOTD data and sorted keys.
* **Parameters:** None.
* **Returns:** `(table, table)` — `motd_info` (box ID → entry), `motd_sorted_keys` (ordered list of IDs).

### `IsNewUpdateAvailable()`
* **Description:** Determines if a newer game build is available on the server.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `live_build > APP_VERSION`.

### `GetPatchNotes()`
* **Description:** Returns the first visible "patchnotes" box, or a default placeholder if none found.
* **Parameters:** None.
* **Returns:** `table` — Patch notes box data (or fallback object with `no_image = true`).

### `MarkAsSeen(boxid)`
* **Description:** Marks a MOTD box as "seen" by updating its `last_seen` timestamp and saving. Only acts if the box exists and is marked as `is_new`.
* **Parameters:**  
  - `boxid` (string) — Box ID (e.g., `"ID_<guid>"`).
* **Returns:** Nothing.

### `SetLoadingDone()`
* **Description:** Marks loading as complete and pushes the `"motd_info_loaded"` event.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddOnMotdDownloadedCB(ent, cb_fn)`
* **Description:** Registers a callback to be invoked when `"motd_info_loaded"` is pushed.
* **Parameters:**  
  - `ent` (Entity) — Entity to attach the listener to (typically `TheGlobalInstance`).  
  - `cb_fn` (function) — Callback function accepting `(event, data)` signature.
* **Returns:** Nothing.

### `GetImagesToDownload()`
* **Description:** Returns a prioritized list of images to download, respecting `MAX_IMAGE_FILES`.
* **Parameters:** None.
* **Returns:** `table` — List of `{cell_id, image_url, image_file?}` tables for each pending image.

### `DownloadMotdInfo(remaining_retries)`
* **Description:** Initiates the HTTP request for MOTD JSON. Retries up to `MAX_RETRIES` (`4`) on failure.
* **Parameters:**  
  - `remaining_retries` (number) — Remaining attempts allowed.
* **Returns:** Nothing.

### `DownloadMotdImages(download_queue, retries)`
* **Description:** Downloads images in parallel, storing each as a `.tex` file under a `boxN` name. Retries up to `2` times per image.
* **Parameters:**  
  - `download_queue` (table) — Queue of image download tasks.  
  - `retries` (number) — Current retry count for the current image.
* **Returns:** Nothing.

### `LoadCachedImages()`
* **Description:** Preloads cached images for all MOTD boxes that already have `image_file` metadata.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `motd_info_loaded` — via `AddOnMotdDownloadedCB`, invoked after full MOTD data is processed.
- **Pushes:**  
  - `motd_info_loaded` — `{success = boolean}` — fired in `SetLoadingDone` after data load completes (success or failure).  
  - `motd_image_loaded` — `{cell_id = string}` — fired per image after successful download or fallback.
