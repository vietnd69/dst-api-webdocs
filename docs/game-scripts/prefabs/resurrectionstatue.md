---
id: resurrectionstatue
title: Resurrectionstatue
description: Manages the resurrection statue entity, allowing players to attune it to复活 dead players in DST.
tags: [combat, resurrection, attunement, structure]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 99b93252
system_scope: entity
---

# Resurrectionstatue

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`resurrectionstatue` is a prefabricated structure entity that serves as a resurrection device for dead players. It uses the `attunable`, `burnable`, `workable`, and `lootdropper` components to manage player linking, burning behavior, hammering interaction, and loot drops. When attuned to a player, it enables remote resurrection using that player’s essence (retrieved from a dead body or by sacrificing a clone). The statue will extinguish when hammered while burning and transitions to a burnt state permanently upon full combustion.

## Usage example
```lua
local inst = SpawnPrefab("resurrectionstatue")
inst.Transform:SetPosition(player.Transform:GetWorldPosition())
inst.components.attunable:LinkToPlayer(player) -- Attune to a living player
```

## Dependencies & tags
**Components used:**  
- `lootdropper`
- `workable`
- `burnable`
- `attunable`
- `inspectable`
- `soundemitter`
- `animstate`
- `minimapentity`
- `transform`
- `network`
- `health` (indirectly, for attunement cost checks)

**Tags:**  
- `structure`
- `resurrector`
- `burnt` (added conditionally via `burnable` component)

## Properties
No public properties defined directly on this prefab or its associated component. All state is managed via component methods.

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles hammer interaction. Extinguishes the statue if it is burning, then drops loot appropriate to its burn state and spawns collapse FX.
*   **Parameters:**  
    - `inst` (Entity) — The resurrection statue instance.  
    - `worker` (Entity) — The entity performing the hammer action (usually a player).  
*   **Returns:** Nothing.
*   **Error states:** None.

### `onburnt(inst)`
*   **Description:** Called when the statue finishes burning. Removes the `attunable` component and delegates to `DefaultBurntStructureFn`.
*   **Parameters:**  
    - `inst` (Entity) — The burnt statue instance.  
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Plays the “hit” animation on the statue during hammering if not already burnt.
*   **Parameters:**  
    - `inst` (Entity) — The statue instance.  
    - `worker` (Entity) — The entity hitting the statue.  
*   **Returns:** Nothing.

### `onattunecost(inst, player)`
*   **Description:** Calculates and deducts the health penalty for attuning the statue to a player. Returns `false` with reason `"NOHEALTH"` if the player has insufficient health.
*   **Parameters:**  
    - `inst` (Entity) — The statue instance.  
    - `player` (Entity) — The player attempting to attune.  
*   **Returns:**  
    - `true` on success.  
    - `false, "NOHEALTH"` if `player.components.health.currenthealth` is too low.

### `onlink(inst, player, isloading)`
*   **Description:** Plays attunement sound and animation when a player successfully links to the statue. Skips FX during load.
*   **Parameters:**  
    - `inst` (Entity) — The statue instance.  
    - `player` (Entity) — The player linking.  
    - `isloading` (boolean) — Whether the call occurs during world load.  
*   **Returns:** Nothing.

### `onunlink(inst, player, isloading)`
*   **Description:** Plays unlink sound and animation when a player detaches. Skips if loading or during current attunement animation.
*   **Parameters:**  
    - `inst` (Entity) — The statue instance.  
    - `player` (Entity) — The player unlinking.  
    - `isloading` (boolean) — Whether the call occurs during world load.  
*   **Returns:** Nothing.

### `onbuilt(inst, data)`
*   **Description:** Custom callback fired after construction. Automatically attunes the statue to its builder using a temporary override hack (disabling callbacks during first link), then restores them.
*   **Parameters:**  
    - `inst` (Entity) — The newly built statue instance.  
    - `data` (table) — Build data containing `builder` entity.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` — Triggers `onbuilt` to auto-attune to builder.  
  - `"activateresurrection"` — Removes the entire statue entity (used for one-time activation).  
  - `"onremove"` — Registered per attuned player to track death/removal (via `attunable` component).  
  - `"attuned"` — Registered per attuned player to handle secondary attunement (via `attunable` component).  
- **Pushes:**  
  - `"healthdelta"` — Via `health:DoDelta` when deducting attunement cost.  
  - `"attuned"` — Via `attunable` on successful linking (via component listener).  
  - `"consumehealthcost"` — To notify player of health deduction during attunement.

