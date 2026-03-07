---
id: diviningrodbase
title: Diviningrodbase
description: Acts as a base component for the divining rod that manages its state (locked/unlocked/stuck), visual states, and sound effects in coordination with the Teleportato.
tags: [teleportation, inspectable, lock, sound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 96aebaae
system_scope: world
---

# Diviningrodbase

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `diviningrodbase` prefab serves as the physical base attachment for the Divining Rod in DST. It is not a standalone component, but a prefab entity that integrates with the `lock` and `inspectable` components to manage its operational states—locked, unlocked, and stuck—while controlling visual animations, sounds, and interaction with the Teleportato. It responds to `"ready"` events and coordinates state changes for rod insertion/removal events.

## Usage example
```lua
-- This prefab is automatically instantiated by the game as part of the divining rod system.
-- Modders typically do not instantiate it directly; instead, it is spawned by the rod prefab
-- when the rod is inserted into a Teleportato.
local base = SpawnPrefab("diviningrodbase")
```

## Dependencies & tags
**Components used:** `inspectable`, `lock`  
**Tags:** Adds `"rodbase"` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lock.isstuck` | boolean | `true` (initial), later `false` on ready | Indicates whether the base is physically stuck in the Teleportato slot. |
| `lock.locktype` | LOCKTYPE | `LOCKTYPE.MAXWELL` | Type of lock used (Maxwell-type for Teleportato). |
| `lock.onunlocked` | function | `OnUnlock` | Callback invoked when the lock is unlocked (i.e., rod removed). |
| `lock.onlocked` | function | `OnLock` | Callback invoked when the lock is engaged (i.e., rod inserted). |

## Main functions
No standalone public methods are defined on this prefab. Functionality is exposed through event callbacks passed to the `lock` component and via `inst:ListenForEvent`. However, the internal callback functions are as follows:

### `OnUnlock(inst)`
* **Description:** Triggered when the divining rod base is unlocked (i.e., the rod is removed). Sets the base to stuck state, plays the "idle_full" animation, stops the pulse sound, plays an insertion/removal sound, and notifies the Teleportato by pushing `"powerup"`.
* **Parameters:** `inst` (Entity) — the base entity instance.
* **Returns:** Nothing.
* **Error states:** None — assumes Teleportato entity may or may not exist; silently ignores absence.

### `OnLock(inst)`
* **Description:** Triggered when the rod is inserted and the lock is engaged. Plays the "idle_empty" animation and kills the pulse sound (as no pulse should be active yet).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnReady(inst)`
* **Description:** Called when the Teleportato signals readiness (e.g., after power-up or restart). If the base is locked, starts the pulse animation and sound and clears the stuck state; otherwise, triggers `OnUnlock`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `describe(inst)`
* **Description:** Used by the `inspectable` component to return an appropriate status string for UI tooltip display. Returns `"READY"` if unstuck and unlocked (rod fully functional), `"UNLOCKED"` if stuck but unlocked (rod inserted but not fully ready), or `nil` if locked and stuck.
* **Parameters:** `inst` (Entity).
* **Returns:** `"READY"`, `"UNLOCKED"`, or `nil` (if locked and stuck).

## Events & listeners
- **Listens to:** `"ready"` — triggers `OnReady` to update pulse behavior and stuck state.
- **Pushes:** None — this prefab does not fire custom events, though it may cause the Teleportato to push `"powerup"` via side effect.