---
id: modslistpopup
title: Modslistpopup
description: Constructs and displays a scrollable popup list of mod names, with optional workshop name queries and mod link support.
tags: [ui, mod, popup]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: fa527f1b
system_scope: ui
---

# Modslistpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ModsListPopup` is a UI screen component that inherits from `TextListPopup` and renders a scrollable list of mods, using their fancy names (fetched via `KnownModIndex`) or raw IDs as fallback. It optionally supports querying active Workshop mod names for real-time display updates and provides clickable links to mod pages on supported platforms (Steam). The component is intended for transient display use (e.g., mod collision diagnostics, mod manager introspection).

## Usage example
```lua
local ModsListPopup = require "screens/redux/modslistpopup"

-- Example: Show a popup listing active mod IDs with optional name queries
local mods_list = {"123456789", "987654321"}
local popup = ModsListPopup(
    mods_list,
    "Active Mods",
    "The following mods are currently loaded.",
    { { text = "Close", id = "close" } },
    0.05,  -- spacing
    true   -- querynames: true to update workshop mod names live
)
popup:Open()
```

## Dependencies & tags
**Components used:** None directly. Relies on:
- `TextListPopup` (base class)
- `KnownModIndex`
- `ModManager`
- `TheSim:QueryWorkshopModName`
- `IsWorkshopMod`, `GetWorkshopIdNumber`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mods_list` | table (string array) | — | Input list of mod IDs passed to constructor. |
| `title_text` | string | — | Popup title text passed to base constructor. |
| `body_text` | string | — | Popup body text passed to base constructor. |
| `buttons` | table | — | Button definitions passed to base constructor. |
| `spacing` | number | — | Vertical spacing between list items passed to base constructor. |
| `querynames` | boolean | `false` | Whether to query and update Workshop mod names asynchronously. |

## Main functions
### `BuildOptionalModLink(mod_name)`
*   **Description:** Returns a platform-specific link string (function reference) for Steam mods, or `nil` if no link is available (e.g., non-Steam platform or generic URL).
*   **Parameters:** `mod_name` (string) — the mod's internal name or ID.
*   **Returns:** `string` (function reference) or `nil`.
*   **Error states:** Returns `nil` if `PLATFORM` is not Steam-based or if `GetLinkForMod` returns `is_generic_url = true`.

### `BuildModList(mod_ids)`
*   **Description:** Converts an array of mod IDs into a list of display-ready entries suitable for `TextListPopup`.
*   **Parameters:** `mod_ids` (table) — array of mod ID strings.
*   **Returns:** `table` — list of `{ text = string, onclick = function or nil }` entries.
*   **Error states:** None; falls back to raw ID if `KnownModIndex:GetModFancyName` returns `nil`.

### `QueryName(modname, modtable, textlistpopup)`
*   **Description:** Initiates an asynchronous Workshop name query for Workshop mods and updates `modtable.text` on success; refreshes the popup's list view if provided.
*   **Parameters:**  
  - `modname` (string) — mod identifier (must be Workshop mod).  
  - `modtable` (table) — the list entry to update (expects `modtable.text`).  
  - `textlistpopup` (table or `nil`) — the popup instance; used to refresh its scroll list.
*   **Returns:** Nothing (asynchronous).
*   **Error states:** If query fails (`isSuccessful = false`), prints `"Workshop Name Query Failed!"` to console.

### `ModsListPopup(mods_list, title_text, body_text, buttons, spacing, querynames)`
*   **Description:** Constructor — builds mod list entries and initializes the base `TextListPopup`. Optionally starts name queries for Workshop mods.
*   **Parameters:** Same as properties above; see table in **Properties**.
*   **Returns:** `ModsListPopup` instance.
*   **Error states:** None; failures in `QueryName` are silent beyond console print.

## Events & listeners
None identified.