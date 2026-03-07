---
id: nutrients_overlay
title: Nutrients Overlay
description: Manages client-side visual overlay for nutrient and moisture levels on farm soil, syncing with server-side nutrient data.
tags: [ui, visual, soil, farm, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4f77e61e
system_scope: ui
---

# Nutrients Overlay

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nutrients_overlay` is a client-facing prefab component that displays visual indicators for nutrient levels (three distinct nutrients) and soil moisture on farm plots. It consists of two prefabs: `nutrients_overlay` (the main instance, managed server-side and replicated to clients) and `nutrients_overlay_visual` (a child visual-only entity created on clients). It integrates with `nutrients_visual_manager` to register/unregister and update visual state, and uses networked state (`net_ushortint`) to sync nutrient levels between server and clients.

## Usage example
This component is typically instantiated automatically by the farm plot system. Manual usage is not intended for modders, but an example of attaching the component conceptually would look like:
```lua
-- On an entity (e.g., a farm plot), the game internally uses:
inst:AddChild("nutrients_overlay")
-- The overlay then listens to "nutrientlevelsdirty" and updates visuals via nutrients_visual_manager.
```

## Dependencies & tags
**Components used:** `nutrients_visual_manager` (accessed via `TheWorld.components.nutrients_visual_manager`)
**Tags:** Adds `DECOR` and `NOCLICK` to both prefabs.

## Properties
No public properties. State is managed internally via `inst.nutrientlevels` (a `net_ushortint`) and `inst.visual` (a child entity reference).

## Main functions
### `UpdateOverlay(_n1, _n2, _n3)`
* **Description:** Encodes three raw nutrient values into a compact `nutrientlevels` bitmask and updates the networked state. Triggered when nutrient values change on the server.
* **Parameters:** 
  * `_n1`, `_n2`, `_n3` (numbers) — Raw nutrient amounts (e.g., `0`, `1`, `25`, `50`, or `100`).
* **Returns:** Nothing.
* **Error states:** Uses `nutrients_count` thresholds to quantize each nutrient into one of four levels (0–3), then packs the three levels into a 16-bit integer using bit operations.

### `UpdateMoisture(percent)`
* **Description:** Updates the animation percentage of the soil moisture overlay based on a 0–1 ratio.
* **Parameters:** 
  * `percent` (number) — Moisture level normalized to `0.0`–`1.0`.
* **Returns:** Nothing.

### `OnNutrientLevelsDirty(inst)`
* **Description:** Client-side callback triggered when `nutrientlevels` changes. It decodes the bitmask and updates visible overlay symbols (e.g., `nutrient_1_low`, `nutrient_2_full`) on the `visual` entity.
* **Parameters:** 
  * `inst` (entity) — The `nutrients_overlay` instance.
* **Returns:** Nothing.
* **Error states:** Skips if `inst.visual` is `nil` (e.g., on dedicated servers or before visual child spawns).

## Events & listeners
- **Listens to:** 
  - `nutrientlevelsdirty` — Triggers `OnNutrientLevelsDirty` to refresh visual symbols.
  - `entitysleep` — Removes the visual child when the entity goes to sleep (cave world).
  - `entitywake` — Spawns and refreshes the visual child when the entity wakes up.
  - `onremove` — Unregisters the visual from `nutrients_visual_manager`.
- **Pushes:** None.