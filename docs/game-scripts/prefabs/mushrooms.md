---
id: mushrooms
title: Mushrooms
description: Defines the prefabs for red, green, and blue mushrooms—including their growth behavior, pickup, regeneration, haunting, and cooking mechanics—in Don't Starve Together.
tags: [world, environment, food, hauntable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9588b4a3
system_scope: environment
---

# Mushrooms

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mushrooms.lua` file defines three related prefabs per mushroom type (`red`, `green`, `blue`)—the in-ground mushroom, the detached cap, and the cooked version—through reusable functional templates (`mushcommonfn`, `capcommonfn`, `cookedcommonfn`). These prefabs implement seasonal and phase-based growth (day/dusk/night), rain-dependent regeneration, haunted transformation, and cooking behavior. The system heavily integrates with `pickable`, `hauntable`, `edible`, `perishable`, `cookable`, `fuel`, and `workable` components.

## Usage example
```lua
local red_mushroom = SpawnPrefab("red_mushroom")
red_mushroom.Transform:SetPosition(0, 0, 0)

-- Interact with its components after it spawns
if red_mushroom.components.pickable and red_mushroom.components.pickable:CanBePicked() then
    red_mushroom:PushEvent("dig") -- triggers workable callback
end
```

## Dependencies & tags
**Components used:**  
`inspectable`, `pickable`, `lootdropper`, `workable`, `hauntable`, `fuel`, `edible`, `perishable`, `tradable`, `stackable`, `inventoryitem`, `cookable`, `snowmandecor`

**Tags added:** `cookable`, `mushroom` (on caps only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rain` | number | `0` | Tracks remaining rain cycles needed for regrowth after being picked. |
| `growtask` | Task | `nil` | Delayed task used for opening/closing phases in caves. |
| `data` | table | `{}` | Holds type-specific settings (e.g., `open_time`, `sanity`, `health`, `pickloot`). |
| `opentaskfn` | function | defined in constructor | Callback to transition the mushroom to the fully visible open state. |
| `closetaskfn` | function | defined in constructor | Callback to bury the mushroom underground. |

## Main functions
### `mushcommonfn(data)`
*   **Description:** Creates and configures the in-ground mushroom prefab. Handles growth, rain-dependent regeneration, phase-based visibility, haunting, and digging rewards.
*   **Parameters:** `data` (table) — Contains `name`, `animname`, `pickloot`, `open_time`, `health`, `hunger`, `sanity`, etc.
*   **Returns:** Entity instance (`inst`) with all components attached and logic wired.
*   **Error states:** Returns early with only networked components on the client (`TheWorld.ismastersim == false`).

### `capcommonfn(data)`
*   **Description:** Creates the detached mushroom cap prefab used as a loot item or cooked ingredient. Edible, perishable, stackable, and hauntable.
*   **Parameters:** `data` (table) — Mirrors `mushcommonfn` data, using `health`, `hunger`, `sanity`, and cooked variants.
*   **Returns:** Entity instance with edible, perishable, stackable, tradable, and cookable components.
*   **Error states:** Returns early with minimal components on the client.

### `cookedcommonfn(data)`
*   **Description:** Creates the cooked mushroom cap prefab. Edible, perishable, stackable, fuel, and hauntable.
*   **Parameters:** `data` (table) — Uses `cookedhealth`, `cookedhunger`, `cookedsanity`.
*   **Returns:** Entity instance with edible, perishable, stackable, fuel, and tradable components.

### `OnHauntMush(inst, haunter)`
*   **Description:** Handles haunting of in-ground mushrooms: may transform into another mushroom type, open/close, or spawn `small_puff`. May also ignite under rare conditions (commented out).
*   **Parameters:** `inst` (Entity) — The mushroom being haunted; `haunter` (Entity) — The haunter.
*   **Returns:** `true` on successful haunt; otherwise `false`.
*   **Error states:** Returns `false` if haunt chance fails or mushroom is not interactable.

### `OnHauntCapOrCooked(inst, haunter)`
*   **Description:** Handles haunting of caps and cooked mushrooms. Transforms them to another color variant, preserving stack size, moisture, and percent-perished.
*   **Parameters:** `inst` (Entity), `haunter` (Entity).
*   **Returns:** `true` on successful transformation; otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `"iscave<phase>"` — Triggers `OnIsOpenPhase` to open/close in caves.  
  - `"spawnedfromhaunt"` — Calls `OnSpawnedFromHaunt` to launch the new entity.  
- **Pushes:**  
  - `"despawnedfromhaunt"` — Fired when an old mushroom is replaced via haunting.  
  - `"perishchange"` — Fired by `perishable` when percent changes.  
  - `"stacksizechange"` — Fired by `stackable` when size changes.  
  - `"loot_prefab_spawned"` — Fired by `lootdropper` when loot is dropped.  
