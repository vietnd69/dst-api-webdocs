---
id: hitcher
title: Hitcher
description: Manages hitching state and tag synchronization for entities that can be hitched to or from other entities.
tags: [hitching, entity, tags, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 66b02d8c
system_scope: entity
---

# Hitcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hitcher` is an entity component responsible for tracking whether an entity is hitched to another entity (e.g., a horse hitched to a hitching post). It maintains local hitching state (`hitched`, `canbehitched`, `locked`) and synchronizes tags (`hitcher`, `hitcher_locked`) based on those states. It coordinates with the `hitchable` component on the target entity to ensure bidirectional hitching consistency.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hitcher")

-- Hitch this entity to a target
local target = prefabs.hitching_post()
inst.components.hitcher:SetHitched(target)

-- Unhitch
inst.components.hitcher:Unhitch()

-- Lock/unlock hitching ability
inst.components.hitcher:Lock(true)
```

## Dependencies & tags
**Components used:** `hitchable` (accessed via `target.components.hitchable`)
**Tags:** Adds/removes `hitcher` (when `canbehitched` changes), `hitcher_locked` (when `locked` changes).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitched` | entity or `nil` | `nil` | Reference to the entity this hitcher is currently attached to. |
| `canbehitched` | boolean | `true` | Whether this hitcher is currently available to be hitched. Set to `false` when hitched; set back to `true` on unhitch. |
| `locked` | boolean | `false` | If `true`, indicates the hitcher is locked (used for visual/tag state; does not prevent hitching itself). |

## Main functions
### `GetHitched()`
* **Description:** Returns the currently hitched entity, if any.
* **Parameters:** None.
* **Returns:** `entity` or `nil`.

### `SetHitched(target)`
* **Description:** Hitchs this entity to the specified `target`. Updates state and notifies the target's `hitchable` component.
* **Parameters:** `target` (entity) — the entity to hitch to.
* **Returns:** Nothing.
* **Error states:** If `target` lacks a `hitchable` component, no bidirectional setup occurs.

### `Unhitch()`
* **Description:** Unhitches this entity, restoring `canbehitched` to `true`. Also unhitches the previously hitched target if it is still locked.
* **Parameters:** None.
* **Returns:** Nothing.
* **Events:** Pushes `unhitched` event upon completion.

### `Lock(setting)`
* **Description:** Sets the `locked` state, which affects tag `hitcher_locked`.
* **Parameters:** `setting` (boolean) — `true` to lock, `false` to unlock.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Prepares save data for persistence. Currently returns an empty table (no state serialized).
* **Parameters:** None.
* **Returns:** `data` (table) — always `{}` in this implementation.

### `OnLoad(data)`
* **Description:** Loads persisted state. Currently a no-op (no state deserialized).
* **Parameters:** `data` (table) — expected to match `OnSave()` output.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly. Tag updates are triggered by property getters/setters defined in the `Class()` definition (via `canbehitched = onhitched`, `locked = onlocked`).
- **Pushes:** `unhitched` — fired during `Unhitch()` after unhitching is complete.
