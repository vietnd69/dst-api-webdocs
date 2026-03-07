---
id: wendy_resurrectiongrave
title: Wendy Resurrectiongrave
description: Manages a special resurrection altar for Wendy that allows linking to a player and consuming health to enable resurrection of fallen allies.
tags: [resurrection, structure, utility, linked]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8d4586ed
system_scope: entity
---

# Wendy Resurrectiongrave

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wendy_resurrectiongrave` is a structure prefab that serves as Wendy's unique resurrection device. It functions as an attunable altar that can be linked to a specific player. Once linked, it enables the resurrection of that player's ghost by consuming a health cost. The component handles lighting, sound, naming, and interaction callbacks for the graveyard structure, and integrates with the `attunable`, `fader`, `named`, and `workable` systems to provide its gameplay functionality.

## Usage example
```lua
-- Typically instantiated via the game's prefabs system
local grave = Prefab("wendy_resurrectiongrave", fn, assets, prefabs)
local inst = grave.fn()

-- After building, it auto-links to the builder if attunement succeeds
-- When a player resurrects:
inst:PushEvent("activateresurrection", { resurrect_target = player_entity })
```

## Dependencies & tags
**Components used:** `attunable`, `fader`, `inspectable`, `lootdropper`, `named`, `workable`, `light`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** Adds `structure`, `resurrector`, `DECOR`; checks `NOCLICK`, `FX`, `_named`  
**Tags removed during init (on mastersim):** `_named`

## Properties
No public properties initialized in the constructor.

## Main functions
### `onattunecost(inst, player)`
*   **Description:** Calculates and deducts the health cost required to attune or relink the grave. Prevents death during cost deduction.
*   **Parameters:** `inst` (Entity), `player` (PlayerEntity) — the player attempting to attune.
*   **Returns:** `true` if cost is successfully deducted; `false, "NOHEALTH"` if player health is insufficient.
*   **Error states:** Returns `false` with `"NOHEALTH"` if player's current health (accounting for `health_as_oldage` tag) is `<=` the penalty amount.

### `onlink(inst, player, isloading)`
*   **Description:** Activates the grave's lighting and animation when successfully linked to a player. Names the grave after the player.
*   **Parameters:** `inst` (Entity), `player` (PlayerEntity), `isloading` (boolean) — true if called during world load.
*   **Returns:** Nothing.
*   **Error states:** Skips sound and animation if `isloading` is `true`.

### `onunlink(inst, player, isloading)`
*   **Description:** Deactivates lighting and animation when the grave is unlinked. Removes the player-specific name.
*   **Parameters:** `inst` (Entity), `player` (PlayerEntity), `isloading` (boolean).
*   **Returns:** Nothing.
*   **Error states:** Skips sound and animation if `isloading` is `true` or grave is currently animating `"attune_on"`.

### `onbuilt(inst, data)`
*   **Description:** Handles post-construction logic: auto-links to builder, triggers animations and lighting, and restores callbacks after temporary override.
*   **Parameters:** `inst` (Entity), `data` (table) — includes `builder` (PlayerEntity).
*   **Returns:** Nothing.
*   **Error states:** May skip sound/animation if linking fails internally.

### `onactivateresurrection(inst, resurrect_target)`
*   **Description:** Initiates resurrection sequence: removes physics collisions, adds `DECOR` tag, disables persistence, and schedules slide-out animation after 67 frames (~1.1s).
*   **Parameters:** `inst` (Entity), `resurrect_target` (Entity) — the ghost entity to resurrect.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the grave is hammered; drops loot and spawns a big collapse FX before removing the entity.
*   **Parameters:** `inst` (Entity), `worker` (Entity) — the player hammering.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Plays the "hit" animation followed by a loop of "idle" during construction.
*   **Parameters:** `inst` (Entity), `worker` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` — triggers `onbuilt` callback to auto-link and animate on build.  
  - `"activateresurrection"` — triggers `onactivateresurrection` to begin resurrection sequence.  
  - `"animover"` — in FX prefabs (`abigail_gravestone_rebirth_fx`, `wendy_gravestone_rebirth_fx`), removes the FX entity.
- **Pushes:**  
  - `"consumehealthcost"` — pushed on player when health cost is deducted.  
  - `"healthdelta"` — indirectly via `health:DoDelta(...)`.  
  - `"entity_droploot"` — indirectly via `lootdropper:DropLoot(...)`.