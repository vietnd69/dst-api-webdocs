---
id: farm_plants
title: Farm Plants
description: Manages farm plant lifecycle, stress tracking, growth stages, and loot generation for agricultural gameplay.
tags: [farming, growth, stress, loot, agriculture]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f4b1f04d
system_scope: entity
---

# Farm Plants

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`farm_plants.lua` defines the core logic for all farmable crops in DST. It implements a flexible system for plant growth, stress management, and dynamic loot generation based on plant health and conditions. Plants are created dynamically from plant definitions (`PLANT_DEFS`) via `MakePlant`, and each plant entity uses multiple components to handle growth, stress, soil interaction, and research tracking. Key dependencies include `growable` for progression, `farmplantstress` for health monitoring, `farmsoildrinker` for moisture tracking, and `lootdropper` for harvest rewards.

## Usage example
```lua
local plant_def = require("prefabs/farm_plant_defs").PLANT_DEFS["turnip"]
local plant = SpawnPrefab(plant_def.prefab)
plant.Transform:SetPosition(x, y, z)
-- Growth is managed automatically by components; no further setup required.
```

## Dependencies & tags
**Components used:**  
`burnable`, `farmplantstress`, `farmplanttendable`, `farmsoildrinker`, `growable`, `hauntable`, `herdmember`, `inspectable`, `lootdropper`, `plantresearchable`, `workable`, `knownlocations`

**Tags added:** `plantedsoil`, `farm_plant`, `lunarplant_target`, `plant`, `plantresearchable`, `farmplantstress`, `tendable_farmplant`  
Optional per definition: `israndomseed`, `plant_type_tag` (from `plant_def`), `farm_plant_killjoy` (added dynamically if rotten)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plant_def` | table | (provided by definition) | Reference to the plant definition containing properties like growth time, loot, and season compatibility. |
| `is_oversized` | boolean | `false` | Flag indicating if the plant is oversized (max-quality yield). |
| `no_oversized` | boolean | `false` | Flag to prevent future oversized growth (set after rotting or failed conditions). |
| `long_life` | boolean | `false` | Increases spoil time when true (set by `plantkin` tag during planting). |
| `scale` | number | `nil` | Visual scale modifier based on stress checkpoint points. |
| `_identified_plant_type` | string | `nil` | For random seeds, stores the resolved plant type after identification. |
| `_research_stage` | net_tinybyte | (network variable) | Tracks research stage for the seed/vegetable. |
| `plantregistrykey` | string | (from `plant_def.product`) | Key used for seed/plant registry lookup. |

## Main functions
### `MakeStressCheckpoint(inst, is_final_stage)`
*   **Description:** Evaluates all stress conditions (nutrients, moisture, killjoys, family, overcrowding, season, happiness) for the plant at its current stage, updates stress points, calculates final stress state (if final stage), and adjusts the plant’s visual scale accordingly.
*   **Parameters:**  
    `inst` (entity) - The plant instance.  
    `is_final_stage` (boolean) - If true, finalizes stress state (affects oversized check and scaling).
*   **Returns:** Nothing. Modifies `inst.components.farmplantstress.checkpoint_stress_points` and `inst.scale`.

### `ReplaceWithPlant(inst)`
*   **Description:** Replaces a "planted seed" entity with the actual plant prefab (determined by `pickfarmplant` or `_identified_plant_type`), copying soil moisture and stress state from the seed.
*   **Parameters:** `inst` (entity) - The seed entity to replace.
*   **Returns:** Nothing. Sets `inst.grew_into` to the new plant and removes the original.

### `SetupLoot(lootdropper)`
*   **Description:** Dynamically sets loot for the plant based on stress level and rot status. Oversized plants and stress states yield different combinations of product, seed, or rotten food.
*   **Parameters:**  
    `lootdropper` (LootDropper component) - The component to configure.
*   **Returns:** Nothing. Calls `lootdropper:SetLoot(...)` with an appropriate loot table.

### `domagicgrowthfn(inst, doer)`
*   **Description:** Handles instant growth via magic (e.g., by the Magic Flower). Advances growth stage, updates soil moisture, and may trigger tending.
*   **Parameters:**  
    `inst` (entity) - The plant instance.  
    `doer` (entity) - The actor triggering magic growth.
*   **Returns:** `boolean` - `true` if growth progressed, `false` otherwise.

### `GetResearchStage(inst)`
*   **Description:** Returns the 1-based research stage index (e.g., seed = 1, sprout = 2, full = 5, oversized = 6–8).
*   **Parameters:** `inst` (entity) - The plant instance.
*   **Returns:** `number` - 1-based stage index. Uses `inst._research_stage` internally.

### `GetPlantRegistryKey(inst)`
*   **Description:** Returns the registry key for the plant, typically the product name (e.g., `"turnip"`).
*   **Parameters:** `inst` (entity) - The plant instance.
*   **Returns:** `string` - The registry key.

### `UpdateResearchStage(inst, stage)`
*   **Description:** Maps the internal growth stage index (1-based) to the research stage index, accounting for oversized variants (stages 6, 7, 8).
*   **Parameters:**  
    `inst` (entity) - The plant instance.  
    `stage` (number) - Current growth stage index.
*   **Returns:** Nothing. Updates `inst._research_stage` to a 0-based value.

## Events & listeners
- **Listens to:**  
  `loot_prefab_spawned` - Sets `from_plant = true` on spawned loot.  
  `on_planted` - Sets `inst.long_life = true` if the planter has the `plantkin` tag.  
  `isnight` (world state) - Triggers `OnIsDark`, which manages growth pausing/resuming and night-time tasks.  
  `defend_farm_plant` - (Implied via event push; handled by defenders)

- **Pushes:**  
  `ms_fruitflyspawneractive` - Notifies world when a fruit fly spawner plant becomes active (at `full` stage).  
  `ms_oncroprotted` - Notifies world when a plant rots.  
  `idplantseed` - Pushed to the identifier player when a random seed is identified.  
  `entity_droploot` - (via `lootdropper:DropLoot`)
