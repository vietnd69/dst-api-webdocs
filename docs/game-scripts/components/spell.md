---
id: spell
title: Spell
description: Manages the lifecycle, logic, and serialization of an active spell effect applied to an entity in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: f1e4bb40
---

# Spell

## Overview
The `Spell` component orchestrates the execution and lifecycle of a time-limited spell effect on an entity. It supports deferred execution via callbacks (`OnStart`, `OnTarget`, `OnFinish`), periodic or frame-by-frame logic via `OnUpdate`, and provides save/load compatibility by tracking state and serializing target references.

## Dependencies & Tags
- Uses `inst:StartUpdatingComponent(self)` and `inst:StopUpdatingComponent(self)` to manage its update lifecycle.
- Expects the host `inst` entity to have valid `:HasTag()`, `:Remove()`, and `GUID` access.
- Targets must have a tag matching `spellname` (default `"spell"`) for `SetTarget` to succeed.
- Does not add or remove component tags from the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the entity this component is attached to. |
| `active` | `boolean` | `false` | Whether the spell is currently running. |
| `spellname` | `string` | `"spell"` | Tag name required on a target for `SetTarget` to accept it. |
| `onstartfn` | `function?` | `nil` | Callback invoked when `StartSpell` is called. |
| `onfinishfn` | `function?` | `nil` | Callback invoked when the spell duration expires. |
| `ontargetfn` | `function?` | `nil` | Callback invoked when `SetTarget` is called successfully. |
| `fn` | `function?` | `nil` | Main spell logic callback, called each frame or per period. |
| `resumefn` | `function?` | `nil` | Callback invoked when `ResumeSpell` is called. |
| `target` | `Entity?` | `nil` | The current target entity of the spell. |
| `duration` | `number` | `3` | Total duration (in seconds) before the spell ends. |
| `lifetime` | `number` | `0` | How long (in seconds) the spell has been active. |
| `period` | `number?` | `nil` | Interval (in seconds) between calls to `fn`; `nil` means every frame. |
| `timer` | `number?` | `nil` | Remaining time until next `fn` tick (used when `period` is set). |
| `removeonfinish` | `boolean` | `false` | Whether the host entity should be removed when the spell finishes. |
| `variables` | `table` | `{}` | Custom user-defined data for the spell (not saved across saves). |

## Main Functions

### `OnStart()`
* **Description:** Marks the spell as active and invokes the `onstartfn` callback if defined.
* **Parameters:** None.

### `OnFinish()`
* **Description:** Invokes `onfinishfn`, stops the component from updating, and optionally removes the host entity if `removeonfinish` is true.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called every frame while the spell is active. Updates `lifetime`, manages periodic ticking via `timer` and `period`, and invokes `fn` when triggered. Ends the spell when `lifetime >= duration`.
* **Parameters:**
  * `dt` *(number)*: Delta time since the last frame.

### `OnTarget()`
* **Description:** Invokes the `ontargetfn` callback if defined. Typically called automatically when `SetTarget` succeeds.
* **Parameters:** None.

### `StartSpell()`
* **Description:** Begins the spell's active lifecycle. Validates that a target is set, starts component updates, and triggers `OnStart`.
* **Parameters:** None.

### `ResumeSpell()`
* **Description:** Resumes a spell after loading. Invokes `resumefn` with remaining time, then starts updates again.
* **Parameters:** None.

### `SetVariables(variables)`
* **Description:** Assigns a table of user-defined data to `variables`. Performs type validation.
* **Parameters:**
  * `variables` *(table)*: Custom data to attach to the spell (not persisted across saves).

### `SetTarget(target)`
* **Description:** Sets the spell's target entity. Only accepts targets that possess a tag matching `spellname`, and triggers `OnTarget` on success.
* **Parameters:**
  * `target` *(Entity)*: The entity to target.

### `OnSave()`
* **Description:** Serializes core runtime state (`lifetime`, `timer`, `active`, and optionally `target.GUID`). Returns a data table and a list of referenced GUIDs if the target is non-player.
* **Parameters:** None.
* **Returns:** `data` *(table)*, optionally `entity_refs` *(table of GUIDs)*.

### `OnLoad(data)`
* **Description:** Restores runtime state (`lifetime`, `timer`, `active`) from saved data.
* **Parameters:**
  * `data` *(table?)*: Saved spell state.

### `LoadPostPass(newents, data)`
* **Description:** Resolves deferred target references after world load, restores active state by calling `ResumeSpell`, and validates entity validity.
* **Parameters:**
  * `newents` *(table)*: Table mapping GUIDs to restored entities.
  * `data` *(table)*: Saved spell state.

## Events & Listeners
None identified.