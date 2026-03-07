---
id: sleepcloud
title: Sleepcloud
description: A world FX entity that spawns floating spore clouds which induce sleepiness or knockback resistance in nearby entities over time.
tags: [environment, fx, world, combat, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3af2bc24
system_scope: world
---

# Sleepcloud

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sleepcloud` is a non-persistent FX entity that represents a floating spore cloud. It periodically affects all eligible entities within a radius by increasing their sleepiness or grogginess, potentially putting them to sleep or extending an existing knock-out. The cloud self-disperses after a fixed duration (`TUNING.SLEEPBOMB_DURATION`). It supports two variants: standard and lunar (colored blue), differing only in visual appearance. The component is primarily used as a game effect tied to items like Sleep Bombs.

This prefab is never networked for simulation on dedicated servers — only clients spawn its local visual overlays (`sleepcloud_overlay`). It interacts with several components on affected targets: `sleeper`, `grogginess`, `combat`, `burnable`, `freezable`, `pinnable`, `fossilizable`, and `rider`.

## Usage example
```lua
-- Spawn a standard sleep cloud
local cloud = SpawnPrefab("sleepcloud")
cloud.Transform:SetPosition(x, y, z)
cloud:SetOwner(playerinst)

-- Spawn a lunar variant (blue-tinted)
local lunar_cloud = SpawnPrefab("sleepcloud_lunar")
lunar_cloud.Transform:SetPosition(x, y, z)
lunar_cloud:SetOwner(playerinst)
```

## Dependencies & tags
**Components used:** `timer` (added), external component access: `sleeper`, `grogginess`, `combat`, `burnable`, `freezable`, `pinnable`, `fossilizable`, `rider`.  
**Tags added:** `FX`, `NOCLICK`, `notarget`.  
**Tags checked:** `player`, `playerghost`, `sleeper`, `FX`, `DECOR`, `INLIMBO`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_state` | `net_tinybyte` | `0` → `1` → `2` | Networked state: `0`=pre-anims, `1`=active, `2`=dispersing/finalized. |
| `_inittask` | task handle | `nil` | Delayed task that spawns base FX and sets `_basefx`. |
| `_basefx` | entity (optional) | `nil` | The base `sporecloud_base` FX entity. |
| `_overlayfx` | table | `{}` | List of active overlay entities (`sleepcloud_overlay`). |
| `_overlaytasks` | table | `{}` | Task handles for spawning overlays sequentially. |
| `_drowsytask` | periodic task | `nil` | Periodic task (every 0.5s) calling `DoAreaDrowsy`. |
| `_create_base_fn` | function | `CreateBase` | Function used to instantiate base FX (differs for lunar variant). |
| `owner` | entity (optional) | `nil` | Entity that created the cloud (not used for targeting logic). |

## Main functions
### `SetOwner(inst, owner)`
* **Description:** Sets the `owner` field on the instance; primarily for tracking source but not used in target filtering logic.
* **Parameters:** `owner` (entity) — the entity that spawned the cloud.
* **Returns:** Nothing.

### `DoAreaDrowsy(inst, sleeptimecache, sleepdelaycache)`
* **Description:** A periodic function that scans for nearby targets within 3.5 units and applies sleepiness or grogginess. Excludes targets in burning, frozen, stuck, or recently attacked states; also respects PVP mode rules. Works on entities with `sleeper` or `grogginess` components, or sends a `"knockedout"` event otherwise.
* **Parameters:**
  * `inst` — the sleep cloud instance.
  * `sleeptimecache` (table) — per-target cache of remaining sleep duration.
  * `sleepdelaycache` (table) — per-target counter to delay repeated application.
* **Returns:** Nothing.
* **Error states:** Skips targets if they:
  * Are the cloud's owner.
  * Have `combat.lastwasattackedtime` within `ATTACK_SLEEP_DELAY` seconds.
  * Are burning (`burnable:IsBurning()`).
  * Are frozen (`freezable:IsFrozen()`).
  * Are stuck (`pinnable:IsStuck()`).
  * Are fossilized (`fossilizable:IsFossilized()`).
  * In PVP: Must have either `"sleeper"` or `"player"` tag (via `oneof_tags`); in non-PVP: must have `"sleeper"` tag.

### `DoDisperse(inst)`
* **Description:** Handles cloud dispersal: cancels all tasks, plays post-animation, kills loop sound, removes overlays, and destroys the instance after 3 seconds.
* **Parameters:** `inst` — the sleep cloud instance.
* **Returns:** Nothing.

### `InitFX(inst)`
* **Description:** Deferred initialization task that creates the base FX (`_basefx`) only on non-dedicated servers.
* **Parameters:** `inst` — the sleep cloud instance.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Called during networked load; resumes active state from saved timer, skips pre-anims, and respawns overlays. If the timer has expired, instantly destroys the cloud.
* **Parameters:** `inst`, `data` — network load arguments.
* **Returns:** Nothing.

### `SpawnOverlayFX(inst, i, set, isnew)`
* **Description:** Creates and positions a `sleepcloud_overlay` entity at a pre-defined offset and scale (based on `OVERLAY_COORDS`). Handles looping animation and animation-over callbacks.
* **Parameters:**
  * `inst` — the sleep cloud instance.
  * `i` (number or `nil`) — index used to store task handle; if non-nil, cancels existing task.
  * `set` (table) — `{x, y, z, scale, rotation?}` offsets.
  * `isnew` (boolean) — if `true`, triggers `sleepcloud_overlay_pre` animation.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"statedirty"` — triggers `OnStateDirty` on clients to update local FX when `_state` changes.  
  - `"animover"` — on sleep cloud entity, calls `OnAnimOver` to advance `_state` from pre to active.  
  - `"timerdone"` — triggers `OnTimerDone` to initiate dispersal when the `"disperse"` timer expires.  
  - `"animover"` (on overlay entities) — triggers `OnOverlayAnimOver` to loop animation after pre.

- **Pushes:**  
  - `"ridersleep"` — sent to a mount entity when its rider is affected.  
  - `"knockedout"` — sent on non-sleeper/non-groggy entities to signal knockback resistance.