---
id: berrybush
title: Berrybush
description: Handles the lifecycle, regeneration, and loot spawning of berry bushes, including growth states, seasonal interactions, and special event behaviors.
tags: [plant, harvest, environment, seasonal]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d0497218
system_scope: environment
---

# Berrybush

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`berrybush` defines prefabs for renewable berry bushes that support harvesting, seasonal changes, and regeneration. It leverages the `pickable`, `witherable`, `workable`, and `lootdropper` components to manage growth cycles, state animations, looting, and special behaviors like Perd spawning. The system uses dynamic animation state control to reflect berry yield (empty, some berries, full berries) and adapts behavior based on bush type (normal or juicy) and environmental conditions (e.g., winter, lunar hail, withering).

## Usage example
```lua
-- Create a normal berrybush prefab
local bush = Prefab("my_berrybush", function()
    local inst = CreateEntity()
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst:AddTag("bush")
    inst:AddTag("plant")
    inst:AddTag("renewable")

    inst:AddComponent("pickable")
    inst.components.pickable:SetUp("berries", 600) -- 600 seconds regrowth
    inst.components.pickable.max_cycles = 5
    inst.components.pickable.cycles_left = 5

    inst:AddComponent("witherable")
    inst:AddComponent("workable")
    inst:AddComponent("lootdropper")

    return inst
end)
```

## Dependencies & tags
**Components used:** `pickable`, `witherable`, `workable`, `lootdropper`, `inspectable`, `hauntable`, `herdmember`, `lunarthrall_plantspawner`, `workable`, `lootdropper`, `home` (via `homeseeker`).
**Tags:** `bush`, `plant`, `renewable`, `lunarplant_target`, `witherable`, `quagmire_wildplant` (Quagmire mode only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `"berrybush"` / `"berrybush_juicy"` | Animation bank/build used for rendering. |
| `berries` | string | `"berries"`, `"berriesmore"`, `"berriesmost"` | Enumerated states representing berry yield levels. |
| `cycles_left` | number or `nil` | `max_cycles` on init | Remaining harvest cycles; `nil` implies infinite harvests. |
| `max_cycles` | number | `TUNING.BERRYBUSH_CYCLES + math.random(2)` | Maximum harvest cycles before barren state. |
| `product` | string | `"berries"` / `"berries_juicy"` | Item prefab dropped on each pick. |
| `dropheight` | number | `0` / `3.5` (juicy) | Vertical offset for loot drop position. |
| `dropped` | boolean | `false` / `true` (juicy) | Whether picks drop items directly from work (jostle). |
| `jostlepick` | boolean | `false` / `true` (juicy) | Enables picking via jostle damage (e.g., beaver gnaw). |

## Main functions
### `createbush(name, inspectname, berryname, master_postinit)`
*   **Description:** Factory function that constructs and returns a `Prefab` definition for a berrybush variant, configuring components, tags, animations, and callbacks.
*   **Parameters:** 
    * `name` (string) — Prefab base name (e.g., `"berrybush"`).  
    * `inspectname` (string) — Display name override (e.g., `"berrybush"`).  
    * `berryname` (string) — Item prefab name for harvested berries (e.g., `"berries"`).  
    * `master_postinit` (function) — Custom initialization callback applied on master simulation.
*   **Returns:** `Prefab` instance.
*   **Error states:** None identified; server-side logic safely short-circuits on non-mastersim.

### `onpickedfn(inst, picker)`
*   **Description:** Triggered after picking berries; updates animations to reflect partial harvest or barren state, and initiates Perd spawning based on luck.
*   **Parameters:** 
    * `inst` (Entity) — The bush entity.  
    * `picker` (Entity or `nil`) — The entity performing the pick.
*   **Returns:** Nothing.
*   **Error states:** Skips Perd spawn if `picker` has `berrythief` tag, if bush has `_noperd`, or if luck roll fails.

### `getregentimefn_normal(inst)` / `getregentimefn_juicy(inst)`
*   **Description:** Computes the time until next regrowth using base regrowth time plus penalty per cycle passed, plus random variance.
*   **Parameters:** 
    * `inst` (Entity) — The bush entity (must have `pickable` component).
*   **Returns:** `number` — Regrowth time in seconds.
*   **Error states:** Falls back to `TUNING` default if `pickable` component missing.

### `makeemptyfn(inst)` / `makebarrenfn(inst)` / `makefullfn(inst)`
*   **Description:** Animation callbacks invoked on barren/empty/full states to transition bush visuals appropriately (idle → dead, grow, etc.).
*   **Parameters:** 
    * `inst` (Entity) — The bush entity.
*   **Returns:** Nothing.

### `dig_up_common(inst, worker, numbertries)`
*   **Description:** Handles bush removal on `DIG` action; drops loots (twigs if barren/withered, bush itself, and berries if harvestable).
*   **Parameters:** 
    * `inst` (Entity) — The bush entity.  
    * `worker` (Entity) — Entity performing the dig.  
    * `numbertries` (number) — How many berries to drop if harvestable.
*   **Returns:** Nothing.

### `onworked_juicy(inst, worker, workleft)`
*   **Description:** Custom callback for juicy bushes to support picking during jostle damage (e.g., beaver gnaw).
*   **Parameters:** 
    * `inst` (Entity) — The bush entity.  
    * `worker` (Entity) — Entity causing jostle.  
    * `workleft` (number) — Remaining work left before finish.
*   **Returns:** Nothing.

### `setberries(inst, pct)`
*   **Description:** Controls animation visibility of berry layers (`berries`, `berriesmore`, `berriesmost`) based on yield percentage.
*   **Parameters:** 
    * `inst` (Entity) — The bush entity.  
    * `pct` (number or `nil`) — Yield fraction (`0.0`–`1.0`). If `nil`, auto-detects state from component data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — Triggers `setberries` to update berry visibility after animation transitions.  
  - `onwenthome` — Triggers `shake` animation (e.g., on wind or haunt).  
  - `spawnperd` — Triggers `spawnperd` on event firing (YOTG event mode only).  
  - `onremove` — Removes home reference via `homeseeker` (handled in `sethome`).  
  - `picked` — Internal event (handled by `pickable` component, but bush modifies visuals).  
- **Pushes:** None directly; relies on events from attached components (`picked`, `picked` with `loot`).