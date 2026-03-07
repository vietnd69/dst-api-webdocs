---
id: moonstorm_spark
title: Moonstorm Spark
description: A floating, ephemeral lightning-based entity that periodically emits electric shocks to nearby targets and can be recharged by moonsparkchargeable components; it ages over time and disappears when depleted.
tags: [electric, environment, projectile, perishable, ai]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bc02590f
system_scope: environment
---

# Moonstorm Spark

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonstorm_spark` is a transient, flying entity spawned during moonstorms. It floats near the ground and periodically emits an electric shock (via `dospark`) that damages eligible entities within a 4-unit radius. Sparks can be collected and later recharged via the `moonsparkchargeable` component. They have a finite lifespan governed by `perishable`, and their behavior is managed by the `SGspore` stategraph and a dedicated brain. The spark emits light, sound, and avoids insulation/ghost states on targets.

## Usage example
```lua
-- Spawning a spark manually (typically done via worldgen, not modder code)
local spark = SpawnPrefab("moonstorm_spark")
spark.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:**  
- `combat` (via `CanBeAttacked`, `GetAttacked`)  
- `electricattacks` (via `AddSource`)  
- `hauntable` (via `Panic`)  
- `health` (via `IsDead`)  
- `inventory` (via `IsInsulated`, `GiveItem`)  
- `inventoryitem` (via `IsHeld`, `OnDropped`, `SetOnPutInInventoryFn`)  
- `locomotor` (via `EnableGroundSpeedMultiplier`, `SetTriggersCreep`, `walkspeed`)  
- `moonsparkchargeable` (via `DoSpark`)  
- `moonstormmanager` (via `DoTestForSparks`)  
- `perishable` (via `SetLocalMultiplier`, `SetOnPerishFn`, `SetPercent`, `SetPerishTime`, `StartPerishing`)  
- `stackable` (via `Get`, `StackSize`)  
- `workable` (via `SetOnFinishCallback`, `SetWorkAction`, `SetWorkLeft`)  

**Tags added:** `show_spoilage`, `moonstorm_spark`  
**Tags checked (on targets):** `moonsparkchargeable`, `playerghost`, `INLIMBO`, `flight`, `invisible`, `notarget`, `noattack`, `moonstorm_static`, `wall`, `structure`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sparktask` | Task or `nil` | `nil` | Task handle for scheduled spark events. |
| `crowdingtask` | Task or `nil` | `nil` | Task handle for crowding density checks. |
| `scrapbook_damage` | number | `TUNING.MOONSTORM_SPARK_DAMAGE * TUNING.ELECTRIC_DAMAGE_MULT` | Damage value shown in scrapbook. |
| `scrapbook_animpercent` | number | `0.5` | Animation frame percentage for scrapbook preview. |
| `scrapbook_anim` | string | `"idle_flight_loop"` | Animation used in scrapbook preview. |
| `scrapbook_animoffsetx` | number | `20` | X offset for scrapbook preview. |
| `scrapbook_animoffsety` | number | `35` | Y offset for scrapbook preview. |
| `displayadjectivefn` | function | `DisplayAdjectiveFn` | Returns string adjective for UI based on spoilage state. |

## Main functions
### `dospark(inst)`
* **Description:** Initiates the spark’s discharge sequence: spawns a shock FX prefab, schedules `dospark1`, and recursively schedules the next `dospark` after a delay.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.
* **Error states:** Does not return early; fails silently if `inst` is invalid.

### `dospark1(inst, dospark)`
* **Description:** Performs the main electric shock: damages all eligible entities within 4 units, charges `moonsparkchargeable` entities, and schedules `dospark2` after 0.5s and the next `dospark` after 5–15s.
* **Parameters:**  
  - `inst` (Entity) — the spark instance.  
  - `dospark` (function) — reference to the `dospark` function to enable recursion.  
* **Returns:** Nothing.
* **Error states:** Targets are only damaged if they meet multiple conditions: valid, not in limbo, not insulated, not dead, have `combat` and `CanBeAttacked()` returns true. Permanently skips绝缘 (insulated) entities.

### `dospark2(inst)`
* **Description:** Reduces the spark’s light radius to 1.5 after 0.5 seconds, simulating a fading discharge.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `depleted(inst)`
* **Description:** Handles spark expiration: disables workability, pushes `"death"` event, removes `"spore"` tag, sets `persists = false`, and removes the entity after 3s.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `checkforcrowding(inst)`
* **Description:** Monitors spore density within `TUNING.MUSHSPORE_MAX_DENSITY_RAD`. If overpopulated, spoils the spark immediately by setting `perishable` to 0%; otherwise, schedules the next check.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `onpickup(inst)`
* **Description:** Called when the spark is placed in an inventory. Slows spoilage, stops idle sound, and cancels tasks (`crowdingtask`, `sparktask`) and light.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `ondropped(inst)`
* **Description:** Called when the spark is dropped. Restores spoilage rate, resumes idle sound (if awake), restores workability, splits stacks if oversized, resumes light and spark timer.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `onworked(inst, worker)`
* **Description:** Callback for when the spark is worked on (e.g., with a net). Transfers the spark to the worker’s inventory and forces a moonstorm spark test.
* **Parameters:**  
  - `inst` (Entity) — the spark instance.  
  - `worker` (Entity) — the entity performing the work.  
* **Returns:** Nothing.

### `OnWake(inst)`
* **Description:** Restarts spark timer and idle sound if the entity wakes and is not held.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `OnSleep(inst)`
* **Description:** Cancels spark timer and kills idle sound when the entity goes to sleep.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** Nothing.

### `DisplayAdjectiveFn(inst)`
* **Description:** Returns a localized string (`STRINGS.UI.HUD.STALE_POWER` or `STRINGS.UI.HUD.SPOILED_POWER`) if the spark is stale or spoiled, otherwise `nil`.
* **Parameters:** `inst` (Entity) — the spark instance.
* **Returns:** `string?` — adjective string or `nil`.

### `fn()`
* **Description:** Constructor function that creates the spark entity, attaches all required components and assets, sets up behavior, and returns the fully initialized prefab instance.
* **Parameters:** None.
* **Returns:** Entity — a fully initialized `moonstorm_spark` prefab.

## Events & listeners
- **Listens to:**  
  - `"onputininventory"` — triggers `onpickup`.  
  - `"ondropped"` — triggers `ondropped`.  
  - `"death"` — internal event from `perishable` via `depleted`, also manually pushed when depleted.  
- **Pushes:**  
  - `"death"` — when spark is depleted.  
  - `"perishchange"` — triggered by `perishable:SetPercent()` or `SetPerishTime()` (internal to component).  

