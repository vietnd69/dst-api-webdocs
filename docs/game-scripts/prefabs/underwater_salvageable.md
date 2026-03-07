---
id: underwater_salvageable
title: Underwater Salvageable
description: A networked underwater entity that can be retrieved by a winch and yields a single salvaged item.
tags: [salvage, underwater, winch, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 94c1fcb0
system_scope: world
---

# Underwater Salvageable

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`underwater_salvageable` is a prefab that represents a recoverable underwater object (e.g., shipwreck debris or flotsam). It provides physical interaction, minimap visibility, and integration with the `winchtarget` and `inventory` systems. When salvaged via a winch, it yields the single item stored in its inventory slot. It is designed to exist only in the underwater environment, with appropriate collision masks and rendering layering.

## Usage example
```lua
-- Typically instantiated via Prefab() as a predefined entity, not manually.
-- Example of manual instantiation (not recommended outside internal code):
local inst = Prefab("underwater_salvageable")
inst.Transform:SetPosition(x, y, z)
inst.components.inventory:SetItemInSlot(1, Prefab("log"))
```

## Dependencies & tags
**Components used:** `winchtarget`, `treasuremarked`, `inventory`  
**Tags added:** `ignorewalkableplatforms`, `notarget`, `NOCLICK`, `NOBLOCK`, `winchtarget`, `underwater_salvageable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.inventory.ignorescangoincontainer` | boolean | `true` | Prevents scanning tools from reading this as a container. |
| `components.inventory.maxslots` | number | `1` | Restricts the inventory to a single item slot. |

## Main functions
### `OnSalvage(inst)`
* **Description:** Callback invoked by the `winchtarget` component when the salvageable is retrieved. Returns the item stored in slot `1`.
* **Parameters:** `inst` (Entity) — the salvageable entity instance.
* **Returns:** `inst.components.inventory:GetItemInSlot(1)` (Entity or `nil`) — the salvaged item.
* **Error states:** Returns `nil` if slot `1` is empty.

### `onitemlose(inst)`
* **Description:** Event handler for `itemlose` (fired when an item is removed from the inventory). Schedules removal of the entire entity after one frame to ensure the item is fully removed before cleanup.
* **Parameters:** `inst` (Entity) — the salvageable entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `itemlose` — triggers `onitemlose` handler to destroy the entity after item removal.
- **Pushes:** None.