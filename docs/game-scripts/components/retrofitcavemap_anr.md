---
id: retrofitcavemap_anr
title: Retrofitcavemap Anr
description: Applies worldgen retrofits for "A New Reign" and other DLC content to existing worlds by spawning missing prefabs, adjusting topology, and scheduling server resets.
tags: [world, retrofit, dlc, map, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e6237c75
system_scope: world
---

# Retrofitcavemap Anr

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RetrofitCaveMap_ANR` is a world-scoped component that applies retroactive changes to an existing world’s generation to incorporate content introduced in the "A New Reign" and other DLCs. It is designed to run once per world on world startup and perform tasks such as inserting new prefabs (e.g., atrium structures, altars, respawners), modifying topology nodes, and fixing layout inconsistencies. Because world generation data is immutable after creation, this component modifies the world via runtime spawning and topology updates, and triggers a server reset if necessary to finalize changes.

The component is only active on the master simulation and relies heavily on map and world generation utilities (`TheWorld.Map`, `TheWorld.topology`, `TheSim:FindEntities`) and interacts with components like `teleporter`, `objectspawner`, and `undertile`.

## Usage example
```lua
local world = TheWorld
if world.ismastersim then
    world:AddComponent("retrofitcavemap_anr")
    local retrofit = world.components.retrofitcavemap_anr

    -- Enable retrofits for A New Reign content
    retrofit.retrofit_heartoftheruins = true
    retrofit.retrofit_sacred_chest = true

    -- Manually trigger retrofit logic (typically done on World PostInit)
    if retrofit.OnPostInit then
        retrofit:OnPostInit()
    end
end
```

## Dependencies & tags
**Components used:** `heavyobstaclephysics`, `objectspawner`, `teleporter`, `undertile`  
**Tags:** Checks `STRUCTURE_TAGS` ({"structure"}), `ALTAR_TAGS` ({"altar"}), `LOCOMOTOR_TAGS` ({"locomotor"}). Does not add or remove tags on itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `self.inst` | The world entity instance owning this component. |
| `requiresreset` | `boolean` | `false` | Set to `true` when retrofits require a server restart to finalize (e.g., topology or navmesh updates). |
| `retrofit_warts` | `boolean` | `nil` | Enables spawning of `toadstool_cap` prefabs for the "Warts and All" retrofit. |
| `retrofit_artsandcrafts` | `boolean` | `nil` | Enables spawning of `fossil_piece` prefabs if `spiderhole` count is below threshold. |
| `retrofit_heartoftheruins` | `boolean` | `nil` | Triggers full Heart of the Ruins retrofit (atrium + ruins). |
| `retrofit_heartoftheruins_respawnerfix` | `boolean` | `nil` | Reduces respawner counts to intended cap values (post-override). |
| `retrofit_heartoftheruins_altars` | `boolean` | `nil` | Adds respawners for `ancient_altar_broken` and `ancient_altar`. |
| `retrofit_heartoftheruins_caveholes` | `boolean` | `nil` | Ensures at least 8 `cave_hole` prefabs exist in the world. |
| `retrofit_heartoftheruins_oldatriumfixup` | `boolean` | `nil` | Moves atrium gateway entities and ensures valid topology for retrofitted atriums. |
| `retrofit_heartoftheruins_statuechessrespawners` | `boolean` | `nil` | Adds respawners for statues and chess junk entities. |
| `retrofit_sacred_chest` | `boolean` | `nil` | Spawns `sacred_chest` near the Sacred Altar. |
| `retrofit_acientarchives` | `boolean` | `nil` | Initiates retrofit of the Ancient Archives via `retrofit_archiveteleporter`. |
| `retrofit_acientarchives_fixes` | `boolean` | `nil` | Fixes node tags (`MushGnomeSpawnArea`, `nocavein`) and removes extra nightmare spawners if not retrofitted. |
| `retrofit_dispencer_fixes` | `boolean` | `nil` | Repairs dispencer product assignments (`turfcraftingstation`, `archive_resonator_item`, `refined_dust`). |
| `retrofit_archives_navmesh` | `boolean` | `nil` | Forces a recalculation of the nav grid for the retrofitted archives. |
| `retrofit_nodeidtilemap_atriummaze` | `boolean` | `nil` | Repopulates tile node IDs for the AtriumMaze zone. |
| `retrofit_daywalker_content` | `boolean` | `nil` | Spawns a `daywalkerspawningground` if missing. |
| `console_beard_turf_fix` | `boolean` | `nil` | Replaces `RIFT_MOON` tiles with `BEARD_RUG` where undertile data is absent (console-specific fix). |
| `retrofit_rifts6_add_fumarole` | `boolean` | `nil` | Initiates fumarole retrofit via `retrofit_fumaroleteleporter`. |
| `floating_heavyobstaclephysics_fix` | `boolean` | `nil` | Enables `deprecated_floating_exploit` on all `HeavyObstaclePhysics` components. |
| `retrofit_missing_retrofits_generated_densities` | `boolean` | `nil` | Fixes density populations for retrofit zones (e.g., MoonMush, FumaroleRetrofit). |
| `retrofit_cave_mite_spawners` | `boolean` | `nil` | Spawns `cave_vent_mite_spawner` in vent and fumarole zones. |

## Main functions
### `OnPostInit()`
* **Description:** Main driver for all retrofit logic. Called automatically by the game’s world initialization pipeline. Evaluates all retrofit flags, executes corresponding subroutines, and schedules a server reset if `requiresreset` is set.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None; runtime failures are logged via `print()`.

### `OnSave()`
* **Description:** Serializes the component state. Returns a table of flags preserved across saves to resume incomplete retrofits after a restart.
* **Parameters:** None.
* **Returns:** `{}` — An empty table (all state is held in component properties and survives serialization via `OnLoad`).
  
### `OnLoad(data)`
* **Description:** Restores state from save file data, particularly retrofits that may have been interrupted (e.g., due to `requiresreset`). Updates component properties to resume work or prevent re-processing.
* **Parameters:** `data` (`table?`) — State table from `OnSave()` or save upgrades (e.g., `retrofit_heartoftheruins_respawnerfix`).
* **Returns:** Nothing.

### `RemovePrefabs(prefabs_to_remove, biomes_to_cleanup)`
* **Description:** (Private helper) Iterates all entities and removes those matching `prefabs_to_remove`, optionally filtering by tile biome.
* **Parameters:** `prefabs_to_remove` (`table<string>`) — List of prefab names to remove. `biomes_to_cleanup` (`table<string>?`) — Optional tile biome filter.
* **Returns:** `number` — Count of removed entities.

### `RetrofitNewCaveContentPrefab(inst, prefab, min_space, dist_from_structures, nightmare, searchnodes_override, ignore_terrain)`
* **Description:** (Private helper) Attempts up to `MAX_PLACEMENT_ATTEMPTS` (50) to spawn a prefab in a valid cave node, ensuring spacing and terrain constraints.
* **Parameters:**  
  * `inst` (`Entity`) — The world entity (unused, retained for legacy).  
  * `prefab` (`string`) — Prefab to spawn.  
  * `min_space` (`number`) — Minimum radius around spawn point to keep free of entities and terrain.  
  * `dist_from_structures` (`number?`) — If provided, also checks radius for entities with `STRUCTURE_TAGS`.  
  * `nightmare` (`boolean?`) — Filters nodes by `Nightmare` tag. Defaults to `false`.  
  * `searchnodes_override` (`table<number>?`) — Optional explicit list of node indices to search (bypasses default logic).  
  * `ignore_terrain` (`boolean?`) — Skip `CanPlacePrefabFilteredAtPoint` terrain checks.  
* **Returns:** `success` (`boolean`) — Whether spawn succeeded. `ret` (`Entity?`) — Spawned entity on success.

## Events & listeners
- **Listens to:** None (this component does not register event listeners).
- **Pushes:** Does not directly push events; however, `OnPostInit` may schedule server-wide resets via `TheWorld:PushEvent("ms_save")`.
