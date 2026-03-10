---
id: historyoftravelspanel
title: Historyoftravelspanel
description: Renders the history of travels screen UI panel, displaying most common deaths, most common friends, and festival achievement history buttons.
tags: [ui, history, festivals]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: bb0dae26
system_scope: ui
---

# Historyoftravelspanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Historyoftravelspanel` is a UI widget component that constructs and manages the visual layout for the "History of Travels" screen. It aggregates and displays player history data including most common causes of death, most played co-op friends, and festival history buttons. It does not inherit from an ECS component but is instantiated as a standalone UI widget and attached to a parent screen.

## Usage example
```lua
local HistoryOfTravelsPanel = require "screens/redux/panels/historyoftravelspanel"
local parent_screen = TheFrontEnd:GetCurrentScreen()
local panel = HistoryOfTravelsPanel(parent_screen)
TheFrontEnd:GetCurrentScreen():AddChild(panel)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags — pure UI widget with no entity association.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | screen | `nil` | The screen instance that owns this panel. |
| `root` | Widget | created in constructor | Root widget container for all child panels. |
| `death` | Widget | `nil` | Container widget for the most common deaths section. |
| `friends` | Widget | `nil` | Container widget for the most common friends section. |
| `festival_history` | Widget | `nil` | Container widget for the festival history buttons. |
| `festivals_badges` | table | `{}` | Array of button widgets for each festival entry. |
| `festivals_label` | Text | `nil` | Header label for the festival history section. |
| `festivals_divider_top` | Image | `nil` | Decorative divider image for the festival section. |

## Main functions
### `: _DoFocusHookups()`
* **Description:** Configures keyboard/controller focus navigation between festival badge buttons (up/down/left navigation). Called during initialization.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `self.festivals_badges` is `nil`.

### `: _BuildMostCommonDeaths()`
* **Description:** Constructs and returns the UI subtree for displaying the top 4 most common causes of death, including death count and percentages. Falls back to a "no deaths" message if no history is available.
* **Parameters:** None (instance method).
* **Returns:** `Widget` — Root widget for the death statistics panel.
* **Error states:** Uses `Morgue:GetRows()` and `GetKilledByFromMorgueRow()` — behavior depends on data availability.

### `: _BuildMostCommonFriends()`
* **Description:** Constructs and returns the UI subtree for displaying up to 4 players with whom the character spent the most time in multiplayer.
* **Parameters:** None (instance method).
* **Returns:** `Widget` — Root widget for the friends list panel.
* **Error states:** Uses `PlayerHistory:GetRowsMostTime()` — fallback text appears if data is missing or empty.

### `: _BuildFestivalHistoryButton(festival_key, season)`
* **Description:** Creates a button widget that, when clicked, either shows an offline error or contacts the event server to fetch and display achievements for the specified festival and season.
* **Parameters:**  
  - `festival_key` (string) — Unique ID for the festival event (e.g., `"SUMMER"`, `"WINTER"`)  
  - `season` (number) — Season number of the festival (e.g., `1`, `2`)  
* **Returns:** `Widget` — A button widget with an attached `onclick` handler.
* **Error states:**  
  - If offline, shows `PopupDialogScreen` with "not available offline" message.  
  - If server request fails, shows a generic failure dialog.

### `: _BuildFestivalHistory()`
* **Description:** Builds the entire festival history section by iterating over `PREVIOUS_FESTIVAL_EVENTS_ORDER` and generating buttons via `_BuildFestivalHistoryButton`.
* **Parameters:** None (instance method).
* **Returns:** `Widget` — Root widget for the full festival history panel.
* **Error states:** None — assumes `PREVIOUS_FESTIVAL_EVENTS_ORDER` is defined elsewhere.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
*(This is a UI-only widget; it does not participate in ECS event handling.)*