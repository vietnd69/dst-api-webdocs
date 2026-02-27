---
id: stageactingprop
title: Stageactingprop
description: Manages the logic and state for theatrical performances on stage props, including cast collection, script selection, line execution, and performance lifecycle.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 7c36412d
---

# Stageactingprop

## Overview
This component enables a stage prop entity (e.g., a stage or podium) to host and orchestrate theatrical performances. It handles casting nearby `stageactor` entities, selecting and executing lines from scripts based on available costumes, managing performance state (e.g., progress tags), and triggering callbacks for performance start/end events.

## Dependencies & Tags
- **Adds Tag:** `stageactingprop`
- **Requires Components:** `inventory` (via `GetEquippedItem`), `stageactor` (for cast members), `talker`, `locomotor`, `Transform`, `entitytracker` (for `GetEntity("lecturn")`)
- **Events Listened For:** `unequip`, `newstate` (on cast members); internal thread sleep for line timing
- **Events Pushed:** `play_begun`, `play_ended`, `perform_do_next_line`, `stopstageacting`, `startstageacting`, `play_performed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to (the stage prop) |
| `cast` | `table` | `nil` | Map of costume name → `{castmember=Entity}`; populated during `CollectCast()` |
| `script` | `string?` | `nil` | Key of the selected script to execute (e.g., act name); set before `DoLines()` |
| `performance_problem` | `string?` | `nil` | Error code if performance is invalid (e.g., `"BAD_COSTUMES"`, `"NO_SCRIPT"`) |
| `costumes` | `table` | `{}` | Map of costume name → `{head=string, body=string}` defining valid costume combos |
| `current_act` | `string?` | `nil` | Key of the currently active script/act |
| `generalscripts` | `table` | `{}` | General scripts loaded at initialization (from `play_generalscripts.lua`) |
| `scripts` | `table` | `{}` | Combined scripts: general + play-specific (set via `AddPlay`) |
| `enablefn` | `function?` | `nil` | Callback for enabling the prop (invoked by `EnableProp`) |
| `dissablefn` | `function?` | `nil` | Callback for disabling the prop (invoked by `DisableProp`) |
| `onperformancebegun` | `function?` | `nil` | Custom callback invoked when a performance starts (`DoPerformance`) |
| `onperformanceended` | `function?` | `nil` | Custom callback invoked when a performance ends (`EndPerformance`) |

## Main Functions

### `AddGeneralScript(script_name, script_content)`
* **Description:** Registers a general-purpose script by name. Fails if a script with the same name already exists.
* **Parameters:**
  * `script_name`: `string` — Unique identifier for the script.
  * `script_content`: `table` — Script data (typically containing `cast`, `lines`, etc.).

### `AddPlay(playdata)`
* **Description:** Loads a specific play’s data, merging general scripts with play-specific ones, and updating costumes and the current act.
* **Parameters:**
  * `playdata`: `table` — Table with keys `costumes` (map), `scripts` (map), and `current_act` (string).

### `EnableProp()`
* **Description:** Re-enables the stage prop by adding the `stageactingprop` tag and invoking `enablefn` if set.

### `DisableProp(time)`
* **Description:** Disables the stage prop (removes `stageactingprop` tag), triggers `dissablefn` if set, and starts an update loop to re-enable after `time` seconds.
* **Parameters:**
  * `time`: `number?` — Seconds to wait before re-enabling; if omitted, the prop remains disabled until manually re-enabled.

### `FindCostume(head, body)`
* **Description:** Searches `costumes` for a full or partial match based on item prefabs. Returns costume key or `nil`.
* **Parameters:**
  * `head`: `string?` — Prefab name of the head item.
  * `body`: `string?` — Prefab name of the body item.
* **Side Effects:** Sets `performance_problem = "BAD_COSTUMES"` if a partial (non-full) match is found.

### `CheckCostume(player)`
* **Description:** Invokes `FindCostume` using the player’s equipped head and body items.
* **Parameters:**
  * `player`: `Entity` — The actor entity whose inventory is checked.

### `CollectCast(doer)`
* **Description:** Scans entities within 5.5 units for actors (`stageactor` tag, excluding `fire`/`burnt`). Builds the `cast` table. Adds `doer` as a monologue if no costume matches.
* **Parameters:**
  * `doer`: `Entity` — The actor who initiated the performance.
* **Side Effects:** May set `performance_problem = "REPEAT_COSTUMES"` if duplicate costume roles are used.

### `FindScript(doer)`
* **Description:** Finds eligible scripts where all required cast roles (from `script.cast`) are filled in the current `cast`. Prefers scripts with more roles. Returns script key or `"NO_SCRIPT"`.
* **Parameters:**
  * `doer`: `Entity` — Ignored; included for API consistency.
* **Side Effects:** May set `performance_problem = "NO_SCRIPT"` or `"BAD_COSTUMES"` if already set.

### `EndPerformance(doer)`
* **Description:** Finalizes a performance: clears cast tags, resets components, triggers callbacks, disables blackout/blackout birds, and schedules cleanup.
* **Parameters:**
  * `doer`: `Entity?` — The player who triggered the performance.

### `ClearPerformance(doer)`
* **Description:** Immediately cancels and cleans up an ongoing or pending performance by calling `EndPerformance` and killing the play thread.
* **Parameters:**
  * `doer`: `Entity?` — Passed to `EndPerformance`.

### `DoPerformance(doer)`
* **Description:** Starts a new performance: collects cast, selects a script, spawns birds (if applicable), sets up event listeners, and begins line execution via thread.
* **Parameters:**
  * `doer`: `Entity` — The player who triggered the performance.
* **Returns:** `boolean` — `true` if performance started; `false` if already in progress or no valid script.

### `DoLines()`
* **Description:** Executes lines from the selected script sequentially, respecting timing (`Sleep`), conditions (e.g., `lucytest`, `treetest`), and callbacks. Triggers `perform_do_next_line` for each line.
* **Side Effects:** Pushes `play_performed` with metadata; may call `FinishAct` if script has `next`.

### `FinishAct(next_act)`
* **Description:** Updates the current act and syncs a lecturn entity to reflect the next act.
* **Parameters:**
  * `next_act`: `string` — Key of the next act/script.

### `SpawnBirds(arch)`
* **Description:** Spawns two "Charlie heckler" birds (`charlie_heckler`) that orbit the stage prop and play synchronized sounds.
* **Parameters:**
  * `arch`: `Entity?` — Entity to use as anchor; defaults to `self.inst`.

### `OnUpdate(dt)` / `LongUpdate(dt)`
* **Description:** Decrements internal timer for re-enabling the prop after disable; used during the disable cooldown.
* **Parameters:**
  * `dt`: `number` — Delta time since last frame.

### `OnSave()` / `LoadPostPass(newents, data)`
* **Description:** Saves and restores the disable timer (`self.time`) across game sessions.
* **Parameters:**
  * `data`: `table?` — Saved state containing `time` (seconds remaining).

### `OnRemoveFromEntity()`
* **Description:** Removes the `stageactingprop` tag on entity removal.

## Events & Listeners
- **Listens For:**
  - `"unequip"` → `costumecheck` (on cast member entities)
  - `"newstate"` → `abortplay` (on cast member state machines)
- **Triggers/Pushes:**
  - `"play_begun"` — When performance starts (via `DoPerformance`)
  - `"play_ended"` — When performance ends (via `EndPerformance`)
  - `"perform_do_next_line"` — Per line, to animate/speak (via `DoLines`)
  - `"stopstageacting"` / `"startstageacting"` — On cast members to signal acting mode
  - `"play_performed"` — After script lines finish (includes metadata: `next`, `error`, `skip_hound_spawn`)