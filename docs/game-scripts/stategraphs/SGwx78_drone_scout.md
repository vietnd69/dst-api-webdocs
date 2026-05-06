---
id: SGwx78_drone_scout
title: Sgwx78 Drone Scout
description: Animation state machine for the WX-78 drone scout entity, governing deploy sequence and hover movement.
tags: [stategraph, drone, scout, ai]
sidebar_position: 10
last_updated: 2026-05-05
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 5f235c9c
system_scope: entity
---

# Sgwx78 Drone Scout

> Based on game build **722832** | Last updated: 2026-05-05

## Overview
Stategraph for the WX-78 drone scout entity. Stategraphs are attached via `StartStateGraph` or `inst:StartStateGraph`, not called as utility functions. Major state categories: deploy (initialization) and idle (hovering).

## Usage example
```lua
-- Attach stategraph to entity:
inst:StartStateGraph("wx78_drone_scout")

-- Trigger deploy sequence:
inst.sg:GoToState("deploy")

-- Drone will automatically transition to idle after deploy animation completes
```

## Dependencies & tags
**External dependencies:**
- None

**Components used:** None identified

**Tags:**
- `busy` -- added in deploy state to block other transitions
- `idle` -- added in idle state for idle-specific behavior

## Properties
| State name | Tags | Description |
|------------|------|-------------|
| `deploy` | `busy` | Initial state for deploying; plays deploy animation and stops physics. At frame 0, plays beep sound. |
| `idle` | `idle` | Hovers in place; loops idle animation. |

## Main functions
### `UpdateHover(inst, dt)` (local)
* **Description:** Calculates and sets vertical velocity for sinusoidal hover pattern. Retrieves current position with inst.Transform:GetWorldPosition(), current time value from inst.sg.statemem.t, and motor velocity with inst.Physics:GetMotorVel(). Calculates ht = ht0 + math.sin(t * TWOPI / period) * amp, then sets vertical velocity as (ht - y) * 15. Behavior depends on conditions: if inst:IsAsleep() returns immediately; if t is nil (initial state), handles liftoff conditions; if t < 0, enters liftoff mode. Updates sg.statemem.t with new time value. * **Parameters:**
  - `inst` -- entity owning the stategraph
  - `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onenter (deploy)`
* **Description:** Plays deploy animation, stops physics motion, sets sg.mem.vel to zero, and resets sg.statemem.t to nil.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onupdate (deploy)`
* **Description:** Updates hover position by calling `UpdateHover` local function.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onenter (idle)`
* **Description:** Plays idle animation in loop and sets sg.statemem.t to the passed t.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `t` -- initial time for hover pattern
* **Returns:** nil
* **Error states:** None.

### `onupdate (idle)`
* **Description:** Updates hover position by calling `UpdateHover` local function.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

## Events & listeners
**Listens to:**
- `animover` (in state `deploy`) -- triggers transition to idle state when deploy animation completes.

**World state watchers:** None.

**Pushes:** None.