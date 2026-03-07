---
id: canary_poisoned
title: Canary Poisoned
description: Represents a poisoned canary entity that cannot be picked up while alive or dead, spoils over time, and drops spoiled food upon death.
tags: [bird, inventory, perishable, loot, stategraph]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0f85b24e
system_scope: entity
---

# Canary Poisoned

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`canary_poisoned` is a prefab representing a poisoned canary creature. It is a non-player entity that enters a "struggling" state, cannot be picked up by players while alive or dead, and begins spoiling (perishing) only after being placed in an inventory. It uses the `SGcanarypoisoned` state graph and integrates with the `health`, `inventoryitem`, `perishable`, `lootdropper`, and `hauntable` components to simulate its behavior in the game world.

## Usage example
This prefab is instantiated automatically via the Prefab system. Typical usage involves spawning it as part of game logic (e.g., after a player consumes contaminated food), where it automatically handles spoilage, loot dropping, and pickup restrictions.

```lua
-- Spawn example (not usually needed directly)
local inst = TheWorld:PushWorldEntity("canary_poisoned")
-- The entity is pre-configured by its constructor (`fn`)
-- and starts with 48% spoilage, no loot yet, and pickup disabled.
```

## Dependencies & tags
**Components used:** `lootdropper`, `inventoryitem`, `health`, `combat`, `inspectable`, `hauntable`, `perishable`  
**Tags added:** `bird`, `canary`, `smallcreature`, `small_livestock`, `show_spoilage`, `sickness`, `untrappable`

## Properties
No public properties are defined in the constructor. All configuration is done via component method calls.

## Main functions
The constructor defines only private helper functions (`PreventPickup`, `AllowPickup`, `OnPutInInventory`, `OnDropped`). These are used as callbacks by `inventoryitem`:

### `PreventPickup(inst)`
*   **Description:** Disables pickup for the entity by setting `canbepickedup` to `false`. Typically called on `death` or `freeze` events.
*   **Parameters:** `inst` (Entity) — The canary entity instance.
*   **Returns:** Nothing.

### `AllowPickup(inst)`
*   **Description:** Enables pickup only if the entity is not in the `nopickup` state tag and is not dead. Called on `unfreeze` events.
*   **Parameters:** `inst` (Entity) — The canary entity instance.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Starts the spoilage timer when the canary is placed into a player's inventory.
*   **Parameters:** `inst` (Entity) — The canary entity instance.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Stops spoilage and transitions the canary to the `"dropped"` state if it is not dead. Prevents further spoilage while on the ground.
*   **Parameters:** `inst` (Entity) — The canary entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` — triggers `PreventPickup` to disable pickup.
- **Listens to:** `freeze` — triggers `PreventPickup` to disable pickup while frozen.
- **Listens to:** `unfreeze` — triggers `AllowPickup` to re-enable pickup if conditions are met.
- **Pushes:** None directly. Event emission is handled by attached components (e.g., `perishable` fires `perishchange`, `health` fires `death`), but this prefab does not register custom listeners for those events.