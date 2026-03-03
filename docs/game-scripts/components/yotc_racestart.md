---
id: yotc_racestart
title: Yotc Racestart
description: Manages race state transitions and callback hooks for a yotc race event on an entity.
tags: [race, state, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 4d20c9fa
system_scope: world
---

# Yotc Racestart

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`YOTC_RaceStart` is a lightweight component that tracks and controls the lifecycle of a race event for its owner entity. It maintains optional callback functions for race start and end, manages the `race_on` tag, and registers the `yotc_racestart` tag on initialization. It is typically attached to entities that initiate or signal the beginning of a race sequence, such as a race trigger or checkpoint.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yotc_racestart")

inst.components.yotc_racestart.onstartracefn = function(e)
    print("Race started for", e:GetDebugName())
end

inst.components.yotc_racestart.onendracefn = function(e)
    print("Race ended for", e:GetDebugName())
end

inst.components.yotc_racestart:StartRace()
-- ... later ...
inst.components.yotc_racestart:EndRace()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `yotc_racestart` on init; adds/removes `race_on` during start/end.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onstartracefn` | function? | `nil` | Optional callback invoked when `StartRace()` is called. Receives `inst` as argument. |
| `onendracefn` | function? | `nil` | Optional callback invoked when `EndRace()` is called. Receives `inst` as argument. |
| `rats` | table | `{}` | Reserved field (unused in current implementation). |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleanup method called when the component is removed from its entity. Removes the `yotc_racestart` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartRace()`
*   **Description:** Initiates the race state: invokes the `onstartracefn` callback (if set), and adds the `race_on` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EndRace()`
*   **Description:** Terminates the race state: invokes the `onendracefn` callback (if set), and removes the `race_on` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CanInteract()`
*   **Description:** Returns `true` if the entity is *not* currently in a race (`race_on` tag is absent); otherwise returns `nil`.
*   **Parameters:** None.
*   **Returns:** `true` or `nil`.
*   **Error states:** Returns `nil` when `race_on` tag is present — this indicates the entity cannot be interacted with (e.g., locked during race).

## Events & listeners
None.
