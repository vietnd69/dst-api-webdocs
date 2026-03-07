---
id: atrium_fence
title: Atrium Fence
description: Controls the dynamic opening and closing behavior of an atrium fence based on player proximity and power state.
tags: [entity, physics, animation, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 63fe647f
system_scope: world
---

# Atrium Fence

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`atrium_fence` is a prefab that implements a gate-like environmental obstacle which automatically opens when players are nearby and closes when players move away — unless it is powered (locked), in which case it remains closed even when players are close. It integrates animation, physics, sound, and network state to synchronize its state across clients. The component is self-contained and does not rely on external component APIs beyond standard engine integrations (`Transform`, `AnimState`, `SoundEmitter`, `Physics`, `MiniMapEntity`, `Network`).

## Usage example
This prefab is instantiated automatically by the world generation system and does not require manual component addition. However, the following demonstrates how its behavior would be triggered programmatically (e.g., during testing or scripting):
```lua
-- Example: Simulate power state change (e.g., via event)
TheWorld:PushEvent("atriumpowered", true)   -- locks the fence
TheWorld:PushEvent("atriumpowered", false)  -- unlocks the fence
-- Proximity-based opening/closing occurs automatically via onupdate
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `obstacle`, `atrium_fence` (implicitly via Prefab registration and physics mask).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fenceid` | number | `1..5` (random) | Identifier used to select animation variants (`grow1`..`grow5`, `idle1`..`idle5`). |
| `closed` | boolean | `false` | Indicates whether the fence is currently closed (physics active). |
| `locked` | boolean or `nil` | `nil` | `true` when powered (via `"atriumpowered"` event), preventing opening regardless of proximity. |
| `closingtask` | `Task` or `nil` | `nil` | Pending delayed task to transition to closed state. |
| `openingtask` | `Task` or `nil` | `nil` | Pending delayed task to transition to open state. |

## Main functions
### `setclosed(inst)`
* **Description:** Initiates the transition to the closed state with a random delay, unless already closed or a transition is pending.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** No effect if `inst.closed` is already `true` or `inst.closingtask` is non-`nil`.

### `setopened(inst)`
* **Description:** Initiates the transition to the opened state with a random delay, unless already open or a transition is pending.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** No effect if `inst.closed` is `false` or `inst.openingtask` is non-`nil`.

### `transitionclosed(inst)`
* **Description:** Finalizes the transition to the closed state — sets physics, plays animations, and emits sound.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Nothing.

### `transitionopened(inst)`
* **Description:** Finalizes the transition to the opened state — sets physics, plays animations, and emits sound.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Nothing.

### `onupdate(inst)`
* **Description:** Periodically evaluates player proximity and the `locked` state to decide whether to open or close the fence.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** No-op if no state change is required.

### `OnPoweredFn(inst, ispowered)`
* **Description:** Updates the `locked` state when the `"atriumpowered"` event is received, updates animations for powered/idle states, and triggers `onupdate`.
* **Parameters:**
  * `inst` (Entity) — the entity instance.
  * `ispowered` (boolean) — new power state (`true` = locked/closed).
* **Returns:** Nothing.
* **Error states:** No change if `ispowered` equals current `inst.locked`.

## Events & listeners
- **Listens to:** `atriumpowered` (via `TheWorld`) — triggers `OnPoweredFn` to update locked state and re-evaluate openness.
- **Pushes:** None identified.

## Overview (Extended)
The fence operates in one of two physical configurations:
- **Opened**: Collision mask excludes characters and giants, allowing movement. Uses `"shrink"` → `"shrunk"` animation.
- **Closed**: Collision mask includes all entities (`WORLD`, `ITEMS`, `CHARACTERS`, `GIANTS`). Uses `"growX"` → `"idleX"` (or `"idleX_active"` if powered) animation.

Proximity thresholds are:
- Open if closed and player is within `7` units (`NEAR_DIST_SQ = 49`).
- Close if open and player is beyond `8` units (`FAR_DIST_SQ = 64`) — unless locked.

When powered (`locked = true`), the fence ignores proximity and remains closed. The `"atriumpowered"` event is typically fired by the Atrium structure when its power state changes.