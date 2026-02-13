---
id: charliecutscene
title: Charliecutscene
description: This component orchestrates the cinematic sequence where Charlie repairs the Atrium Gate and introduces the Charlie's Hand entity, managing camera and entity states.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Charliecutscene

## Overview
This component is responsible for managing the entirety of the "Charlie repairs the Atrium Gate" cutscene. It orchestrates camera movements, spawns the `charlie_npc` and `charlie_hand` entities, handles the visual and functional state transition of the Atrium Gate, and dispatches global world events related to the cutscene's progression. It handles both client-side camera control and server-side entity spawning and state management.

## Dependencies & Tags
This component interacts with and relies on various other components and game systems:
*   **`AnimState`**: For playing animations on the parent entity (the Atrium Gate).
*   **`SoundEmitter`**: For playing sounds during the cutscene (e.g., gate repair).
*   **`MiniMapEntity`**: To update the Atrium Gate's icon on the minimap after repair.
*   **`Transform`**: To get and set positions of entities.
*   **`colourtweener`**: To tween the screen color to black during the gate repair animation.
*   **`trader`**: To temporarily disable trading on the Atrium Gate during the cutscene.
*   **`pickable`**: To check `caninteractwith` status for minimap icon.
*   **`worldsettingstimer`**: To check `destabilizedelay` and `cooldown` timers for minimap icon and animations.
*   **`entitytracker`**: To track the spawned `charlie_hand` entity.
*   **`TheFocalPoint`**: For managing the client's camera focus during the cutscene.
*   **`TheCamera`**: For direct control over the client's camera (locking, setting gains, distance, heading).

**Tags:**
*   The component searches for entities with the `"pillar_atrium"` tag to identify and position the surrounding pillars for scene setup.

## Properties
| Property            | Type          | Default Value | Description                                                                                             |
| :------------------ | :------------ | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`              | `Entity`      | `nil`         | A reference to the parent entity this component is attached to (the Atrium Gate).                       |
| `gate_pos`          | `Vector3`     | `nil`         | The cached world position of the Atrium Gate entity.                                                    |
| `atrium_pillars`    | `table`       | `nil`         | A table containing references to Atrium Pillar entities, categorized by their position relative to the gate (e.g., `back`, `side`). |
| `_iscameralocked`   | `net_bool`    | `false`       | A networked boolean flag indicating whether the client's camera is currently locked for the cutscene.    |
| `_cameraangle`      | `net_ushortint`| `0`           | A networked unsigned short integer representing the target heading angle for the locked camera.         |
| `_running`          | `boolean`     | `false`       | A flag indicating if the cutscene is currently active and in progress on the server.                    |
| `_gatefixed`        | `boolean`     | `false`       | A flag indicating if the Atrium Gate has been successfully repaired by Charlie during the cutscene.     |
| `_traderenabled`    | `boolean`     | `nil`         | Stores the initial `enabled` state of the parent entity's `trader` component before it is disabled by the cutscene. |
| `charlie`           | `Entity`      | `nil`         | A reference to the `charlie_npc` entity spawned during the cutscene.                                    |
| `hand`              | `Entity`      | `nil`         | A reference to the `charlie_hand` entity spawned during the cutscene.                                   |

## Main Functions
### `ClientLockCamera()`
*   **Description:** Locks the client's camera, making it uncontrollable by the player. It then sets specific camera gains (pan, heading, distance), fixes the camera distance, and sets the target heading angle based on the `_cameraangle` networked property.
*   **Parameters:** None.

### `ClientUnlockCamera()`
*   **Description:** Unlocks the client's camera, restoring player control. The `TheFocalPoint` system is expected to handle the reset of camera gain values.
*   **Parameters:** None.

### `Start()`
*   **Description:** Initiates the server-side logic for the Atrium Gate cutscene. This involves setting the `_running` flag, pushing global events, temporarily disabling the Atrium Gate's `trader` component, collecting pillar data, scheduling Charlie's spawn and gate repair, and locking the camera on all clients.
*   **Parameters:** None.

### `Finish()`
*   **Description:** Concludes the server-side logic for the Atrium Gate cutscene. This method resets the `_running` flag, pushes global events, re-enables the `trader` component if it was previously enabled, unlocks the camera on all clients, and triggers the "shadowrift_opened" event.
*   **Parameters:** None.

### `CollectAtriumPillarsData()`
*   **Description:** Gathers and caches the positions and angles of nearby Atrium Pillars relative to the Atrium Gate. This data is crucial for determining camera angles and spawn points. It only performs this collection once.
*   **Parameters:** None.

### `FindSceneCameraAngle()`
*   **Description:** Calculates an optimal camera heading angle for the cutscene, ensuring a good view of the gate and Charlie, based on the collected Atrium Pillar data. The angle is rounded to standard 90-degree increments with an offset.
*   **Parameters:** None.
*   **Returns:** `number` - The calculated camera heading angle in degrees (0-359).

### `StartRepairingGateWithDelay(delay, delay_to_fix)`
*   **Description:** Schedules the gate repair animation and the actual gate state change (`RepairGate`) to occur after specified delays.
*   **Parameters:**
    *   `delay` (`number`): The time in seconds before the gate repair animation (`StartRepairingGate`) begins.
    *   `delay_to_fix` (`number`): The time in seconds before the gate is fully repaired (`RepairGate`) and its state changes.

### `RepairGate()`
*   **Description:** Marks the Atrium Gate as repaired (`_gatefixed = true`). It updates the gate's `AnimState` to the "fixed" build and plays the "fixed" animation, stops the "fixing" sound, plays a "fixed" sound, shakes all cameras, and updates the minimap icon and subsequent animations (idle or cooldown).
*   **Parameters:** None.

### `FindCharlieSpawnPoint()`
*   **Description:** Determines a suitable spawn point for the `charlie_npc` entity. It calculates a position between one of the side pillars and the Atrium Gate, with a slight offset.
*   **Parameters:** None.
*   **Returns:** `Vector3` - The calculated spawn position for Charlie.

### `SpawnCharlieWithDelay(delay)`
*   **Description:** Spawns the `charlie_npc` prefab after a specified delay. It then positions Charlie at the calculated spawn point, forces him to face the Atrium Gate, and instructs him to begin casting his repair spell.
*   **Parameters:**
    *   `delay` (`number`): The time in seconds before `charlie_npc` is spawned.

### `FindCharlieHandSpawnPoint()`
*   **Description:** Calculates the spawn point for the `charlie_hand` entity by finding an inverse point relative to the Atrium Pillars, providing a visually interesting location for the hand to appear.
*   **Parameters:** None.
*   **Returns:** `Vector3` - The calculated spawn position for Charlie's hand.

### `SpawnCharlieHand()`
*   **Description:** Spawns the `charlie_hand` prefab and establishes tracking relationships between the hand and the Atrium Gate. It then initializes the hand's position based on `FindCharlieHandSpawnPoint()`.
*   **Parameters:** None.

### `IsGateRepaired()`
*   **Description:** Checks if the Atrium Gate has been marked as repaired by the cutscene.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if the gate is repaired, `false` otherwise.

### `OnSave()`
*   **Description:** Provides data to be saved when the game persists. It saves whether the cutscene was `running` or if the `gatefixed` state was achieved.
*   **Parameters:** None.
*   **Returns:** `table` - A table containing `running = true` or `gatefixed = true` if applicable, otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Loads the cutscene's state from saved data. If the cutscene was running, it immediately calls `Finish()` to skip it. If the gate was fixed (or the cutscene was running), it sets the `_gatefixed` flag and updates the gate's visual build and minimap icon accordingly.
*   **Parameters:**
    *   `data` (`table`): The table containing saved state data for this component.

## Events & Listeners
*   **Listens For:**
    *   `inst:ListenForEvent("iscameralockeddirty", OnIsCameraLockedDirty)`: On the client, this event listener triggers `OnIsCameraLockedDirty` whenever the networked `_iscameralocked` property changes, which then calls `ClientLockCamera()` or `ClientUnlockCamera()`.
*   **Pushes/Triggers:**
    *   `TheWorld:PushEvent("charliecutscene", true)`: Signaled when the cutscene `Start()`s.
    *   `TheWorld:PushEvent("charliecutscene", false)`: Signaled when the cutscene `Finish()`es.
    *   `TheWorld:PushEvent("ms_locknightmarephase", "wild")`: Locks the nightmare phase to "wild" at the start of the cutscene.
    *   `TheWorld:PushEvent("ms_locknightmarephase", nil)`: Unlocks the nightmare phase at the end of the cutscene.
    *   `TheWorld:PushEvent("shadowrift_opened")`: Signaled at the very end of the cutscene (`Finish()`), indicating a new game state.