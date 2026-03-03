---
id: rider
title: Rider
description: Manages a player entity mounting and dismounting rideable creatures (such as beefalo), handling animations, physics, damage redirection, and serialization.
tags: [locomotion, entity, mount, combat]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 07720704
system_scope: locomotion
---
# Rider

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Rider` enables an entity (typically a player) to mount and ride rideable creatures (e.g., beefalo). It manages the transition into and out of the mounted state, including animation switching, physics synchronization, parent-child relationships, and temporary disabling of mounting constraints. It coordinates closely with the `rideable` component on the mount, and integrates with `health`, `combat`, `sheltered`, `pinnable`, and `saddler` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("rider")
-- To mount a rideable creature:
local mount = some_beefalo_entity
inst.components.rider:Mount(mount, false)
-- To dismount:
inst.components.rider:Dismount()
-- Check current state:
if inst.components.rider:IsRiding() then
    print("Player is mounted!")
end
```

## Dependencies & tags
**Components used:** `rideable`, `health`, `combat`, `sheltered`, `pinnable`, `saddler`, `brain`, `weapon`  
**Tags:** Checks `pseudoprojectile` on attacker for damage redirection; no tags added/removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target_mount` | `Entity` or `nil` | `nil` | Temporary reference to the intended mount during mounting logic. |
| `mount` | `Entity` or `nil` | `nil` | The entity currently being ridden. |
| `saddle` | `Entity` or `nil` | `nil` | The saddle equipped on the current mount (if any). |
| `riding` | boolean | `false` | Internal flag indicating whether the entity is currently mounted. |

## Main functions
### `Mount(target, instant)`
*   **Description:** Initiates mounting a specified `target` entity. Verifies obedience, rider eligibility, and mount availability before performing the mount sequence.
*   **Parameters:**
    * `target` (`Entity`) — The rideable creature to mount. Must have the `rideable` component.
    * `instant` (`boolean`) — If `true`, skips the mount animation and transitions directly to the "idle" state.
*   **Returns:** Nothing.
*   **Error states:** Returns early without mounting if: `self.riding` is `true`, `target` lacks `rideable` component, `target` is already being ridden, `TestObedience()` or `TestRider()` fails on the mount.

### `Dismount()`
*   **Description:** Triggers a dismount event. The actual dismount logic is deferred to `ActualDismount()`, typically invoked by the state graph.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ActualDismount()`
*   **Description:** Performs the core dismount logic: restores animations, re-enables physics and pinning, resets parent-child hierarchy, and reactivates the mount's brain and state graph.
*   **Parameters:** None.
*   **Returns:** `Entity` — The mount entity that was just dismounted, or `nil` if not riding.
*   **Error states:** Returns early without action if `riding` is `false`.

### `IsRiding()`
*   **Description:** Reports whether the entity is currently mounted.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if mounted, `false` otherwise.

### `GetMount()`
*   **Description:** Returns the entity currently being ridden.
*   **Parameters:** None.
*   **Returns:** `Entity` or `nil` — The current mount, or `nil` if not mounted.

### `StartTracking(mount)`
*   **Description:** Registers interest in `saddlechanged` events on the given mount to keep the local `saddle` reference up to date.
*   **Parameters:**
    * `mount` (`Entity`) — The mount to begin tracking, or `nil` to stop tracking current mount.
*   **Returns:** Nothing.

### `StopTracking(mount)`
*   **Description:** Unregisters `saddlechanged` interest and clears local saddle reference.
*   **Parameters:**
    * `mount` (`Entity`) — The mount to stop tracking, or `nil`.
*   **Returns:** Nothing.

### `GetSaddle()`
*   **Description:** Returns the current saddle entity equipped on the mounted creature.
*   **Parameters:** None.
*   **Returns:** `Entity` or `nil` — The saddle, or `nil` if no saddle is equipped.

### `OnSave()`
*   **Description:** Prepares mount data for serialization during autosave/quit. Only saves if the mount has `rideable:ShouldSave()` returning `true`.
*   **Parameters:** None.
*   **Returns:** `table` — Save data with key `mount`, containing the mount's `GetSaveRecord()`, or empty table `{}` if no mount or `ShouldSave()` is `false`.

### `OnLoad(data)`
*   **Description:** Restores the mount during load. Spawns the saved mount entity and immediately mounts it.
*   **Parameters:**
    * `data` (`table`) — Save data containing the mount record under `data.mount`.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when the component is removed from the entity. Cancels pending health announcement task and stops tracking the current mount.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `saddlechanged` (on mount) — Updates `self.saddle` via `self._onSaddleChanged`. Registered in `StartTracking`, removed in `StopTracking`.

- **Pushes:**  
  - `mounted` — Fired after mounting completes. Payload: `{ target = mount }`.  
  - `dismount` — Fired when dismount is initiated (via `Dismount()`).  
  - `dismounted` — Fired after dismount completes (in `ActualDismount`). Payload: `{ target = ex_mount }`.  
  - `refusedmount` — Fired if mount is refused due to obedience or rider test failure. Payload: `{ rider = self.inst, rideable = target }`.  
  - `refusedrider` — Fired on the mount when mount refusal occurs. Payload: `{ rider = self.inst, rideable = target }`.  
  - `mountwounded` — Fired when the mount’s health drops below 20% (after ~2–4 seconds post-mount, triggered by `_mountannouncetask`).
