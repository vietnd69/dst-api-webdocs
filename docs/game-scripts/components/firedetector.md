---
id: firedetector
title: FireDetector
description: Monitors entities within range for fire-related hazards, supporting normal fire detection and emergency mode responses based on burning, smoldering, or withering targets.
tags: [combat, environment, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bb15cdfa
system_scope: environment
---

# FireDetector

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FireDetector` is an environment-monitoring component attached to entities (typically structures like fireplaces or beehives) to detect fire hazards and trigger automated responses. It operates in two modes: normal mode (scanning for burning/smoldering/withering targets) and emergency mode (reacting to high-priority fire events). The component uses tag-based entity searches and listens for burn/remove events to assess threats. It optionally calls custom callback functions when events occur and maintains an emergency level based on observed burnt targets.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("firedetector")
inst.components.firedetector:SetOnFindFireFn(function(fire_detector, pos)
    print("Fire detected at", pos.x, pos.y, pos.z)
end)
inst.components.firedetector:Activate()
```

## Dependencies & tags
**Components used:** `burnable`, `witherable`  
**Tags added/removed:** `emergency` (added/removed dynamically), `fire` (used for emergency detection), `smolder`, `witherable` (used in filtering)  
**Tags excluded from searches:** `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `burnt`, `player`, `monster`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `TUNING.FIRE_DETECTOR_RANGE` | Radius around the entity to scan for fire hazards. |
| `detectPeriod` | number | `TUNING.FIRE_DETECTOR_PERIOD` | Interval (in seconds) between periodic scans. |
| `emergencyLevelMax` | number | `TUNING.EMERGENCY_BURNT_NUMBER` | Maximum emergency level (capacity of tracked burnt targets). |
| `emergencyLevelFireThreshold` | number | `TUNING.EMERGENCY_BURNING_NUMBER` | Minimum number of burning targets to consider triggering emergency level increase. |
| `emergencyResponsePeriod` | number | `TUNING.EMERGENCY_RESPONSE_TIME` | Time window (seconds) for counting burnt targets toward emergency level. |
| `emergencyShutdownPeriod` | number | `TUNING.EMERGENCY_SHUT_OFF_TIME` | Delay before deactivating emergency mode if no fire detected. |
| `emergencyLevel` | number | `0` | Current emergency level (0 = no emergency, higher = more severe). |
| `emergency` | boolean | `false` | Whether emergency mode is active. |
| `detectedItems` | table | `{}` | Map of tracked detected entities (key = entity, value = delayed cleanup task). |
| `emergencyWatched` | table | `nil` | Map of watched entities during emergency mode with registered callbacks. |
| `emergencyBurnt` | table | `nil` | List of timestamps for recent burnt events during emergency mode. |

## Main functions
### `SetOnFindFireFn(fn)`
* **Description:** Assigns a callback function triggered when a fire-related target is found during scanning.
* **Parameters:** `fn` (function) - signature `fn(fire_detector, position)`; receives the detector instance and the target's world position.
* **Returns:** Nothing.

### `Activate(randomizedStartTime)`
* **Description:** Starts normal detection mode, periodically scanning for fire hazards.
* **Parameters:** `randomizedStartTime` (boolean) - if true, applies a randomized delay before the first scan.
* **Returns:** Nothing.

### `ActivateEmergencyMode(randomizedStartTime)`
* **Description:** Activates emergency mode, which tracks burning entities directly via event callbacks and manages emergency level.
* **Parameters:** `randomizedStartTime` (boolean) - if true, applies a randomized delay before the first scan.
* **Returns:** Nothing.

### `IsEmergency()`
* **Description:** Reports whether emergency mode is currently active.
* **Parameters:** None.
* **Returns:** `true` if emergency mode is active, otherwise `false`.

### `GetEmergencyLevel()`
* **Description:** Returns the current emergency level (number of recent burnt targets, clamped to `emergencyLevelMax`).
* **Parameters:** None.
* **Returns:** number (current emergency level).

### `GetMaxEmergencyLevel()`
* **Description:** Returns the maximum supported emergency level (`emergencyLevelMax`).
* **Parameters:** None.
* **Returns:** number.

### `ResetEmergencyCooldown()`
* **Description:** Refreshes the timestamps for all tracked burnt targets, resetting their expiry times to the current moment (plus fixed intervals).
* **Parameters:** None.
* **Returns:** Nothing.

### `RaiseEmergencyLevel(numlevels)`
* **Description:** Manually increases the emergency level by inserting new burnt timestamps.
* **Parameters:** `numlevels` (number, optional) - number of levels to raise; defaults to `1`.
* **Returns:** Nothing.

### `LowerEmergencyLevel(numlevels)`
* **Description:** Manually decreases the emergency level by removing the oldest burnt timestamps.
* **Parameters:** `numlevels` (number, optional) - number of levels to lower; defaults to `1`.
* **Returns:** Nothing.

### `Deactivate()`
* **Description:** Fully deactivates all detection (normal or emergency), cancels pending tasks, and clears internal state.
* **Parameters:** None.
* **Returns:** Nothing.

### `DetectFire()`
* **Description:** Forces an immediate fire detection scan (used by stategraphs to trigger responses on custom timers).
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string summarizing the detector's current state for debugging.
* **Parameters:** None.
* **Returns:** string - e.g., `"ON level: 0 watching: 2 recent: 5 warningdelay: 10.50 cooldown: 2.30"`.

## Events & listeners
- **Listens to:**  
  `onburnt` — attached to watched burning entities during emergency mode; triggers `EmergencyResponse`.  
  `onremove` — attached to watched entities during emergency mode; cleans up watch entries.  
  (Also uses internal tasks to remove stale entries from `detectedItems` after 2 seconds.)
- **Pushes:**  
  Events are not directly pushed by this component; instead, it calls registered callbacks (`onfindfire`, `onbeginemergency`, `onendemergency`, `onbeginwarning`, `onupdatewarning`, `onendwarning`) when conditions are met.
