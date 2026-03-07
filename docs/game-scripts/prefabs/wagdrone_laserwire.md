---
id: wagdrone_laserwire
title: Wagdrone Laserwire
description: Manages the visual beam segments and electric shock attack logic for the Wagdrone laserwire entity.
tags: [combat, fx, network, electric]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 619eceb6
system_scope: combat
---

# Wagdrone Laserwire

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagdrone_laserwire` prefab creates a networked, non-persistent entity that renders a dynamic beam (using visual segments) and detects nearby entities to deliver electric shock damage. It uses the `combat` component for attack execution and relies on client-server synchronization via networked `net_byte` variables (`len`, `rot`) to maintain visual and mechanical consistency. The component is tightly integrated with `wagdrone_common.lua` for target detection and uses `health` component state to avoid attacking dead entities.

## Usage example
```lua
-- Example of creating and configuring a laserwire segment
local wire = Prefabs["wagdrone_laserwire_fx"]:Spawn()
wire:SetBeam(10, 45) -- length=10, rotation=45°
wire:PushEvent("beamdirty") -- Force refresh if needed
```

## Dependencies & tags
**Components used:** `combat`
**Tags added:** `CLASSIFIED`, `notarget`, `FX`, `NOCLICK`
**Tags checked:** None (only `combat`/`health` states queried)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `len` | `net_byte` | `0` | Networked beam length (0–255), scaled to real units via `MAX_LEN`. |
| `rot` | `net_byte` | `0` | Networked beam rotation (0–255), scaled to degrees (0–360). |
| `segs` | table | `nil` | Local table of segment entities (`seg`), populated only on non-dedicated clients. |
| `targetx` / `targetz` | table | `nil` | tables of x/z coordinates for shock detection points, populated only on master sim. |
| `targettask` | `DoPeriodicTask` | `nil` | Periodic task for scanning and damaging nearby entities. |

## Main functions
### `SetBeam(inst, len, rot)`
* **Description:** Updates the beam's length and rotation, triggers a redraw of visual segments, and resets the shock detection task.
* **Parameters:** 
  * `len` (number) — physical length of the beam (max `MAX_LEN = 15`).
  * `rot` (number) — rotation angle in degrees (clamped to 0–360 internally).
* **Returns:** Nothing.

### `RefreshSegs(inst, animoverride)`
* **Description:** Constructs and positions beam visual segments on clients; sets up shock detection points and the `UpdateTargets` task on master sim.
* **Parameters:** 
  * `inst` (Entity) — the laserwire instance.
  * `animoverride` (string, optional) — animation name to override default ("follow_marker").
* **Returns:** Nothing.

### `ClearSegs(inst)`
* **Description:** Removes all visual segments and cancels the `targettask`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `UpdateTargets(inst, p1, p2, pv, targets)`
* **Description:** Scans for entities near the beam segment using `WagdroneCommon.FindShockTargets`, and performs electric shock damage via `combat.DoAttack` if criteria are met. Reschedules itself with adaptive period (`SLOW_PERIOD` or `FAST_PERIOD`).
* **Parameters:** 
  * `p1`, `p2` (tables) — endpoints of the current beam segment.
  * `pv` (table) — temporary point buffer for distance calculations.
  * `targets` (table) — table of cooldown timestamps per entity to prevent spamming shocks.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `beamdirty` — triggers `OnBeamDirty`, which clears and regenerates segments (client-side only).
- **Pushes:** None (external events like `electrocute` are pushed on *target* entities via `v:PushEventImmediate("electrocute")`).