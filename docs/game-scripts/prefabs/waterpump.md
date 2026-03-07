---
id: waterpump
title: Waterpump
description: A functional entity that channels water in a circular area, launching water projectiles when used; breaks upon being hammered and extinguishes flames.
tags: [structure, channeling, projectile, utility]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f5baa03
system_scope: world
---

# Waterpump

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waterpump` is a static structure prefab that functions as a water pump, primarily used on boats to remove water leaks. When activated via channeling (e.g., by a player), it launches water projectiles (`waterstreak_projectile`) within a circular radius, with speed and direction determined by a linear easing function and nearest valid target. It integrates with components such as `burnable`, `channelable`, `workable`, and `lootdropper`, and supports serialization and placement helper visuals.

## Usage example
```lua
--典型用法：在主世界中生成水泵实体
local pump = SpawnPrefab("waterpump")
if pump and pump.Transform then
    pump.Transform:SetPosition(x, y, z)
    -- 水泵会自动处理频道和项目发射逻辑
end

-- 注意：该实体由游戏预设系统自动管理，通常通过放置器（placer）创建
```

## Dependencies & tags
**Components used:** `burnable`, `channelable`, `complexprojectile`, `deployhelper`, `lootdropper`, `placer`, `workable`, `propagator`  
**Tags added:** `structure`, `pump`  
**Tags checked/ignored during target search:** `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `burnt`, `player`, `monster`  
**Tag exclusions (ONEOFTAGS):** `fire`, `smolder`

## Properties
No public properties are directly exposed as modifiable fields in this file.

## Main functions
### `LaunchProjectile(inst)`
*   **Description:** Launches a `waterstreak_projectile` toward a target within `TUNING.WATERPUMP.MAXRANGE` range. If no valid entities are found, a random position is chosen. Speed is computed using a linear easing function based on distance.
*   **Parameters:** `inst` (Entity) — the waterpump instance.
*   **Returns:** Nothing.
*   **Error states:** Projectile only launches if `TheWorld.Map:IsVisualGroundAtPoint(x,y,z)` returns `false` (i.e., the pump is over water). Targets must be within range and avoid forbidden tags.

### `OnStartChanneling(inst, channeler)`
*   **Description:** Initiates the channeling interaction. Plays the `use_pre` animation and schedules projectile launch after a delay. Listens for `animover` to trigger `startprojectilelaunch`.
*   **Parameters:** `inst` (Entity), `channeler` (Entity) — the entity initiating channeling (e.g., player).
*   **Returns:** Nothing.

### `OnStopChanneling(inst)`
*   **Description:** Stops the channeling interaction. Cancels pending tasks, resets animation, kills looping sound, and clears `channeler` reference.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the waterpump is hammered (e.g., destroyed or dismantled). Extinguishes any active fire, spawns a `collapse_small` FX, drops loot, notifies linked boat of a leak if on a platform, and removes the entity.
*   **Parameters:** `inst` (Entity), `worker` (Entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

### `onsave(inst, data)`, `onload(inst, data)`
*   **Description:** Serialization hooks. `onsave` stores `burnt` state; `onload` restores it by invoking `onburnt` logic if marked burnt.
*   **Parameters:** `inst` (Entity), `data` (table) — save/load state.
*   **Returns:** Nothing.

### `OnEnableHelper(inst, enabled)`
*   **Description:** Manages the visual placement helper (used only on client). Shows/hides a scaled proxy entity when the waterpump is being placed or removed from inventory.
*   **Parameters:** `inst` (Entity), `enabled` (boolean).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onburnt` — triggers cleanup and removes `channelable` component.  
  - `channel_finished` — triggers `OnStopChanneling`.  
  - `animover` — triggers `startprojectilelaunch` (scheduled from `use_pre` animation end).  
  - `onbuilt` — plays `place` animation and sounds, calls `testforland`.  
  - `onremove` — cancels channeling if entity is removed while being channeled.
- **Pushes:**  
  - `spawnnewboatleak` — via linked boat when hammered while burning or leaking.  
  - `onextinguish`, `onburnt`, `onbuilt` — standard events passed through.  
  - `cancel_channel_longaction` — if channeling is interrupted (e.g., burnt).  
  - `entity_droploot` — after loot drop.