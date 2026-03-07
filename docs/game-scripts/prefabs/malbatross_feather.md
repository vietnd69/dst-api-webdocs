---
id: malbatross_feather
title: Malbatross Feather
description: A lightweight, stackable item used as a cat toy and fuel source that floats on water and animates when dropped or falling.
tags: [inventory, physics, item, fx, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8773879e
system_scope: inventory
---

# Malbatross Feather

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `malbatross_feather` prefab is a small, throwable item used as a cat toy and burnable fuel. It is defined by two separate prefabs: `malbatross_feather` (static/inventory state) and `malbatross_feather_fall` (animated falling state). It integrates with core systems such as `floater` (via `OnLandedServer`), `fuel`, `stackable`, and decorative systems like `snowmandecor`. When thrown or dropped into water, it floats; when thrown at cats (e.g., Wilson's cat), it acts as a toy. It is also usable as low-grade fuel and flammable prop material.

## Usage example
```lua
-- Create a malbatross feather item in inventory
local inst = SpawnPrefab("malbatross_feather")
inst.Transform:SetPosition(x, y, z)

-- Add to an entity's inventory (e.g., player)
player.components.inventory:GiveItem(inst)

-- Drop it into water to trigger floating behavior
player.components.inventory:DropItem(inst)

-- Trigger fall animation and spawn water interaction
local falling = SpawnPrefab("malbatross_feather_fall")
falling.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:**  
- `floater` (via external call: `inst.components.floater:OnLandedServer()`)  
- `fuel` (`fuelvalue`)  
- `stackable` (`maxsize`)  
- Also uses these components implicitly via helper functions: `inspectable`, `inventoryitem`, `snowmandecor`, `smallburnable`, `smallpropagator`, `hauntablelaunch`

**Tags:**  
- Adds `cattoy`, `birdfeather`  
- Inherits tags via `MakeInventoryPhysics`, `MakeInventoryFloatable`, etc.

## Properties
No public properties are declared directly in this script. Configuration is done via `TUNING` constants (e.g., `TUNING.STACK_SIZE_MEDITEM`, `TUNING.TINY_FUEL`, `TUNING.TINY_BURNTIME`) and helper functions.

## Main functions
This is a prefab definition script—not a component—so it defines prefabs (`fn`, `fallfn`) rather than methods. However, two key functions serve as entry points:

### `fn()`
*   **Description:** Constructor for the static/inventory state of the malbatross feather. Sets up transform, animation, physics, inventory, fuel, stackable, and decorative properties.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the fully constructed item prefab instance.
*   **Error states:** Returns early on non-master simulation (client-only) after setting up basic visual components only.

### `fallfn()`
*   **Description:** Constructor for the falling animation state. Plays the "fall" animation and spawns the static `malbatross_feather` prefab upon animation completion, triggering water interaction via `floater:OnLandedServer()`.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the falling animation instance.
*   **Error states:** Returns early on non-master simulation; the event listener may fail if the "animover" event is not dispatched (rare).

## Events & listeners
- **Listens to:** `animover` (in `malbatross_feather_fall` only) — triggers spawn of static feather and calls `OnLandedServer()` after animation completes.
- **Pushes:** `floater_startfloating` — indirectly via `floater:OnLandedServer()` after landing in water (not directly called here, but referenced).