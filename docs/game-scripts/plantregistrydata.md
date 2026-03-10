---
id: plantregistrydata
title: Plantregistrydata
description: Manages persistent plant, fertilizer, and oversized picture knowledge for the plant registry system.
tags: [inventory, progression, persistence, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 63afd8c7
system_scope: inventory
---

# Plantregistrydata

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`PlantRegistryData` tracks which plant stages, fertilizers, and oversized plant pictures a player has discovered or captured in the game. It is a persistent data store that supports syncing with online inventories and handles local-only storage on unsupported platforms. The component integrates with external definitions (`PLANT_DEFS`, `WEED_DEFS`, `FERTILIZER_DEFS`) to validate and interpret registry entries and exposes methods for learning plant stages, fertilizers, and taking pictures.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("plantregistrydata")
local registry = inst.components.plantregistrydata

-- Learn a specific plant stage
registry:LearnPlantStage("cave_bush", 3)

-- Check if a stage is known
if registry:KnowsPlantStage("cave_bush", 3) then
    print("Stage 3 is known!")
end

-- Load saved data (e.g., on startup)
registry:Load()

-- Check progress
if registry:GetPlantPercent("cave_bush", some_plant_registry_info) == 1.0 then
    print("All stages of cave_bush are known.")
end
```

## Dependencies & tags
**Components used:** `TheInventory`, `TheNet`, `TheSim`, `TheFrontEnd`, `ThePlayer`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plants` | table | `{}` | Maps plant name → `{stage→true}`, e.g., `{"cave_bush" = {[3]=true}}`. |
| `fertilizers` | table | `{}` | Maps fertilizer name → `true` if known. |
| `pictures` | table | `{}` | Maps plant name → `{weight, player, clothing, base, mode, ...}` for oversized picture data. |
| `filters` | table | `{}` | Stores UI filter state by category (e.g., `{type="plant", rarity="rare"}`). |
| `last_selected_card` | table | `{}` | Maps plant name → card ID (e.g., `"summary"` or stage number) for UI restoration. |
| `save_enabled` | nil | `nil` | Internal flag indicating whether saving is enabled (not exposed publicly). |
| `dirty` | boolean | `false` | Internal flag used to defer save until a change occurs. |
| `synced` | boolean | `nil` | Tracks whether online profile data has been applied. |

## Main functions
### `GetKnownPlants()`
* **Description:** Returns the internal table of known plant entries.
* **Parameters:** None.
* **Returns:** `table` — mapping plant names to stage tables (e.g., `{[plantname] = {[stage]=true, ...}}`).

### `GetKnownPlantStages(plant)`
* **Description:** Returns the stage table for a given plant, or an empty table if none.
* **Parameters:** `plant` (string) — plant name.
* **Returns:** `table` — `{[stage_number]=true, ...}` or `{}` if unknown.

### `IsAnyPlantStageKnown(plant)`
* **Description:** Returns `true` if at least one stage of the plant is known.
* **Parameters:** `plant` (string) — plant name.
* **Returns:** `boolean`.

### `KnowsPlantStage(plant, stage)`
* **Description:** Checks if a specific stage of a plant is known.
* **Parameters:** `plant` (string), `stage` (number) — stage index (1–8).
* **Returns:** `boolean`.

### `KnowsSeed(plant, plantregistryinfo)`
* **Description:** Determines if the seed for *any* known stage of the plant can be learned (based on `learnseed` flag in `plantregistryinfo`).
* **Parameters:** `plant` (string), `plantregistryinfo` (table) — plant registry info table mapping stages to metadata.
* **Returns:** `boolean`.

### `KnowsPlantName(plant, plantregistryinfo, research_stage)`
* **Description:** Determines if the plant name is revealed for at least one known stage, optionally constrained to a specific `research_stage`.
* **Parameters:** `plant` (string), `plantregistryinfo` (table), `research_stage` (optional number) — stage index.
* **Returns:** `boolean`.

### `KnowsFertilizer(fertilizer)`
* **Description:** Checks if a fertilizer is known.
* **Parameters:** `fertilizer` (string) — fertilizer name.
* **Returns:** `boolean`.

### `HasOversizedPicture(plant)`
* **Description:** Returns `true` if an oversized picture has been taken for the plant.
* **Parameters:** `plant` (string).
* **Returns:** `boolean`.

### `GetOversizedPictureData(plant)`
* **Description:** Returns the picture metadata table for the plant.
* **Parameters:** `plant` (string).
* **Returns:** `table?` — picture data or `nil`.

### `GetPlantPercent(plant, plantregistryinfo)`
* **Description:** Calculates the ratio of known stages to total stages (including fullgrown) for the given plant.
* **Parameters:** `plant` (string), `plantregistryinfo` (table) — must include `growing` and `fullgrown` flags per stage.
* **Returns:** `number` (0.0–1.0).

### `LearnPlantStage(plant, stage)`
* **Description:** Marks a plant stage as known. Handles updating online inventory and UI card selection if saving is enabled.
* **Parameters:** `plant` (string), `stage` (number).
* **Returns:** `boolean` — `true` if the stage was newly learned.
* **Error states:** Returns early and logs if `plant` or `stage` is `nil`. Modded characters are silently ignored (no picture update logic applies).

### `LearnFertilizer(fertilizer)`
* **Description:** Marks a fertilizer as known. Updates online inventory if applicable.
* **Parameters:** `fertilizer` (string).
* **Returns:** `boolean` — `true` if the fertilizer was newly learned.
* **Error states:** Returns early and logs if `fertilizer` is `nil`.

### `TakeOversizedPicture(plant, weight, player, beardskin, beardlength)`
* **Description:** Records an oversized picture of a plant, keeping only the highest-weight capture per plant. Updates online inventory.
* **Parameters:** `plant` (string), `weight` (string or number), `player` (entity with `userid`, `prefab`, and skin data), `beardskin` (optional string), `beardlength` (optional number).
* **Returns:** `boolean` — `true` if a new or higher-weight picture was saved.
* **Error states:** Returns early with `nil`/`false` for `nil` inputs or if `player.prefab` is not in `DST_CHARACTERLIST`.

### `Save(force_save)`
* **Description:** Serializes and persists registry data using `TheSim:SetPersistentString`.
* **Parameters:** `force_save` (boolean) — overrides `save_enabled` and `dirty` checks.
* **Returns:** Nothing.

### `Load()`
* **Description:** Loads persisted data from `TheSim:GetPersistentString`. Resets all internal tables on load.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** On malformed data, logs failure and calls `Save(true)` to reset.

### `ApplyOnlineProfileData()`
* **Description:** Syncs registry data from online inventory (`TheInventory:GetLocalPlantRegistry()`). Decodes stage bitmasks and picture metadata.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if sync completed.
* **Error states:** Returns `false` early if online sync conditions are not met.

### `ClearFilters()`, `SetFilter(category, value)`, `GetFilter(category)`
* **Description:** UI filter helpers managing `self.filters`.
* **Parameters:** `category` (string), `value` (any).
* **Returns:** `nil` (for `SetFilter`/`ClearFilters`) or `value` (for `GetFilter`).

### `GetLastSelectedCard(plant)`, `SetLastSelectedCard(plant, card)`
* **Description:** UI helper for restoring last-selected card per plant.
* **Parameters:** `plant` (string), `card` (string or number).
* **Returns:** `nil` (for `SetLastSelectedCard`) or card ID (for `GetLastSelectedCard`).

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.