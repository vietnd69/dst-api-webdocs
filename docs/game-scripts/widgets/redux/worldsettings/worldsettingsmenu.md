---
id: worldsettingsmenu
title: Worldsettingsmenu
description: Manages the UI menu for configuring world and game settings presets, including switching between combined and separate mode layouts, editing presets, and synchronizing tweak values with the underlying data model.
tags: [ui, world, settings, preset]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 830a031d
system_scope: ui
---

# Worldsettingsmenu

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WorldSettingsMenu` is a UI widget responsible for rendering and managing the world settings configuration interface. It orchestrates two layout modes—`combined` and `seperate`—using `PresetBox` and `SettingsList` children to display and edit preset data for world generation or world settings. It acts as a bridge between user interactions (preset selection, edits, deletions) and the underlying data layers (`Levels`, `Customize`, `CustomPresetManager`), maintaining local tweak state and propagating changes to parent components.

## Usage example
```lua
local WorldSettingsMenu = require "widgets/redux/worldsettings/worldsettingsmenu"
local menu = WorldSettingsMenu(LEVELCATEGORY.SETTINGS, parent_widget)
menu:SetDataFromOptions(options)
menu:SetPresetMode("seperate")
menu:Refresh()
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget, not a component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `levelcategory` | string (`LEVELCATEGORY.*`) | — | The category of settings managed (`SETTINGS` or `WORLDGEN`). |
| `parent_widget` | widget | — | The parent UI widget (typically `ServerCreationScreen` or equivalent). |
| `mode` | string | `"combined"` or `"seperate"` | Current layout mode; initialized from profile. |
| `settings` | table | `{tweaks = {}}` | Local state holding current `preset`, `basepreset`, and `tweaks` overrides. |
| `refreshing` | boolean | `false` | Guard flag to prevent recursive refreshes. |
| `firstedit` | boolean | `true` | Tracks if first edit has occurred (unused in current code). |
| `multipresetbox` | widget | — | Container for `combined` and `seperate` preset layouts. |
| `combined` | widget | — | Widget container for combined-mode layout. |
| `seperate` | widget | — | Widget container for separate-mode layout. |
| `settingslist` | SettingsList | — | Widget listing individual setting controls. |
| `last_focus` | widget | `multipresetbox` | Tracks the most recently focused child for focus recovery. |

## Main functions
### `UpdatePresetMode()`
*   **Description:** Delegates the preset mode change request to the parent widget.
*   **Parameters:** None.
*   **Returns:** Result of `parent_widget:UpdatePresetMode(self.mode)`.

### `SetPresetMode(mode)`
*   **Description:** Updates the layout mode (`combined` or `seperate`) and refreshes the menu. If the shard is not new, it forces `seperate` mode.
*   **Parameters:** `mode` (string) — desired preset mode (`"combined"` or `"seperate"`).
*   **Returns:** Nothing.

### `IsEditable()`
*   **Description:** Determines whether the current settings are editable (i.e., for new shards or the global `SETTINGS` category).
*   **Parameters:** None.
*   **Returns:** boolean — `true` if editable, otherwise `false`.

### `IsNewShard()`
*   **Description:** Convenience proxy to `parent_widget:IsNewShard()`.
*   **Parameters:** None.
*   **Returns:** boolean — whether the shard is new (allows full editing).

### `GetValueForOption(option)`
*   **Description:** Retrieves the effective value for a given option, prioritizing user tweaks, then preset overrides, then location defaults.
*   **Parameters:** `option` (string) — option name.
*   **Returns:** any — the effective value.

### `SetTweak(option, value)`
*   **Description:** Records a tweak value; triggers refresh unless in `refreshing` mode.
*   **Parameters:** `option` (string), `value` (any).
*   **Returns:** Nothing.

### `UpdatePresetInfo()`
*   **Description:** Updates the `PresetBox` text and metadata based on current preset state (custom or stock).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Refresh(force)`
*   **Description:** Re-renders the menu: toggles layout visibility (`combined`/`seperate`), updates preset info, and refreshes children. Skips if already refreshing.
*   **Parameters:** `force` (boolean, optional) — forces deep refresh if `true`.
*   **Returns:** Nothing.

### `SavePreset(presetid, name, desc, noload)`
*   **Description:** Saves the current tweak set as a custom preset, computing overrides relative to defaults.
*   **Parameters:** `presetid` (string), `name` (string), `desc` (string), `noload` (boolean, optional — skip reloading after save).
*   **Returns:** boolean — `true` on success.

### `EditPreset(originalid, presetid, name, desc, updateoverrides)`
*   **Description:** Moves/renames a custom preset and updates the current preset if needed.
*   **Parameters:** `originalid`, `presetid`, `name`, `desc` (strings), `updateoverrides` (boolean).
*   **Returns:** boolean — `true` on success.

### `DeletePreset(presetid)`
*   **Description:** Deletes a custom preset. If the deleted preset is in use, reverts to the base preset while preserving tweaks.
*   **Parameters:** `presetid` (string).
*   **Returns:** Nothing.

### `RevertChanges()`
*   **Description:** Resets tweaks and reloads the current preset, or restores from slot options if not a new shard.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnPresetButton(presetid)`
*   **Description:** Loads and refreshes the menu for the selected preset ID.
*   **Parameters:** `presetid` (string).
*   **Returns:** Nothing.

### `GetNumberOfTweaks()`
*   **Description:** Counts how many tweak values differ from effective defaults (preset + location defaults).
*   **Parameters:** None.
*   **Returns:** number — count of modified options.

### `GetCurrentPresetId()`
*   **Description:** Returns the current preset ID, or `nil` if a custom preset.
*   **Parameters:** None.
*   **Returns:** string? — preset ID.

### `GetOptions()`
*   **Description:** Retrieves the list of options for the current `levelcategory` using `Customize`.
*   **Parameters:** None.
*   **Returns:** array — list of option definitions.

### `CollectOptions()`
*   **Description:** Builds and returns a fully flattened options table suitable for network transmission, incorporating all overrides and custom metadata.
*   **Parameters:** None.
*   **Returns:** table — flattened options object.

### `SetDataFromOptions(options)`
*   **Description:** Initializes the menu state from an options table (typically from parent).
*   **Parameters:** `options` (table, optional) — if `nil`, defaults are used.
*   **Returns:** Nothing.

### `LoadPreset(preset)`
*   **Description:** Loads a specific preset by ID into local state; handles missing presets with fallbacks.
*   **Parameters:** `preset` (string?) — preset ID; `nil` loads defaults.
*   **Returns:** Nothing.

### `VerifyValidSeasonSettings()`
*   **Description:** Validates that at least one season is enabled in settings (only for master level).
*   **Parameters:** None.
*   **Returns:** boolean — `true` if valid.

### `GetLocation()`
*   **Description:** Returns the location string for the current preset.
*   **Parameters:** None.
*   **Returns:** string? — location ID.

### `GetLocationStringID()`
*   **Description:** Returns the uppercase location string ID for display.
*   **Parameters:** None.
*   **Returns:** string — uppercase location ID or `"UNKNOWN"`.

### `DoFocusHookups()`
*   **Description:** Configures directional focus navigation (`MOVE_LEFT`, `MOVE_RIGHT`, `MOVE_UP`) between preset and settings list.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetFocusFromChild(child)`
*   **Description:** Overrides parent method to update `last_focus` on focus change.
*   **Parameters:** `child` (widget) — the widget receiving focus.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.