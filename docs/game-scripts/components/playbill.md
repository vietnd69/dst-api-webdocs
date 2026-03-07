---
id: playbill
title: Playbill
description: Manages state for a theatrical playbill, tracking the current act and persisting it across save/load cycles.
tags: [theatre, save, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e62d69fd
system_scope: entity
---

# Playbill

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Playbill` is a simple state-holding component used to track the current act of a theatrical performance, such as for the Beefalo Zoo minigame. It is attached to an entity (typically a `playbill` prefab) and supports saving and loading its state via the `OnSave` and `OnLoad` methods. It does not manage logic, timing, or演出 flow — only persists the selected act.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playbill")
inst.components.playbill:SetCurrentAct("act2")
-- State will be automatically saved/loaded during game save/load
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scripts` | table | `{}` | Reserved for script references (not used in current implementation). |
| `costumes` | table | `{}` | Reserved for costume references (not used in current implementation). |
| `starting_act` | any | `nil` | Reserved for initial act value (not used in current implementation). |
| `current_act` | any | `nil` | The currently active act in the playbill. |
| `book_build` | any | `nil` | Reserved for build metadata (not used in current implementation). |

## Main functions
### `SetCurrentAct(act)`
*   **Description:** Sets the `current_act` field to the specified act identifier.
*   **Parameters:** `act` (any) — the act to set as current (e.g., a string like `"act1"` or `nil`).
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns a serializable table containing the component’s state for savegames.
*   **Parameters:** None.
*   **Returns:** Table — `{ current_act = self.current_act }`, or `{ current_act = nil }` if `self.current_act` is `nil`.

### `OnLoad(data)`
*   **Description:** Restores the component’s state from a savegame data table.
*   **Parameters:** `data` (table or `nil`) — the data table returned by `OnSave()`.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores malformed or missing `data` — only updates `self.current_act` if `data.current_act` is present.

## Events & listeners
None identified
