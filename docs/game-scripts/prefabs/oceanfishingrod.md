---
id: oceanfishingrod
title: Oceanfishingrod
description: Implements the ocean fishing rod item, managing tackle slots, reticule targeting, and fishing state transitions in Don't Starve Together.
tags: [fishing, equipment, container, combat, ui]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 501e824f
system_scope: inventory
---

# Oceanfishingrod

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`oceanfishingrod` is a prefab definition for the Ocean Fishing Rod, a specialized tool for ocean fishing. It integrates multiple components to handle equipment interactions, container-based tackle storage (bobber and lure slots), reticule-based targeting over water, and combat functionality. It is tightly coupled with `oceanfishingrod` (the component), `container`, `equippable`, `weapon`, and `reticule` to provide a complete fishing experience.

## Usage example
```lua
local inst = Prefab("oceanfishingrod", fn, assets, prefabs)()
-- This prefab is instantiated by the game engine and adds itself with:
inst:AddComponent("oceanfishingrod")
inst:AddComponent("container")
inst:AddComponent("equippable")
inst:AddComponent("weapon")
inst:AddComponent("reticule")
-- Reticule behavior is customized for ocean fishing
```

## Dependencies & tags
**Components used:** `container`, `equippable`, `oceanfishingrod`, `reticule`, `weapon`, `inspectable`, `inventoryitem`, `inventoryitemmoisture`, `oceanfishingtackle`, `oceanfishinghook`, `playercontroller`.  
**Tags added:** `weapon`, `allow_action_on_impassable`, `accepts_oceanfishingtackle`.

## Properties
No public properties are defined in this file.

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the rod is equipped by a player. Sets up skinned animation overrides, shows the "ARM_carry" animation, and opens the rod's container UI.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `owner` (Entity) - the player equipping the rod.
*   **Returns:** Nothing.
*   **Error states:** Non-fatal: skips skin overrides if no skin build is present.

### `onunequip(inst, owner)`
*   **Description:** Called when the rod is unequipped. Restores normal arm animations, clears fishing-related symbol overrides, and closes the container.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `owner` (Entity) - the player unequipping the rod.
*   **Returns:** Nothing.
*   **Error states:** Non-fatal: skin events still fire even if no skin build is present.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Called when equipping the rod to a model (e.g., holding it while constructing). Always closes the container to prevent UI from persisting incorrectly.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `owner` (Entity) - the entity holding the rod; `from_ground` (boolean) - whether the rod was picked up from the ground.
*   **Returns:** Nothing.

### `GetTackle(inst)`
*   **Description:** Returns a table containing the bobber (slot 1) and lure (slot 2) if both container and oceanfishingrod components exist.
*   **Parameters:** `inst` (Entity) - the fishing rod instance.
*   **Returns:** Table `{ bobber = <item or nil>, lure = <item or nil> }`, or an empty table `{}` if preconditions fail.
*   **Error states:** Returns `{}` if `inst.components.container` or `inst.components.oceanfishingrod` is missing.

### `OnTackleChanged(inst, data)`
*   **Description:** Callback fired when items are added or removed from the rod's container. Triggers a client-side update to the maximum casting distance.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `data` (table) - event payload (unused).
*   **Returns:** Nothing.

### `reticuletargetfn(inst)`
*   **Description:** Determines the target position for the reticule. Prioritizes entities with the `oceanfishingfocus` tag within the cast radius and player's forward arc; otherwise defaults to a point ahead of the player on the water surface.
*   **Parameters:** `inst` (Entity) - the fishing rod instance.
*   **Returns:** `Vector3` target position (in world coordinates) where the rod should cast.
*   **Error states:** Returns default vector if `inst.replica.oceanfishingrod` is nil; uses `ThePlayer` globals.

### `ReticuleValidFn(inst, reticule, targetpos, alwayspassable, allowwater, deployradius)`
*   **Description:** Validates that the reticule target is over ocean water or a virtual ocean entity.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `reticule` (Reticule) - the reticule component; `targetpos` (Vector3) - proposed target position; other args reserved for generic reticule use.
*   **Returns:** `true` if the target is over ocean water, `false` otherwise.

### `reticuleshouldhidefn(inst)`
*   **Description:** Hides the reticule when the rod is held but the player is not currently in the "fishing" state.
*   **Parameters:** `inst` (Entity) - the fishing rod instance.
*   **Returns:** `true` if the reticule should be hidden, `false` otherwise.

### `OnStartedFishing(inst, fisher, target)`
*   **Description:** Fired when fishing starts. Closes the rod's container to prevent interaction during casting.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `fisher` (Entity) - the player fishing; `target` (Entity or Vector3) - the fishing target.
*   **Returns:** Nothing.

### `OnDoneFishing(inst, reason, lose_tackle, fisher, target)`
*   **Description:** Fired when fishing completes. Destroys container contents if tackle is lost; otherwise reopens the container for the player.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `reason` (string) - fishing result; `lose_tackle` (boolean) - whether tackle was consumed; `fisher` (Entity), `target` (Entity) - participants.
*   **Returns:** Nothing.

### `OnHookedSomething(inst, target)`
*   **Description:** Called when a fish or object is hooked. Soaks items in the container if hooked over water; otherwise consumes single-use tackle.
*   **Parameters:** `inst` (Entity) - the fishing rod instance; `target` (Entity) - the hooked entity or projectile.
*   **Returns:** Nothing.
*   **Error states:** Skips processing if `target` is nil or lacks expected components.

## Events & listeners
- **Listens to:** `itemget` - triggers `OnTackleChanged` when items are added to container.
- **Listens to:** `itemlose` - triggers `OnTackleChanged` when items are removed from container.
- **Pushes:** (None directly; delegates to components and sub-functions for event dispatch.)
