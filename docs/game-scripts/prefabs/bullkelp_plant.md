---
id: bullkelp_plant
title: Bullkelp Plant
description: A decorative underwater kelp plant prefab that can be harvested and regrows over time; also handles beached migration logic when moved ashore.
tags: [harvest, environment, regrowth, underwater]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d59968c9
system_scope: environment
---

# Bullkelp Plant

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bullkelp_plant` prefab represents a harvestable underwater vegetation structure in DST. It consists of two nested entities: a visible above-water root part and an underwater leaf part (`bullkelp_plant_leaves`). It uses the `pickable` component to manage harvesting, regrowth, and visual feedback. When moved ashore (e.g., via player collision or physics), it detects the beached condition and spawns a `bullkelp_root` item before removing itself. This prefab is part of the game's environmental decoration and resource-gathering loop, tied to underwater ecology mechanics.

## Usage example
This prefab is not typically instantiated directly by modders. Instead, it is loaded via the world generation system in oceanic biomes. When spawning manually for testing or custom content, use:

```lua
local plant = SpawnPrefab("bullkelp_plant")
if plant ~= nil then
    plant.Transform:SetPosition(x, y, z)
    -- Optional: adjust properties via components
    plant.components.pickable.protected_cycles = 3
end
```

## Dependencies & tags
**Components used:** `pickable`, `inspectable`  
**Tags:** Adds `kelp` and `DECOR` (to underwater leaf entity); checks `withered` during regrowth.  
**Prefabs spawned internally:** `kelp`, `bullkelp_root`, `bullkelp_plant_leaves`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AnimState` | AnimState component | — | Manages above-ground visuals; bank `"bullkelp"`, build `"bullkelp"`, plays `"idle"` animation by default. |
| `underwater` | Entity | `SpawnPrefab("bullkelp_plant_leaves")` | The nested underwater leaf entity; parented to `inst.entity`. |
| `pickable` | Pickable component | — | Attached via `inst:AddComponent("pickable")`; regrowth time from `TUNING.BULLKELP_REGROW_TIME`. |
| `_checkgroundtask` | Task | `nil` | Delayed task used to debounce ground-checking after collisions. |

## Main functions
### `CheckBeached(inst)`
* **Description:** Periodically checks if the bullkelp has been moved ashore (e.g., via collision or external forces). If so, it immediately harvests the plant as if picked by `TheWorld`, spawns a `bullkelp_root` item at the location, and removes the plant.
* **Parameters:** `inst` (Entity) — the bullkelp plant instance.
* **Returns:** Nothing.
* **Error states:** Uses `inst:GetCurrentPlatform()` and `TheWorld.Map:IsVisualGroundAtPoint(...)` to detect beached state; safely handles missing `pickable` component.

### `OnCollide(inst, other)`
* **Description:** Collision callback invoked when the plant collides with another entity. Defers beached detection to a staggered task (`CheckBeached`) to avoid excessive checks during physics resolution.
* **Parameters:**  
  `inst` (Entity) — the bullkelp plant.  
  `other` (Entity) — the colliding entity (unused in implementation).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `Collision` (via `inst.Physics:SetCollisionCallback(OnCollide)`)  
- **Pushes:**  
  - `picked` — fired when `pickable:Pick()` is called (includes `picker` and `loot` in event data)  
  - Internally, `onpickedfn` and `onregenfn` callbacks also trigger animation events (e.g., `"picking"`, `"grow"`).

> Note: The prefab itself does not register explicit `inst:ListenForEvent()` handlers; events are handled via callback hooks on the `pickable` component (`onpickedfn`, `onregenfn`, `makeemptyfn`).