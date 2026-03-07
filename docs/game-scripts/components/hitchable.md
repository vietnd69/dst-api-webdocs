---
id: hitchable
title: Hitchable
description: Manages the hitched state of an entity, allowing it to be attached to or detached from another entity via a hitching mechanic.
tags: [locomotion, interaction, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: aa144e47
system_scope: entity
---

# Hitchable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hitchable` enables an entity to be hitched to another entity (e.g., a horse to a hitching post). It tracks whether the entity is currently hitched (`self.hitched`) and whether it can be hitched (`self.canbehitched`). The component coordinates sound playback, event listening (for combat target changes), and synchronization with the `hitcher` component on the target entity to ensure consistent hitching behavior on both ends.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hitchable")
-- Later, to hitch this entity to a target:
if target and target.components.hitcher and target.components.hitcher:canbehitched() then
    inst.components.hitchable:SetHitched(target)
end
-- To unhitch:
inst.components.hitchable:Unhitch()
```

## Dependencies & tags
**Components used:** `hitcher` (via `target.components.hitcher`)
**Tags:** Adds/removes `hitched` tag on the entity based on hitch state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitched` | `Entity` or `nil` | `nil` | Reference to the entity this entity is currently hitched to. |
| `canbehitched` | boolean | `true` | Whether the entity is currently available to be hitched. |

## Main functions
### `SetHitched(target)`
*   **Description:** Hitch this entity to the given target entity. Plays the hitching sound, sets `canbehitched` to `false`, and begins listening for the `newcombattarget` event.
*   **Parameters:** `target` (`Entity`) – the entity to hitch to. Must have a `hitcher` component.
*   **Returns:** Nothing.

### `Unhitch()`
*   **Description:** Unhitch this entity from its current target. Plays the unhitching sound, stops listening for `newcombattarget`, resets `canbehitched` to `true`, and also unhitches the target entity if it is not manually unhitched.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetHitch()`
*   **Description:** Returns the entity this entity is currently hitched to.
*   **Parameters:** None.
*   **Returns:** `Entity` or `nil` – the hitched target, or `nil` if not hitched.

### `OnSave()`
*   **Description:** Prepares data for saving the component state. Currently returns an empty table; no persistent state is saved.
*   **Parameters:** None.
*   **Returns:** `table` – an empty table `{}`.

### `OnLoad(data)`
*   **Description:** Restores component state after loading. Currently does nothing; no persistent state is restored.
*   **Parameters:** `data` (`table`) – save data from `OnSave()`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `newcombattarget` – triggers `Unhitch()` when the entity gains a new combat target, ensuring hitching doesn’t interfere with movement or combat.
- **Pushes:** None directly (events like `unhitched` are emitted by the `hitcher` component on the *other* entity when this component calls `hitcher:Unhitch()`).
