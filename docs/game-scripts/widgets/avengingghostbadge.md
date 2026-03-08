---
id: avengingghostbadge
title: Avengingghostbadge
description: Displays a custom ghost buff indicator on the player's HUD with a dynamic symbol and timer.
tags: [hud, ui, buff, status]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7727a734
system_scope: ui
---

# Avengingghostbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`AvengingGhostBadge` is a specialized UI widget that extends `Badge` to display avenging ghost-related buffs on the player's HUD. It renders a ghost-themed icon (`status_ghost`) below the badge number and supports dynamic symbol-to-build mapping for customization. It manages visibility and percentage-based timer updates, but does not handle logic or timing itself — it only visualizes values passed to it via `SetValues`.

## Usage example
```lua
local badge = AvengingGhostBadge(owner, "yellow", "status_ghost", "green")
badge:SetBuildForSymbol("my_custom_symbol", "my_mod_status")
badge:SetValues("my_custom_symbol", 5.0, 10.0) -- 50% full, visible
badge:SetValues("my_custom_symbol", 0, 10.0)    -- empty, hidden
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `ghostbuff` (inherited via `Badge` base class)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OVERRIDE_SYMBOL_BUILD` | table | `{}` | Map from symbol identifiers (e.g. strings) to custom `UIAnim` build names; used to override the default icon. |
| `default_symbol_build` | string | (passed in constructor) | The fallback build name used for the ghost icon. |
| `bufficon` | `UIAnim` | `nil` | Child widget used to display the ghost status animation. |
| `buffsymbol` | number | `0` | Stores the current symbol identifier (not actively used; appears legacy). |

## Main functions
### `SetBuildForSymbol(build, symbol)`
*   **Description:** Overrides the animation build associated with a given symbol. Allows mods to replace the default ghost icon with custom ones for specific buff states.
*   **Parameters:**  
    `build` (string) — the name of the `UIAnim` build (e.g. `"my_mod_status"`).  
    `symbol` (any) — the identifier key used to look up the build (typically a string or number).  
*   **Returns:** Nothing.

### `SetValues(symbol, time, max_time)`
*   **Description:** Updates the badge's visibility and percentage based on `time / max_time`. If `percent > 0`, the badge is shown; otherwise, it is hidden.
*   **Parameters:**  
    `symbol` (any) — the current symbol identifier (stored in `buffsymbol`, but not actively used).  
    `time` (number) — current elapsed time of the buff.  
    `max_time` (number) — total duration of the buff.  
*   **Returns:** Nothing.

## Events & listeners
None identified