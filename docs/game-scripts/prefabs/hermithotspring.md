---
id: hermithotspring
title: Hermithotspring
description: Manages the state, behavior, and visual synchronization of the Hermit Hot Spring structure, including heating, bathing, bathbomb effects, and construction workflow.
tags: [structure, environment, heating, bath, construction]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39f4cac6
system_scope: environment
---

# Hermithotspring

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermithotspring` prefab implements a complex environmental structure with dynamic behavior states (empty, filled, bathbombed), temperature effects, sanity adjustments, and construction mechanics. It integrates multiple components (`watersource`, `heater`, `bathbombable`, `bathingpool`, `workable`, `timer`, etc.) to handle gameplay logic such as player heating/sanity restoration while occupied, bathbomb reactions, and construction-to-full-structure transitions. It also manages high-fidelity visual synchronization of rock arrangements, animations, and FX entities via custom sync and post-update handlers.

## Usage example
```lua
local inst = SpawnPrefab("hermithotspring")
inst.Transform:SetPosition(x, y, z)

-- Fill the hot spring and trigger bathbomb effect
inst.components.watersource.available = true
inst.components.bathbombable:OnBathBombed(bomb_item, player)

-- Force empty state (e.g., after draining)
inst.components.bathbombable:Reset()
MakeEmpty(inst, false)
```

## Dependencies & tags
**Components used:** `watersource`, `heater`, `bathbombable`, `bathingpool`, `workable`, `timer`, `constructionsite`, `inspectable`, `lootdropper`, `hauntable`, `placer`, `updatelooper`  
**Tags added:** `hermithotspring`, `antlion_sinkhole_blocker`, `birdblocker`, `groundhole`, `structure`, `HASHEATER`, `watersource`, `constructionsite`, `FX` (for internal rocks/pegs/holes)  
**Tags checked:** `player`, `burnt` (via burn loot overrides), `watersource` (for naming), `debuffed` (indirectly via sanity modifiers), `builder` (via work callbacks)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rocks` | table of FX entities | `{}` (lazy-initialized) | Array of rock FX entities spawned around the hot spring for visual variation. |
| `_rockripples` | boolean | `true` | Internal flag indicating whether rock animations should use eight-faced ripples or flat no-faced versions. |
| `rockripples` | networked boolean | `true` | Networked boolean used to sync rock ripple state across clients. |
| `skinid` | networked hash | `0` | Networked hash storing the skin variant ID used for symbol overrides. |
| `bathbombable.is_bathbombed` | boolean | `false` | Indicates whether the hot spring is currently under a bathbomb effect. |
| `bathingpool` | component or `nil` | `nil` | Active only when filled and bathbombing is enabled; manages occupant iteration and tick callbacks. |
| `filltask` | task or `nil` | `nil` | Task tracking refill animation and transition to full state. |
| `bathingpoolents` | table or `nil` | `nil` | Tracks current occupants for per-occupant tick logic. |
| `bathingpooltask` | periodic task or `nil` | `nil` | Periodic task that processes heating and sanity per occupied player. |

## Main functions
### `MakeEmpty(inst, placing)`
*   **Description:** Transitions the hot spring to an empty/drain state: disables lighting, sets appropriate minimap icon, stops bathbomb timer, marks water unavailable, disables bathbombing, and disables the bathing pool. Plays draining or empty animation.
*   **Parameters:** `inst` (entity), `placing` (boolean) — if `true`, plays the `place` animation (e.g., during placement); otherwise plays `drain`.
*   **Returns:** Nothing.

### `MakeFilled(inst)`
*   **Description:** Transitions the hot spring to a filled state. If not already filled, triggers a refill animation; if bathbombing is active, triggers glowing animation and starts bathbomb timer. Enables water availability and resets bathbombable state otherwise.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnBathBombed(inst)`
*   **Description:** Activates the bathbomb effect: enables lighting, starts glowing animations (`glow_pre` → `glow_loop`), plays sound effects, starts a bathbomb timer, enables the `bathingpool` component, and marks water available.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnBathingPoolTick_PerOccupant(inst, occupant, dt)`
*   **Description:** Applies per-frame health regen and sanity adjustment to each occupant. Sanity effect is inverted inside lunacy areas.
*   **Parameters:** `inst` (entity, the hot spring), `occupant` (entity), `dt` (number, time delta).
*   **Returns:** Nothing.

### `GetHeat(inst)`
*   **Description:** Determines current heat output based on water availability and bathbomb status. Returns either `PASSIVE` or `ACTIVE` heat values from `TUNING.HOTSPRING_HEAT`.
*   **Parameters:** `inst` (entity).
*   **Returns:** number — 0 if unavailable, otherwise passive or active heat constant.

### `OnHit(inst)`
*   **Description:** Handles structural damage (hammering) while not asleep. Forces all occupants out of the pool and triggers hit animation sync.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnHammered(inst)`
*   **Description:** Handles destruction of the hot spring. Spawns `collapse_big`, drops loot and construction materials, then removes the entity.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnFinishFill(inst, force)`
*   **Description:** Finalizes the refill process. Enables water source, enables bathbombing (via `Reset`), disables lighting, and ensures idle animation.
*   **Parameters:** `inst` (entity), `force` (boolean) — if `true`, skips animation checks and transitions directly.
*   **Returns:** Nothing.

### `PushSyncAnim(inst)`
*   **Description:** Requests animation state synchronization across network by pushing the `hermithotspring.syncanim` event and immediately invoking `DoSyncAnim`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `PushRockRipples(inst, enable)`
*   **Description:** Updates and synchronizes the rock ripple mode via the `rockripples` networked boolean.
*   **Parameters:** `inst` (entity), `enable` (boolean).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — handles bathbomb timer expiration (`OnTimerDone`).
- **Listens to:** `onbuilt` — triggers full-state setup after construction (`OnBuilt`).
- **Listens to:** `hermithotspring.synchit` — handles hit animation sync (`OnSyncHit`).
- **Listens to:** `hermithotspring.syncanim` — handles animation sync (`OnSyncAnim`).
- **Listens to:** `rockripplesdirty` — responds to rock ripple mode changes (`OnRockRipplesDirty`).
- **Listens to:** `skiniddirty` — triggers rock symbol refresh (`OnSkinIdDirty`).
- **Pushes:** `hermithotspring.syncanim` — fires to notify clients of animation changes.
- **Pushes:** `hermithotspring.synchit` — fires to notify clients of hit animations.
- **Pushes:** `rockripplesdirty` — fires to notify clients of ripple mode changes.
- **Pushes:** `skiniddirty` — fires to notify clients of skin/symbol changes.
