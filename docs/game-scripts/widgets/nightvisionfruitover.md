---
id: nightvisionfruitover
title: Nightvisionfruitover
description: Manages the visual and audio overlay shown when the Night Vision Fruit effect is active on the player.
tags: [ui, visual, overlay, player]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 760b7915
system_scope: ui
---

# Nightvisionfruitover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Nightvisionfruitover` is a UI widget that displays a visual overlay and plays sound when the player has the `nightvision_fruit` status effect active. It extends `UIAnim` and listens for changes to the player’s condition table (via the `ccoverrides` event) to toggle the overlay on or off. It also responds to the `onremove` event to ensure cleanup when the widget is removed.

## Usage example
```lua
-- Typically instantiated internally by the game when the player enters night vision mode
local overlay = NightVisionFruitOver(player)
-- Automatic toggling via event listeners handles show/hide; no manual calls needed
```

## Dependencies & tags
**Components used:** `playervision` (via `GetCCTable()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `ent` | `nil` | The player entity this overlay belongs to. |
| `shown` | boolean | `false` | Tracks whether the overlay is currently visible. |
| `hidetask` | `task` | `nil` | Delayed task used to hide the overlay after the post-animation plays. |

## Main functions
### `Toggle(show)`
* **Description:** Shows or hides the overlay based on the `show` boolean. Ensures transitions only occur when state changes.
* **Parameters:** `show` (boolean) — if `true`, enables the overlay; otherwise, disables it.
* **Returns:** Nothing.

### `Enable()`
* **Description:** Makes the overlay visible, plays the entry animation (`over_pre` followed by `over_idle` loop), and starts the sound effect.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Cancels any pending `hidetask` to prevent premature hiding.

### `Disable()`
* **Description:** Initiates the exit animation (`over_pst`) and schedules hiding after the animation completes. Also stops the sound effect.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Cancels any existing `hidetask` before scheduling a new one.

## Events & listeners
- **Listens to:**  
  - `ccoverrides` (on `owner`) — triggers `Toggle()` when condition table changes; checks for `cctable.nightvision_fruit`.  
  - `onremove` (on `self.inst`) — calls `Toggle(false)` to clean up overlay state.
- **Pushes:** None.