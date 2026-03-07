---
id: moonstorm_glass
title: Moonstorm Glass
description: A destructible, timed explosive structure that detonates after a fixed interval or when fully worked; inflicts area-of-effect damage to nearby entities and drops infused moon glass loot.
tags: [explosive, timer, environment, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 36ae8d05
system_scope: environment
---

# Moonstorm Glass

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonstorm_glass` is a prefabricated entity representing a volatile, moon-infused glass structure that acts as an environmental hazard or boss-adjacent object. It is designed to detonate automatically after a 20-second countdown (configurable via `TIME`) or when fully worked (mined), causing area-of-effect damage to nearby valid entities within a 4-unit radius. The detonation triggers visual and audio FX, removes the entity, and drops loot from a custom table (`moonstorm_glass_infused`). A secondary, lightweight `moonstorm_glass_nub` entity serves as a workable handle tied to the main structure.

The component uses the `workable`, `lootdropper`, `timer`, `inspectable`, `named`, and `updatelooper` components to manage state, serialization, and gameplay behavior.

## Usage example
```lua
-- Example: Spawn and configure moonstorm glass manually (not typical; usually spawned via worldgen or event)
local glass = SpawnPrefab("moonstorm_glass")
glass.Transform:SetPosition(position)
glass.spawnin(glass)  -- triggers spawn animation

-- The structure auto-detonates after 20 seconds unless mined first.
-- Mining progress is handled by the workable component and nub.
```

## Dependencies & tags
**Components used:**
- `named` — sets display name and persists author info.
- `lootdropper` — manages loot drops on destruction.
- `workable` — enables mining interaction.
- `inspectable` — provides status text (e.g., `INFUSED`).
- `timer` — handles countdown and detonation.
- `updatelooper` — updates animations based on remaining time.

**Tags added:** `moonglass`, `moonstorm_glass` (nub only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `defused` | boolean | `false` | Whether the glass has been successfully mined instead of exploding. Set to `true` only upon work completion. |
| `nub` | Entity | `nil` | Reference to the attached `moonstorm_glass_nub` entity. Used to delegate work to the glass. |
| `showCloudFXwhenRemoved` | boolean | `nil` (not used in code) | Placeholder for optional FX — not referenced in current implementation. |

## Main functions
### `explode(inst)`
*   **Description:** Triggers the detonation sequence: plays crack animation, spawns ground/FX prefabs, plays break sound, applies area-of-effect combat damage to nearby entities, and removes the entity.
*   **Parameters:** `inst` (Entity) — the moonstorm glass instance.
*   **Returns:** Nothing.
*   **Error states:** Does not validate `inst` before use; assumes `inst` is valid. Does not detonate if `animover` event is never received.

### `OnWork(inst, worker, workleft)`
*   **Description:** Callback invoked after each work increment on the glass. Delegates work to the nub, and if `workleft <= 0`, spawns debris FX, drops loot, and removes the entity.
*   **Parameters:**  
    `inst` (Entity) — the moonstorm glass instance.  
    `worker` (Entity) — the entity performing the work.  
    `workleft` (number) — remaining work required (decremented each call).
*   **Returns:** Nothing.

### `setanim(inst, workleft)`
*   **Description:** (Helper) Selects and plays a center animation (`centre_idle1`, `centre_idle2`, `centre_idle3`) based on how much work remains relative to `TUNING.ROCKS_MINE`.
*   **Parameters:**  
    `inst` (Entity) — the moonstorm glass_nub instance.  
    `workleft` (number) — current remaining work.
*   **Returns:** Nothing.

### `ontimedone(inst, data)`
*   **Description:** Event handler triggered when the `defusetime` timer completes. Calls `explode(inst)` to detonate the glass.
*   **Parameters:**  
    `inst` (Entity) — the moonstorm glass instance.  
    `data` (table) — timer event data containing `name`.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Provides status text for the `inspectable` component.
*   **Parameters:** `inst` (Entity) — the moonstorm glass instance.
*   **Returns:** `"INFUSED"` if not defused; `nil` if defused (i.e., mined instead of exploded).

### `on_save(inst, data)`
*   **Description:** Serialization hook; saves the `defused` state for persistence across reloads.
*   **Parameters:**  
    `inst` (Entity) — the moonstorm glass instance.  
    `data` (table) — the save data table to populate.
*   **Returns:** Nothing.

### `on_load(inst, data)`
*   **Description:** Deserialization hook; if `defused` is `true` in saved data, immediately triggers `explode(inst)` and stops the timer.
*   **Parameters:**  
    `inst` (Entity) — the moonstorm glass instance.  
    `data` (table) — the saved data table.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `timerdone` — triggers detonation when `defusetime` expires.  
  - `animover` — finalizes explosion after crack animation completes (inside `explode`).  
  - `onremove` — ensures `moonstorm_glass_nub` is removed when the main glass is removed.
- **Pushes:** None directly (relies on engine events like `entity_droploot` via `lootdropper`).