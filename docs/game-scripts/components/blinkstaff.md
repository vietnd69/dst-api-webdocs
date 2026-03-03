---
id: blinkstaff
title: Blinkstaff
description: Handles teleportation logic and visual/audio effects for the Blink Staff item in DST.
tags: [teleport, item, fx, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0da7bd0d
system_scope: entity
---

# Blinkstaff

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Blinkstaff` manages the behavior of the Blink Staff item, including teleporting the user, spawning visual and sound effects, and coordinating invincibility during the short blink delay. It is attached to the Blink Staff entity and invoked via script when the item is used (e.g., on right-click). The component integrates closely with the target entity’s `health` component to grant temporary invincibility during the blink sequence.

## Usage example
```lua
local staff = Prefab("blinkstaff")
staff:AddComponent("blinkstaff")
staff.components.blinkstaff:SetFX("staff_blink_front", "staff_blink_back")
staff.components.blinkstaff:SetSoundFX("dontstarve/common/staff_blink_pre", "dontstarve/common/staff_blink_post")
staff.components.blinkstaff:SetOnBlinkFn(function(inst, pt, caster) print("Blink started!") end)
```

## Dependencies & tags
**Components used:** `health` (via `SetInvincible` to manage invincibility during blink)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | The entity instance the component is attached to. |
| `onblinkfn` | function or `nil` | `nil` | Optional callback invoked when `Blink()` is called. |
| `blinktask` | `Task` or `nil` | `nil` | Reference to the pending blink completion task; used to cancel ongoing blinks. |
| `frontfx` | string or `nil` | `nil` | Prefab name to spawn at target position (front effect). |
| `backfx` | string or `nil` | `nil` | Prefab name to spawn slightly below target (back effect). |
| `presound` | string | `"dontstarve/common/staff_blink"` | Sound event to play at start of blink. |
| `postsound` | string | `"dontstarve/common/staff_blink"` | Sound event to play after blink completes. |

## Main functions
### `SetFX(front, back)`
* **Description:** Sets the visual effect prefabs to spawn during a blink. `front` appears at the destination; `back` appears slightly beneath it.
* **Parameters:**  
  - `front` (string or `nil`) — name of the front-effect prefab.  
  - `back` (string or `nil`) — name of the back-effect prefab.  
* **Returns:** Nothing.

### `ResetSoundFX()`
* **Description:** Resets sound event paths to default values (both pre- and postsound to `"dontstarve/common/staff_blink"`).
* **Parameters:** None.  
* **Returns:** Nothing.

### `SetSoundFX(presound, postsound)`
* **Description:** Sets custom sound events to play at the start and end of the blink.
* **Parameters:**  
  - `presound` (string) — sound to play when blink begins.  
  - `postsound` (string) — sound to play after teleport completes.  
* **Returns:** Nothing.

### `SpawnEffect(inst)`
* **Description:** Spawns the configured visual effects at the given entity’s position.
* **Parameters:**  
  - `inst` (`Entity`) — the entity whose position is used as the spawn point.  
* **Returns:** Nothing.

### `Blink(pt, caster)`
* **Description:** Initiates a blink (teleport) for the caster to the target point `pt`. Performs validation checks (teleport permissions, passability, blocked targets), spawns effects and sound, grants temporary invincibility, and schedules a delayed completion task. Returns `true` on successful initiation.
* **Parameters:**  
  - `pt` (`Vector` or `DynamicPosition`) — the destination point (must be passable and unblocked).  
  - `caster` (`Entity`) — the entity performing the blink.  
* **Returns:** `true` if blink started; `false` if the teleport was blocked by validation rules.  
* **Error states:**  
  - Returns `false` if `IsTeleportingPermittedFromPointToPoint` fails.  
  - Returns `false` if caster is in a non-`quicktele` state (if stategraph exists) or destination is impassable/blocked.  
  - Cancels and replaces any existing pending blink task (`blinktask`) before starting a new one.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** The component itself does not push events, but the delayed `OnBlinked` callback (called via `DoTaskInTime`) may trigger custom logic via `caster.sg.statemem.onstopblinking` or health invincibility toggle.
