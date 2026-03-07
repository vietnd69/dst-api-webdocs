---
id: wormhole_limited
title: Wormhole Limited
description: Manages a one-time or limited-uses wormhole teleporter that consumes charges on each use and degrades when unattended.
tags: [teleporter, inventory, player, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7be60846
system_scope: environment
---

# Wormhole Limited

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wormhole_limited` prefab implements a reusable but charge-depleting teleporter (e.g., the Sick Wormhole) that requires manual activation or player proximity to open. It supports interaction via the `teleporter`, `trader`, `playerprox`, and `inventory` components. It tracks remaining uses, reduces sanity on activation, and self-destructs after its last use or prolonged inactivity. It also emits events to coordinate travel animations and sound effects.

## Usage example
```lua
-- Spawn a one-charge wormhole
local inst = Prefab("wormhole_limited_1")
-- A concrete instance can be obtained via the returned prefab function:
local wormhole = makewormhole(1)()
```

## Dependencies & tags
**Components used:** `inspectable`, `playerprox`, `teleporter`, `inventory`, `trader`  
**Tags added:** `trader`, `alltrader`, `antlion_sinkhole_blocker`  
**Tags checked:** `player`, `debuffed` is *not* used here, but sanity tag logic is internal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `usesleft` | number | `0` | Remaining activation count; decrements on successful use; `0` triggers self-destruction. |
| `persists` | boolean | `true` (initially) | Controls whether the wormhole persists in save data after last use. Set to `false` when exhausted. |
| `closetask` | Task (pending) | `nil` | Internal task used to delay automatic closing after teleportation or player departure. |

## Main functions
### `OnActivate(inst, doer)`
* **Description:** Called when a player interacts with the wormhole. Handles sanity deduction, usage counting, teleporter disablement after final use, and sounds. Also triggers event for player-local sound.
* **Parameters:** `inst` (Entity) — the wormhole instance; `doer` (Entity) — the activator, expected to be a player.
* **Returns:** Nothing.
* **Error states:** If `doer` is not a player, plays generic teleport sound but skips player-specific logic.

### `OnActivateByOther(inst, source, doer)`
* **Description:** Invoked when another teleporter attempts activation. Opens the wormhole state if not already open.
* **Parameters:** `inst` (Entity), `source` (Entity), `doer` (Entity).
* **Returns:** Nothing.
* **Error states:** Ignores non-open states only; no explicit failure conditions.

### `OnDoneTeleporting(inst, obj)`
* **Description:** Post-teleportation logic. Schedules automatic closure or destruction based on remaining uses and player proximity. Informs player of ejection via event.
* **Parameters:** `inst` (Entity), `obj` (Entity, optional) — the teleportee (often a player).
* **Returns:** Nothing.
* **Error states:** May skip closure/destruction if the wormhole or its partner is busy.

### `onnear(inst)`
* **Description:** Player proximity handler. Opens the wormhole if active and currently closed.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if already open or not active.

### `onfar(inst)`
* **Description:** Player departure handler. Closes the wormhole if not busy and currently open.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if busy or already closed.

### `onaccept(inst, giver, item)`
* **Description:** Trader callback for item-based activation (e.g., in some modded use cases). Drops and teleports the item.
* **Parameters:** `inst` (Entity), `giver` (Entity), `item` (Entity) — the accepted item.
* **Returns:** Nothing.
* **Error states:** Does nothing if trader logic fails.

### `StartTravelSound(inst, doer)`
* **Description:** Plays the swallow sound and fires `wormholetravel` event for local client coordination.
* **Parameters:** `inst` (Entity), `doer` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `starttravelsound` — triggers `StartTravelSound`; `doneteleporting` — triggers `OnDoneTeleporting`.
- **Pushes:** `wormholespit` — fired on player ejection (via `DoTaskInTime`); `wormholetravel` — for client-side sound sync.
- **Persistence events:** `OnSave` and `OnLoad` handle `usesleft` serialization.