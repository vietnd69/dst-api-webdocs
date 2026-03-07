---
id: weed_plants
title: Weed Plants
description: A reusable prefab factory that creates customizable farmable weeds with growth stages, soil interaction, and magical growth mechanics.
tags: [farming, growth, plant, magic]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1e8e0c9c
system_scope: environment
---

# Weed Plants

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `weed_plants` module acts as a factory for creating farmable weed prefabs. It defines shared behavior for all weed types—including growth progression, soil moisture consumption, tending mechanics, spreading, and magical growth (where plants grow automatically without player input when nourished). It integrates tightly with components like `growable`, `farmplanttendable`, `farmsoildrinker`, `lootdropper`, and `burnable`, leveraging a shared configuration table (`weed_def`) to customize appearance, timing, and effects.

## Usage example
```lua
-- Typically invoked via require("prefabs/weed_plants") to spawn prefabs for all defined weeds.
-- The actual usage is implicit: the module returns a list of prefab definitions.
-- Example of how modders interact with it:
local WEED_DEFS = require("prefabs/weed_defs").WEED_DEFS
local my_weed_def = table.deepcopy(WEED_DEFS["medio"])  -- clone an existing definition
my_weed_def.product = "my_custom_product"
my_weed_def.grow_time.full = { 60, 90 }
-- The factory automatically registers the new prefab via MakeWeed()
```

## Dependencies & tags
**Components used:** `burnable`, `farmplanttendable`, `farmsoildrinker`, `growable`, `hauntable`, `inspectable`, `lootdropper`, `pickable`, `plantresearchable`, `timer`, `workable`.  
**Tags added:** `plantedsoil`, `farm_plant`, `farm_plant_killjoy`, `weed`, `plant`, `plantresearchable`, `weedplantstress`, `tendable_farmplant`. Additional tags depend on `weed_def.extra_tags` and `weed_def.sameweedtags`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.weed_def` | table | `weed_def` | Configuration object defining growth, product, tags, and callbacks. |
| `inst.plantregistrykey` | string | `weed_def.prefab` | Unique key used for plant registry/research. |
| `inst.mature` | boolean | `false` | Tracks whether the plant has reached full maturity. |
| `inst.from_seed` | boolean | `nil` | Set during save/load to track origin (seed vs. spread). |
| `inst._research_stage` | replicated variable (`net_tinybyte`) | `0` | Networked value representing research progress (0-based index). |
| `inst._magicgrowthtask` | task | `nil` | Task reference for periodic magical growth checks. |
| `inst.magic_tending` | boolean | `nil` | If true, enables auto-tending during magical growth. |
| `inst.magic_growth_delay` | number | `nil` | Delay before next magical growth tick. |

## Main functions
### `MakeWeed(weed_def)`
*   **Description:** Constructs and registers a new weed prefab using the provided definition. Creates entities with animation, network, and all necessary components.
*   **Parameters:** `weed_def` (table) – defines all behavior: `bank`, `build`, `product`, `grow_time`, `nutrient_consumption`, `moisture`, etc.
*   **Returns:** `Prefab` – a prefabricated entity definition for the weed.

### `OnTrySpread(inst)`
*   **Description:** Attempts to spread the weed to a nearby location by either finding an adjacent tilled soil tile or generating a new one. Creates a new weed instance at the target.
*   **Parameters:** `inst` (entity) – the parent weed attempting to spread.
*   **Returns:** number – delay before next spread attempt (in seconds), respecting `spread.time_min` and `spread.time_var`.

### `domagicgrowthfn(inst)`
*   **Description:** Implements magical growth logic: grows the plant in the background if nourished, consumes soil moisture, and optionally tend to the plant. Only active if `magicgrowable` is true and the plant is not growing regularly.
*   **Parameters:** `inst` (entity) – the plant entity.
*   **Returns:** boolean – `true` if growth/tending occurred, `false` otherwise.

### `dig_up(inst, worker)`
*   **Description:** Handles digging up the weed: drops loot, summons defenders, spawns dig FX, restores soil tile, and removes the entity.
*   **Parameters:**  
  `inst` (entity) – the weed being dug up.  
  `worker` (entity) – the entity performing the dig action.
*   **Returns:** Nothing.

### `UpdateResearchStage(inst, stage)`
*   **Description:** Updates the networked research stage value for the plant registry. Maps internal stage index (1-based) to research index (0-based).
*   **Parameters:**  
  `inst` (entity) – the plant instance.  
  `stage` (number) – current growth stage (1-based).
*   **Returns:** Nothing.

### `MakePickable(inst, enable)`
*   **Description:** Attaches or removes the `pickable` component to control harvesting behavior.
*   **Parameters:**  
  `inst` (entity) – the plant instance.  
  `enable` (boolean) – whether to make the plant harvestable.
*   **Returns:** Nothing.

### `GetDisplayName(inst)`
*   **Description:** Returns the displayed name for the plant. If the player hasn't researched it and lacks the `farmplantidentifier` tag, returns the unknown name string.
*   **Parameters:** `inst` (entity) – the plant instance.
*   **Returns:** string? – the display name or `nil` if unknown.

### `PlantRegistryKey / GetPlantRegistryKey(inst)`
*   **Description:** Getter for `plantregistrykey`, used for registry lookups.
*   **Parameters:** `inst` (entity) – the plant instance.
*   **Returns:** string – the registry key (e.g., `"medio"`).

### `GetResearchStage(inst)`
*   **Description:** Returns the current research stage (1-based).
*   **Parameters:** `inst` (entity) – the plant instance.
*   **Returns:** number – research stage index.

### `UpdateSpreading(inst, stage_data)`
*   **Description:** Starts or stops the spread timer depending on the current growth stage.
*   **Parameters:**  
  `inst` (entity) – the plant instance.  
  `stage_data` (table) – current stage definition from `GROWTH_STAGES`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `timerdone` – handles timed events like spreading and magic growth.  
  `on_planted` – triggers custom anims (e.g., "seedless_to_small") if planted above ground.  
  `defend_farm_plant` – receives defense call from nearby defenders.
- **Pushes:**  
  `defend_farm_plant` – notifies adjacent defenders when damaged or harvested.  
  `breaksoil` – notifies soil tile when weed is dug up.  
  `entity_droploot` – fired by `lootdropper:DropLoot`.

