---
id: wagstaff_machinery
title: Wagstaff Machinery
description: Handles the creation, rendering, and destruction logic for the Wagstaff machinery structure, including dynamic debris animation, loot generation, and event signaling.
tags: [structure, loot, event, destruction]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 062c048c
system_scope: world
---

# Wagstaff Machinery

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagstaff_machinery` prefab defines a decorative/interactive structure used in the *Return of the Giants* content. It manages its visual state via debris animation variants, contributes to loot tables during destruction, and emits world-level events upon spawn and removal. It integrates with the `lootdropper`, `workable`, and `inspectable` components to support gameplay interactions like hammering and blueprint drops. The structure does not perform any logic on the client—server-side initialization is separated via `TheWorld.ismastersim`.

## Usage example
```lua
local inst = SpawnPrefab("wagstaff_machinery")
inst.Transform:SetPosition(10, 0, -10)
inst:SetDebrisType(2) -- force debris variant 2
-- later, during hammering:
inst.components.workable:WorkedBy(player)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`  
**Tags added:** `structure`, `wagstaff_machine`, `CLASSIFIED`, `NOCLICK` (for marker only)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `debris_id` | string | `"1"–"3"` (randomly assigned) | Identifier suffix appended to animation states (`idle<id>`, `hit<id>`). |
| `scrapbook_anim` | string | `"idle3"` | Animation name used for the scrapbook view. |

## Main functions
### `SetDebrisType(index)`
*   **Description:** Sets the debris animation variant (1–3) and updates the `debris_id` property. Used to synchronize animation across clients and ensure consistent visuals during state changes.  
*   **Parameters:** `index` (string | number | nil) — Optional override for the debris ID; if nil, a random ID is chosen.  
*   **Returns:** Nothing.  
*   **Error states:** No explicit failure modes; always sets `inst.debris_id` and plays the appropriate animation.  

### `lootsetfn(lootdropper)`
*   **Description:** Dynamically configures loot options for the machinery upon destruction. Loot consists of *wagpunk blueprints*, selected based on which players in range lack the corresponding recipes.  
*   **Parameters:** `lootdropper` (LootDropper component instance) — used to configure random loot rules.  
*   **Returns:** Nothing.  
*   **Error states:** If no players are within 4 tiles (`distance^2 <= 16`), loot is drawn uniformly from all four blueprints; otherwise, only blueprints for unknown recipes are included.  

## Events & listeners
- **Listens to:** None (this entity does not register event listeners via `inst:ListenForEvent`).  
- **Pushes:**  
  - `wagstaff_machine_added` — fired on spawn (`OnSpawned`), passing `inst.GUID`.  
  - `wagstaff_machine_destroyed` — fired on removal (`OnRemoveEntity`), passing `inst.GUID`.  
  - `ms_register_wagstaff_machinery` — fired only by the marker prefab during server init.  
