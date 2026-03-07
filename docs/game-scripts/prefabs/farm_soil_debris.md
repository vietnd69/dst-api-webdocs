---
id: farm_soil_debris
title: Farm Soil Debris
description: A temporary debris object that appears when farm soil is worked, dropping randomized loot upon destruction.
tags: [environment, loot, interact, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 20dceb0e
system_scope: environment
---

# Farm Soil Debris

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`farm_soil_debris` is a non-player entity that appears temporarily above farm soil when it is dug or disturbed. It serves as a visual and gameplay bridge: it animates into existence, persists briefly, then self-destructs to trigger dirt puff effects and attempt loot drops via the `lootdropper` component. The debris is handled on the master sim only and does not replicate to clients, making it purely local to the authoritative simulation.

## Usage example
This prefab is automatically spawned by other systems (e.g., when farm soil is worked) and does not require direct instantiation by modders. A typical usage pattern is:

```lua
-- Example: how the game creates debris (not modder-facing)
local debris = SpawnPrefab("farm_soil_debris")
debris.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `lootdropper`  
**Tags:** Adds `farm_debris`, `farm_plant_killjoy`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `"f1"|"f2"|"f3"|"f4"` | Randomly selected animation name (one of `anim_names`) used during spawn and save/load. |

## Main functions
### `onfinishcallback(inst, worker)`
* **Description:** Called when the `workable` component finishes work on this debris. Spawns a dirt puff at the debris position and removes the debris. Attempts a luck-based loot drop using `lootdropper:SpawnLootPrefab`.
* **Parameters:**  
  `inst` (Entity) — the debris instance.  
  `worker` (Entity) — the entity that performed the work (e.g., a character).
* **Returns:** Nothing.
* **Error states:** Loot only spawns if `TryLuckRoll` succeeds, based on `TUNING.FARM_SOIL_DEBRIS_LOOT_CHANCE`. No error is thrown if loot fails to spawn.

## Events & listeners
- **Listens to:** —  
- **Pushes:** `inst:PushEvent("loot_prefab_spawned", {loot = loot})` — fired internally when loot is spawned (via `lootdropper:SpawnLootPrefab`).