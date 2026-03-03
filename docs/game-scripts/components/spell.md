---
id: spell
title: Spell
description: Manages the lifecycle, update loop, and behavior of a spell effect on an entity, including start/finish callbacks, periodic ticking, and save/load support.
tags: [combat, ai, effect, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f1e4bb40
system_scope: entity
---

# Spell

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Spell` is a reusable component for implementing time-limited, potentially target-based effects on entities. It handles the core lifecycle: initialization, start, periodic updates (frame-based or periodic), and termination (including optional removal of the spell's entity). It supports callback functions for key events (`onstart`, `onfinish`, `ontarget`, `onupdate`, `onresume`) and integrates with DST's save/load system by serializing state and restoring target references via `LoadPostPass`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("spell")

inst.components.spell.duration = 5
inst.components.spell.fn = function(self, target) 
    print("Spell ticking")
end
inst.components.spell.onstartfn = function(inst) 
    print("Spell started")
end
inst.components.spell.onfinishfn = function(inst) 
    print("Spell finished")
end

inst.components.spell:SetTarget(some_target_entity)
inst.components.spell:StartSpell()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `spellname` tag on target entity (`self.spellname`, default `"spell"`). Uses `player` tag to avoid GUID serialization for players.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `false` | Whether the spell is currently running and being updated. |
| `spellname` | string | `"spell"` | Tag name used to validate the target entity. |
| `onstartfn` | function? | `nil` | Called once when `StartSpell` is invoked. |
| `onfinishfn` | function? | `nil` | Called once when the spell duration expires. |
| `ontargetfn` | function? | `nil` | Called once when a valid target is assigned via `SetTarget`. |
| `fn` | function? | `nil` | Called each update cycle (frame or period-based) during the spell's lifetime. |
| `resumefn` | function? | `nil` | Called when `ResumeSpell` is invoked, with `timeleft` (number) as argument. |
| `target` | Entity? | `nil` | The target entity for the spell. Must have the `spellname` tag. |
| `duration` | number | `3` | Total lifetime of the spell in seconds. |
| `lifetime` | number | `0` | Accumulated time (in seconds) the spell has been alive. |
| `period` | number? | `nil` | Interval (in seconds) between `fn` calls. If `nil`, `fn` runs every frame. |
| `timer` | number? | `nil` | Internal counter used when `period` is set; resets to `period` after each tick. |
| `removeonfinish` | boolean | `false` | If `true`, the spell's entity (`self.inst`) is removed when `OnFinish` is called. |
| `variables` | table | `{}` | User-defined storage for spell-specific data (e.g., FX, damage). Not saved. |

## Main functions
### `OnStart()`
*   **Description:** Marks the spell as active and invokes `onstartfn` if defined. Called automatically by `StartSpell`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnFinish()`
*   **Description:** Stops the spell from updating, calls `onfinishfn`, and optionally removes the spell's entity if `removeonfinish` is true.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** The core update loop. Accumulates `lifetime`, handles the `timer` for periodic ticking, and invokes `fn` when due. Triggers `OnFinish` when duration is exceeded.
*   **Parameters:** `dt` (number) — Delta time in seconds since last frame.
*   **Returns:** Nothing.

### `OnTarget()`
*   **Description:** Invokes `ontargetfn` if defined, after successfully setting a target that has the required tag. Called automatically by `SetTarget`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartSpell()`
*   **Description:** Begins the spell by starting updates and calling `OnStart`. Requires a valid `target` (not `nil`) to proceed.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `target` is `nil`; does nothing.

### `ResumeSpell()`
*   **Description:** Restarts the spell's update loop after a save/load cycle or interruption. If `resumefn` is defined, it is called with the remaining time (`duration - lifetime`) before updates resume.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetVariables(variables)`
*   **Description:** Assigns user data to `self.variables`. Typically used to pass configuration (e.g., damage, FX prefabs) to the spell logic.
*   **Parameters:** `variables` (table) — Table of key-value pairs to store. Must be a table.
*   **Returns:** Nothing.
*   **Error states:** Prints a warning to console and returns early if `variables` is not a table.

### `SetTarget(target)`
*   **Description:** Assigns a target entity to the spell, provided it has the required tag (`spellname`). Automatically calls `OnTarget` on success.
*   **Parameters:** `target` (Entity) — The entity to target.
*   **Returns:** Nothing.
*   **Error states:** Does nothing and does not set `target` if `target:HasTag(self.spellname)` returns `false`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

### `OnSave()`
*   **Description:** Serializes state (`lifetime`, `timer`, `active`) and, if `target` is a non-player entity, stores the target's GUID. Returns data and optional GUIDs for dependency resolution.
*   **Parameters:** None.
*   **Returns:** `{ lifetime: number, timer: number?, active: boolean }` (and `{ target: GUID }`, `{ target_GUID }` if non-player target).

### `OnLoad(data)`
*   **Description:** Restores state (`lifetime`, `timer`, `active`) from saved `data`.
*   **Parameters:** `data` (table?) — Saved state data (may be `nil`).
*   **Returns:** Nothing.

### `LoadPostPass(newents, data)`
*   **Description:** Resolves the saved target GUID using `newents`, restores it via `SetTarget`, and resumes the spell if active.
*   **Parameters:** `newents` (table) — Table of deserialized entities indexed by GUID; `data` (table) — Loaded spell data.
*   **Returns:** Nothing.
