---
id: eventannouncer
title: Eventannouncer
description: Manages the display queue of regular and clickable skin announcements in the HUD, handling timing, positioning, and shuffling of messages.
tags: [ui, hud, announcement]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2dc2cf4c
system_scope: ui
---

# Eventannouncer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`EventAnnouncer` is a widget component responsible for displaying non-modal announcements in the HUD. It maintains two parallel queues—one for standard text announcements and one for skin-related (clickable) announcements—and manages their lifecycle, including timing, fade-out behavior, and vertical stacking. It extends `Widget` and operates independently of any specific entity.

## Usage example
```lua
-- Assuming a valid `owner` entity with a `widgets` component
local ann = owner.widgets.eventannouncer
ann:ShowNewAnnouncement("The world has changed!", {1, 0.5, 0.5, 1}, "alert")
ann:ShowSkinAnnouncement("Player1", {1, 1, 1, 1}, "FestivalOutfit")
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds `hud_announcer` to `owner` implicitly (via `AddChild` usage).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `regular_announcements` | table | `{}` | Array of `AnnouncementWidget` instances for standard text announcements. |
| `skin_announcements` | table | `{}` | Array of `SkinAnnouncement` instances for clickable skin announcements. |
| `active_announcements` | table | `{}` | Tracks currently displayed announcements; maintains ordering. |
| `message_font` | string | `UIFONT` | Font name used for announcement text. |
| `message_size` | number | `30` | Font size for announcement text. |

## Main functions
### `ShowNewAnnouncement(announcement, colour, announce_type)`
* **Description:** Displays a standard (non-clickable) text announcement in the queue.
* **Parameters:**  
  - `announcement` (string) – Message text to display. Ignored if `nil`.  
  - `colour` (table or `nil`) – RGBA color table (e.g., `{1,1,1,1}`). Defaults to white `{1,1,1,1}` if `nil`.  
  - `announce_type` (string or `nil`) – Optional string to categorize the announcement (e.g., `"alert"`); defaults to `"default"` if empty or `nil`.  
* **Returns:** Nothing.  
* **Error states:** No-op if `announcement` is `nil`. Queuing logic ensures insertion into the next available slot or forces shuffle-up if full.

### `ShowSkinAnnouncement(user_name, user_colour, skin_name)`
* **Description:** Displays a clickable skin announcement (e.g., "Player1 equipped 'FestivalOutfit'").
* **Parameters:**  
  - `user_name` (string or `nil`) – Name of the player. Must not be `nil`.  
  - `user_colour` (table or `nil`) – RGBA color for the player name text. Must not be `nil`.  
  - `skin_name` (string or `nil`) – Display name of the equipped skin. Must not be `nil`.  
* **Returns:** Nothing.  
* **Error states:** No-op if any of `user_name`, `user_colour`, or `skin_name` is `nil`.

### `DoShuffleUp(i)`
* **Description:** Shifts announcements upward to make room for new ones or clear expired ones, starting at index `i`.
* **Parameters:**  
  - `i` (number) – Starting index for shuffling (1-based).  
* **Returns:** Nothing.  
* **Error states:** Returns early if `i > ANNOUNCEMENT_QUEUE_SIZE` or if no announcement exists at `i`.

### `OnUpdate()`
* **Description:** Called automatically by the widget update loop. Checks each active announcement for visibility and triggers shuffling when an announcement is no longer shown.
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None