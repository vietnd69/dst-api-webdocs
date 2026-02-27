---
id: roseinspectableuser
title: Roseinspectableuser
description: This component enables an entity (typically a player) to use Rose Glasses to inspect entities or points in the world for hidden Residue-based interactions, managing cooldowns, residue spawning, and quips.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6d310e3a
---

# Roseinspectableuser

## Overview
The `RoseInspectableUser` component allows an entity (e.g., a player character) to use Rose Glasses to interact with "rose-inspectable" objects or locations. It manages the spawning of Charlie Residue for visual feedback, handles the cooldown state of the glasses, triggers inspect actions, and plays appropriate quips (dialogue or sound effects) based on success or cooldown status. It integrates tightly with the `roseinspectable` component on target entities and supports both targeted and point-based inspection.

## Dependencies & Tags
- **Component Dependencies:** Requires the host entity to have `components.talker` for quips and `components.player_classified` for UI cooldown state updates. `components.roseinspectable` must be present on target entities during targeted inspection.
- **Invalid Tags:** `{"lunar_aligned", "notroseinspectable"}` — entities possessing either tag are rejected as inspection targets.
- **Residue Interaction:** Spawns a `"charlieresidue"` prefab for each inspection attempt and tracks its lifecycle (e.g., removes listeners on entity destruction).
- **No tags added/removed** to the host entity itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed) | Reference to the host entity (e.g., player). |
| `cooldowntime` | `number` | `TUNING.SKILLS.WINONA.ROSEGLASSES_COOLDOWNTIME` | Duration (in seconds) of the cooldown after a successful inspection. |
| `target` | `Entity?` | `nil` | The inspected entity (if inspecting a target). |
| `point` | `Vector3?` | `nil` | The inspected world position (if inspecting a point). |
| `residue` | `PrefabInstance?` | `nil` | The currently active Charlie Residue instance spawned for inspection feedback. |
| `quipcooldowntime` | `number?` | `nil` | Timestamp used to throttle quip repetition (4–5 second interval). |
| `cooldowntask` | `Task?` | `nil` | Task handle tracking active cooldown; `nil` when not in cooldown. |

> Note: `cooldowntask` is initialized as `nil` but managed dynamically. Properties like `target`, `point`, and `residue` are set per inspection request and reset afterward.

## Main Functions

### `SetCooldownTime(cooldowntime)`
* **Description:** Updates the duration used for cooldowns (used for dynamic tuning, e.g., skill upgrades).
* **Parameters:**
  * `cooldowntime` (`number`): New cooldown duration in seconds.

### `GoOnCooldown()`
* **Description:** Cancels any existing cooldown task and starts a new one using the current `cooldowntime`. Also sets the `roseglasses_cooldown` state in the player’s classified UI.
* **Parameters:** None.

### `OnCharlieResidueActivated(residue)`
* **Description:** Triggered when a spawned residue is activated (e.g., by player interaction). Performs actual inspection logic: inspects the current `target` (if set) or the stored `point`, applies cooldown if needed, and handles cooldown quips.
* **Parameters:**
  * `residue` (`PrefabInstance`): The residue instance being activated. Must match `self.residue` for processing.

### `SetRoseInpectionOnTarget(target)`
* **Description:** Prepares the component to inspect a specific entity: sets `target`, clears `point`, spawns/resets residue, and links the residue to the target via `roseinspectable:HookupResidue`.
* **Parameters:**
  * `target` (`Entity`): Entity to inspect.

### `SetRoseInpectionOnPoint(point)`
* **Description:** Prepares inspection of a world point: clears `target`, sets `point`, and spawns/resets residue.
* **Parameters:**
  * `point` (`Vector3` or similar): World position to inspect.

### `ForceDecayResidue()`
* **Description:** Immediately triggers decay of the current `residue`, cleaning up listeners first.
* **Parameters:** None.

### `SpawnResidue()`
* **Description:** Destroys any existing residue and spawns a new `"charlieresidue"` prefab at the appropriate location (on `target` or at `point`). Attaches listeners for residue removal.
* **Parameters:** None.

### `DoRoseInspectionOnPoint()`
* **Description:** Iterates through `ROSEPOINT_CONFIGURATIONS` to find and execute an inspection match at the current `point`. Returns `true` if a match triggered a cooldown (caller should call `GoOnCooldown()`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a successful match induce a cooldown.

### `DoQuip(reason, failed)`
* **Description:** Plays a localized string/audio quip (e.g., cooldown message or announcement) via `talker`. Enforces per-quip cooldowns to avoid spam.
* **Parameters:**
  * `reason` (`string`): Key for localized string (e.g., `"ROSEGLASSES_COOLDOWN"`).
  * `failed` (`boolean`): If `true`, plays a failure quip immediately; otherwise, enforces quip cooldown before playing.

### `TryToDoRoseInspectionOnTarget(target)`
* **Description:** Validates and initiates inspection of a target entity. Performs pre-flight checks (tags, presence of `roseinspectable`, cooldown, residue eligibility). If valid, calls `SetRoseInpectionOnTarget()` and plays an announcement.
* **Parameters:**
  * `target` (`Entity`): Entity to inspect.
* **Returns:** `boolean, string` — `true, ""` on success; `false, reason` on failure (e.g., `"ROSEGLASSES_INVALID"`, `"ROSEGLASSES_COOLDOWN"`).

### `TryToDoRoseInspectionOnPoint(pt)`
* **Description:** Initiates point-based inspection: sets `point` and spawns residue, then announces inspection.
* **Parameters:**
  * `pt` (`Vector3`): Point in the world to inspect.
* **Returns:** `boolean` — Always `true`.

### `ApplyCooldown(duration)`
* **Description:** Creates a delayed task to end the cooldown after `duration`, updates UI state, and cancels any previous cooldown task.
* **Parameters:**
  * `duration` (`number`): Cooldown duration in seconds.

### `OnCooldown()`
* **Description:** Ends the cooldown state by clearing `cooldowntask` and updating UI state.
* **Parameters:** None.

### `IsInCooldown()`
* **Description:** Returns whether the component is currently in cooldown.
* **Returns:** `boolean`.

### `OnSave()`
* **Description:** Saves remaining cooldown time for persistence.
* **Returns:** `table` — Contains `cooldown` key with remaining seconds if active.

### `OnLoad(data)`
* **Description:** Restores active cooldown from saved data.
* **Parameters:**
  * `data` (`table?`): Saved component data.

### `LongUpdate(dt)`
* **Description:** Adjusts the cooldown task for time scaling (e.g., during slow-mo or season transitions) by rescheduling.
* **Parameters:**
  * `dt` (`number`): Delta time to apply.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing current state (target/point and remaining cooldown).
* **Returns:** `string`.

## Events & Listeners
- **Listens for `"onremove"` on host entity:** Cancels active cooldown and calls `OnCooldown()` via `OnRemoveFromEntity`.
- **Listens for `"onremove"` on `self.residue`:** Clears `self.residue` via `self.residue._onresidueremoved`.
- **Triggers:**
  - `"silentcloseinspect"` — Sent during quip spam prevention.
  - Passively via `DoQuip`: Uses `talker:Say` to trigger speech/quips.
  - Via `residue._onresidueremoved`: Automatically calls `self.residue = nil`.