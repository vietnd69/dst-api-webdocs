---
id: farmplot
title: Farmplot
description: Manages a farmplot structure that can be planted with crops and degrades when hammered or burnt, including level-specific growth rates, fertility tracking, and decorative element rendering.
tags: [farming, environment, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d0995242
system_scope: environment
---

# Farmplot

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `farmplot` is a structure prefab with three distinct levels (`slow_farmplot`, `fast_farmplot`, and implicitly `farmplot`). It supports crop planting and growth via the `grower` component, integrates fire behavior via `burnable`, and manages decoration elements (e.g., fences, sticks, signs) that change based on burn state. It interacts closely with `workable` (for hammering), `inspectable` (for status display), and `hauntable` (for haunter interactions).

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
-- ... (typically handled internally via `plot(level)` function)
inst:AddComponent("grower")
inst.components.grower.level = 2
inst.components.grower.max_cycles_left = 20
inst.components.grower.cycles_left = 20
inst.components.grower.growrate = TUNING.FARM2_GROW_BONUS
inst.components.grower.croppoints = { Vector3(0, 0, 0) }
inst.components.grower.setfertility = function(inst, fert_percent) -- custom fertility animation update
    if not inst:HasTag("burnt") then
        inst.AnimState:PlayAnimation(fert_percent <= 0.33 and "med2" or "full")
    end
end
```

## Dependencies & tags
**Components used:** `inspectable`, `burnable`, `propagator`, `grower`, `lootdropper`, `workable`, `savedrotation`, `hauntable`, `placer` (via `placerdecor`)
**Tags:** Adds `structure`; checks `burnt`, `NOCLICK`, `CLASSIFIED`, `placer`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` / `2` / `3` | Farmplot tier, affects growth rate and decoration layout. |
| `_burnt` | `net_bool` | `false` | Replicated state indicating whether the plot is burnt. |
| `decor` | table | `{}` | Local (non-dedicated server) table of attached decoration prefabs. |
| `crop` / `grower` | `Grower` component instance | — | Manages fertility, planting, and crop state. |
| `grower.level` | number | `level` | Passed to `grower`, used internally for tuning (e.g., `rates[level]`). |
| `grower.croppoints` | table of `Vector3` | `{ { Vector3(0, 0, 0) } }` | List of spawn offsets for crops. Varies by plot level. |
| `grower.growrate` | number | `TUNING.FARMx_GROW_BONUS` | Growth speed multiplier per level. |

## Main functions
### `OnHaunt(inst)`
*   **Description:** Handles haunter behavior. If the plot has remaining fertility cycles, it decrements them by one, updates fertility animation, and resets haunt cooldown. Returns whether a successful haunt occurred.
*   **Parameters:** `inst` (entity) — the farmplot instance.
*   **Returns:** `boolean` — `true` if cycles were decremented; `false` otherwise.
*   **Error states:** May return `false` if `cycles_left <= 0` or if random chance fails (though `HAUNT_CHANCE_ALWAYS` implies guaranteed success in current code).

### `setfertilityfn(inst, fert_percent)`
*   **Description:** Updates the animation based on fertiliy percentage (for visual feedback). Skips animation update if the plot is burnt.
*   **Parameters:** 
    * `inst` (entity) — the farmplot instance.
    * `fert_percent` (number) — ratio `cycles_left / max_cycles_left`, used to select animation state (`empty`, `med2`, `med1`, `full`).
*   **Returns:** Nothing.

### `RefreshDecor(inst, burnt)`
*   **Description:** Removes existing decoration entities and spawns a new set according to `decor_defs` or `burntdecor_defs`, depending on `burnt` state. Runs only on non-dedicated servers.
*   **Parameters:** 
    * `inst` (entity) — the farmplot instance.
    * `burnt` (boolean) — whether burnt decoration should be used.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Callback triggered when the plot is hammered. Extinguishes fire, resets the grower state (removes crops), drops loot (including burnt overrides), spawns a `collapse_small` FX, and removes the plot.
*   **Parameters:** 
    * `inst` (entity) — the farmplot instance.
    * `worker` (entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Marks the plot as burnt and triggers visual decoration refresh on the client.
*   **Parameters:** `inst` (entity) — the farmplot instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves burnt state to persistence data if applicable.
*   **Parameters:** 
    * `inst` (entity) — the farmplot instance.
    * `data` (table) — the save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state on load by calling `onburnt` if burnt flag exists in `data`.
*   **Parameters:** 
    * `inst` (entity) — the farmplot instance.
    * `data` (table) — the loaded save data.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Provides a status string for inspection UI.
*   **Parameters:** `inst` (entity) — the farmplot instance.
*   **Returns:** 
    * `"BURNT"` if burnt,
    * `"NEEDSFERTILIZER"` if not fertile,
    * `"GROWING"` if not empty,
    * `nil` otherwise (fertile and empty).

## Events & listeners
- **Listens to:** `burntup` — triggers `OnBurnt`.
- **Listens to:** `burntdirty` — triggers `OnBurntDirty` (client-side).
- **Listens to:** `onbuilt` — triggers `OnBuilt` to play build sound.
- **Pushes:** `onextinguish` (via `burnable:Extinguish()`).
- **Pushes:** `entity_droploot` (via `lootdropper:DropLoot()`).