---
id: sporebomb
title: Sporebomb
description: Applies a debuff that follows a target, fades out over time, and spawns a spore cloud upon detachment or timer expiration.
tags: [combat, debuff, fx, hostilespawn]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6eecaad5
system_scope: fx
---

# Sporebomb

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sporebomb` is a visual and functional prefab that acts as a persistent debuff attached to a target entity. It visually follows the target while fading out, then detonates to spawn a `sporecloud` when detached (e.g., via `debuff:Stop()`) or when its internal timer expires. It uses the `debuff` and `timer` components for core logic, and is primarily used by items like the Toadstool tool. The effect includes dynamic light fading and synchronized animation states across client/server.

## Usage example
The sporebomb prefab is instantiated automatically when the Toadstool attacks and applies the debuff. It is not typically created manually in mod code. Typical lifecycle:  
- Attached via `target.components.debuff:AddDebuff("sporebomb")`.  
- Follows the target entity.  
- Expires after `TUNING.TOADSTOOL_SPOREBOMB_TIMER` seconds.  
- On detachment/expiry, spawns a sporecloud at the target’s location and self-removes.

## Dependencies & tags
**Components used:**  
- `debuff` — manages attachment/detachment lifecycle and follow behavior.  
- `timer` — triggers explosion after a set duration.

**Tags:**  
- Added to main entity: `"FX"`, `"NOCLICK"`.  
- Applied to internal `_light` entity: `"FX"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fade` | `net_smallbyte` | N/A | Networked integer tracking fade progress (0 to `2*FADE_FRAMES+1`). |
| `_light` | `Entity` | `nil` | Light entity for visual effect; parented to sporebomb. |
| `_fadetask` | `Task` | `nil` | Periodic task handling fading animation. |
| `_followtask` | `Task` | `nil` | Periodic task keeping sporebomb rotation aligned with target. |

## Main functions
### `OnAttached(inst, target, followsymbol, followoffset)`
* **Description:** Called when the debuff is attached to a target. Parenting occurs, alignment task starts, and follow behavior is initialized. Also pushes `"startfumedebuff"` event on the target.  
* **Parameters:**  
  - `inst` (Entity) — the sporebomb instance.  
  - `target` (Entity) — entity receiving the debuff.  
  - `followsymbol` (string) — target’s animation symbol to follow.  
  - `followoffset` (vector) — optional offset from the follow symbol.  
* **Returns:** Nothing.  
* **Error states:** None.

### `OnDetached(inst)`
* **Description:** Called when the debuff is removed (manually or via timer expiry). Spawns a `sporecloud` at the parent’s world position and removes the sporebomb entity.  
* **Parameters:**  
  - `inst` (Entity) — the sporebomb instance.  
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Timer callback. When the `"explode"` timer finishes, it stops the debuff to trigger detachment logic.  
* **Parameters:**  
  - `inst` (Entity) — the sporebomb instance.  
  - `data` (table) — timer data, must contain `name == "explode"`.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"fadedirty"` (client only) — triggers `OnFadeDirty` to restart fading task.  
  - `"timerdone"` (server only) — triggers `OnTimerDone` when explosion timer ends.  
  - `"startfumedebuff"` — handled internally by `OnInit`; fires when attached.  
- **Pushes:**  
  - `"startfumedebuff"` on the target entity (during attachment, from `OnInit`).  
  - (Implicit) Triggered via `debuff` hooks — no direct pushing beyond the above.