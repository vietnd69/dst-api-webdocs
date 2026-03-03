---
id: stageactingprop
title: Stageactingprop
description: Manages theatrical performance logic for stage props, including script selection, cast collection, and line delivery coordination.
tags: [theater, ai, performance, script, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7c36412d
system_scope: entity
---

# Stageactingprop

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stageactingprop` orchestrates stage performances for props (e.g., lecterns, stages) in Don't Starve Together. It collects actors within range, matches them to roles using costume data, selects an appropriate script, and coordinates line delivery via `Talker` and stategraph events. It integrates with `stageactor`, `inventory`, `locomotor`, `playbill_lecturn`, and `entitytracker` to manage scene flow, coordination, and transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stageactingprop")

inst.components.stageactingprop:AddGeneralScript("Act1", { cast = { "BEARCAT", "MONOLOGUE" }, lines = { ... } })
inst.components.stageactingprop:AddPlay({
    costumes = { BEARCAT = { head = "bearcat_head", body = "bearcat_body" } },
    scripts = { Act1 = { ... } },
    current_act = "Act1"
})

inst.components.stageactingprop:DoPerformance(player)
```

## Dependencies & tags
**Components used:** `entitytracker`, `inventory`, `locomotor`, `playbill_lecturn`, `stageactor`, `talker`  
**Tags:** Adds `stageactingprop` to its owner; checks/removes `acting`, `play_in_progress`, `NOCLICK`, `fire`, `burnt` on actors.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cast` | table | `nil` | Map of `costume -> { castmember = ent }` for active performance. |
| `script` | string | `nil` | Name of the currently active script. |
| `performance_problem` | string | `nil` | Indicates why performance failed (e.g., `"NO_SCRIPT"`, `"BAD_COSTUMES"`). |
| `costumes` | table | `{}` | Map of costume names to `{ head = prefab, body = prefab }`. |
| `current_act` | string | `nil` | Name of the currently selected act. |
| `generalscripts` | table | `{}` | General-purpose scripts stored on initialization. |
| `scripts` | table | `{}` | Active scripts (general + play-specific). |

## Main functions
### `AddGeneralScript(script_name, script_content)`
* **Description:** Registers a general script (applies to all plays) and adds it to `self.scripts`.
* **Parameters:**  
  `script_name` (string) — unique script identifier.  
  `script_content` (table) — script definition table.  
* **Returns:** Nothing.  
* **Error states:** Asserts if `script_name` already exists in `generalscripts` or `scripts`.

### `AddPlay(playdata)`
* **Description:** Loads a new play’s costume and script definitions, preserving general scripts.
* **Parameters:**  
  `playdata` (table) — expects `costumes`, `scripts`, and `current_act` keys.  
* **Returns:** Nothing.

### `EnableProp()`
* **Description:** Ensures the `stageactingprop` tag is present and invokes the optional `enablefn`.
* **Parameters:** None.  
* **Returns:** Nothing.

### `DisableProp(time)`
* **Description:** Removes `stageactingprop` tag, invokes `dissablefn`, and schedules re-enabling after `time` seconds.
* **Parameters:**  
  `time` (number?) — delay before re-enabling. If `nil`, no timer is started.  
* **Returns:** Nothing.

### `FindCostume(head, body)`
* **Description:** Finds the costume name matching the given head/body prefabs. Sets `performance_problem = "BAD_COSTUMES"` on partial match.
* **Parameters:**  
  `head` (string?) — head prefab name.  
  `body` (string?) — body prefab name.  
* **Returns:** (string?) — costume name if exact match; `nil` otherwise.

### `CheckCostume(player)`
* **Description:** Checks what costume the player is wearing based on equipped head/body items.
* **Parameters:**  
  `player` (entity) — entity with `inventory` component.  
* **Returns:** (string?) — costume name or `nil`.

### `CollectCast(doer)`
* **Description:** Finds actors in range, assigns them to `self.cast` by matching costumes. If `doer` has no costume, only `doer` is added as a `MONOLOGUE` fallback.
* **Parameters:**  
  `doer` (entity) — entity triggering the performance.  
* **Returns:** Nothing.

### `FindScript(doer)`
* **Description:** Identifies valid scripts requiring all cast members; prefers longer casts. Returns `"NO_SCRIPT"` or `"BAD_COSTUMES"` on failure.
* **Parameters:**  
  `doer` (entity) — used to infer monologue fallback.  
* **Returns:** (string?) — script name or error code.

### `DoPerformance(doer)`
* **Description:** Initiates a performance by collecting cast and selecting a script; sets up listeners and tags. Returns `false` if performance already in progress.
* **Parameters:**  
  `doer` (entity) — actor triggering the performance.  
* **Returns:** (boolean) — `true` if performance started; `false` otherwise.

### `EndPerformance(doer)`
* **Description:** Ends a performance, cleans up tags, audio, birds, and callbacks. Fires `"play_ended"` and optional `onperformanceended`.
* **Parameters:**  
  `doer` (entity?) — triggering actor (may be `nil`).  
* **Returns:** Nothing.

### `ClearPerformance(doer)`
* **Description:** Ends the performance and cancels the active play task (`self.playtask`).
* **Parameters:**  
  `doer` (entity) — actor ending the performance.  
* **Returns:** Nothing.

### `DoLines()`
* **Description:** Executes the script’s lines sequentially. Skips lines based on `lucytest`/`treetest`, triggers `perform_do_next_line`, and handles sounds.
* **Parameters:** None.  
* **Returns:** Nothing. Fires `"play_performed"` with metadata at completion.

### `FinishAct(next_act)`
* **Description:** Updates the current act and syncs with lecturn via `playbill_lecturn`.
* **Parameters:**  
  `next_act` (string) — next act/script name.  
* **Returns:** Nothing.

### `SpawnBirds(arch)`
* **Description:** Spawns two heckler birds that follow the prop (or optional `arch`) and face it.
* **Parameters:**  
  `arch` (entity?) — optional anchor entity (defaults to `self.inst`).  
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Decrements the disable timer during `DisableProp` and re-enables when elapsed.
* **Parameters:**  
  `dt` (number) — delta time.  
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes only `time` (remaining disable duration).
* **Parameters:** None.  
* **Returns:** (table) — `{ time = self.time }`.

### `LoadPostPass(newents, data)`
* **Description:** Restores disable state after deserialization if `data.time` is present.
* **Parameters:**  
  `newents` (table) — mapping of GUIDs to entities.  
  `data` (table?) — saved data from `OnSave`.  
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleans up `stageactingprop` tag when component is removed.
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `unequip` — on cast members; triggers `costumecheck` to end performance if costume is removed.  
  `newstate` — on cast members; triggers `abortplay` to verify actor is still active.  
  `play_ended` — pushed by this component to signal performance conclusion.  
  `play_begun` — pushed by this component to signal start.  
  `play_performed` — pushed after script execution; includes `next`, `error`, `skip_hound_spawn`.  
- **Pushes:**  
  `startstageacting` / `stopstageacting` — on actors to signal entry/exit from acting state.  
  `perform_do_next_line` — triggers animation/line delivery on actors.
