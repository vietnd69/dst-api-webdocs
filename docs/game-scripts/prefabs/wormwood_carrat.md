---
id: wormwood_carrat
title: Wormwood Carrat
description: Manages the lifecycle, behavior, and visual state of the Carrat pet summoned by Wormwood during lunar alignment, including its transformation into a carrot upon timer expiry or interaction with an owner.
tags: [pet, npc, combat, transformation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2aa15ed7
system_scope: entity
---

# Wormwood Carrat

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wormwood_carrat` is a prefab constructor that defines the behavior and properties of the Carrat pet — a temporary lunar-aligned companion summoned by Wormwood. It integrates with several core systems: `locomotor` for movement, `combat` for damage and attack interactions, `inventory` for a single item slot (used to carry carrots), `lootdropper` for item ejection, and `timer` for automatic transformation after a set lifetime. It responds to events such as attack from its owner (to abort transformation) or timer expiration (to transform into a carrot and drop it). The Carrat also supports stategraph-based animations and sound effects unique to the Turn of Tides content.

## Usage example
```lua
local carrat = SpawnPrefab("wormwood_carrat")
carrat.Transform:SetPosition(x, y, z)
carrat.components.inventory:PushItem(carrot)
```

## Dependencies & tags
**Components used:** `locomotor`, `drownable`, `health`, `lootdropper`, `combat`, `burnable`, `inventory`, `inspectable`, `sleeper`, `timer`, `follower`
**Tags:** Adds `animal`, `catfood`, `cattoy`, `prey`, `smallcreature`, `stunnedbybomb`, `lunar_aligned`, `NOBLOCK`, `notraptrigger`, `wormwood_pet`, `noauradamage`, `soulless`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `no_spawn_fx` | boolean | `true` | Prevents default spawn effects. |
| `RemoveWormwoodPet` | function | `finish_transformed_life` | Reference to the function used to manually trigger Carrat transformation. |
| `sounds` | table | `carratsounds` | Sound event keys mapping to asset paths. |
| `sg.mem.burn_on_electrocute` | boolean | `true` | Enables burning damage on electrocution. |

## Main functions
### `finish_transformed_life(inst)`
*   **Description:** Transforms the Carrat into a carrot, drops it, clears inventory, spawns a transformation FX prefab, and removes the Carrat entity.
*   **Parameters:** `inst` (Entity) — the Carrat entity instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if called on an invalid or already-removed entity.

### `OnTimerDone(inst, data)`
*   **Description:** Handles the completion of the `finish_transformed_life` timer by triggering `finish_transformed_life`.
*   **Parameters:** 
  * `inst` (Entity) — the Carrat instance.
  * `data` (table) — timer data containing at least `name`.
*   **Returns:** Nothing.
*   **Error states:** Only acts if `data.name == "finish_transformed_life"`; otherwise does nothing.

### `OnAttacked(inst, data)`
*   **Description:** If the attacker is the Carrat's owner (checked via `petleash:IsPet`), aborts the timer and triggers immediate transformation.
*   **Parameters:** 
  * `inst` (Entity) — the Carrat instance.
  * `data` (table) — attack event data containing `attacker`.
*   **Returns:** Nothing.
*   **Error states:** Only triggers transformation if attacker is the owner *and* the `finish_transformed_life` timer exists.

## Events & listeners
- **Listens to:** `attacked` — used to abort transformation if the attacker is the Carrat's owner.
- **Listens to:** `timerdone` — used to trigger transformation upon timer expiry.
- **Pushes:** None directly (uses entity removal as final action).