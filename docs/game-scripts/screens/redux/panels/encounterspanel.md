---
id: encounterspanel
title: Encounterspanel
description: Renders a scrolling list of player encounter records, displaying character icons, names, server info, and playtime with controller- and mouse-friendly interaction.
tags: [ui, player, history, scroll]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 711b4ded
system_scope: ui
---

# Encounterspanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`EncountersPanel` is a UI widget that displays a grid of player encounter records retrieved from `PlayerHistory`. It shows each encounter's character portrait, player name, last-seen server name and date, and total playtime, along with context-sensitive buttons for viewing net profiles and clearing entries. The panel adapts its behavior and control scheme based on whether a controller or keyboard/mouse is attached.

## Usage example
```lua
local panel = EncountersPanel()
TheFrontEnd:AddScreen("encounters", panel)
panel:DoInit() -- ensures scroll list is populated with current history
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Uses `PlayerHistory` module to retrieve and remove entries; uses `TheNet`, `TheInput`, and `ServerPreferences` services.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `player_history` | table | `PlayerHistory:GetRows()` | Array of encounter records (tables with keys like `prefab`, `name`, `server_name`, `last_seen_date`, `time_played_with`, `netid`, `userid`). |
| `can_view_profile` | boolean | `not IsPS4()` | Controls whether the profile view button is shown and active. |
| `root` | Widget | — | Top-level container widget for the panel. |
| `dialog` | Widget | — | Window frame container (using `TEMPLATES.RectangleWindow`). |
| `encounters_scroll_list` | ScrollingGrid | — | The scrollable list displaying encounter records. |
| `focus_forward` | Widget | `encounters_scroll_list` | The widget that receives focus when this panel is focused. |

## Main functions
### `DoInit()`
* **Description:** Initializes and populates the `encounters_scroll_list` with encounter data using `PlayerHistory:GetRows()`. Sets up the scrolling grid with custom widget constructor and update callbacks.
* **Parameters:** None.
* **Returns:** Nothing.

### `encounter_widget_update(context, w, data, index)`
* **Description:** Updates a single encounter widget with data from a record. Shows/hides the portrait, player name, description (server name and date), and playtime fields, and configures the profile/delete buttons with corresponding IDs.
* **Parameters:**
  * `context` (table) — the scroll list context containing `screen` (this `EncountersPanel` instance).
  * `w` (Widget or nil) — the encounter widget to update. If `nil`, the function returns early.
  * `data` (table or nil) — the encounter record. If `nil`, hides the widget row.
  * `index` (number) — the row index (unused in current implementation).
* **Returns:** Nothing.
* **Error states:** If `data` is `nil`, the row is hidden; no error is thrown.

### `BuildCharacterPortrait(name)`
* **Description:** Constructs a portrait widget that displays a character icon. Returns a widget with a `SetCharacter(character)` method to load and display the appropriate texture.
* **Parameters:** `name` (string) — widget name.
* **Returns:** Widget — a portrait widget with `portraitbg`, `portrait`, and `SetCharacter` members.

### `ecounter_widget_constructor(context, i)`
* **Description:** Creates a single encounter row widget with portrait, name, server info, playtime fields, and controller-aware buttons. Sets up focus navigation, button handlers, and help text for keyboard/mouse and controller input.
* **Parameters:**
  * `context` (table) — scroll list context (contains `screen` reference to this `EncountersPanel`).
  * `i` (number) — row index (unused in current implementation).
* **Returns:** Widget — fully configured encounter row widget.

### `SetTruncatedLeftJustifiedString(txt, str)`
* **Description:** Sets a truncated string on a `Text` widget and horizontally centers it at the widget's `_position.x`.
* **Parameters:**
  * `txt` (Text) — target text widget.
  * `str` (string or nil) — string to display; `nil` treated as empty string.
* **Returns:** Nothing.

### `SetTruncatedRightJustifiedString(txt, str)`
* **Description:** Sets a truncated string on a `Text` widget and horizontally centers it at the widget's `_position.x` with right-justified positioning.
* **Parameters:**
  * `txt` (Text) — target text widget.
  * `str` (string or nil) — string to display; `nil` treated as empty string.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls).
- **Pushes:** None identified (no `inst:PushEvent` calls).