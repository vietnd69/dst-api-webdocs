---
id: lavaarena_communityprogression_panel
title: Lavaarena Communityprogression Panel
description: Renders the UI panel displaying community progression unlocking progress and active quests for the Lava Arena event.
tags: [ui, event, progress, quest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8cf4de23
system_scope: ui
---

# Lavaarena Communityprogression Panel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CommunityProgress` is a UI widget that presents the community-driven progression panel for the Lava Arena event. It displays a horizontal unlocking bar for unlocks (items, bosses) in order of availability and a second section listing active quests with XP rewards and expiry timers. The panel reacts to networked progression data via `Lavaarena_CommunityProgression` and automatically updates when new data is received from the server.

## Usage example
```lua
local panel = CreateWidget("lavaarena_communityprogression_panel", festival_key, season)
-- The panel self-initializes: starts querying data and renders the UI
-- It listens for "community_clientdata_updated" and refreshes when new data arrives
```

## Dependencies & tags
**Components used:** `Lavaarena_CommunityProgression` (via `Lavaarena_CommunityProgression:...`), `EventAchievements`, `TheNet`, `TheWorld`, `TheGlobalInstance`.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `festival_key` | string | — | Identifier for the festival (e.g., `"lavaarena"`). |
| `season` | string | — | Season identifier for the event. |
| `root` | Widget | — | Root container for all child widgets. |
| `status_root` | Widget | `nil` initially | Container for the progress bar and unlock icons. |
| `details_root` | Widget | `nil` initially | Container for the quest list panel. |
| `progressbar` | Widget | `nil` initially | Reference to the progress bar container. |
| `fill_width` | number | — | Width used for scissoring the progress bar fill. |
| `icons` | table of widgets | `nil` initially | Array of widget nodes representing unlock positions. |
| `items` | table of unlock identifiers | `nil` initially | Array of unlock definitions corresponding to `icons`. |
| `is_animating` | table or `nil` | `nil` | Stores animation state if the progress bar is animating. |

## Main functions
### `ShowSyncing()`
* **Description:** Clears the root and displays a “syncing” status message while data is being fetched. Called in the constructor before data is received.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRecievedData()`
* **Description:** Renders the full UI after receiving networked community progression and quest data. Creates or replaces the progress bar panel and quest panel, showing errors if data queries fail.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildProgressionPanel(bar_width, bar_height)`
* **Description:** Constructs and returns a widget containing the linear unlocking progress bar, title text, and unlock icon placeholders. Unlocks are arranged horizontally based on `GetUnlockOrder()` and revealed as the bar animates past their offset.
* **Parameters:**
  * `bar_width` (number) — Horizontal width in pixels of the progress fill.
  * `bar_height` (number) — Vertical height in pixels of the progress fill.
* **Returns:** `Widget` — Container widget (`status_root`) holding the progress UI.

### `AnimateBarFill(from, to)`
* **Description:** Initiates a progress bar fill animation from a previous progress percentage to a new one, revealing unlocked icons as the bar crosses their position.
* **Parameters:**
  * `from` (table) — Contains `percent` and `level` for the starting state.
  * `to` (table) — Contains `percent` and `level` for the target state.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Step function for the progress bar animation. Updates the fill percentage over time and reveals icons when the bar passes their offset.
* **Parameters:**
  * `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `BuildQuestPanel(active_quests)`
* **Description:** Constructs and returns a widget displaying active quests, including daily and recurring quest entries with XP, icons, and time-to-reset labels.
* **Parameters:**
  * `active_quests` (table) — Structured data returned by `Lavaarena_CommunityProgression:GetCurrentQuestData(...)`, including daily and quest types with expiry times.
* **Returns:** `Widget` — Container widget (`quest_root`) holding the quest list UI.

### `MakeDailyEntry(quest_info, festival_key, season)`
* **Description:** Helper that builds a single daily quest cell (icon, title, XP).
* **Parameters:**
  * `quest_info` (table) — Quest definition (e.g., `daily_match`).
  * `festival_key` (string) — Festival identifier.
  * `season` (string) — Season identifier.
* **Returns:** `Widget` — Daily quest cell.

### `MakeQuestEntry(quest_info, row_w, festival_key, season)`
* **Description:** Helper that builds a full quest entry with icon, title, description, type (personal/team/character), XP, and alignment within a row of width `row_w`.
* **Parameters:**
  * `quest_info` (table) — Quest definition (e.g., `basic`, `challenge`).
  * `row_w` (number) — Width of the container row.
  * `festival_key` (string) — Festival identifier.
  * `season` (string) — Season identifier.
* **Returns:** `Widget` — Full quest cell widget.

### `AddItemWidget(self, root, item, offset)`
* **Description:** Adds a single unlock icon widget (locked or revealed) to the root and configures reveal behavior. Used during progress bar setup.
* **Parameters:**
  * `self` (table) — The `CommunityProgress` instance (passed implicitly).
  * `root` (Widget) — Parent widget for the new item.
  * `item` (table or `0`) — Unlock definition or placeholder (`0` if not yet defined).
  * `offset` (number) — Normalized horizontal position (`0..1`) for placing the icon.
* **Returns:** `Widget` — The created item widget.

### `Reveal_ItemWidget(w, item, is_new)`
* **Description:** Utility to replace a locked icon with the actual unlock graphic and apply new/unlock effects.
* **Parameters:**
  * `w` (Widget) — Item widget instance.
  * `item` (table) — Unlock definition (contains `atlas`, `icon`, and `style`).
  * `is_new` (boolean) — Whether this is a newly unlocked item.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `community_clientdata_updated` — Fires when the client receives updated community data from the server, triggering `OnRecievedData()`.
- **Pushes:** None identified.