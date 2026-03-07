---
id: spiderhole
title: Spiderhole
description: A spawner entity that periodically generates spider minions and releases them when mined; it transforms into a mineable rock when fully depleted.
tags: [spider, enemy, spawner, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ae894d0e
system_scope: world
---

# Spiderhole

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spiderhole` prefab represents a cavern-dwelling spider spawner that dynamically produces spider minions (primarily `spider_hider`, with rare `spider_spitter` variants) over time. It exists in two states: as an active spawner entity and as a depleted rock (`spiderhole_rock`). When mined, the spawner releases all currently available children, then transforms into a loot-dropping rock. The component integrates with `childspawner`, `workable`, `health`, `lootdropper`, `hauntable`, and `knownlocations` to manage spawning, mining, death, loot, haunting, and investigating behaviors.

## Usage example
```lua
-- Typical usage in Prefab definition:
return Prefab("spiderhole", spawnerfn, assets, prefabs),
       Prefab("spiderhole_rock", rockfn, assets, prefabs)

-- In `spawnerfn`, the component setup includes:
inst:AddComponent("childspawner")
inst.components.childspawner:SetMaxChildren(5)
inst.components.childspawner:SetSpawnPeriod(120)
inst.components.childspawner:SetRegenPeriod(180)
inst.components.childspawner:StartSpawning()
```

## Dependencies & tags
**Components used:**  
`health`, `workable`, `childspawner`, `lootdropper`, `hauntable`, `knownlocations`, `inventory`, `sleeper`, `spooked`  
**Tags:** Adds `cavedweller`, `spiderden`; checks `playerghost`, `spider`, `INLIMBO`, `bus`, `decoration`, `building`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_proxy` | string | `"spiderhole_rock"` | Prefab name used when viewing in scrapbook. |
| `scrapbook_anim` | string | `"full"` | Animation bank used in scrapbook view. |
| `SummonsChildren` | function | `SummonChildren` | Public method invoked when the spawner is targeted for spawning (e.g., by quake events). |

## Main functions
### `OnQuakeBegin(inst)`
*   **Description:** Wakes up all spider children currently outside the hole when a world quake begins, ensuring they do not remain asleep during the event.
*   **Parameters:** `inst` (Entity) — the spiderhole instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if `childspawner` component is missing.

### `OnQuakeEnd(inst)`
*   **Description:** Removes the `_quaking` flag from all spider children outside the hole once the quake ends.
*   **Parameters:** `inst` (Entity) — the spiderhole instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if `childspawner` component is missing.

### `rock_onworked(inst, worker, workleft)`
*   **Description:** Handles mining of the rock variant (`spiderhole_rock`). Triggers FX, drops loot, and removes the entity when mining completes.
*   **Parameters:**  
    - `inst` (Entity) — the rock instance being mined.  
    - `worker` (Entity) — the entity performing the mining.  
    - `workleft` (number) — remaining work required; triggers FX/haunt logic before completion.
*   **Returns:** Nothing.
*   **Error states:** No FX or loot is dropped if `workleft > 0`. Haunt reaction triggers only if `worker.components.spooked` is present.

### `spawner_onfinish(inst, worker)`
*   **Description:** Converts the spawner into `spiderhole_rock` upon full mining.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole spawner instance.  
    - `worker` (Entity) — the mining entity.
*   **Returns:** Nothing.
*   **Error states:** Haunt effect may be triggered before conversion if `worker.components.spooked` is present.

### `SpawnInvestigators(inst, data)`
*   **Description:** Spawns up to two spider children outside the hole to investigate the last known location of a specific entity (e.g., player) if triggered by `creepactivate`.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole instance.  
    - `data` (table) — expected to contain `target`, a valid entity.
*   **Returns:** Nothing.
*   **Error states:** No effect if spawner is dead, missing `childspawner`/`knownlocations` on children, or `data.target` is absent.

### `SummonChildren(inst, data)`
*   **Description:** Forces immediate release of all available spider children, applies a debuff to them, and skips regen logic.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole instance.  
    - `data` (table) — not used in implementation.
*   **Returns:** Nothing.
*   **Error states:** Early exit if spawner is dead or missing `childspawner`.

### `spawner_onworked(inst, worker, workleft)`
*   **Description:** Called during mining of the spawner; immediately releases all available children and does not wait for mining to finish.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole instance.  
    - `worker` (Entity) — the mining entity.  
    - `workleft` (number) — unused in implementation.
*   **Returns:** Nothing.

### `OnGoHome(inst, child)`
*   **Description:** Drops any equipped head item (e.g., hat) before a spider returns home.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole instance (unused).  
    - `child` (Entity) — the spider returning home.
*   **Returns:** Nothing.

### `commonfn(anim, minimap_icon, tag, hascreep)`
*   **Description:** Shared constructor logic for both `spiderhole` and `spiderhole_rock`. Sets up visual, network, physics, and basic tags.
*   **Parameters:**  
    - `anim` (string) — animation to play (`"full"` or `"med"`).  
    - `minimap_icon` (string or nil) — icon filename for minimap.  
    - `tag` (string or nil) — optional additional tag (e.g., `"spiderden"`).  
    - `hascreep` (boolean) — whether ground creep is added.
*   **Returns:** `inst` (Entity) — partially initialized entity.

### `CanTarget(guy)`
*   **Description:** Predicate function used during haunting/targeting — only targets entities that are alive.
*   **Parameters:** `guy` (Entity) — the candidate entity.
*   **Returns:** `true` if `guy` is alive, else `false`.

### `CustomOnHaunt(inst, haunter)`
*   **Description:** Custom haunt reaction that attempts to mine the spawner upon haunting (50% chance), triggering child release and raising haunt value.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole instance.  
    - `haunter` (Entity) — the haunting entity.
*   **Returns:** `true` if haunt mining succeeded, else `nil`.

### `OnPreLoad(inst, data)`
*   **Description:** Initializes child spawner timing and state based on world settings during load.
*   **Parameters:**  
    - `inst` (Entity) — the spiderhole instance.  
    - `data` (table) — world state data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"creepactivate"` — triggers `SpawnInvestigators` to send spiders to investigate a target.  
  - `"startquake"` — triggers `OnQuakeBegin` to wake all children.  
  - `"endquake"` — triggers `OnQuakeEnd` to clear `_quaking` flags.  
- **Pushes:** None directly; relies on childspawner, workable, and hauntable events internally.