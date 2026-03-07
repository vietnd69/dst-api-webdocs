---
id: potatosack
title: Potatosack
description: Acts as a heavy, hammerable obstacle that drops loot when destroyed and can be equipped as a body item to modify movement speed and visual appearance.
tags: [inventory, physics, combat, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a137ffe4
system_scope: physics
---

# Potatosack

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `potatosack` prefab represents a physical game object that serves dual purposes: as a non-portable obstacle in the world (with physics properties like weight and submersion handling) and as an equipped item on entities (specifically worn on the body). It integrates with multiple core systems including physics, inventory, equippable, workable (for hammering), burnable (for fire interaction), and loot generation. Its behavior changes based on whether it is in the world (obstacle), in an inventory (item), or equipped on an entity.

## Usage example
```lua
local inst = Prefab("potatosack", fn)
-- When placed in the world, it functions as a heavy obstacle
-- When picked up or equipped, its properties adapt:
inst.components.inventoryitem.cangoincontainer = false
inst.components.equippable.equipslot = EQUIPSLOTS.BODY
inst.components.equippable.walkspeedmult = TUNING.HEAVY_SPEED_MULT
-- It responds to hammering via the workable component:
inst.components.workable:SetOnFinishCallback(onhammered)
```

## Dependencies & tags
**Components used:** `heavyobstaclephysics`, `inspectable`, `inventoryitem`, `symbolswapdata`, `hauntable`, `equippable`, `submersible`, `lootdropper`, `workable`, `burnable`, `propagator`  
**Tags:** Adds `heavy`; checks `burnt` (indirectly via `burnable:IsBurning()` in `onhammered`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gymweight` | number | `1` | Weight value used in gym-related context (non-networked local property). |
| `scrapbook_anim` | string | `"idle_full"` | Animation state used when viewing in scrapbook UI. |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Executed when the potatosack is equipped onto an entity. Overrides the entity's `"swap_body"` symbol with the `"potato_sack"` asset to change visual appearance.
*   **Parameters:**  
    `inst` (Entity) — The potatosack instance being equipped.  
    `owner` (Entity) — The entity receiving the potatosack as an equipped item.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Executed when the potatosack is unequipped. Removes the `"potato_sack"` symbol override from the owner's `"swap_body"` slot.
*   **Parameters:**  
    `inst` (Entity) — The potatosack instance being unequipped.  
    `owner` (Entity) — The entity from which the potatosack is being removed.  
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Callback executed upon successful hammering. Extinguishes any active burning, drops loot, spawns a small collapse FX, and removes the entity.
*   **Parameters:**  
    `inst` (Entity) — The potatosack instance being hammered.  
    `worker` (Entity) — The entity performing the hammering action.  
*   **Returns:** Nothing.
*   **Error states:** If `burnable` component is `nil`, no extinguish attempt is made. If `lootdropper` fails, loot may not drop.

### `onhit(inst, worker)`
*   **Description:** Callback fired during partial hammering work. Plays the `"hit"` animation, followed immediately by returning to `"idle_full"`.
*   **Parameters:**  
    `inst` (Entity) — The potatosack instance being hammered.  
    `worker` (Entity) — The entity performing the hammering action.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (explicit `inst:ListenForEvent` calls not present in this file).
- **Pushes:** None (explicit `inst:PushEvent` calls not present in this file).  
  Note: Components used by this prefab (e.g., `burnable`, `workable`, `lootdropper`) will internally push their own events, but this file does not register handlers or push events directly.