---
id: mine
title: Mine
description: Manages a trap mine's behavior, including activation testing for nearby targets, explosion triggering, and state persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 55c647e3
---

# Mine

## Overview
This component implements a deployable trap mine that periodically scans for eligible targets within a defined radius. When a target is detected meeting specific criteria, the mine springs (activates), triggers an explosion callback, and enters a sprung state. It supports deactivation (e.g., when picked up), reuse logic, alignment-based filtering, and persistence across save/load cycles.

## Dependencies & Tags
**Dependencies (components/tags used internally or required on `inst`):**
- `"health"` (accessed via `CanBeAttacked` in target test function)
- `"combat"` (accessed via `CanBeAttacked` in target test function)
- `"entityreplica"` (referenced in comment; implied dependency)

**Tags added/removed:**
- Added: `"minesprung"`, `"mineactive"`, `"mine_not_reusable"` (conditionally)
- Removed: `"minesprung"`, `"mineactive"`, `"mine_not_reusable"` on removal; `"mineactive"`/`"minesprung"` toggled on `inactive`/`issprung` changes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `radius` | `number?` | `nil` | Radius around the mine to scan for targets. |
| `onexplode` | `function?` | `nil` | Callback invoked when the mine explodes. |
| `onreset` | `function?` | `nil` | Callback invoked when the mine is reset. |
| `onsetsprung` | `function?` | `nil` | Callback invoked when the mine springs. |
| `ondeactivate` | `function?` | `nil` | Callback invoked when the mine is deactivated. |
| `testtimefn` | `function?` | `nil` | Optional custom function to determine time until next test. |
| `target` | `Entity?` | `nil` | The most recently detected target (if any). |
| `inactive` | `boolean` | `true` | Whether the mine is currently inactive (e.g., due to being picked up). |
| `issprung` | `boolean` | `false` | Whether the mine has already sprung. |
| `testtask` | `Task?` | `nil` | Periodic task handle used for scanning. |
| `alignment` | `string` | `"player"` | Alignment tag used to exclude targets (e.g., `"player"` means enemies are not targeted). |

## Main Functions

### `Mine:SetRadius(radius)`
* **Description:** Sets the scanning radius for the mine. Must be called before the mine starts testing to take effect.
* **Parameters:**
  - `radius` (`number`): The radius in world units to scan for targets.

### `Mine:SetOnExplodeFn(fn)`
* **Description:** Sets the callback function executed when the mine explodes.
* **Parameters:**
  - `fn` (`function(inst, target)`): Function to call on explosion; receives the mine entity and the target entity.

### `Mine:SetOnSprungFn(fn)`
* **Description:** Sets the callback function executed when the mine springs.
* **Parameters:**
  - `fn` (`function(inst)`): Function to call when the mine springs.

### `Mine:SetOnResetFn(fn)`
* **Description:** Sets the callback function executed when the mine is reset (after explosion or deactivation, before reuse).
* **Parameters:**
  - `fn` (`function(inst)`): Function to call on reset.

### `Mine:SetOnDeactivateFn(fn)`
* **Description:** Sets the callback function executed when the mine is deactivated (e.g., when removed from the world).
* **Parameters:**
  - `fn` (`function(inst)`): Function to call on deactivation.

### `Mine:SetTestTimeFn(fn)`
* **Description:** Sets a custom function to compute the interval between scans.
* **Parameters:**
  - `fn` (`function(inst): number`): Returns the delay in seconds until the next scan.

### `Mine:SetAlignment(alignment)`
* **Description:** Sets the alignment tag to exclude from target detection. Targets matching this alignment tag are ignored.
* **Parameters:**
  - `alignment` (`string`): The alignment string (e.g., `"player"`, `"monster"`).

### `Mine:SetReusable(reusable)`
* **Description:** Controls whether the mine can be reused after springing. Non-reusable mines are tagged `mine_not_reusable`.
* **Parameters:**
  - `reusable` (`boolean`): `true` to allow reuse; `false` to mark as spent.

### `Mine:Reset()`
* **Description:** Resets the mine to its initial ready state (ready to be triggered again). Cancels testing, clears target, and fires the `onreset` callback.
* **Parameters:** None.

### `Mine:StartTesting()`
* **Description:** Begins periodic scanning for targets using `MineTest`. Schedules a periodic task that calls `MineTest` repeatedly.
* **Parameters:** None.

### `Mine:StopTesting()`
* **Description:** Cancels the periodic scanning task, halting target detection.
* **Parameters:** None.

### `Mine:OnEntitySleep()`
* **Description:** Called when the entity goes to sleep (e.g., in sleep mode). Cancels the current test task and schedules a new one with a fixed 10-second interval.
* **Parameters:** None.

### `Mine:OnEntityWake()`
* **Description:** Called when the entity wakes up. Cancels the sleep-mode test task and resumes normal testing using `StartTesting()`.
* **Parameters:** None.

### `Mine:Deactivate()`
* **Description:** Deactivates the mine (e.g., when picked up). Stops testing, sets `inactive = true`, and clears `issprung`.
* **Parameters:** None.

### `Mine:Spring()`
* **Description:** Marks the mine as sprung without detonating it (e.g., if triggered manually). Stops testing, sets `issprung = true`.
* **Parameters:** None.

### `Mine:Explode(target)`
* **Description:** Handles the explosion sequence when a target is found. Sets target, springs the mine, fires the `onexplode` callback, and updates stats.
* **Parameters:**
  - `target` (`Entity?`): The entity that triggered the mine.

### `Mine:GetTarget()`
* **Description:** Returns the most recently detected target.
* **Parameters:** None.

### `Mine:OnSave()`
* **Description:** Returns serializable state data (e.g., `sprung` or `inactive` flags) for saving.
* **Parameters:** None.

### `Mine:OnLoad(data)`
* **Description:** Restores the mine’s state based on saved data. Calls `Spring()`, `Deactivate()`, or `Reset()` as appropriate.
* **Parameters:**
  - `data` (`table?`): The saved state; may contain `{ sprung = true }` or `{ inactive = true }`.

## Events & Listeners
- Listens for `"onputininventory"` → triggers `DoDeactivate`
- Listens for `"onpickup"` → triggers `DoDeactivate`
- Listens for `"teleported"` → triggers `DoDeactivate`