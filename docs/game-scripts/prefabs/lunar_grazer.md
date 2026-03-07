---
id: lunar_grazer
title: Lunar Grazer
description: Manages the lunar-grazing entity’s cloud-based sleep induction, combat behavior, debris mechanics, and Gestalt integration in DST.
tags: [combat, ai, boss, sleep, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e39b4847
system_scope: entity
---

# Lunar Grazer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lunar_grazer` prefab implements a boss entity that emits a damaging sleep-inducing cloud affecting sleepers and grogginess-capable characters. It manages combat targeting, debris deployment mechanics (reveal/hide/scatter/toss), cloud activation control, and Gestalt capture integration. The component relies heavily on the `combat`, `health`, `locomotor`, `sleeper`, and `grogginess` components, and interacts with `knownlocations`, `entitytracker`, and `planardamage`. It also supports state-graph-based behavior via `SGlunar_grazer` and integrates with DST’s network system for client-server synchronization.

## Usage example
```lua
-- Spawn a lunar grazer with default configuration
local grazer = SpawnPrefab("lunar_grazer")
grazer:OnSpawnedBy(portal_entity, 3)  -- Set spawn point and start delay
grazer.components.locomotor.walkspeed = 5
grazer.EnableCloud(false)  -- Disable cloud effects
grazer.ShowDebris()
grazer.ScatterDebris()
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `sleeper`, `grogginess`, `knownlocations`, `entitytracker`, `gestaltcapturable`, `planardamage`, `damagetyperesist`, `planarentity`, `inspectable`  
**Tags added:** `monster`, `hostile`, `notraptrigger`, `lunar_aligned`, `brightmare`, `gestaltcapturable`, `FX`, `NOCLICK`, `DECOR`  
**Tags checked:** `player`, `sleeper`, `playerghost`, `epic`, `INLIMBO`, `sleeping`, `knockout`, `waking`, `invisible`, `debris`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_cloudenabled` | `net_bool` | `true` | Networked flag controlling cloud activation. |
| `debris` | table of prefabs | `nil` | Pool of debris prefabs; initialized on first debris request. |
| `debrisshown` | boolean | `false` | Whether debris is currently visible. |
| `debrisscattered` | boolean | `false` | Whether debris has been scattered/tossed. |
| `cloudtask` | periodic task | `nil` | Periodic task that applies cloud effects. |
| `cloud` | FX prefab | spawned `lunar_goop_cloud_fx` | Visual FX for cloud. |
| `core` | FX prefab | spawned `lunar_grazer_core_fx` | Core FX follower tied to symbol. |
| `trails` | table of numbers | `[1..7]` shuffled | Valid trail variation IDs. |
| `last_trail` | FX or `nil` | `nil` | Reference to last spawned trail FX. |

## Main functions
### `EnableCloud(enable)`
* **Description:** Toggles the cloud effect on or off. Starts/stops the periodic cloud task accordingly.  
* **Parameters:** `enable` (boolean) — whether to enable the cloud. Omitting or passing `false` disables it.  
* **Returns:** Nothing.

### `IsCloudEnabled()`
* **Description:** Returns the current cloud activation state.  
* **Parameters:** None.  
* **Returns:** `boolean` — current cloud state.

### `IsTargetSleeping(inst, target)`
* **Description:** Checks whether the target is asleep or knocked out, using `grogginess:IsKnockedOut()` or `sleeper:IsAsleep()`.  
* **Parameters:** `target` (entity or `nil`) — the entity to check.  
* **Returns:** `boolean` — true if target is knocked out or sleeping.

### `SetCloudProtection(inst, ent, duration)`
* **Description:** Grants temporary immunity to cloud effects by setting a delayed callback to clear `_lunargrazercloudprot`.  
* **Parameters:**  
  - `ent` (entity) — target to protect.  
  - `duration` (number) — seconds before immunity expires.  
* **Returns:** Nothing.

### `RetargetFn(inst)`
* **Description:** AI retargeting function for `combat`. Prioritizes waking sleeping players near debris mode, otherwise aggroes on visible, non-dead entities with combat or player tags.  
* **Parameters:** `inst` (entity) — the lunar grazer instance.  
* **Returns:** `entity` (or `nil`, `true`) — valid target entity or `true` for soft-aggro signaling.

### `KeepTargetFn(inst, target)`
* **Description:** Determines whether to retain current target. Fails if target is invisible, non-player debris mode, or out of deaggro range.  
* **Parameters:** `target` (entity) — current combat target.  
* **Returns:** `boolean` — `true` if target should be retained.

### `SpawnTrail(inst, scale, duration, pos)`
* **Description:** Spawns or recycles a trail FX with a random variation. Updates `inst.last_trail`.  
* **Parameters:**  
  - `scale` (number) — FX scale.  
  - `duration` (number) — FX duration.  
  - `pos` (vector3 or `nil`) — spawn position; if `nil`, uses entity position.  
* **Returns:** Nothing.

### `ShowDebris(inst)`
* **Description:** Shows the debris rock FX that appear when the grazer enters debris mode. Creates the debris pool if needed.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `ScatterDebris(inst)`
* **Description:** Scatters debris rocks in a circle around the entity at ground level. Sets `debrisscattered = true`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `TossDebris(inst)`
* **Description:** Similar to `ScatterDebris`, but rocks are elevated (`y=1`) and given upward velocity for a tossing effect.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `DropDebris(inst)`
* **Description:** Drops debris rocks at ground level (`y=0`) with no vertical velocity.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `HideDebris(inst)`
* **Description:** Hides and reparents all debris FX back to the entity. Resets `debrisshown` and `debrisscattered`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnSpawnedBy(inst, portal, delay)`
* **Description:** Registers spawn location, tracks portal entity, and starts a spawn-delay state.  
* **Parameters:**  
  - `portal` (entity) — the portal that spawned this grazer.  
  - `delay` (number) — seconds to delay before entering main behavior.  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Saves debris visibility state for persistence.  
* **Parameters:** `data` (table) — the save data table.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Loads debris state: if saved as debris, jumps to `"dissipated"` state.  
* **Parameters:** `data` (table or `nil`) — loaded save data.  
* **Returns:** Nothing.

### `OnLoadPostPass(inst)`
* **Description:** Verifies portal link after load; removes entity if portal is gone and spawn point exists.  
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"attacked"` (`OnAttacked`) — sets attacker as combat target if not within attack range of current target.  
  - `"onremove"` (portal) (`_onportalremoved`) — despawns grazer if portal is destroyed.  
  - `"newstate"` (`OnNewState`) — hides debris when exiting states with `"debris"` tag.  
- **Pushes:**  
  - `"captured_despawn"` (`PushEventImmediate`) — fired upon Gestalt capture.  
  - `"lunar_grazer_despawn"` — fired when portal is lost and not asleep.