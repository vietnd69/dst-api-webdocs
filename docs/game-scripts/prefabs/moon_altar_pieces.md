---
id: moon_altar_pieces
title: Moon Altar Pieces
description: Defines prefabs for collectible moon altar components, including decorative pieces, mineable rocks, and markers, used in constructing and interacting with moon altars.
tags: [environment, puzzle, collection]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b26f3e7b
system_scope: environment
---

# Moon Altar Pieces

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moon_altar_pieces.lua` defines three types of prefabs used in the moon altar gameplay loop:  
1. **Decorative altar pieces** (`makepiece`) — equipped items that can be placed on a moon altar and repair it.  
2. **Mineable rocks** (`makerockpiece`) — boulders that yield altar pieces upon being mined.  
3. **Markers** (`makemarker`) — invisible entities used for tracking altar-related events.  

The file is not a component itself but a *prefab factory*—it returns prefab definitions via `Prefab(...)`. It uses many core components (`equippable`, `workable`, `repairer`, `lootdropper`, `heavyobstaclephysics`, etc.) to define how these entities behave in-world.

## Usage example
```lua
-- Example: Spawn a moon altar rock piece and mine it
local rock = SpawnPrefab("moon_altar_rock_idol")
rock.Transform:SetPosition(10, 0, 10)

-- After mining completes, it spawns "moon_altar_idol" and collapses
-- Example: Equip a moon altar piece
local piece = SpawnPrefab("moon_altar_idol")
player.components.inventory:GiveItem(piece)
player.components.equippable:Equip(piece, EQUIPSLOTS.BODY)
```

## Dependencies & tags
**Components used:**  
`heavyobstaclephysics`, `inspectable`, `inventoryitem`, `equippable`, `repairer`, `submersible`, `symbolswapdata`, `hauntable`, `lootdropper`, `workable`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`

**Tags added:**  
- `irreplaceable`, `nonpotatable`, `heavy` (altar pieces)  
- `boulder` (altar rocks)  
- `moon_altar_marker` (markers)

## Properties
No public properties are defined directly in this file’s scope, as it defines prefabs, not components. Each prefab instance may hold private properties (e.g., `inst._socket_product`, `inst._altar_piece`) for internal logic.

## Main functions
### `makepiece(name, socket_product)`
*   **Description:** Factory function that returns a prefab definition for an equipable, repair-capable altar piece (e.g., "idol", "glass"). When equipped, it overrides the player’s body animation; when used on a moon altar, it repairs the altar.
*   **Parameters:**  
    `name` (string) – Base name used in asset paths and prefabs (e.g., `"idol"`).  
    `socket_product` (string or nil) – Optional product name used during altar interaction.
*   **Returns:** `Prefab` – The constructed prefab.
*   **Error states:** None. Works as long as assets exist.

### `makerockpiece(name, socket_product)`
*   **Description:** Factory function that returns a prefab definition for a mineable boulder rock. Mining it yields an altar piece. Contains logic for speech announcements at mine thresholds and animation switching based on remaining work.
*   **Parameters:**  
    `name` (string) – Base name (e.g., `"idol"`).  
    `socket_product` – Not used (passed but ignored internally).
*   **Returns:** `Prefab` – The constructed rock prefab.

### `OnWork(inst, worker, workleft, numworks)`
*   **Description:** Callback triggered during or after mining the rock. Handles voice lines, spawning the altar piece upon full completion, and switching animations.
*   **Parameters:**  
    `inst` (Entity) – The rock entity.  
    `worker` (Entity or nil) – The entity performing the work.  
    `workleft` (number) – Remaining work units.  
    `numworks` (number) – Work units applied this tick.
*   **Returns:** Nothing.
*   **Error states:**  
    - No voice line if `worker` is nil or lacks `talker` component.  
    - Spawning may fail if `inst._altar_piece` is missing.

### `makemarker(name, socket_product)`
*   **Description:** Factory function that returns a minimal, invisible marker prefab used for event registration (e.g., with `calling_moon_relics`).
*   **Parameters:** Ignored (`name`, `socket_product`).
*   **Returns:** `Prefab` – The marker entity definition.

## Events & listeners
- **Listens to:** `calling_moon_relics` – All altar pieces and rocks register themselves via `data.caller:RegisterDevice(inst)` when this event is fired in the world.  
- **Pushes:** None directly. The `OnWork` callback does not push events; it triggers side effects (spawn, sound, talk).

## Notes
- Altar pieces are *not* reusable once placed; they are removed on successful altar repair.
- Altar rocks are tagged `boulder` and mineable via `ACTIONS.MINE`; their total work (`TUNING.MOONALTAR_ROCKS_MINE`) is split across three stages with voice/animation triggers.
- The prefabs returned match naming patterns like `"moon_altar_idol"` and `"moon_altar_rock_idol"` and are exposed in the global scope via a variadic return.