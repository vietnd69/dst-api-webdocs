---
id: custombuildmanager
title: Custombuildmanager
description: Manages visual symbol overrides for entity build groups, allowing dynamic replacement of animation symbols based on current build configuration.
tags: [animation, visual, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3b8e6b76
system_scope: entity
---

# Custombuildmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Custombuildmanager` is a component that enables dynamic replacement of animation symbols on an entity via `AnimState:OverrideSymbol`, based on configurable build groups. It is typically used for visual customization (e.g., equipment, upgrades, or cosmetic changes) where different build states should replace specific animation symbols with other assets. The component stores group-to-build mappings and triggers visual updates when configurations change.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("custombuildmanager")

-- Define build groups: group name → list of symbol names
local groups = {
    ["hat"] = { "symbol_hat_top", "symbol_hat_side" },
    ["body"] = { "symbol_body_overlay" }
}
inst.components.custombuildmanager:SetGroups(groups)

-- Set current build for a group
inst.components.custombuildmanager:ChangeGroup("hat", "build_top_hat")

-- Optionally restrict when swaps occur
inst.components.custombuildmanager:SetCanSwapSymbol(function(ent)
    return ent:HasTag("player")
end)
```

## Dependencies & tags
**Components used:** `animstate` (via `self.inst.AnimState:OverrideSymbol`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `groups` | table | `{}` | Mapping of group names → arrays of symbol names to override. Populated via `SetGroups`. |
| `current` | table | `{}` | Mapping of group names → current build asset names. Updated via `ChangeGroup`. |
| `canswapsymbol` | function or `nil` | `nil` | Optional predicate function that determines if a symbol swap may occur for the entity. |

## Main functions
### `refreshart()`
*   **Description:** Iterates through all registered groups and their symbols, applying current build overrides using `AnimState:OverrideSymbol`. Skips symbols if `canswapsymbol` is defined and returns `false`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetGroups(data)`
*   **Description:** Registers a new set of build group definitions. Each key is a group name; each value is a list of symbol names belonging to that group.
*   **Parameters:** `data` (table) — map of `{ group_name = { "symbol_a", "symbol_b", ... }, ... }`.
*   **Returns:** Nothing.

### `SetCanSwapSymbol(fn)`
*   **Description:** Sets a callback function to control whether symbol overrides are applied for this entity.
*   **Parameters:** `fn` (function or `nil`) — a predicate taking `inst` as argument and returning `true` if swapping is allowed.
*   **Returns:** Nothing.

### `ChangeGroup(group, build)`
*   **Description:** Updates the active build asset for a given group and triggers a visual refresh.
*   **Parameters:**  
    `group` (string) — name of the build group.  
    `build` (string or `nil`) — asset name to apply; `nil` clears the current build for the group.
*   **Returns:** Nothing.
*   **Error states:** No effect if `group` does not exist in `self.groups`.

### `OnSave(data)`
*   **Description:** Serializes the current build state for persistence.
*   **Parameters:** None.
*   **Returns:** `{ current = self.current }` — a table containing only the `current` build mapping.

### `OnLoad(data)`
*   **Description:** Restores the build state from saved data and refreshes visuals.
*   **Parameters:** `data` (table or `nil`) — saved data, expected to contain `data.current`.
*   **Returns:** Nothing.

## Events & listeners
None identified.
