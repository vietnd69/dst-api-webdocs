---
id: firedetector
title: Firedetector
description: Monitors a spherical area around an entity for fire hazards and manages warning or emergency states based on burning objects, with support for both passive detection and active emergency protocols.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: bb15cdfa
---

# Firedetector

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `firedetector` component enables an entity to passively or actively scan its vicinity for fire-related hazards and respond with escalating warnings or full emergency protocols. It integrates with `burnable` and `witherable` components to assess threat levels and triggers configurable callback functions when new fires are found or emergency states change. The component supports three operational modes: `OFF`, `ON` (passive detection), `ARMED` (pre-emptive emergency preparation), and `EMERGENCY` (high-priority fire-only scanning with active suppression behavior). It is typically used by structures like fire alarms or suppression units.

## Dependencies & Tags
- **Components used:** `components.burnable` (via `IsBurning()`, `IsSmoldering()`), `components.witherable` (via `CanRejuvenate()`, `CanWither()`, `IsProtected()`).
- **Tags added:** `"emergency"` (added/removed dynamically via `onemergency` setter).
- **Tags excluded in searches:** `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, `"burnt"`, `"player"`, `"monster"` (defined in `NOTAGS`).
- **Emergency-specific tags searched:** `"structure"`, `"wall"`, `"tree"`, `"pickable"`, `"witherable"`, `"readyforharvest"`, `"notreadyforharvest"` (defined in `EMERGENCYTAGS`).
- **Non-emergency tags searched:** `"witherable"`, `"fire"`, `"smolder"` or `"fire"`, `"smolder"` only depending on mode (defined in `NONEMERGENCYTAGS`/`NONEMERGENCY_FIREONLY_TAGS`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | `number` | `TUNING.FIRE_DETECTOR_RANGE` | Radius (in world units) within which the component scans for targets. |
| `detectPeriod` | `number` | `TUNING.FIRE_DETECTOR_PERIOD` | Interval (in seconds) between scans in active modes. |
| `onfindfire` | `function(inst, pos)` | `nil` | Callback invoked when a fire hazard is first detected; passed the detector entity and target position. |
| `onbeginemergency` | `function(inst, level)` | `nil` | Callback invoked when full emergency state is triggered. |
| `onendemergency` | `function(inst, level)` | `nil` | Callback invoked when emergency state ends. |
| `onbeginwarning` | `function(inst, level)` | `nil` | Callback invoked when warning level increases (from 0 to N). |
| `onupdatewarning` | `function(inst, level)` | `nil` | Callback invoked when warning level changes mid-warning (e.g., 2 -> 3). |
| `onendwarning` | `function(inst, level)` | `nil` | Callback invoked when warning level drops to 0. |
| `detectedItems` | `table` | `{}` | Mapping of entity references to pending cleanup timers (used to avoid duplicate detection). |
| `emergencyLevel` | `number` | `0` | Current emergency level (count of recent burning events). |
| `emergencyLevelMax` | `number` | `TUNING.EMERGENCY_BURNT_NUMBER` | Maximum possible emergency level (threshold for full emergency mode). |
| `emergencyLevelFireThreshold` | `number` | `TUNING.EMERGENCY_BURNING_NUMBER` | Minimum number of burning entities required to start building emergency level. |
| `emergencyResponsePeriod` | `number` | `TUNING.EMERGENCY_RESPONSE_TIME` | Time window (in seconds) over which burn events are counted toward emergency level. |
| `emergencyShutdownPeriod` | `number` | `TUNING.EMERGENCY_SHUT_OFF_TIME` | Time to wait before ending emergency/armed state if no fires detected. |
| `emergency` | `boolean` | `false` | `true` when full emergency mode is active. |
| `emergencyWatched` | `table` | `nil` (in emergency mode only) | Mapping of watched entities to their event callbacks (only in armed/emergency mode). |
| `emergencyBurnt` | `table` | `nil` (in armed/emergency mode only) | Timestamped list of recent burn events; used to compute `emergencyLevel`. |
| `emergencyShutdownTask` | `timer` | `nil` | Task scheduled to end emergency/armed state. |
| `warningStartTime` | `number?` | `nil` | Timestamp when current warning phase started. |

## Main Functions
### `SetOnFindFireFn(fn)`
* **Description:** Sets the callback invoked when a new fire hazard is detected in passive or active mode.
* **Parameters:** `fn` (`function(inst, pos)`): Function to call with the detector entity and the target's world position. Pass `nil` to clear.
* **Returns:** `nil`.

### `SetOnBeginEmergencyFn(fn)`, `SetOnEndEmergencyFn(fn)`, `SetOnBeginWarningFn(fn)`, `SetOnUpdateWarningFn(fn)`, `SetOnEndWarningFn(fn)`
* **Description:** Configures optional callbacks for emergency and warning state transitions.
* **Parameters:** `fn` (`function(inst, level)`): Function receiving the detector entity and current emergency level. `SetOnUpdateWarningFn` and `SetOnEndWarningFn` receive the updated level after change.
* **Returns:** `nil`.

### `Activate(randomizedStartTime)`
* **Description:** Activates passive fire detection (mode `ON`). Begins scanning periodically for fire-related targets (burning, smoldering, or witherable objects).
* **Parameters:** `randomizedStartTime` (`boolean`): If `true`, adds a random delay up to `detectPeriod` to first scan.
* **Returns:** `nil`.

### `ActivateEmergencyMode(randomizedStartTime)`
* **Description:** Activates armed/emergency mode (mode `ARMED` -> `EMERGENCY`). Begins monitoring entities with `EMERGENCYTAGS` and listening for `onburnt` events. Builds `emergencyBurnt` list to track burn events over time.
* **Parameters:** `randomizedStartTime` (`boolean`): If `true`, randomizes initial scan delay.
* **Returns:** `nil`.

### `IsEmergency()`
* **Description:** Returns whether the component is in full emergency mode.
* **Returns:** `boolean`.

### `GetEmergencyLevel()`
* **Description:** Returns the current emergency level (number of recent burn events).
* **Returns:** `number`.

### `GetMaxEmergencyLevel()`
* **Description:** Returns the configured maximum emergency level threshold.
* **Returns:** `number`.

### `ResetEmergencyCooldown()`
* **Description:** Resets timestamps of all entries in `emergencyBurnt` to current time (or reschedules shutdown if empty), effectively extending the response window.
* **Returns:** `nil`.

### `RaiseEmergencyLevel(numlevels)`
* **Description:** Manually increments the emergency level by adding up to `numlevels` (default `1`) entries to `emergencyBurnt`.
* **Parameters:** `numlevels` (`number?`): Number of levels to raise; clamped to remaining capacity (`emergencyLevelMax - #emergencyBurnt`).
* **Returns:** `nil`.

### `LowerEmergencyLevel(numlevels)`
* **Description:** Manually decrements the emergency level by removing up to `numlevels` (default `1`) entries from `emergencyBurnt`.
* **Parameters:** `numlevels` (`number?`): Number of levels to lower.
* **Returns:** `nil`.

### `Deactivate()`
* **Description:** Clears all active states. Behavior depends on current mode:
  - `EMERGENCY`: Cancels tasks and triggers `onendemergency`.
  - `ARMED`: Clears `emergencyBurnt` and triggers `EmergencyResponse`.
  - `ON` or `OFF`: Cancels detection tasks.
* **Returns:** `nil`.

### `DetectFire()`
* **Description:** Triggers a single detection scan immediately (used by stategraphs for timed interactions). Respects busy state tags. Uses `LookForFireEmergencies` if in `EMERGENCY`, otherwise `LookForFiresAndFirestarters`.
* **Returns:** `nil`.

### `GetDebugString()`
* **Description:** Returns a human-readable status string for debugging (e.g., `"ARMED level: 2 watching: 3 recent: 1 warningdelay: 0.50 cooldown: 2.30"`).
* **Returns:** `string`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up all active tasks, event listeners, and stored references when the component is removed from its entity.
* **Returns:** `nil`.

## Events & Listeners
- **Listens to:**
  - `onburnt` (on watched entities in `emergencyWatched`): Triggers `EmergencyResponse` when an entity burns.
  - `onremove` (on watched entities in `emergencyWatched`): Removes the entity from `emergencyWatched` when it is removed.
- **Pushes:**
  - Fire detection via `onfindfire` callback (if set).
  - Emergency state transitions via `onbeginemergency`, `onendemergency`, `onbeginwarning`, `onupdatewarning`, `onendwarning` callbacks.
- **Internal callbacks:** `OnDetectEmergencyTargets`, `LookForFireEmergencies`, `EmergencyResponse`, `OnEndEmergency`, `OnDetectedItemTimeOut` are used as task/event callbacks internally.

---