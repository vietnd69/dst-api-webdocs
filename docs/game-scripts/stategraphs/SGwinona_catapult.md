---
id: SGwinona_catapult
title: Sgwinona Catapult
description: Manages the animation, power state, and attack logic for Winona's catapult structure, including projectile launching and elemental battery consumption.
tags: [combat, stategraph, structure, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 66e17a13
system_scope: entity
---

# Sgwinona Catapult

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph (`SGwinona_catapult`) defines the behavior of Winona's catapult structure in Don't Starve Together. It handles state transitions for deployment, power cycling (`powerup`/`powerdown`), idle operation, attack sequencing, and hit responses. The catapult interacts with the `circuitnode` component to consume elemental battery fuel, the `combat` component to initiate attacks, and the `complexprojectile` component to launch rocks. It also supports queuing of `dovolley` and `doelementalvolley` events for burst attacks.

## Usage example
This stategraph is automatically attached to the catapult prefab (`winona_catapult`) and does not require direct instantiation by modders. A typical workflow involves placing the structure, toggling its power via `togglepower` event, and triggering attacks via `doattack`, `dovolley`, or `doelementalvolley` events.

```lua
-- Example: Triggering a single attack
catapult_inst:PushEvent("doattack", { target = enemy, doer = player })

-- Example: Queueing a volley attack
catapult_inst:PushEvent("dovolley", { targetpos = Vector3(x, y, z), doer = player })
```

## Dependencies & tags
**Components used:** `circuitnode`, `combat`, `complexprojectile`, `fueled`, `health`, `skilltreeupdater`  
**Tags added/removed:** `NOCLICK`, `notarget`, `busy`, `idle`, `canrotate`, `attack`, `hit`, `caninterrupt`, `noattack`, `death`  
**State tags managed:** `busy`, `idle`, `canrotate`, `attack`, `hit`, `caninterrupt`, `noattack`

## Properties
No public properties defined. Internal state is stored in `inst.sg.mem` (e.g., `ison`, `recentlyplaced`, `attack_data`, `elemental`, `targetpos`, `aoe`, `caster`, `rock`) and `inst.sg.statemem`.

## Main functions
### `VolleyData(data)`
*   **Description:** Formats and enriches raw volley input data with skill tree-modified AOE level. Used internally to prepare attack parameters for queued volleys.
*   **Parameters:**
    *   `data` (table) — Contains at minimum `doer`, `targetpos`, and optionally `element` (for `doelementalvolley`). `doer` may be `nil`.
*   **Returns:** Table with keys: `doer` (same as input), `pos` (`targetpos`), `mega` (`element` if present), `aoe` (integer: 0–3, derived from skill tree activation).
*   **Error states:** Returns `aoe = 0` if `data.doer` is `nil` or lacks `skilltreeupdater` component.

### `TryQueuedVolley(inst)`
*   **Description:** Attempts to execute the next queued volley (elemental or regular) if the catapult is in active mode and not busy.
*   **Parameters:**
    *   `inst` (Entity) — The catapult entity instance.
*   **Returns:** `true` if a queued volley was dequeued and attack started; `false` otherwise.

### `ClearQueuedVolley(inst)`
*   **Description:** Clears both `volleyqueue` and `elemvolleyqueue` memory fields.
*   **Parameters:**
    *   `inst` (Entity) — The catapult entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `doattack` — Initiates a single attack on a target entity.
  - `dovolley` — Queues or executes a non-elemental volley (ground-targeted).
  - `doelementalvolley` — Queues or executes an elemental (shadow/lunar/hybrid) volley.
  - `attacked` — Triggers the `hit` state on external damage, unless interrupted blocked or by specific weapon types.
  - `animover` — Automatically advances to `idle` state after animation completes.
  - `togglepower` — Switches between `powerup` and `powerdown` states based on `data.ison`.
- **Pushes:** No events are fired by this stategraph; it only consumes events.