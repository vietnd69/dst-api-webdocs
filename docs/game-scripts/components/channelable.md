---
id: channelable
title: Channelable
description: Manages entity channeling behavior, supporting single or multiple simultaneous channelers with state transition control.
tags: [channeling, state, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 734b1a1b
system_scope: entity
---

# Channelable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Channelable` manages the channeling state of an entity—enabling or disabling it from being a channel target, tracking active channelers, and coordinating state graph transitions. It supports both single-channeler (exclusive) and multi-channeler (non-exclusive) modes. The component integrates with the entity's state graph (`sg`) to drive visual and logical channeling states (`prechanneling`, `channeling`, `stopchanneling`) via long actions or custom functions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("channelable")

-- Enable multi-channeling
inst.components.channelable:SetMultipleChannelersAllowed(true)

-- Set up channel start/stop callbacks
inst.components.channelable:SetChannelingFn(
    function(target, channeler) print("Start channeling:", channeler:GetDebugString()) end,
    function(target, aborted, channeler) print("Stop channeling:", channeler:GetDebugString()) end
)

-- A channeler begins channeling
local channeler = some_entity
channeler.sg:GoToState("prechanneling")
inst.components.channelable:StartChanneling(channeler)

-- Later, stop channeling
inst.components.channelable:StopChanneling(false, channeler)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `channelable`, `channeled`, `use_channel_longaction`, `multichannelable`. Tags reflect current channeling capability and active state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the entity can accept channeling. |
| `channeler` | entity or `nil` | `nil` | Single active channeler when `multichannelersallowed` is `false`. |
| `multichannelers` | table or `nil` | `nil` | Map of channelers when `multichannelersallowed` is `true`. |
| `use_channel_longaction` | boolean or `nil` | `nil` | Whether long actions must use the channeling state flow. |
| `multichannelersallowed` | boolean | `nil` (initially `false`) | If `true`, allows multiple channelers simultaneously. |
| `skip_state_channeling` | boolean (inherited) | `nil` | If `true`, skips auto-`GoToState("channeling")` on start. |
| `skip_state_stopchanneling` | boolean (inherited) | `nil` | If `true`, skips auto-`GoToState("stopchanneling")` on stop. |

## Main functions
### `SetMultipleChannelersAllowed(allowed)`
*   **Description:** Enables or disables multi-channeling mode. Switching from multi to single mode immediately clears all channelers.
*   **Parameters:** `allowed` (boolean) – if `true`, allows multiple channelers; otherwise, enforces exclusive channeling.
*   **Returns:** Nothing.

### `SetEnabled(enabled)`
*   **Description:** Sets whether the entity can be channeled.
*   **Parameters:** `enabled` (boolean) – new enabled state.
*   **Returns:** Nothing.

### `GetEnabled()`
*   **Description:** Returns whether the entity is currently channelable.
*   **Parameters:** None.
*   **Returns:** boolean – `true` if enabled, otherwise `false`.

### `SetChannelingFn(startfn, stopfn)`
*   **Description:** Registers optional callback functions invoked when channeling starts or stops.
*   **Parameters:**  
  - `startfn` (function or `nil`) – called as `startfn(target, channeler)` when channeling begins.  
  - `stopfn` (function or `nil`) – called as `stopfn(target, aborted, channeler)` when channeling ends.
*   **Returns:** Nothing.

### `IsChanneling(targetchanneler)`
*   **Description:** Checks whether the specified channeler (or any channeler) is currently channeling this entity.
*   **Parameters:** `targetchanneler` (entity or `nil`) – if provided, checks only that channeler; otherwise, checks all.
*   **Returns:** boolean – `true` if the channeler(s) are in the `channeling` state.
*   **Error states:** Returns `false` if `targetchanneler.sg` is `nil` or does not have the `"channeling"` state tag.

### `StartChanneling(channeler)`
*   **Description:** Begins channeling from the given `channeler` onto this entity, assuming all conditions are met.
*   **Parameters:** `channeler` (entity) – the entity attempting to channel this one.
*   **Returns:** boolean – `true` if channeling started successfully; `false` otherwise.
*   **Error states:** Returns `false` if `enabled` is `false`, channeling is already active (unless `ignore_prechannel` is `true`), `channeler.sg` is `nil`, or `channeler` is not in `prechanneling` state (unless `skip_state_channeling` is `true`).

### `StopChanneling(aborted, targetchanneler)`
*   **Description:** Ends channeling for the specified channeler (or all channelers if omitted), triggering cleanup and state transitions.
*   **Parameters:**  
  - `aborted` (boolean) – whether channeling was interrupted.  
  - `targetchanneler` (entity or `nil`) – specific channeler to stop; if `nil`, stops all channelers in multi-mode.
*   **Returns:** Nothing.
*   **Error states:** Safe to call multiple times; no-op if no active channeling matches.

### `OnUpdate(dt)`
*   **Description:** Periodic check during channeling to ensure the channeling state is still valid; stops channeling if not.
*   **Parameters:** `dt` (number) – time elapsed since last frame.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable status string for debugging.
*   **Parameters:** None.
*   **Returns:** string – `"Channeling"` or `"Not Channeling"`.

## Events & listeners
- **Listens to:** `onremove` (on channeler entities) – triggers `onremovechanneler` callback to clean up references when a channeler is destroyed.
- **Pushes:** No events directly via `PushEvent`; but triggers side effects (e.g., state graph transitions, callback invocations).
