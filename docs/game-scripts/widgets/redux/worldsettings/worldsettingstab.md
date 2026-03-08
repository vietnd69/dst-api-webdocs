---
id: worldsettingstab
title: Worldsettingstab
description: Manages the UI tab interface for configuring world settings and world generation options in the server creation screen, handling tab switching, level enabling/disabling, and preset synchronization.
tags: [ui, world, settings, tabs]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2a1277fd
system_scope: ui
---

# Worldsettingstab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WorldSettingsTab` is a widget component responsible for rendering and managing the user interface tab for a specific world location (e.g., Forest, Caves) in the server creation screen. It hosts two child `WorldSettingsMenu` widgets—one for general settings and one for world generation—and provides controls for switching between tabs, enabling/disabling sublevels, adding/removing levels, and synchronizing presets across settings and worldgen categories. It acts as a conduit between the higher-level `ServerCreationScreen` and the lower-level settings menus.

## Usage example
```lua
local tab = WorldSettingsTab(1, servercreationscreen)
tab:SetDataForSlot(slot, ...)
tab:Refresh()
local options = tab:CollectOptions()
```

## Dependencies & tags
**Components used:** None (this is a widget, not an ECS component; no `inst.components.X` calls).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `location_index` | number | `nil` | 1-based index of the current location in `SERVER_LEVEL_LOCATIONS`. |
| `servercreationscreen` | table | `nil` | Reference to the parent `ServerCreationScreen` instance. |
| `locations` | table | `SERVER_LEVEL_LOCATIONS` | Table of supported level locations for the current game mode. |
| `level_enabled` | boolean | `false` | Whether the sublevel (e.g., Caves) is enabled. |
| `slot` | number | `nil` | Save slot index being edited. |
| `isnewshard` | boolean | `nil` | Whether the current save slot is empty. |

## Main functions
### `AddMultiLevel()`
*   **Description:** Enables the sublevel (e.g., Caves) for this location and reloads presets in both settings and worldgen menus.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RemoveMultiLevel()`
*   **Description:** Disables the sublevel for this location. Only effective if the current level is not the master level (`location_index == 1`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateSublevelControlsVisibility()`
*   **Description:** Updates visibility and focus state of sublevel controls (add/remove buttons, checkbox, disabled message) based on shard state and whether the location is valid/enabled.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Refresh()`
*   **Description:** Refreshes both the settings and worldgen widgets and updates sublevel control visibility.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetLocation()`
*   **Description:** Returns the current worldgen location string ID (e.g., `"FOREST"`, `"CAVES"`), preferring the value from `worldgen_widget`.
*   **Parameters:** None.
*   **Returns:** string | `nil` — location identifier.

### `GetLocationStringID()`
*   **Description:** Returns the uppercase location string ID.
*   **Parameters:** None.
*   **Returns:** string.

### `IsMasterLevel()`
*   **Description:** Returns whether this tab corresponds to the master level (always the first location, `location_index == 1`).
*   **Parameters:** None.
*   **Returns:** boolean.

### `CollectOptions()`
*   **Description:** Merges world generation and settings options from child widgets. Only returns non-nil options if the level is enabled.
*   **Parameters:** None.
*   **Returns:** table | `nil` — Deep-merged options table including `location`, or `nil` if the level is disabled.

### `SetDataForSlot(slot, ...)`
*   **Description:** Initializes this tab’s state for a given save slot, handling new slot setup, preset loading from existing options, and auto-enabling caves if configured.
*   **Parameters:** `slot` (number) — save slot index.
*   **Returns:** Nothing.

### `RefreshOptionItems()`
*   **Description:** Reloads presets and refreshes option item lists in both child widgets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCombinedPresetButton(presetid)`
*   **Description:** Handles a combined preset button click by synchronizing both settings and worldgen widgets to use the provided preset (or its default fallback).
*   **Parameters:** `presetid` (string | number) — ID of the preset to apply.
*   **Returns:** Nothing.

### `SaveCombinedPreset(presetid, name, desc, noload)`
*   **Description:** Saves the current settings and worldgen state under a combined preset ID, optionally reloading it.
*   **Parameters:**  
  `presetid` (string | number) — ID to save under.  
  `name` (string) — Preset name.  
  `desc` (string) — Preset description.  
  `noload` (boolean) — If true, skip reloading after saving.  
*   **Returns:** boolean — `true` if both widgets saved successfully.

### `EditCombinedPreset(originalid, presetid, name, desc, updateoverrides)`
*   **Description:** Updates a combined preset’s metadata and/or overrides. If `presetid` changes, deletes the `originalid` preset after saving.
*   **Parameters:**  
  `originalid` (string | number) — Original preset ID (to delete if changed).  
  `presetid` (string | number) — New or updated preset ID.  
  `name` (string) — New preset name.  
  `desc` (string) — New preset description.  
  `updateoverrides` (boolean) — If true, also save overrides from current state.  
*   **Returns:** boolean — `true` if save operations succeeded.

### `DeleteCombinedPreset(presetid)`
*   **Description:** Deletes the given preset from both the settings and worldgen widgets.
*   **Parameters:** `presetid` (string | number) — ID to delete.
*   **Returns:** Nothing.

### `OnChangeGameMode(gamemode)`
*   **Description:** Called when the game mode changes; updates the list of supported locations for this tab.
*   **Parameters:** `gamemode` (string) — new game mode identifier.
*   **Returns:** Nothing.

### `OnChangeLevelLocations(level_locations)`
*   **Description:** Updates the `locations` table and may reload presets or disable the level if the current index is out of bounds.
*   **Parameters:** `level_locations` (table) — New list of supported locations.
*   **Returns:** Nothing.

### `BuildMenuEntry()`
*   **Description:** Returns a standard menu entry table for use in selection dropdowns or lists.
*   **Parameters:** None.
*   **Returns:** table — `{key = <location>, text = <localized tab name>}`.

## Events & listeners
None.