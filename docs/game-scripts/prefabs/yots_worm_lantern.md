---
id: yots_worm_lantern
title: Yots Worm Lantern
description: A deployable lantern prefab that transforms into a worm when activated, triggering nearby worm lanterns to activate in sequence.
tags: [environment, event, activation, spawner]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c8d71fea
system_scope: environment
---

# Yots Worm Lantern

> Based on game build **714004** | Last updated: 2026-03-07

## Overview
The `yots_worm_lantern` is a deployable environmental prefab that behaves as an inactive lantern until activated. Upon activation (typically via player interaction), it schedules a delayed transformation into a `yots_worm` and simultaneously triggers nearby worm lanterns in a chain reaction. It exists in three variants: the main lantern, a spawner that generates multiple lanterns at world generation time, and a lightweight light-emitting entity that provides visual feedback. The component relies on the `activatable` and `burnable` components for interaction logic and state management.

## Usage example
```lua
local inst = SpawnPrefab("yots_worm_lantern")
inst.Transform:SetPosition(x, y, z)
-- Lantern is initially inactive and idles in "idle_loop"
-- When activated (e.g., by player):
inst:PushActivate(doer) -- triggers delayed activation sequence
```

## Dependencies & tags
**Components used:** `activatable`, `burnable`, `hauntable`, `inspectable`, `playerprox` (spawner only)  
**Tags added:** `yots_worm`  
**Tags checked:** `fireimmune`, `controlled_burner` (via external `Burnable` component)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_light` | Entity or nil | `nil` | Reference to the associated `yots_worm_lantern_light` entity; set during master init. |
| `_player_nearby_task` | Task or nil | `nil` | Task reference tracking player-proximity delay for spawner behavior. |
| `_spawned` | Table or boolean | `false` / `{}` | Map of spawned lantern entities (spawner only); `false` initially, initialized to `{}` after spawn. |
| `inactive` | boolean | `true` | Property of the `activatable` component; determines whether activation is possible. |

## Main functions
### `do_activate(inst, doer)`
*   **Description:** Replaces the lantern entity with a `yots_worm` entity and optionally reignites it if it was burning before transformation.
*   **Parameters:** `inst` (Entity) — the lantern prefab instance; `doer` (Entity or nil) — the entity that triggered activation (e.g., player).
*   **Returns:** Nothing.
*   **Error states:** None; assumes `ReplacePrefab` succeeds.

### `push_an_activation(inst, doer)`
*   **Description:** Initiates the activation sequence if the lantern is currently inactive. Schedules a delayed call to `do_activate` with a random duration between 2 and 5 seconds.
*   **Parameters:** `inst` (Entity) — the lantern prefab instance; `doer` (Entity or nil) — the activator.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst.components.activatable.inactive` is `false`.

### `on_activated(inst, doer)`
*   **Description:** Called after all nearby lanterns are triggered. Iterates over other worm lanterns within a wider radius (≈15 units), calls `PushActivate` on each, then executes `do_activate`.
*   **Parameters:** `inst` (Entity) — the lantern prefab instance; `doer` (Entity or nil) — the activator.
*   **Returns:** `false` (used as return value for activation callbacks).
*   **Error states:** None.

### `on_lantern_ignited(inst, source, doer)`
*   **Description:** Callback executed when the lantern is ignited (e.g., by fire). Marks it as active and schedules the activation sequence after a short fixed delay (~2–3 seconds).
*   **Parameters:** `inst` (Entity), `source` (Entity), `doer` (Entity or nil).
*   **Returns:** Nothing.
*   **Error states:** None.

### `spawner_do_spawn(inst)`
*   **Description:** Spawns multiple `yots_worm_lantern` instances in a circular pattern around the spawner. Runs only once per spawner.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst._spawned` is already truthy.

### `player_near_finished(inst, player)`
*   **Description:** Triggers activation for all nearby worm lanterns when a player comes close to the spawner (after an 8–12 second delay).
*   **Parameters:** `inst` (Entity) — the spawner; `player` (Entity) — the nearby player.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst:IsAsleep()` is true.

### `activate_verb()`
*   **Description:** Client-side override that defines the context-sensitive verb shown for the lantern (e.g., "Pick Up").
*   **Parameters:** None.
*   **Returns:** `"FAKE_PICKUP"`.

## Events & listeners
- **Listens to:**  
  - `"onremove"` — on the lantern light entity to clear `_light` reference.  
  - `"onremove"` — on spawned lanterns (spawner only) to track active lantern count and self-remove when all are gone.  
  - `"death"` — added dynamically to the `burnable` component upon ignition (via `Burnable:Ignite`).  
- **Pushes:**  
  - `"onignite"` — triggered via `Burnable:Ignite`.  
  - Custom `"activate"`-style sequence via `PushActivate` calls.