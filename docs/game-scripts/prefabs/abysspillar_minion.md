---
id: abysspillar_minion
title: Abysspillar Minion
description: A floating mechanical minion that serves as a portable platform in the Rifts biome, supporting entity movement and state synchronization with its associated large pillar.
tags: [ai, platform, boss, entity, rift]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 17125a47
system_scope: world
---

# Abysspillar Minion

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `abysspillar_minion` prefab represents a deployable platform in the Rifts biome, used to extend mobility across the Void during boss encounters. It is designed to attach to and detach from one of two large abyss pillars (`leftpillar` or `rightpillar`), and transitions between an inactive "statue" state and an active, physics-enabled state. It integrates with multiple core components: `inspectable` for status display, `locomotor` and `embarker` for movement, `entitytracker` to manage associations with large pillars, and state graphs for gameplay logic. The prefab supports saving/loading and network replication for client-server consistency.

## Usage example
```lua
local minion = SpawnPrefab("abysspillar_minion")
minion.Transform:SetPosition(x, 0, z)
minion:Activate()
minion.components.entitytracker:TrackEntity("leftpillar", bigpillar_entity)
minion:SetOnBigPillar(bigpillar_entity, true)
```

## Dependencies & tags
**Components used:** `inspectable`, `locomotor`, `embarker`, `entitytracker`, `follower`, `transform`, `animstate`, `soundemitter`, `physics`, `network`  
**Tags:** `monster`, `soulless`, `mech`, `notarget`, `NOBLOCK`, `electricdamageimmune`  
**Additional tags applied during activation:** `ignorewalkableplatformdrowning` (added in `Activate`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `broken` | boolean | `nil` | Set by `MakeBroken()` to indicate the minion is visually broken and non-functional. |
| `sg` | StateGraph or `nil` | `nil` | The assigned state graph during activation; `nil` indicates inactive state. |

## Main functions
### `MakeBroken(inst)`
* **Description:** Visually renders the minion as broken: plays the "broken" animation and sets the build to `abyss_pillar_minion_broken_build`. Typically called on load if saved as broken.
* **Parameters:** `inst` (Entity) — the entity to break (same as `self` within method).
* **Returns:** Nothing.

### `IsActivated(inst)`
* **Description:** Checks whether the minion is currently active (i.e., has an assigned state graph).
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** `true` if `inst.sg ~= nil`, otherwise `false`.

### `PreActivate(inst)`
* **Description:** Begins the activation transition (play "turn_on_pre" animation and sound). Idempotent — does nothing if already activated.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `Activate(inst)`
* **Description:** Fully activates the minion: enables physics, switches to eight-faced orientation, assigns the `"SGabysspillar_minion"` state graph, and transitions to the `"activate"` state if not asleep.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** No-op if already activated (`inst.sg ~= nil`).

### `Deactivate(inst)`
* **Description:** Deactivates the minion: clears the state graph, removes the `"ignorewalkableplatformdrowning"` tag, disables physics, reverts to two-faced orientation and zero rotation, and plays shutdown animations/sounds.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `Flip(inst)`
* **Description:** Rotates the minion 180° if inactive. Used to align orientation when detaching from a pillar.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Rotation is skipped if `IsActivated()` returns `true`.

### `GetBigPillar(inst)`
* **Description:** Retrieves the associated large pillar (left or right) tracked by the `entitytracker` component.
* **Parameters:** `inst` (Entity).
* **Returns:** `(bigpillar, isLeft)` where `bigpillar` is the Entity or `nil`, and `isLeft` is `true` if the left pillar is selected, `false` if the right, or `nil` if neither tracked.

### `SetOnBigPillar(inst, bigpillar, leftminion)`
* **Description:** Moves the minion to attach onto the given `bigpillar`, aligns its orientation, and updates tracking to remember the pillar it's attached to. First deactivates the minion.
* **Parameters:**
  * `bigpillar` (Entity) — the large pillar to attach to.
  * `leftminion` (boolean) — `true` if this is the left-side minion, used to determine rotation.
* **Returns:** Nothing.

### `RemoveFromBigPillar(inst)`
* **Description:** Stops the follower behavior, detaching the minion from any pillar it was following.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Records the minion's state for persistence: whether broken and whether activated.
* **Parameters:**
  * `inst` (Entity).
  * `data` (table) — the save table to populate.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the broken state from saved data.
* **Parameters:**
  * `inst` (Entity).
  * `data` (table) — loaded data; if truthy and contains `broken`, calls `MakeBroken`.
* **Returns:** Nothing.

### `OnLoadPostPass(inst, ents, data)`
* **Description:** Finalizes post-load restoration: reattaches to tracked pillar if still present, or re-activates if persisted as active (should be rare for properly tracked minions).
* **Parameters:**
  * `inst` (Entity).
  * `ents` (table) — entity resolution map (unused in this implementation).
  * `data` (table) — loaded data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly — event callbacks are managed internally by the `StateGraph` and `EntityTracker` components (e.g., `"onremove"` via `TrackEntity`).
- **Pushes:** None — no `inst:PushEvent` calls are present.