---
id: flower
title: Flower
description: Represents a customizable plant entity that can transform into a rose under certain conditions and interacts with sanity, combat, and world state systems.
tags: [environment, plant, sanity, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1d097116
system_scope: environment
---

# Flower

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `flower` prefab is a static environment entity that spawns with random animation states and can dynamically transform into a thorny rose (`flower_rose`) under specific conditions (e.g., during a full moon via transformer logic—currently commented out in code). It supports interaction via the `pickable`, `inspectable`, and `halloweenmoonmutable` components, and triggers sanity effects or damage when picked by certain entities. It also integrates with the scrapbook system and supports in-world regrowth and world state–based decay in caves.

## Usage example
```lua
local flower = SpawnPrefab("flower")
flower.Transform:SetPosition(x, y, z)

-- Manually set type to rose (e.g., via world event)
flower:PushEvent("flower_transform_to_rose")
```

## Dependencies & tags
**Components used:**  
`animstate`, `transform`, `network`, `inspectable`, `pickable`, `halloweenmoonmutable`, `roseinspectable`  
**Tags:** `flower`, `cattoy`, `thorny` (added only when `animname == "rose"`)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `"f1"`–`"f10"` or `"rose"` | Current animation state name; determines visual appearance and thorn status. |
| `planted` | boolean | `nil` | Indicates whether the flower was manually placed (prevents automatic regrowth registration). |
| `_isrose` | net_bool | `false` | Networked boolean tracking if the flower is currently a rose; triggers `OnIsRoseDirty`. |
| `scrapbook_proxy` | string? | `"flower_rose"` (rose) or `nil` | Used by scrapbook system to reference related entry. |

## Main functions
### `setflowertype(inst, name)`
* **Description:** Sets or updates the flower’s animation state. If set to `"rose"`, adds the `thorny` tag and updates networked state; otherwise removes the tag. Only changes if `name` differs from current `animname`.
* **Parameters:**  
  `name` (string?) — optional target animation name. If `nil`, picks random name from `names` or `rose` with `ROSE_CHANCE`.  
* **Returns:** Nothing.  
* **Error states:** No-op if `name` matches current `animname`.

### `onpickedfn(inst, picker)`
* **Description:** Callback fired when the flower is picked; applies sanity delta to the picker (if valid) and inflicts thorn damage if it is a rose and picker lacks `bramble_resistant` or is not a `shadowminion`.
* **Parameters:**  
  `inst` (Entity) — the flower entity.  
  `picker` (Entity?) — entity that picked the flower, may be `nil`.  
* **Returns:** Nothing.  
* **Error states:** Early returns if `picker` is `nil` or missing `sanity`/`combat` components.

### `DieInDarkness(inst)`
* **Description:** Checks for nearby daylight sources within `TUNING.DAYLIGHT_SEARCH_RANGE`. If no light is found, removes the flower and spawns `flower_withered`.
* **Parameters:** `inst` (Entity) — the flower entity.  
* **Returns:** Nothing.

### `CheckForPlanted(inst)`
* **Description:** Adds unpicked flower to regrowth manager if `inst.planted` is falsy.
* **Parameters:** `inst` (Entity) — the flower entity.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `isrosedirty` — triggers `OnIsRoseDirty` to update scrapbook proxy when rose status changes.  
- **Pushes:**  
  `thorns` — sent to picker upon rose damage.  
  `plantkilled` — sent to world on pick.  
- **World state listeners (caves only):**  
  `iscaveday` — schedules `DieInDarkness` during cave day.