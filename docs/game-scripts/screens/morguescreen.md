---
id: morguescreen
title: Morguescreen
description: Displays player death records (obituaries) and tracked online player encounters in a scrollable UI tabbed screen.
tags: [ui, history, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 4799d4f5
system_scope: ui
---

# Morguescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Morguescreen` is a UI screen that presents historical data about player deaths and tracked online player encounters. It extends `Screen` and provides two tabs: one for local obituaries (from the `Morgue` data source) and one for online player encounters (from `PlayerHistory`). It uses a scrollable list architecture with custom row widgets for each data type and supports platform-specific localization (e.g., Japanese PS4 scaling).

## Usage example
```lua
-- Show the morgue screen with proper screen transition
TheFrontEnd:PushScreen(Morguescreen(prev_screen))
-- Where prev_screen is the screen to return to upon exit
```

## Dependencies & tags
**Components used:** None directly; uses external UI helper widgets and data stores (`Morgue`, `PlayerHistory`, `TheNet`, `TheFrontEnd`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prev_screen` | Screen | `nil` | The screen to return to when exiting this one. |
| `selected_tab` | string | `"obituary"` | Current active tab (`"obituary"` or `"encounters"`). |
| `morgue` | table | `{}` | List of obituary rows retrieved from `Morgue:GetRows()`. |
| `player_history` | table | `{}` | List of encounter rows retrieved from `PlayerHistory:GetRows()`. |
| `obit_widgets` | table | `{}` | List of pre-allocated obituary row widgets for reuse. |
| `encounter_widgets` | table | `{}` | List of pre-allocated encounter row widgets for reuse. |
| `column_focus` | number | `1` | Tracks focus state within encounter row sub-widgets (1 = NET_ID, 2 = CLEAR). |

## Main functions
### `SetTab(tab)`
* **Description:** Switches the active tab between `"obituary"` and `"encounters"`, showing the corresponding root widget and updating button selection states.
* **Parameters:** `tab` (string) — target tab name (`"obituary"` or `"encounters"`).
* **Returns:** Nothing.

### `OK()`
* **Description:** Handles screen exit: disables the screen, fades out, pops the screen from the stack, then fades back in.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdatePlayerHistory()`
* **Description:** Refreshes the encounter list data and updates the scroll list. Called when the underlying history data may have changed.
* **Parameters:** None.
* **Returns:** Nothing.

### `EncounterWidgetConstructor(data, parent, obit_button)`
* **Description:** Constructs and returns a single encounter row widget with player name, character icon, server name, date, age, and action buttons (View Profile / Clear).
* **Parameters:**  
  `data` (table) — encounter data (e.g., `name`, `prefab`, `server_name`, `date`, `playerage`, `netid`, `userid`).  
  `parent` (Widget) — parent widget for the row.  
  `obit_button` (Button) — reference to the obituary navigation button for focus movement.
* **Returns:** Widget — configured encounter row widget.
* **Error states:** Returns `nil` on missing required data fields.

### `BuildObituariesTab()`
* **Description:** Builds the full UI for the obituaries tab, including header lines, column labels, and populates the scrollable list using `obit_widget_constructor`.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildEncountersTab()`
* **Description:** Builds the full UI for the encounters tab, including header lines, column labels, and populates the scrollable list using `EncounterWidgetConstructor`.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddWhiteStripes(parent)`
* **Description:** Draws alternating row background lines for visual separation in the list area.
* **Parameters:** `parent` (Widget) — parent widget to attach stripes to.
* **Returns:** Nothing.

## Events & listeners
**Listens to:** None.  
**Pushes:** None.  
(No event listeners or emitted events are registered in this screen.)