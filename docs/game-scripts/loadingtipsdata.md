---
id: loadingtipsdata
title: LoadingTipsData
description: Manages loading tip selection, weighting, persistence, and localization based on player progression and input configuration.
tags: [ui, persistence, localization, progression]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 512fc406
system_scope: ui
---

# LoadingTipsData

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`LoadingTipsData` is a data management component responsible for selecting and displaying context-aware loading tips during game load screens. It dynamically calculates tip weights based on how often each tip has been shown (to ensure diversity) and player progression (e.g., total play sessions), persists the history of shown tips across sessions, and handles platform- and input-specific localization for control-related tips. It does not attach to entities or participate in the ECS—instead, it is a singleton-style utility class instantiated once and shared globally.

## Usage example
```lua
local loadingtips = require("loadingtipsdata")()
loadingtips:Load()
local tip = loadingtips:PickLoadingTip("forest")
if tip then
    print(tip.text, tip.atlas, tip.icon)
end
loadingtips:RegisterShownLoadingTip(tip)
```

## Dependencies & tags
**Components used:** `Profile` (via `Profile:GetValue`, `Profile:GetLoadingTipsOption`), `TheSim` (via `TheSim:GetPersistentString`, `TheSim:SetPersistentString`), `TheInput` (via `TheInput:GetLocalizedControl`, `TheInput:GetControllerID`, `TheInput:ControllerAttached`), `json` (via `json.encode`, `json.decode`), `LOADING_SCREEN_TIP_*` globals (`LOADING_SCREEN_TIP_CATEGORIES`, `LOADING_SCREEN_TIP_CATEGORY_WEIGHTS_START`, `LOADING_SCREEN_TIP_CATEGORY_WEIGHTS_END`, `LOADING_SCREEN_CONTROL_TIP_KEYS`, etc.), `STRINGS.UI.LOADING_SCREEN_*`, `STRINGS.SKIN_DESCRIPTIONS`, `IsConsole`, `weighted_random_choice`, `subfmt`, `MergeMaps`, `GetTableSize`, `deepcopy`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shownloadingtips` | table | `{}` | Map of tip IDs to number of times each tip has been shown, persisted across sessions. |
| `dirty` | boolean | `false` | Flag indicating whether `shownloadingtips` has unsaved changes. |
| `loadingtipweights` | table | `nil` (calculated at init) | Per-category map of tip IDs to selection weights (inverse frequency). |
| `categoryweights` | table | `nil` (calculated at init) | Per-category weights for weighted random selection, adjusted by play progression. |

## Main functions
### `Reset()`
* **Description:** Resets tracking state by clearing `shownloadingtips`, marking the data as dirty, and saving the empty state.
* **Parameters:** None.
* **Returns:** Nothing.

### `Save()`
* **Description:** Persists `shownloadingtips` to disk using `TheSim:SetPersistentString` if data has changed (`dirty == true`).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `dirty` is `false`.

### `Load()`
* **Description:** Asynchronously loads persisted `shownloadingtips` from disk via `TheSim:GetPersistentString`, decodes JSON, and calls `CleanupShownLoadingTips`.
* **Parameters:** None.
* **Returns:** Nothing.

### `CleanupShownLoadingTips()`
* **Description:** Removes entries from `shownloadingtips` whose IDs no longer exist in any `STRINGS.UI.LOADING_SCREEN_*_TIPS` tables (i.e., tips have been deleted or renamed).
* **Parameters:** None.
* **Returns:** Nothing.

### `CalculateCategoryWeights()`
* **Description:** Computes per-category weights for tip selection, increasing weight for newer categories as `play_instance` count grows toward `TIMES_PLAYED_FOR_MAX_WEIGHT`.
* **Parameters:** None.
* **Returns:** Table of `category → weight`, where each weight is a number.
* **Error states:** Returns a table with `0` weight for categories lacking an `END` value in `LOADING_SCREEN_TIP_CATEGORY_WEIGHTS_END`.

### `CalculateLoadingTipWeights()`
* **Description:** Generates weight maps for all tip categories (CONTROLS, SURVIVAL, LORE, OTHER) using `GenerateLoadingTipWeights`. Controls tips are conditionally merged with platform-specific subsets (console/non-console).
* **Parameters:** None.
* **Returns:** Table of `category → { tip_id → weight }`.

### `GenerateLoadingTipWeights(stringlist)`
* **Description:** Converts a tip string list into a weight map where each tip’s weight is `1 / (shown_count + 1)`. Tips never shown (count = 0) get weight `1`.
* **Parameters:** `stringlist` (table) — A map of tip IDs to localized strings (e.g., `STRINGS.UI.LOADING_SCREEN_SURVIVAL_TIPS`).
* **Returns:** Table of `tip_id → weight` (number).

### `IsControlTipBound(controllerid, tipid)`
* **Description:** Checks whether all input controls required by a control tip are bound on the given controller. Returns `false` if any control maps to the “unbound” string.
* **Parameters:** `controllerid` (number) — Controller index. `tipid` (string) — Tip ID.
* **Returns:** Boolean — `true` if all controls are bound, `false` otherwise.

### `GenerateControlTipText(tipid)`
* **Description:** Generates localized text for a control tip, substituting control key names for placeholders (e.g., “Press `[A]` to jump”). Falls back to keyboard bindings for non-console platforms if controller bindings are missing.
* **Parameters:** `tipid` (string) — Tip ID.
* **Returns:** Localized string with controls substituted, or `STRINGS.UI.LOADING_SCREEN_CONTROL_TIPS_NOT_CONSOLE.TIP_BIND_CONTROLS` if controls cannot be mapped.

### `PickLoadingTip(loadingscreen)`
* **Description:** Selects a tip based on user options (e.g., lore only), current loading screen context, and category weights. Returns tip metadata or `nil` if no tips are available.
* **Parameters:** `loadingscreen` (string) — The ID of the current loading screen (e.g., `"forest"`).
* **Returns:** Table `{ id, text, atlas, icon }` or `nil`.
* **Error states:** Returns `nil` if tip options are disabled (`NONE`), no categories remain valid, or `weighted_random_choice` returns `nil`.

### `RegisterShownLoadingTip(tip)`
* **Description:** Increments the shown count for a tip ID and marks data as dirty, triggering a save.
* **Parameters:** `tip` (table) — A tip data table returned by `PickLoadingTip`, must contain `id`.
* **Returns:** Nothing.

## Events & listeners
None identified.