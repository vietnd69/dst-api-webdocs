---
id: wx78_scanner
title: Wx78 Scanner
description: Manages scanning behavior, proximity detection, and state transitions for the Wx78 character's scanner device.
tags: [scanning, ai, component, proximity, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0ec19795
system_scope: entity
---

# Wx78 Scanner

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wx78_scanner.lua` defines the logic for the Wx78 scanner device, including its inventory item form, deployable scanner prop, success state, and FX entities. It coordinates proximity scanning (finding new scan targets), active scanning (locking onto and analyzing creatures), sound management, visual effects (including ring FX), and serialization. It relies heavily on `entitytracker`, `updatelooper`, `deployable`, `follower`, `activatable`, `teacher`, and `dataanalyzer` components to function.

## Usage example
```lua
local inst = SpawnPrefab("wx78_scanner_item")
inst.components.deployable:Deploy(target_pos, deployer, rotation)
-- Proximity scanning begins automatically after deploy
-- Active scanning starts when a scan target is found
-- On success, spawns wx78_scanner_succeeded prefab for harvesting
```

## Dependencies & tags
**Components used:** `activatable`, `builder`, `dataanalyzer`, `deployable`, `entitytracker`, `follower`, `harvestable`, `inspectable`, `locomotor`, `teacher`, `timer`, `updatelooper`, `talker`  
**Tags:** `companion`, `NOBLOCK`, `scarytoprey`, `CLASSIFIED`, `DECOR`, `NOCLICK`, `FX`, `usedeploystring` (added conditionally)

## Properties
No public properties are initialized in the constructor. Internal state variables are stored as instance fields (e.g., `inst._donescanning`, `inst._scantime`).

## Main functions
### `proximityscan(inst, dt)`
*   **Description:** Called every update via `updatelooper` while the scanner is active. Finds eligible creatures in range and attempts to lock onto the first one the owner doesn't have the blueprint for. Triggers ping sound and looping FX on lock-on.
*   **Parameters:** `inst` (Entity) - The scanner instance; `dt` (number) - Delta time.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if owner is dead, lacks `upgrademoduleowner`, or lacks `builder` component.

### `TryFindTarget(inst)`
*   **Description:** Scans a limited range around the scanner for candidates that meet scanning criteria (has scan data, has sufficient scan data, or lacks a known module recipe). If found, initiates active scanning via `OnTargetFound`.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** `nil`.
*   **Error states:** Returns early if scanning is done, no owner, out of range, or no candidates found.

### `OnTargetFound(inst, scan_target)`
*   **Description:** Locks onto a specific target, disables proximity scanning, shows lock-on sound/FX, starts scanning timer and top-light flash, and begins proximity-to-player checks.
*   **Parameters:** `inst` (Entity) - The scanner instance; `scan_target` (Entity) - The creature to scan.
*   **Returns:** Nothing.

### `OnUpdateScanCheck(inst, dt)`
*   **Description:** Runs during active scanning to verify the target is valid and in range, accumulates scan time, triggers scanning FX, and fires success/failure events when the scan duration threshold is crossed.
*   **Parameters:** `inst` (Entity) - The scanner instance; `dt` (number) - Delta time.
*   **Returns:** Nothing.
*   **Error states:** Returns early if scanning is done or target is invalid.

### `OnSuccessfulScan(inst)`
*   **Description:** Finalizes a successful scan: saves the target prefab and module recipe for teaching, removes scan target listeners, stops all scanning, and triggers success ring FX.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** Nothing.

### `OnScanFailed(inst)`
*   **Description:** Cancels active scanning due to target loss, timeout, or inaccessibility; stops all scanning, disables FX, and re-enables proximity scanning.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** Nothing.

### `StopAllScanning(inst, status)`
*   **Description:** Generic cleanup for ending scanning (success, failure, or manual off); removes update callbacks, timer, target listeners, and triggers appropriate ring FX based on `status`.
*   **Parameters:** `inst` (Entity) - The scanner instance; `status` (string) - `"succeed"`, `"fail"`, or default.
*   **Returns:** Nothing.

### `OnActivateFn(inst)`
*   **Description:** Handles deactivation (including emergency success handling if stuck); stops scanning and switches state to `"turn_off"`.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a human-readable status string for the inspect UI: `"HUNTING"` (actively scanning), `"SCANNING"` (proximity locked), or `nil`.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** `string?` - Status text or `nil`.

### `IsInRangeOfPlayer(inst)`
*   **Description:** Checks if the scanner is within player-proximity distance (`TUNING.WX78_SCANNER_PLAYER_PROX`). Used to maintain follow behavior and trigger scan failures when too far.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** `boolean` - Whether the scanner is in range.

### `SpawnData(inst)`
*   **Description:** After a successful scan, consumes the required scan data from the owner's analyzer and spawns a `scandata` prefab at the scanner's position.
*   **Parameters:** `inst` (Entity) - The scanner instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` - Handles top-light flash timer, proximity scan restart, and success-state timers (`onsucceeded_flashtick`, `onsucceeded_onspawn`, `onsucceeded_timeout`).
- **Pushes:** `on_landed` - Fired in success state after spawn delay (handled via `OnLoad`/`OnSave` and state graph).
- **Listeners for events from targets:** `onremove` on the scan target entity to trigger scan failure if the target is destroyed.