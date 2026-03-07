---
id: charliecutscene
title: Charliecutscene
description: Manages the Charlie cutscene event for the Atrium gate, including camera control, NPC spawning, gate repair logic, and world state synchronization.
tags: [cutscene, camera, boss, world, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ec8f1efa
system_scope: world
---

# Charliecutscene

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Charliecutscene` orchestrates the narrative and gameplay sequence when Charlie attacks the Atrium gate. It handles camera locking and focusing, spawns Charlie and Charlie's Hand, repairs the gate, and manages network synchronization of the camera state. It is a dedicated `charliecutscene` component on the Atrium gate entity and only has meaningful functionality on the server (`TheWorld.ismastersim`) — client-side logic is minimal and tied to camera state changes.

The component interacts with `focalpoint` for camera control, `colourtweener` for screen fade effects, `trader` to disable trading, `pickable` to update gate UI icons, `entitytracker` to track Charlie's Hand, and `worldsettingstimer` for condition-dependent animations.

## Usage example
```lua
local gate = CreateEntity()
-- ... (setup Atrium gate prefab) ...
gate:AddComponent("charliecutscene")

-- Start the cutscene when Charlie attacks
gate.components.charliecutscene:Start()

-- Later, finish the cutscene after gate repair
gate.components.charliecutscene:Finish()
```

## Dependencies & tags
**Components used:** `colourtweener`, `entitytracker`, `focalpoint`, `pickable`, `trader`, `worldsettingstimer`  
**Tags:** None added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gate_pos` | `Vector3?` | `nil` | Cached position of the Atrium gate. Set during pillar data collection. |
| `atrium_pillars` | `{back: Entity, side: {Entity, Entity}}?` | `nil` | Structured data identifying the back and two side pillars around the gate. |
| `_iscameralocked` | `net_bool` | `net_bool(...)` | Networked boolean indicating whether the camera is locked during the cutscene. |
| `_cameraangle` | `net_ushortint` | `net_ushortint(...)` | Networked camera heading angle used for client-side camera tracking. |
| `_running` | `boolean` | `false` | Server-side flag indicating if the cutscene is currently active. |
| `_gatefixed` | `boolean` | `false` | Server-side flag indicating whether the gate has been repaired. |
| `_traderenabled` | `boolean?` | `nil` | Cached value of `trader.enabled` before disabling during the cutscene. |
| `charlie` | `Entity?` | `nil` | Reference to the spawned `charlie_npc` prefab. |
| `hand` | `Entity?` | `nil` | Reference to the spawned `charlie_hand` prefab. |

## Main functions
### `Start()`
*   **Description:** Initializes and starts the Charlie cutscene. Disables traders, locks the camera, locates Atrium pillars, spawns Charlie with a delay, and schedules gate repair.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Should only be called on the server (`TheWorld.ismastersim`). Does nothing on dedicated servers or non-mastersim.

### `Finish()`
*   **Description:** Ends the cutscene, unlocks the camera, re-enables traders if previously enabled, and fires the `shadowrift_opened` event.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Should only be called on the server. No effect if the cutscene was not started.

### `CollectAtriumPillarsData()`
*   **Description:** Locates Atrium pillars within range and categorizes them (back, side) relative to the gate. Only runs once per instance unless data is cleared manually.
*   **Parameters:** None.
*   **Returns:** Nothing (populates `gate_pos` and `atrium_pillars`).

### `FindSceneCameraAngle()`
*   **Description:** Computes the optimal camera angle for the scene based on the back pillar position and gate location. Rotates and rounds the angle to align with cardinal views.
*   **Parameters:** None.
*   **Returns:** `number` — A heading angle in degrees (0–359) for client camera focus.

### `StartRepairingGateWithDelay(delay, delay_to_fix)`
*   **Description:** Schedules two sequential actions: starting the gate repair animation and sound, then completing the repair (replacing the visual, playing sound, triggering shake).
*   **Parameters:**  
    * `delay` (number) — Time (in seconds) before `StartRepairingGate` is called.  
    * `delay_to_fix` (number) — Time (in seconds) before `RepairGate` is called (relative to cutscene start).
*   **Returns:** Nothing.

### `RepairGate()`
*   **Description:** Finalizes gate repair: changes animation/build, kills repair sound, triggers camera shake, updates minimap icon, and pushes an idle/cooldown animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FindCharlieSpawnPoint()`
*   **Description:** Calculates the spawn position for Charlie near one of the side pillars and slightly ahead of the gate.
*   **Parameters:** None.
*   **Returns:** `Vector3?` — Spawn position, or `nil` if no side pillar found.

### `SpawnCharlieWithDelay(delay)`
*   **Description:** Spawns `charlie_npc`, sets its parent reference, positions it, orients it toward the gate, and starts casting with delay.
*   **Parameters:**  
    * `delay` (number) — Time (in seconds) before spawning.
*   **Returns:** Nothing.

### `FindCharlieHandSpawnPoint()`
*   **Description:** Calculates the spawn position for Charlie's Hand using a geometric inversion formula based on pillar positions.
*   **Parameters:** None.
*   **Returns:** `Vector3` — Absolute world position for spawning Charlie's Hand.

### `SpawnCharlieHand()`
*   **Description:** Spawns `charlie_hand`, sets up bidirectional entity tracking (hand ↔ atrium), and initializes it.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsGateRepaired()`
*   **Description:** Checks if the gate repair phase has been completed.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `self._gatefixed` is `true`.

### `ClientLockCamera()`
*   **Description:** (Client-side only) Locks player camera input, sets custom camera gains and distance, and targets the saved camera heading.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClientUnlockCamera()`
*   **Description:** (Client-side only) Releases camera control, restoring player control. Does not reset gains (handled by `focalpoint`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns save data if the cutscene is running or the gate is repaired.
*   **Parameters:** None.
*   **Returns:** `{running: boolean}` or `{gatefixed: boolean}`, or `nil` if neither condition applies.

### `OnLoad(data)`
*   **Description:** (Server-side only) Restores state from save data: skips cutscene if running, or repairs gate visuals if saved as fixed.
*   **Parameters:**  
    * `data` (table?) — Load data possibly containing `running` or `gatefixed`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    * `iscameralockeddirty` — Triggers `OnIsCameraLockedDirty` on clients to start/stop camera focus and lock/unlock control.
- **Pushes (server):**  
    * `charliecutscene` (`true`/`false`) — Broadcasts cutscene start/end.  
    * `ms_locknightmarephase` (`"wild"`/`nil`) — Locks/unlocks nightmare phase.  
    * `shadowrift_opened` — Broadcasts when the cutscene finishes.
