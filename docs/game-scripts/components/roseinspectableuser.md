---
id: roseinspectableuser
title: Roseinspectableuser
description: Manages the Rose Glasses' inspection logic, including cooldown tracking, residue spawning, and interaction with roseinspectable targets.
tags: [inspection, cooldown, item, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6d310e3a
system_scope: entity
---

# Roseinspectableuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Roseinspectableuser` handles the behavior of entities using the Rose Glasses to inspect other entities or world points for hidden properties. It manages the cooldown state, creates and maintains a `charlieresidue` effect during inspection, and coordinates with `roseinspectable` components on targets to perform inspection. It also provides quips (dialogue) via the `talker` component and persists cooldown state across saves.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("roseinspectableuser")
inst:AddTag("inspector")
inst:AddComponent("talker")

-- Begin inspecting a target
local target = some_entity
if inst.components.roseinspectableuser:TryToDoRoseInspectionOnTarget(target) then
    -- Inspection started successfully; residue will be spawned
end

-- Later, to trigger immediate cooldown
inst.components.roseinspectableuser:GoOnCooldown()
```

## Dependencies & tags
**Components used:** `talker`, `roseinspectable` (via `target.components.roseinspectable`), `player_classified` (optional), `health` (indirect, for `talker`), `revivablecorpse`, `sleeper` (via `talker`), `Transform`, `Inspectable` (via `CLOSEINSPECTORUTIL`).
**Tags:** Checks `lunar_aligned`, `notroseinspectable` on target (as invalid); adds no tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity owning this component. |
| `cooldowntime` | number | `TUNING.SKILLS.WINONA.ROSEGLASSES_COOLDOWNTIME` | Duration (in seconds) for cooldown after inspection. |
| `target` | `Entity` | `nil` | The target entity currently being inspected. |
| `point` | `Vector` | `nil` | The world point currently being inspected. |
| `residue` | `Entity` | `nil` | The `charlieresidue` prefab instance spawned during inspection. |
| `quipcooldowntime` | number | `nil` | Timestamp used to throttle quip (dialogue) output. |
| `cooldowntask` | `Task` | `nil` | Scheduled task for ending the cooldown period. |

## Main functions
### `SetCooldownTime(cooldowntime)`
* **Description:** Updates the cooldown duration used by `GoOnCooldown`.
* **Parameters:** `cooldowntime` (number) – new cooldown duration in seconds.
* **Returns:** Nothing.

### `GoOnCooldown()`
* **Description:** Starts the cooldown timer using the current `cooldowntime`. Cancels any existing cooldown task first.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnCharlieResidueActivated(residue)`
* **Description:** Triggered when the spawned `charlieresidue` is activated (typically when the user releases the inspect key or the residue times out). Performs the actual inspection on the `target` or `point`, applying cooldown if needed.
* **Parameters:** `residue` (Entity) – the residue instance being activated.
* **Returns:** Nothing.
* **Error states:** Returns early if `residue` does not match `self.residue`.

### `SetRoseInpectionOnTarget(target)`
* **Description:** Begins inspecting a target entity. Spawns a residue linked to the target and sets up event listeners.
* **Parameters:** `target` (Entity) – the entity to inspect.
* **Returns:** Nothing.

### `SetRoseInpectionOnPoint(point)`
* **Description:** Begins inspecting a world point (e.g., a tile or location). Spawns a residue at the point.
* **Parameters:** `point` (Vector or point-like object) – world coordinates of the inspection target.
* **Returns:** Nothing.

### `TryToDoRoseInspectionOnTarget(target)`
* **Description:** Validates and attempts to start an inspection on a target. Returns success status and an optional quip key for failure reasons.
* **Parameters:** `target` (Entity) – entity to inspect.
* **Returns:** `success` (boolean), `quip_reason` (string | nil) – quip key for failure (e.g., `"ROSEGLASSES_COOLDOWN"`), or `nil` if successful.
* **Error states:** Returns `false` if target is a residue, invalid (`CLOSEINSPECTORUTIL.IsValidTarget`), has invalid tags (`lunar_aligned`, `notroseinspectable`), lacks `roseinspectable`, or cannot spawn residue.

### `TryToDoRoseInspectionOnPoint(pt)`
* **Description:** Begins inspection of a world point and returns success.
* **Parameters:** `pt` (Vector) – point to inspect.
* **Returns:** `true` (always succeeds if called).
* **Error states:** None identified.

### `DoRoseInspectionOnPoint()`
* **Description:** Evaluates all configured `ROSEPOINT_CONFIGURATIONS` at the current `self.point` and executes the first matching callback. Returns whether a cooldown should be applied.
* **Parameters:** None.
* **Returns:** `will_cooldown` (boolean) – whether the successful configuration induces a cooldown.
* **Error states:** Returns `false` if no configuration matches or all matching configurations are on cooldown (and a quip is triggered).

### `DoQuip(reason, failed)`
* **Description:** Triggers a line of dialogue via `talker.Say` based on `reason`. Throttles subsequent quips via `quipcooldowntime`.
* **Parameters:**  
  * `reason` (string) – localization key for the dialogue line (e.g., `"ANNOUNCE_ROSEGLASSES"`, `"ROSEGLASSES_COOLDOWN"`).  
  * `failed` (boolean) – if `true`, triggers a failure quip and ignores throttle.
* **Returns:** Nothing.

### `ApplyCooldown(duration)`
* **Description:** Starts a task to end the cooldown after `duration` seconds and notifies `player_classified.roseglasses_cooldown` on the client.
* **Parameters:** `duration` (number) – cooldown duration in seconds.
* **Returns:** Nothing.

### `OnCooldown()`
* **Description:** Called when the cooldown timer ends. Resets `cooldowntask` and notifies `player_classified.roseglasses_cooldown`.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsInCooldown()`
* **Description:** Checks whether the component is currently in a cooldown state.
* **Parameters:** None.
* **Returns:** `true` if `cooldowntask` is not `nil`; otherwise `false`.

### `ForceDecayResidue()`
* **Description:** Immediately destroys the currently spawned `residue`, if any, and cleans up listeners.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnResidue()`
* **Description:** Destroys any existing residue, spawns a new `charlieresidue`, positions it at `target` or `point`, and sets up `onremove` listeners.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes remaining cooldown time for save/load.
* **Parameters:** None.
* **Returns:** `data` (table) – contains `cooldown` (number) if active.
* **Error states:** Returns an empty table if no cooldown is active.

### `OnLoad(data)`
* **Description:** Restores cooldown state from save data.
* **Parameters:** `data` (table) – saved component data.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Handles cooldown refinement across frame updates (e.g., for pause/sync), re-scheduling the task with updated remaining time.
* **Parameters:** `dt` (number) – delta time since last update.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a string for debug display showing the current `target`/`point` and remaining cooldown time.
* **Parameters:** None.
* **Returns:** `debug_str` (string) – e.g., `"Target: mytarget, Cooldown: 2.3"`.

## Events & listeners
- **Listens to:**  
  - `"onremove"` on `self.residue` – triggers `self.residue._onresidueremoved` to clear `self.residue`.  
  - `"onremove"` on `self.inst` – handled via residue's `FXOwner` lifecycle.  
  - `"onremove"` in `SetRoseInpectionOnTarget` – registered directly on `self.residue` for cleanup.  
  - `"onremove"` in `OnRemoveFromEntity` – cancels and clears `cooldowntask`.  
- **Pushes:**  
  - `"silentcloseinspect"` – fired when quip is throttled.  
  - `"ROSEGLASSES_COOLDOWN"` quip via `talker.Say` – not a game event but triggers dialogue.
