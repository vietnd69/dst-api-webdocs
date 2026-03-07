---
id: wobster_den
title: Wobster Den
description: A water-based structure that spawns and regenerates Wobster creatures over time, interacts with player mining actions and boat collisions, and can transform into a Moonglass Wobster Den during Halloween events.
tags: [environment, entity, structure, spawner, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dad7f21f
system_scope: environment
---

# Wobster Den

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wobster_den` prefab represents a static, floating structure in bodies of water that serves as a spawner for Wobster creatures. It is built using the `childspawner` component to manage periodic spawning and regeneration of its occupants, and integrates with the `workable` component to allow mining via the `MINE` action. The den also interacts with physics via `boatphysics` (taking damage when hit by boats), supports day/night cycle logic (spawning only during the day), and can be converted into a `moonglass_wobster_den` during the Halloween event using the `halloweenmoonmutable` component. It is primarily used as part of the world environment to provide a renewable resource source.

## Usage example
```lua
-- Create a standard Wobster Den
local den = Prefab("wobster_den", fn, assets, prefabs)()
den.Transform:SetPosition(Vector3(0, 0, 0))

-- Access and configure child spawner (typically already done inside basefn)
den.components.childspawner:SetMaxChildren(5)
den.components.childspawner:StartSpawning()

-- Trigger mining manually
den.components.workable:WorkedBy(player, 10)
```

## Dependencies & tags
**Components used:**  
- `boatphysics` (read-only, accessed via `data.other.components.boatphysics`)  
- `childspawner`  
- `floater`  
- `halloweenmoonmutable`  
- `lootdropper`  
- `workable`  

**Tags:**  
- Adds: `ignorewalkableplatforms`, `event_trigger`  
- Checks: `structure` (implicit via lootdropper logic), `monster` (loot conversion)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefab` | string | `"wobster_den"` | Internal prefab name; may change to `"moonglass_wobster_den"` on Halloween conversion. |
| `components.workable.workleft` | number | `TUNING.WOBSTER_DEN_WORK` | Current work remaining before destruction. |
| `components.childspawner.childreninside` | number | `TUNING.WOBSTER_DEN_MAX_CHILDREN` | Number of Wobsters currently inside the den. |
| `components.childspawner.childname` | string | `"wobster_sheller"` | Prefab name of the child entity to spawn. |
| `components.childspawner.spawnradius` | number | `TUNING.WOBSTER_DEN_SPAWNRADIUS` | Radius around the den where children are spawned. |
| `components.childspawner.wateronly` | boolean | `true` | Whether children can only spawn on water tiles. |
| `_blink_task` | Task | `nil` | Periodic task for blinking animation when occupied. |
| `_spawning_update_task` | Task | `nil` | Delayed task to start/stop spawning based on time of day. |

## Main functions
### `updateart(inst)`
*   **Description:** Updates the den’s idle animation based on remaining work and number of children inside. Prioritizes `"eyes_loop"` if occupied and work is high, `"med"` for medium work, `"low"` for low work.
*   **Parameters:** `inst` (Entity) – the den entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `get_idle_anim(inst, num_children)`
*   **Description:** Helper used by `updateart` to select the correct animation state.
*   **Parameters:**  
    - `inst` (Entity) – den instance (used to read `workleft`).  
    - `num_children` (number) – value from `childspawner.childreninside`.  
*   **Returns:** Animation state name (string): `"eyes_loop"`, `"full"`, `"med"`, or `"low"`.

### `try_blink(inst)`
*   **Description:** Triggers a blink sequence (`"blink"` → `"eyes_loop"`) if the den has occupants and high work. Used as a periodic task.
*   **Parameters:** `inst` (Entity) – den instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if `workleft ≤ FIRST_WORK_LEVEL` or no children inside.

### `on_den_occupied(inst)`
*   **Description:** Starts a periodic blink task when a Wobster enters the den (i.e., `childreninside > 0`) and `workleft > FIRST_WORK_LEVEL`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_den_vacated(inst)`
*   **Description:** Cancels blink task and resets animation when den becomes empty (`childreninside = 0`) while still above full health.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `stop_spawning(inst)`
*   **Description:** Stops child spawning if currently active.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `start_spawning(inst)`
*   **Description:** Starts child spawning if currently inactive.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_day_started(inst)`
*   **Description:** Schedules `stop_spawning` to run after a random delay (1–3 seconds) when entering cave day.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_day_ended(inst)`
*   **Description:** Schedules `start_spawning` to run after a random delay (1–3 seconds) when exiting cave day.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `initialize(inst)`
*   **Description:** Core initialization logic. Sets initial animation, starts blinking if occupied, and disables spawning during cave day.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnWork(inst, worker, workleft)`
*   **Description:** Callback when the den is mined. If `workleft ≤ 0`, drops loot, releases all children, removes the den, and spawns an FX; otherwise updates art.
*   **Parameters:**  
    - `inst` (Entity) – the den instance.  
    - `worker` (Entity) – player/entity performing work.  
    - `workleft` (number) – remaining work after this hit.  
*   **Returns:** Nothing.

### `OnCollide(inst, data)`
*   **Description:** Handles collision with boats. Calculates hit velocity and applies damage via `workable:WorkedBy`. Also releases all children on impact.
*   **Parameters:**  
    - `inst` (Entity) – den instance.  
    - `data` (table) – collision event data, must include `other` (boat) and `hit_dot_velocity`.  
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `boatphysics` component missing.

### `basefn(build, loot_table_name, child_name)`
*   **Description:** Prefab factory function. Creates a fully configured den entity with all components and listeners.
*   **Parameters:**  
    - `build` (string) – animation bank/build name (e.g., `"lobster_den_build"`).  
    - `loot_table_name` (string) – name of the shared loot table (e.g., `"wobster_den"`).  
    - `child_name` (string) – child prefab name (e.g., `"wobster_sheller"`).  
*   **Returns:** Entity – fully initialized den instance.
*   **Error states:** Returns a partial entity on clients (`TheWorld.ismastersim = false`).

### `moonconversionoverridefn(inst)`
*   **Description:** Overrides den behavior for Halloween conversion. Transforms it into `moonglass_wobster_den` by updating prefab name, animation build, loot table, and child name, then removes the `halloweenmoonmutable` component.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `inst, nil` (required by `halloweenmoonmutable` conversion API).

### `OnPreLoad(inst, data)`
*   **Description:** Callback used during save/load to reapply world setting overrides to the child spawner.
*   **Parameters:**  
    - `inst` (Entity).  
    - `data` (table) – pre-load data (unused directly).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"on_collide"` – handled by `OnCollide`.  
  - `"startcaveday"` – via `WatchWorldState`, triggers `on_day_started`.  
  - `"stopcaveday"` – via `WatchWorldState`, triggers `on_day_ended`.  
- **Pushes:**  
  - None directly. Uses `lootdropper:DropLoot` internally, which pushes `"entity_droploot"`.
