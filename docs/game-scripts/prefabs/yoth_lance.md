---
id: yoth_lance
title: Yoth Lance
description: A consumable ranged weapon component that provides melee combat functionality with lance-specific jousting mechanics.
tags: [combat, consumable, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9f1702b3
system_scope: combat
---

# Yoth Lance

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The Yoth Lance is a consumable weapon prefab that equips as a lance for melee combat. It integrates with the `equippable`, `weapon`, `joustsource`, and `finiteuses` components to provide both standard melee attacks and lance-specific jousting behavior. The lance is consumed after a fixed number of uses, and triggers an animation override when equipped by the player.

## Usage example
```lua
-- Typical usage in a prefab definition (as shown in source)
local inst = Prefab("yoth_lance", fn, assets)
inst:AddComponent("inventoryitem")
-- The component is created and initialized when the prefab is spawned via the game's prefab system
```

## Dependencies & tags
**Components used:** `floater`, `inventoryitem`, `finiteuses`, `weapon`, `joustsource`, `inspectable`, `fencerotator`, `equippable`  
**Tags:** Adds `nopunch`, `sharp`, `pointy`, `lancejab`, `weapon`

## Properties
No public properties

## Main functions
### `onequip(inst, owner)`
*   **Description:** Sets up the visual appearance when the lance is equipped — swaps the carried item symbol and shows the carrying animation.
*   **Parameters:** 
    * `inst` (Entity) - The lance instance.
    * `owner` (Entity) - The entity equipping the lance.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Restores the default arm animation when the lance is unequipped.
*   **Parameters:** 
    * `inst` (Entity) - The lance instance.
    * `owner` (Entity) - The entity unequipping the lance.
*   **Returns:** Nothing.

### `on_uses_finished(inst)`
*   **Description:** Called when the lance exhausts all its uses. Notifies the owner via `toolbroke` event and removes the lance from the world.
*   **Parameters:** 
    * `inst` (Entity) - The lance instance.
*   **Returns:** Nothing.
*   **Error states:** If the grand owner is not found (e.g., missing `inventoryitem` component chain), no event is pushed.

### `OnHitOther(inst, owner, target)`
*   **Description:** Handles visual effect spawning upon successful hit. Chooses between small or large particle effect based on target size.
*   **Parameters:** 
    * `inst` (Entity) - The lance instance.
    * `owner` (Entity) - The entity wielding the lance.
    * `target` (Entity) - The entity hit by the lance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** (None directly — events are handled via component callbacks.)
- **Pushes:** `toolbroke` — fired when `on_uses_finished` triggers, with `{ tool = inst }` as payload.