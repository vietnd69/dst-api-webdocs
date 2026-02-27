---
id: workable
title: Workable
description: Provides an entity with the ability to be worked on by players (e.g., chopped, mined, planted), tracking remaining work progress and triggering callbacks upon completion.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 99bf54ea
---

# Workable

## Overview
The `Workable` component enables entities (e.g., trees, rocks, crops) to be acted upon by players through manual labor or tools. It manages work progress (`workleft`), defines what action is required (e.g., chopping, mining), and handles progress decrement, completion callbacks, and state persistence. It also manages entity tags (e.g., `"chop_workable"`) for UI and logic integration, and integrates with recoil and work multiplier systems.

## Dependencies & Tags
- **Component Dependencies**: None directly required (but typically used alongside `repairable`, `inventory`, `tool`, `diseaseable`, or `plant` components in practice).
- **Tags Added/Removed**:
  - `"workrepairable"` (added/removed by `onworkable` or `OnRemoveFromEntity` when `repairable` exists and conditions are met).
  - `<action.id>_workable` (e.g., `"chop_workable"`) — added/removed based on `workleft > 0` and `workable` state; managed dynamically when `workleft`, `maxwork`, `workable`, or `action` changes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `workleft` | `number` | `10` | Remaining work units needed to finish; reduced on each successful work action. |
| `maxwork` | `number` | `-1` | Maximum work units for the entity. If `<= 0`, `workleft` is not clamped to a cap. When `> 0`, `workleft` is clamped between `1` and `maxwork`. |
| `action` | `Action` | `ACTIONS.CHOP` | The action type (e.g., chop, mine, dig) the entity responds to. |
| `workable` | `boolean` | `true` | Whether the entity can currently be worked on. |
| `savestate` | `boolean` | `false` | Whether the component’s state (`workleft`, `maxwork`) should be saved to disk. |
| `tough` | `boolean` | `nil` | Optional flag indicating if *tough worker* capability is required (via `SetRequiresToughWork`). Not set by default. |

*Note:* Other fields like `onwork`, `onfinish`, `workmultiplierfn`, `shouldrecoilfn`, and `onloadfn` are internal callbacks or functions, not serialized state properties.

## Main Functions

### `Workable:Destroy(destroyer)`
* **Description:** Forces completion of remaining work, triggering `WorkedBy` and potentially `onfinish` if `CanBeWorked()` returns true. Used when an entity is destroyed (e.g., by an action that bypasses full work cycles).
* **Parameters:**
  - `destroyer`: The `GameObject` performing the destruction.

### `Workable:WorkedBy(worker, numworks)`
* **Description:** Handles a work attempt by a worker (typically a player). Applies tool/recoil logic and reduces `workleft`. Calls internal logic (`WorkedBy_Internal`), triggers events (`"worked"`, `"working"`), and fires callbacks.
* **Parameters:**
  - `worker`: The `GameObject` performing the work.
  - `numworks`: Number of work units to apply (may be adjusted by multiplier/recoil logic). Default: `1`.

### `Workable:WorkedBy_Internal(worker, numworks)`
* **Description:** Core logic for decrementing work progress (after recoil checks). Handles floating-point precision, updates `lastworktime` and `lastworker`, fires `"worked"`/`"working"` events, and fires `onwork` callback. If `workleft <= 0` afterward, triggers `"workfinished"` and `onfinish` callback.
* **Parameters:**
  - `worker`: The `GameObject` performing work.
  - `numworks`: Work units to deduct (may be fractional).

### `Workable:SetWorkLeft(work)`
* **Description:** Sets `workleft` to a clamped value (if `maxwork > 0`) or at least `1`. Also forces `workable = true`.
* **Parameters:**
  - `work`: Desired work value. Defaults to `10` if `nil`.

### `Workable:CanBeWorked()`
* **Description:** Returns `true` if `workable` and `workleft > 0`.
* **Returns:** `boolean`.

### `Workable:GetWorkLeft()`
* **Description:** Returns current `workleft` if `workable`; otherwise returns `0`.
* **Returns:** `number`.

### `Workable:SetWorkable(able)`
* **Description:** Sets the `workable` state flag. Automatically updates `"workrepairable"` and `"<action>_workable"` tags.
* **Parameters:**
  - `able`: `true` to make the entity workable; `false` to disable.

### `Workable:SetMaxWork(work)`
* **Description:** Sets the maximum work value (minimum `1`). Resets `workleft` via `SetWorkLeft` if updated (implicitly clamped).
* **Parameters:**
  - `work`: Desired max work value.

### `Workable:SetWorkAction(act)`
* **Description:** Updates the `action` field (e.g., `ACTIONS.DIG`) and refreshes associated tags (`"<action.id>_workable"`).
* **Parameters:**
  - `act`: The new `Action` object.

### `Workable:GetWorkAction()`
* **Description:** Returns the current `action`.
* **Returns:** `Action`.

### `Workable:SetOnWorkCallback(fn)`
* **Description:** Registers a function to be called every time work is performed (i.e., inside `WorkedBy_Internal` before completion).
* **Parameters:**
  - `fn`: Function `(inst, worker, workleft, numworks)`.

### `Workable:SetOnFinishCallback(fn)`
* **Description:** Registers a function to be called when `workleft` reaches `0`.
* **Parameters:**
  - `fn`: Function `(inst, worker)`.

### `Workable:SetRequiresToughWork(tough)`
* **Description:** Enables/disables the "tough work" requirement. If `true`, only entities with `"toughworker"` tag or tools with `"tough"` capability can work without recoil (zero work applied).
* **Parameters:**
  - `tough`: `true` to enforce tough work requirement.

### `Workable:SetWorkMultiplierFn(fn)`
* **Description:** Sets a custom multiplier function for work input (e.g., tool efficiency). Takes `(inst, worker, numworks)` and returns a multiplier.
* **Parameters:**
  - `fn`: Function returning a numeric multiplier.

### `Workable:SetShouldRecoilFn(fn)`
* **Description:** Registers a custom recoil function that may reduce or cancel work input.
* **Parameters:**
  - `fn`: Function `(inst, worker, tool, numworks)` returning `(recoil: boolean, remainingworks: number)`.

### `Workable:OnSave()`
* **Description:** Returns a table with `workleft` and `maxwork` if `savestate` is `true`; otherwise `{}`. Used for serialization.
* **Returns:** `table`.

### `Workable:OnLoad(data)`
* **Description:** Restores `workleft` and `maxwork` from `data`, then calls `onloadfn` if set.
* **Parameters:**
  - `data`: Table with optional `workleft` and `maxwork` keys.

### `Workable:GetDebugString()`
* **Description:** Returns a debug-friendly string summary (e.g., `"workleft: 5 maxwork: -1 workable: true"`).
* **Returns:** `string`.

### `Workable:OnRemoveFromEntity()`
* **Description:** Cleans up entity tags (`"workrepairable"` and `"<action.id>_workable"`) on component removal.

### `Workable:ShouldRecoil(worker, tool, numworks)`
* **Description:** Checks if recoil should occur (e.g., non-tough worker on tough work, or custom logic). Returns `(recoil, remainingworks)`.
* **Parameters:**
  - `worker`: The `GameObject` attempting work.
  - `tool`: Tool in hands (`nil` if none).
  - `numworks`: Raw work input.
* **Returns:** `boolean, number` — `recoil` flag and adjusted `remainingworks`.

## Events & Listeners
- **Events Listen For / Trigger**:
  - Listens for property changes on `workleft`, `maxwork`, `action`, and `workable` (via `Class` field listeners: `onworkable`, `onaction`), updating tags automatically.
  - Emits events on work activity:
    - `"worked"` (on `self.inst`): `{ worker = worker, workleft = self.workleft }`
    - `"working"` (on `worker`): `{ target = self.inst }`
    - `"workfinished"` (on `self.inst`): `{ worker = worker }`
    - `"finishedwork"` (on `worker`): `{ target = self.inst, action = self.action }`
    - `"plantkilled"` (on `TheWorld`): `{ doer = worker, pos = pos, workaction = self.action }` — only for valid plants.