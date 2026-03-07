---
id: retrofitforestmap_anr
title: Retrofitforestmap Anr
description: Applies world-retrofitting changes for post-launch content (e.g., Return of Them, Terraria, Balatro) by dynamically spawning, repositioning, or removing prefabs after world generation completes.
tags: [world, retrofittng, environment]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 4fe37dae
system_scope: world
---
# Retrofitforestmap Anr

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`retrofitforestmap_anr` is a `mastersim`-only component that performs deferred world modifications after initial world generation. It is typically attached to the world entity and triggers surface-level changes (e.g., spawning missing setpiece prefabs, adjusting ocean content, fixing tile/node misplacements) when `OnPostInit` is invoked. It does not modify the core world-generation code but applies transformations based on saved flags and world state during map loading. The component uses helper functions such as `RetrofitNewContentPrefab`, `RemovePrefabs`, and `SpawnPrefab` to modify the world imperatively.

## Usage example
This component is automatically added to the world by the engine and does not require manual instantiation. A typical integration looks like this:
```lua
-- Example internal usage during world initialization (NOT user code)
local world = TheWorld
world:AddComponent("retrofitforestmap_anr")

-- Later, after world generation, the engine sets flags and calls OnPostInit():
world.components.retrofitforestmap_anr.retrofit_turnoftides = true
world.components.retrofitforestmap_anr.retrofit_catcoonden_deextinction = true
-- OnPostInit() is invoked automatically by the framework after load/save cycle.
```

## Dependencies & tags
**Components used:**  
- `scenariorunner` (via `terrariumchest`)  
- `winchtarget` (to retrieve sunken objects)  
- `inventory` (to remove items)  
- `submersible` (to reposition objects on land)  
- `heavyobstaclephysics` (to enable floating exploit flag)  
- `timer` (to check `TimerExists`)  
- `pearldecorationscore` (to enable pearl scoring)  
- `craftingstation` (to adjust Pearl's known recipes)  
- `undertile` (for tile replacement)

**Tags:** Checks and applies tags including: `structure`, `walkableplatform`, `lava`, `irreplaceable`, `playerghost`, `ghost`, `flying`, `player`, `character`, `animal`, `monster`, `giant`, `watersource`, `thorny`, `sculpture`. Also adds tags like `sandstorm` to topology nodes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | The world entity that owns this component. |
| `requiresreset` | `boolean` | `false` | Indicates whether a world save/restart is needed after certain retrofits. |
| `retrofit_part1` | `boolean` | `false` | Flag for early A New Reign content (Moonbase, Stagehand). |
| `retrofit_artsandcrafts` | `boolean` | `false` | Flag for missing Chess sculpture sketches. |
| `retrofit_artsandcrafts2` | `boolean` | `false` | Flag to unlock chesspieces via event. |
| `retrofit_cutefuzzyanimals` | `boolean` | `false` | Flag for Critter Lab and Bee Queen Hive. |
| `retrofit_herdmentality` | `boolean` | `false` | Flag for Deer Spawning Grounds. |
| `retrofit_againstthegrain` | `boolean` | `false` | Flag for Lightning Bluff (Antlion/Oasis Lake). |
| `retrofit_penguinice` | `boolean` | `false` | Flag to mark mini glaciers for removal on dry-up. |
| `retrofit_turnoftides` | `boolean` | `false` | Flag to populate ocean content (Turn of Tides). |
| `retrofit_turnoftides_betaupdate1` | `boolean` | `false` | Flag to update nav grid. |
| `retrofit_turnoftides_seastacks` | `boolean` | `false` | Flag to balance seastacks (Cleanup/Repopulate). |
| `retrofit_fix_sculpture_pieces` | `boolean` | `false` | Flag to reposition detached sculpture heads/noses. |
| `retrofit_salty` | `boolean` | `false` | Flag to populate shoals, saltstacks (Salty Dog). |
| `retrofit_shesellsseashells` | `boolean` | `false` | Flag to populate Wobster Dens. |
| `retrofit_barnacles` | `boolean` | `false` | Flag to replace seastack spawners with barnacle plants. |
| `retrofit_inaccessibleunderwaterobjects` | `boolean` | `false` | Flag to reposition inaccessible underwater salvageables. |
| `retrofit_moonfissures` | `boolean` | `false` | Flag to add moon fissures near water. |
| `retrofit_astralmarkers` | `boolean` | `false` | Flag to add astral markers (moon altar). |
| `retrofit_nodeidtilemap_secondpass` | `boolean` | `false` | Flag to repopulate tile node IDs for lunar island. |
| `retrofit_nodeidtilemap_thirdpass` | `boolean` | `false` | Flag to repopulate tile node IDs for hermit island. |
| `retrofit_removeextraaltarpieces` | `boolean` | `false` | Flag to remove erroneous moon altar pieces near 0,0,0. |
| `retrofit_terraria_terrarium` | `boolean` | `false` | Flag to add Terrarium Chest. |
| `retrofit_catcoonden_deextinction` | `boolean` | `false` | Flag to add Catcoon Dens. |
| `retrofit_alittledrama_content` | `boolean` | `false` | Flag to add Stage and Statue prefabs (A Little Drama). |
| `retrofit_balatro_content` | `boolean` | `false` | Flag to add Balatro Machine (Balatro). |
| `retrofit_daywalker_content` | `boolean` | `false` | Flag to remove old Daywalker entities from forest shard. |
| `console_beard_turf_fix` | `boolean` | `false` | Flag to replace Rift Moon turfs with Beard rugs if missing undertile data. |
| `retrofit_junkyard_content` | `boolean` | `false` | Flag to add Junkyard prefabs (Junk Yard). |
| `retrofit_junkyardv3_content` | `boolean` | `false` | Flag to reapply Junkyard fixes (second pass). |
| `remove_rift_terraformers_fix` | `boolean` | `false` | Flag to remove stale Rift Terraformers. |
| `retrofit_otterdens` | `boolean` | `false` | Flag to add Otter Dens. |
| `sharkboi_ice_hazard_fix` | `boolean` | `false` | Flag to remove ice hazards spawned off ocean. |
| `rifts6_add_whirlpool` | `boolean` | `false` | Flag to spawn a large whirlpool in forest shard. |
| `fix_pearl_eating_everything` | `boolean` | `false` | Flag to reset Pearl’s completed tasks if they were incorrectly eaten. |
| `floating_heavyobstaclephysics_fix` | `boolean` | `false` | Flag to enable deprecated floating exploit flag on heavy obstacles. |
| `retrofit_missing_retrofits_generated_densities` | `boolean` | `false` | Flag to fill missing prefab density tables for retrofits. |
| `retrofit_enable_pearl_score` | `boolean` | `false` | Flag to enable Pearl’s decoration scoring. |
| `hermitcrab_relocation_change` | `boolean` | `false` | Flag to fix Pearl’s known recipes for relocation kit and shellweaver. |

## Main functions
### `OnPostInit()`
*   **Description:** Executes all retrofits based on the component’s boolean flags. Each flag corresponds to a specific content addition, cleanup, or correction. Invoked automatically after world load if the component exists on the world entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Some operations may silently fail if prerequisite conditions are not met (e.g., no matching topology nodes). Logging indicates success/failure via `print()` calls.

### `OnSave()`
*   **Description:** Returns an empty table, as all state flags are persisted via the component instance (handled automatically).
*   **Parameters:** None.
*   **Returns:** `{}` (table).

### `OnLoad(data)`
*   **Description:** Loads and restores state flags from `data`. Flags are preserved across world saves/loads and used by `OnPostInit`.
*   **Parameters:**  
    `data` (table | `nil`) — saved state from previous sessions. Key-value pairs map directly to the component’s flag properties.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly. The component uses `inst:DoTaskInTime()` to schedule delayed announces and the world save/rollback during `requiresreset`, but does not register `ListenForEvent` handlers.
- **Pushes:**  
  - `ms_unlockchesspiece` — fired with `"pawn"`, `"bishop"`, `"rook"`, `"knight"`, `"muse"`, `"formal"` when `retrofit_artsandcrafts2` is active.  
  - `ms_save` — pushed when triggering a world save/rollback after a required reset.
