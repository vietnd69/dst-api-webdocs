---
id: workable
title: Workable
description: Manages the work state and completion logic for interactable entities in the game world.
tags: [interaction, repair, inventory, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 99bf54ea
system_scope: entity
---

# Workable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Workable` component defines how an entity responds to being worked on (e.g., chopped, mined, dug) by players or other entities. It tracks work progress (`workleft`), defines whether the entity is currently workable, and integrates with repair, inventory, and tool systems. When `workleft` reaches zero, it triggers finalization callbacks and emits events such as `workfinished`. It also supports state persistence across saves and dynamic behavior via callback functions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("workable")
inst.components.workable:SetMaxWork(20)
inst.components.workable:SetWorkAction(ACTIONS.CHOP)
inst.components.workable:SetOnFinishCallback(function(inst, worker)
    inst:Remove()
end)
```

## Dependencies & tags
**Components used:** `repairable`, `inventory`, `tool`, `diseaseable`  
**Tags:** Adds `workrepairable` and `action.id.."_workable"` (e.g., `"chop_workable"`). Removes them on removal or completion.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `workleft` | number | `10` | Remaining work units needed to finish; clamped or adjusted per `maxwork`. |
| `maxwork` | number | `-1` | Maximum work value; `-1` disables clamping. |
| `action` | `ACTIONS.*` constant | `ACTIONS.CHOP` | Action type used for tag management and events. |
| `workable` | boolean | `true` | Whether the entity can currently be worked. |
| `savestate` | boolean | `false` | Whether work state should be saved. |
| `tough` | boolean | `false` (commented out) | Whether this work requires a tough worker or tool. |
| `lastworktime` | number | `nil` | Timestamp of last work performed (set in `WorkedBy_Internal`). |
| `lastworker` | `inst` | `nil` | Entity that last performed work. |
| `onwork` | function | `nil` | Callback invoked per work tick. |
| `onfinish` | function | `nil` | Callback invoked on work completion. |
| `workmultiplierfn` | function | `nil` | Function to modify `numworks` per call. |
| `shouldrecoilfn` | function | `nil` | Function to handle recoil or tool breakage effects. |
| `onloadfn` | function | `nil` | Callback invoked after loading from save data. |

## Main functions
### `WorkedBy(worker, numworks)`
*   **Description:** Initiates a work action on this entity. Handles tool recoil, applies work amount, and triggers internal processing. Called automatically when a worker interacts.
*   **Parameters:** `worker` (`inst`) - Entity performing the work; `numworks` (number) - Work units to apply.
*   **Returns:** Nothing.
*   **Error states:** Internally calls `WorkedBy_Internal`. No direct error return.

### `WorkedBy_Internal(worker, numworks)`
*   **Description:** Executes the core work logic: reduces `workleft`, emits events, triggers completion callbacks if finished. Not meant for direct external calls.
*   **Parameters:** `worker` (`inst`) - Entity performing work; `numworks` (number, optional, default `1`) - Work units after multiplier and recoil logic.
*   **Returns:** Nothing.
*   **Error states:** Applies clamping logic to `workleft`; if `numworks <= 0` after multiplier, no change occurs.

### `Destroy(destroyer)`
*   **Description:** Immediately completes the work (if possible) by calling `WorkedBy` with current `workleft`.
*   **Parameters:** `destroyer` (`inst`) - Entity performing the destroy action.
*   **Returns:** Nothing.

### `SetWorkable(able)`
*   **Description:** Sets whether this entity can be worked. Triggers tag updates.
*   **Parameters:** `able` (boolean).
*   **Returns:** Nothing.

### `SetWorkLeft(work)`
*   **Description:** Sets `workleft` to `work`, ensuring it is at least `1`. Updates `workable` to `true`. Respects `maxwork` if positive.
*   **Parameters:** `work` (number, optional, default `10`).
*   **Returns:** Nothing.

### `GetWorkLeft()`
*   **Description:** Returns current `workleft` if `workable`, otherwise `0`.
*   **Parameters:** None.
*   **Returns:** number.

### `CanBeWorked()`
*   **Description:** Checks if the entity is currently workable and has remaining work.
*   **Parameters:** None.
*   **Returns:** boolean (`true` if `workable` and `workleft > 0`).

### `SetMaxWork(work)`
*   **Description:** Sets the maximum work value (`maxwork`), clamped to at least `1`.
*   **Parameters:** `work` (number, optional, default `10`).
*   **Returns:** Nothing.

### `SetWorkAction(act)`
*   **Description:** Sets the work action type (e.g., `ACTIONS.CHOP`, `ACTIONS.MINE`), which determines associated tags and event context.
*   **Parameters:** `act` (`ACTIONS.*` constant).
*   **Returns:** Nothing.

### `GetWorkAction()`
*   **Description:** Returns the currently assigned action type.
*   **Parameters:** None.
*   **Returns:** `ACTIONS.*` constant.

### `SetOnWorkCallback(fn)`
*   **Description:** Registers a callback executed on every successful work tick.
*   **Parameters:** `fn` (function) - Signature: `fn(inst, worker, workleft, numworks)`.
*   **Returns:** Nothing.

### `SetOnFinishCallback(fn)`
*   **Description:** Registers a callback executed when work completes (`workleft <= 0`).
*   **Parameters:** `fn` (function) - Signature: `fn(inst, worker)`.
*   **Returns:** Nothing.

### `SetWorkMultiplierFn(fn)`
*   **Description:** Registers a function to scale the `numworks` value per call (e.g., for efficiency modifiers).
*   **Parameters:** `fn` (function) - Signature: `fn(inst, worker, numworks)` → number.
*   **Returns:** Nothing.

### `SetShouldRecoilFn(fn)`
*   **Description:** Registers a function to handle tool/user-specific recoil (e.g., tool durability damage or work loss).
*   **Parameters:** `fn` (function) - Signature: `fn(inst, worker, tool, numworks)` → `recoil: boolean`, `remaining: number`.
*   **Returns:** Nothing.

### `SetRequiresToughWork(tough)`
*   **Description:** Enables/disables the requirement for a tough worker/tool to work this entity.
*   **Parameters:** `tough` (boolean).
*   **Returns:** Nothing.

### `SetOnLoadFn(fn)`
*   **Description:** Registers a callback executed after `OnLoad` completes, allowing custom logic on entity reload.
*   **Parameters:** `fn` (function) - Signature: `fn(inst, data)`.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns serialization data if `savestate` is `true`.
*   **Parameters:** None.
*   **Returns:** table with `{ maxwork, workleft }` or empty table `{}`.

### `OnLoad(data)`
*   **Description:** Restores `workleft` and `maxwork` from saved `data`. Invokes `onloadfn` if present.
*   **Parameters:** `data` (table) - Must contain `workleft` and `maxwork`.
*   **Returns:** Nothing.

### `SetWorkMultiplierFn(fn)`
*   **Description:** Registers a function to scale the `numworks` value per call (e.g., for efficiency modifiers).
*   **Parameters:** `fn` (function) - Signature: `fn(inst, worker, numworks)` → number.
*   **Returns:** Nothing.

### `ShouldRecoil(worker, tool, numworks)`
*   **Description:** Determines whether the worker/tool should recoil (e.g., tool breakage, work lost). Calls `shouldrecoilfn` if defined, otherwise falls back to `tough` flag logic.
*   **Parameters:** `worker` (`inst`), `tool` (`inst` or `nil`), `numworks` (number).
*   **Returns:** `{boolean recoil, number remainingWorks}`.

### `GetDebugString()`
*   **Description:** Returns a debug string summarizing work state.
*   **Parameters:** None.
*   **Returns:** string - e.g., `"workleft: 5 maxwork: 20 workable: true"`.

## Events & listeners
- **Listens to:** None.
- **Pushes:**
  - `worked` - Fired each time work is performed. Payload: `{ worker = worker, workleft = workleft }`.
  - `workfinished` - Fired when `workleft <= 0`. Payload: `{ worker = worker }`.
  - `plantkilled` (world-level) - Fired if entity is a healthy plant. Payload: `{ doer = worker, pos = position, workaction = action }`.
- Worker entities receive:
  - `working` - Payload: `{ target = self.inst }`.
  - `finishedwork` - Payload: `{ target = self.inst, action = action }`.
