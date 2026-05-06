---
id: hitchable
title: Hitchable
description: Manages hitching behavior for entities that can be tethered to hitching posts or similar structures.
tags: [entity, interaction, year-of-the-beefalo]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 56528b0b
system_scope: entity
---

# Hitchable

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Hitchable` enables an entity to be hitched to a hitching post or similar structure. It tracks the hitched target entity, manages the `hitched` tag based on hitching state, and automatically unhitches when the entity acquires a new combat target. This component works in tandem with the `Hitcher` component on hitching posts to maintain bidirectional hitch relationships.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hitchable")

-- Hitch to a target entity
inst.components.hitchable:SetHitched(hitching_post)

-- Check current hitch status
local target = inst.components.hitchable:GetHitch()

-- Manually unhitch
inst.components.hitchable:Unhitch()
```

## Dependencies & tags
**Components used:**
- `SoundEmitter` -- plays hitching/unhitching sound effects via `self.inst.SoundEmitter:PlaySound()`
- `hitcher` -- accessed on hitched target to maintain bidirectional hitch state

**Tags:**
- `hitched` -- added when `canbehitched` is false, removed when true (managed by property watcher)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitched` | entity | `nil` | The entity this instance is currently hitched to. |
| `canbehitched` | boolean | `true` | Whether this entity can be hitched. Assignment triggers `onhitchable` watcher to update the `hitched` tag. |

## Main functions
### `SetHitched(target)`
* **Description:** Hitches this entity to the specified target. Plays hitching sound, registers combat target event listener, sets `canbehitched` to false (which adds the `hitched` tag via property watcher), and stores the target reference. Note: target should have hitcher component to avoid crash when Unhitch() is called later.
* **Parameters:** `target` -- entity instance to hitch to
* **Returns:** nil
* **Error states:** None

### `Unhitch()`
* **Description:** Unhitches this entity from its current target. Plays unhitching sound, removes the combat target event listener, sets `canbehitched` to true (which removes the `hitched` tag via property watcher), and recursively unhitches the target if it has a `hitcher` component that is not hitchable.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.hitched` exists but lacks a `hitcher` component (nil dereference on `self.hitched.components.hitcher` -- no guard present).

### `GetHitch()`
* **Description:** Returns the entity this instance is currently hitched to.
* **Parameters:** None
* **Returns:** entity instance or `nil` if not hitched
* **Error states:** None

### `OnSave()`
* **Description:** Save lifecycle hook. Returns an empty table as this component does not persist hitch state across saves.
* **Parameters:** None
* **Returns:** empty table `{}`
* **Error states:** None

### `OnLoad(data)`
* **Description:** Load lifecycle hook. Does not restore any state from saved data.
* **Parameters:** `data` -- saved data table (ignored)
* **Returns:** None
* **Error states:** None

### `onhitchable(self)` (local)
* **Description:** Property watcher callback triggered when `canbehitched` is assigned. Adds the `hitched` tag when `canbehitched` is false, removes it when true.
* **Parameters:** `self` -- component instance
* **Returns:** None
* **Error states:** None

### `onnewtarget(inst)` (local)
* **Description:** Event callback triggered when the entity acquires a new combat target. Automatically calls `Unhitch()` to prevent hitched entities from engaging in combat.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `inst` does not have a `hitchable` component (nil dereference on `inst.components.hitchable` -- no guard present).

## Events & listeners
- **Listens to:** `newcombattarget` -- triggers `onnewtarget` to automatically unhitch when entity acquires a combat target; removed on `Unhitch()`
- **Pushes:** None identified