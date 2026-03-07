---
id: waterplant
title: Waterplant
description: A sentient, flower-based ocean plant entity that regenerates barnacles, spawns fish, and attacks nearby threats using ranged combat or pollen-based abilities.
tags: [combat, ai, boss, environment, spawn]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b76dda97
system_scope: environment
---

# Waterplant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waterplant` is a complex environment entity representing a sentient barnacle-covered flower growing in the ocean. It functions as a hybrid farm and combatant: it grows barnacles that can be harvested, spawns small fish via its `childspawner` component, and engages in ranged combat when agitated by harvesting, collisions, or fire. It uses dynamic visual layers (`bud1`, `bud2`, `bud3`) to indicate barnacle maturity and supports three colour variants (pink, white, yellow), each with distinct behavior. It integrates deeply with components for health, combat, floater physics, and time-based events (e.g., pollen clouds, regen timers). Its brain (`waterplantbrain.lua`) manages state transitions.

## Usage example
```lua
-- Typical usage: spawn a waterplant at a target position
local pos = Vector3(x, y, z)
local plant = SpawnPrefab("waterplant")
if plant ~= nil then
    plant.Transform:SetPosition(pos.x, pos.y, pos.z)
    plant.Transform:SetRotation(math.random() * 360)
    -- Optional: manually set colour variant
    plant.components.colouradder:AttachChild(plant.base)
    plant._colour = "yellow_"
    plant.components.lootdropper:SetChanceLootTable("yellow_waterplant")
    plant.components.combat:SetAttackPeriod(TUNING.WATERPLANT.YELLOW_ATTACK_PERIOD)
end
```

## Dependencies & tags
**Components used:** `sleeper`, `colouradder`, `harvestable`, `shaveable`, `combat`, `health`, `lootdropper`, `inventory`, `inspectable`, `childspawner`, `timer`, `burnable`, `propagator`, `freezable`, `floater`, `boatphysics`, `weapon`, `inventoryitem`.  
**Tags added by instance:** `ignorewalkableplatforms`, `seastack`, `veggie`, `waterplant`.  
**Tags added to `waterplant_base`:** `FX`.  
**Tags checked (non-exhaustive):** `plantkin`, `debris`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_colour` | string | random `""`, `"white_"`, `"yellow_"` | Flower variant; determines attack period, loot table, and regen periods. |
| `_stage` | number | `2` | Current developmental stage (2 or 3); controls visual "stage" layers. |
| `_pollen_reset_time` | number | `TUNING.WATERPLANT.POLLEN_RESETTIME` | Base interval (seconds) for pollen cloud reset cooldown. |
| `_can_cloud` | boolean | `false` | Whether the waterplant can currently spawn a pollen cloud. |
| `base` | Entity | `SpawnPrefab("waterplant_base")` | Render-only child entity for sync'd animations. |
| `GoToStage` | function | `go_to_stage` | Helper to switch between stage 2 and 3 visuals. |
| `RevertToRock` | function | `revert_to_rock` | Destroys entity and spawns `waterplant_rock` at same position. |
| `SpawnCloud` | function | `spawn_pollen_cloud` | Spawns a `waterplant_pollen_fx` entity. |

## Main functions
### `set_flower_type(inst, colour)`
*   **Description:** Sets the flower’s colour variant (`""` = pink/default, `"white_"`, `"yellow_"`) and configures per-variant tuning (attack period, loot table, regen period). Also applies colour overrides to the `AnimState` for bud, face, and petal symbols.
*   **Parameters:** `inst` (Entity) - the waterplant instance; `colour` (string or `nil`) - optional colour key; if `nil`, picks a random colour.
*   **Returns:** Nothing.
*   **Error states:** Overlays only change if `colour` differs from `inst._colour` or is `nil`.

### `update_barnacle_layers(inst, pct)`
*   **Description:** Controls visibility of barnacle bud layers (`bud1`, `bud2`, `bud3`) based on maturity percentage (`pct`). Used during harvesting/growth to visually represent barnacle count.
*   **Parameters:** `inst` (Entity); `pct` (number) - barnacle maturity as a fraction (0.0–1.0).
*   **Returns:** Nothing.

### `go_to_stage(inst, new_stage)`
*   **Description:** Switches the waterplant’s visual stage (`stage2` or `stage3`). Hides the opposite stage layer.
*   **Parameters:** `inst` (Entity); `new_stage` (number) — must be `2` or `3`.
*   **Returns:** Nothing.

### `revert_to_rock(inst)`
*   **Description:** Destroys the main entity and its `base`, then spawns a `waterplant_rock` at the same world position.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `set_target(inst, target)`
*   **Description:** Sets the waterplant’s combat target and recruits up to 4 nearby allied plants (`musttags = {"_combat", "waterplant"}`) to share the aggro, provided they are awake.
*   **Parameters:** `inst` (Entity); `target` (Entity) — the target to suggest.
*   **Returns:** Nothing.

### `on_harvested(inst, picker, picked_amount)`
*   **Description:** Called when barnacles are harvested. Resets barnacle layers to `pct = 0`, sets `shaveable.prize_count = 0`, and wakes up the plant to target the picker unless the picker has the `plantkin` tag.
*   **Parameters:** `inst` (Entity); `picker` (Entity); `picked_amount` (number).
*   **Returns:** Nothing.

### `on_grown(inst, produce_count)`
*   **Description:** Called when barnacles finish growing. Updates barnacle layer visibility based on `produce_count`, pushes `barnacle_grown`, and updates `shaveable.prize_count`. Resets grow timer with variance.
*   **Parameters:** `inst` (Entity); `produce_count` (number).
*   **Returns:** Nothing.

### `can_shave(inst, shaver, shave_item)`
*   **Description:** Predicate used by `shaveable`. Allows shaving only if `harvestable:CanBeHarvested()` returns `true`.
*   **Parameters:** `inst` (Entity); `shaver` (Entity); `shave_item` (Entity or `nil`).
*   **Returns:** `true` or `false`.

### `on_shaved(inst, shaver, shave_item)`
*   **Description:** Handles post-shave logic: resets barnacle layers, sets `produce = 0`, restarts growth, and targets the shaver if awake and not `plantkin`.
*   **Parameters:** `inst` (Entity); `shaver` (Entity); `shave_item` (Entity or `nil`).
*   **Returns:** Nothing.

### `retarget(inst)`
*   **Description:** Retargeting function for `combat`. Always returns `nil` to prevent automatic re-acquisition (plants only re-target when agitated).
*   **Parameters:** `inst` (Entity).
*   **Returns:** `nil`.

### `keeptarget(inst, target)`
*   **Description:** Keep-target predicate for `combat`. Returns `true` only if `target` is valid, alive, and within `ATTACK_DISTANCE + 4` units.
*   **Parameters:** `inst` (Entity); `target` (Entity or `nil`).
*   **Returns:** `true` or `false`.

### `equip_ranged_weapon(inst)`
*   **Description:** Spawns a temporary non-networked ranged weapon (`waterplant_projectile`) and equips it in the plant’s `inventory`. Used to enable ranged attacks with extended range.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inventory` has an item equipped.

### `find_and_attack_nearby_player(inst)`
*   **Description:** Scans for the nearest player within `ATTACK_DISTANCE^2` and sets it as the combat target if none is present. Used for fire/collision aggro.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `combat` is `nil` or already has a target.

### `on_burnt(inst)`
*   **Description:** Fires when the plant is fully burnt. Spawns `barnacle_cooked` loot for each barnacle, then reverts to `waterplant_rock`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_frozen(inst)` / `on_unfrozen(inst)`
*   **Description:** On freeze, disables harvesting/growth. On unfreeze, re-enables harvesting/growth and attempts to re-acquire a target if frozen with one.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_collide(inst, data)`
*   **Description:** Handles boat collisions. If impact velocity exceeds `ANGERING_HIT_VELOCITY`, aggroes the plant to a nearby player.
*   **Parameters:** `inst` (Entity); `data` (table) — collision data containing `other` and `hit_dot_velocity`.
*   **Returns:** Nothing.

### `spawn_pollen_cloud(inst)`
*   **Description:** Spawns a `waterplant_pollen_fx` entity and disables cloud spawning until the `resetcloud` timer finishes.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `release_all_fish(inst)`
*   **Description:** Instructs the `childspawner` to release all pending fish.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_timer_finished(inst, data)`
*   **Description:** Handles timer callbacks: equips ranged weapon on `equipweapon`, and re-enables pollen clouds on `resetcloud`.
*   **Parameters:** `inst` (Entity); `data` (table) — timer event data; must contain `name`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` (`on_attacked`) — sets target to the attacker.
  - `onignite` (`on_ignited`) — aggroes to nearest player and disables harvesting.
  - `onburnt` (`on_burnt`) — spawns cooked barnacles and reverts to rock.
  - `onextinguish` (`on_extinguish`) — re-enables harvesting.
  - `freeze` (`on_frozen`) — disables harvesting.
  - `unfreeze` (`on_unfrozen`) — re-enables harvesting and may re-acquire target.
  - `droppedtarget` (`on_dropped_target`) — transitions to bud if stage 3.
  - `on_collide` (`on_collide`) — aggroes on high-velocity boat hits.
  - `newcombattarget` (`on_new_combat_target`) — blanks attacks briefly (4s max).
  - `pollenlanded` (`release_all_fish`) — releases all fish.
  - `gotosleep` (`go_to_sleep`) — pauses `resetcloud` timer.
  - `onwakeup` (`on_wakeup`) — resumes `resetcloud` timer.
  - `timerdone` (`on_timer_finished`) — triggers equipment or cloud reset.
- **Pushes:**
  - `barnacle_grown` — fired when barnacles reach full maturity.
  - `floater_startfloating` — via `floater` on landing.