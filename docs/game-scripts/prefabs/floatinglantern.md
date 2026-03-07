---
id: floatinglantern
title: Floatinglantern
description: Manages a flying lantern prefab that consumes fuel to stay airborne and emits light with dynamic physics-based behavior.
tags: [inventory, physics, light, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: df82537b
system_scope: environment
---

# Floatinglantern

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `floatinglantern` prefab implements a deployable, fuel-powered flying lantern. It uses multiple components to manage inventory interaction, fuel consumption, lighting effects, and physics-based flight dynamics. When ignited, it floats upward and drifts with the wind until fuel is depleted. It supports lantern level visual states and integrates with camera fading, world wind, and global map systems.

## Usage example
```lua
local lantern = SpawnPrefab("floatinglantern")
lantern.components.fueled:InitializeFuelLevel(TUNING.FLOATINGLANTERN_DURATION)
lantern.components.fueled:StartConsuming()
lantern.components.burnable:Ignite()
```

## Dependencies & tags
**Components used:** `burnable`, `camerafade`, `fueled`, `inspectable`, `inventoryitem`, `rainimmunity`, `updatelooper`, `worldwind`
**Tags added:** `cattoyairborne`, `hide_percentage`, `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lantern_level` | number | `1` | Current lantern fuel level state (1 = full, #lantern_levels = empty). |
| `flying` | boolean | `false` | Whether the lantern is currently airborne and consuming fuel. |
| `deactivated` | boolean | `false` | Whether the lantern is in deactivated (grounded) state. |
| `deactivated_floater` | boolean | `false` | Whether the floater physics are deactivated. |
| `noclickon` | boolean | `false` | Whether the lantern is unclickable (while airborne). |
| `wind_vel` | Vector3 | `Vector3(0,0,0)` | Current horizontal wind velocity vector. |
| `lantern_vel` | Vector3 | `Vector3(0,0,0)` | Internal velocity accumulator for flight physics. |
| `start_flyoff_time` | number | `0` | Timestamp when flight began (used for easing and noise). |
| `globalicon` | Entity | `nil` | Reference to the `globalmapicon` entity tracking the lantern. |
| `shadow` | Entity | `nil` | Reference to the associated shadow entity. |
| `flyawaytask` | Task | `nil` | Pending delayed task to initiate flight. |

## Main functions
### `SetHeliumLevel(inst, level)`
*   **Description:** Sets the lantern's current fuel level (1 = full, #lantern_levels = empty), updates visual representation, and triggers deflation animation. If set to the lowest level, flying stops automatically.
*   **Parameters:** `level` (number) - Integer between 1 and `#lantern_levels`, inclusive.
*   **Returns:** Nothing.

### `StartFlying(inst, isload)`
*   **Description:** Initiates flight when the lantern has fuel. If `isload` is `true`, flight starts immediately; otherwise, a 0.2 second delay is applied. Prevents duplicate flight tasks.
*   **Parameters:** `isload` (boolean) - If `true`, flight starts synchronously (used during world load).
*   **Returns:** Nothing.

### `StopFlying(inst)`
*   **Description:** Stops flight, transitions to falling animation, removes physics updates and wind event listeners, and disables camera fade. Cleans up the global map icon and resets flight-related state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDropped(inst, init)`
*   **Description:** Handles lantern placement animation and sound. If placed from inventory (`init = false`), plays "place" animation then transitions to idle ground. If loaded or populated from save, plays idle ground directly.
*   **Parameters:** `init` (boolean) - `true` if called during prefabrication/population; otherwise `false`.
*   **Returns:** Nothing.

### `OnPickup(inst)`
*   **Description:** Stops fuel consumption, removes flight physics updates, cancels pending flyaway tasks, and disables camera fading when the lantern is picked up.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdateMotorVel(inst, dt)`
*   **Description:** Physics update loop during flight. Adjusts velocity based on wind, applies easing for initial flight acceleration, and uses sine-based height oscillation to simulate floating behavior.
*   **Parameters:** `dt` (number) - Delta time in seconds.
*   **Returns:** Nothing.

### `OnUpdateFalling(inst, dt)`
*   **Description:** Physics update loop during falling phase. Applies downward velocity until reaching low height (`y <= 1`), then triggers landing animation and sink logic if applicable.
*   **Parameters:** `dt` (number) - Delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onignite` - Shows the lantern glow symbol.
- **Listens to:** `onextinguish` - Hides the lantern glow symbol.
- **Listens to:** `windchange` (from `TheWorld`) - Updates wind velocity for flight direction.
- **Listens to:** `animover` - Triggers transition to post-landing actions or start flying after drop animation completes.
- **Listens to:** `entitysleep` - Removes entity when flight ends and entity sleeps (during persistence disable).
- **Listens to:** `enablecamerafadedirty` (client-only) - Updates camera fade state when replicated.

## Replication & Sync
- `enablecamerafade` is a network-replicated boolean (`net_bool`) used to synchronize camera fade enablement across server and client.
- Shadow entity (`floatinglantern_shadow`) hooks into `OnEntityReplicated` on clients to register itself in the parent's `highlightchildren` array.
- The lantern's flight state, including global map tracking, is persisted via `OnSave`/`OnLoad`.