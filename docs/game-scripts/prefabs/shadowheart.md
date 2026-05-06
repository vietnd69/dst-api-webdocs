---
id: shadowheart
title: Shadowheart
description: Defines the Shadowheart prefab, a socketable inventory item with pulsing animation and sound effects.
tags: [item, inventory, socketable, wx78]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 786a6ec6
system_scope: inventory
---

# Shadowheart

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Shadowheart` is a socketable inventory item prefab designed for WX-78 character interactions. When dropped on the ground, it plays a pulsing animation and sound effect at randomized intervals. When picked up or placed in inventory, the animation loop stops. It integrates with the socketable system for item enhancement mechanics.

## Usage example
```lua
-- Spawn the Shadowheart item in the world
local shadowheart = SpawnPrefab("shadowheart")

-- Access components for modification
shadowheart.components.socketable:SetSocketQuality(SOCKETQUALITY.MEDIUM)
shadowheart.components.inventoryitem:SetOnDroppedFn(customDropFn)

-- Check if entity has the shadowheart tag
if shadowheart:HasTag("shadowheart") then
    -- Entity is a Shadowheart item
end
```

## Dependencies & tags
**External dependencies:**
- `prefabs/wx78_common` -- provides `MakeItemSocketable` function for WX-78 socket integration

**Components used:**
- `inventoryitem` -- handles drop/pickup callbacks via SetOnDroppedFn and SetOnPutInInventoryFn
- `socketable` -- enables socket quality setting via SetSocketQuality
- `inspectable` -- allows players to examine the item
- `tradable` -- enables trading mechanics with other players

**Tags:**
- `shadowheart` -- added to identify this specific item type

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `beattask` | task | `nil` | Reference to the scheduled beat animation task. Cancelled on pickup. |

## Main functions
### `beat(inst)`
* **Description:** Internal function that plays the idle animation and shadow heart sound, then schedules the next beat cycle with randomized timing between 0.75 and 1.5 seconds.
* **Parameters:** `inst` -- the Shadowheart entity instance
* **Returns:** None
* **Error states:** Errors if `inst.AnimState` or `inst.SoundEmitter` is nil (entity missing required entity components).

### `ondropped(inst)`
* **Description:** Callback fired when the item is dropped from inventory. Cancels any existing beat task and starts a new beat animation loop.
* **Parameters:** `inst` -- the Shadowheart entity instance
* **Returns:** None
* **Error states:** None

### `onpickup(inst)`
* **Description:** Callback fired when the item is picked up or placed in inventory. Cancels the beat animation task and clears the task reference.
* **Parameters:** `inst` -- the Shadowheart entity instance
* **Returns:** None
* **Error states:** None

### `fn()`
* **Description:** Prefab constructor function that creates the Shadowheart entity, attaches all required components, and initializes the beat animation system. Runs on both server and client for visual components, with server-only logic for gameplay components.
* **Parameters:** None
* **Returns:** Entity instance
* **Error states:** Errors if called outside of prefab system context where `CreateEntity()` is unavailable.

## Events & listeners
- **Listens to:** None directly (uses inventoryitem component callbacks instead of entity events)
- **Pushes:** None identified