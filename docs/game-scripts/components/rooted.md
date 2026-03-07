---
id: rooted
title: Rooted
description: Prevents an entity from moving by stopping physics and applying a speed multiplier of 0 via the locomotor component, while managing lifecycle via sources.
tags: [movement, physics, control]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3b21a10b
system_scope: locomotion
---
# Rooted

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Rooted` component freezes an entity in place by removing its physics body's ability to move and applying a zero speed multiplier through the `locomotor` component. It is typically used to temporarily prevent movement due to effects like entanglement, imprisonment, or stasis. The component tracks external sources that can add or remove the rooted state, and automatically cleans itself when all sources are gone. It also adds/removes the `rooted` tag on the entity and broadcasts `rooted` and `unrooted` events at state transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("rooted")

-- Apply a rooted effect from a specific source (e.g., a trap)
inst.components.rooted:AddSource(my_trap)

-- Remove the effect when the trap is destroyed
inst.components.rooted:RemoveSource(my_trap)
```

## Dependencies & tags
**Components used:** `locomotor`, `Physics`
**Tags:** Adds `rooted`; removes `rooted` on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sources` | table | `{}` | Tracks active sources that keep the entity rooted. Keys are source entities (or `nil`), values are `true`. |

## Main functions
### `AddSource(src)`
* **Description:** Registers a new source that maintains the rooted state. The entity will remain rooted as long as at least one source exists.
* **Parameters:** `src` (entity or any unique reference) — the entity or identifier causing the rooted condition.
* **Returns:** Nothing.
* **Error states:** No-op if `src` is already registered.

### `RemoveSource(src)`
* **Description:** Removes a previously registered source. If no sources remain after removal, the component removes itself from the entity.
* **Parameters:** `src` (entity or any unique reference) — the source to remove.
* **Returns:** Nothing.
* **Error states:** No-op if `src` is not currently registered.

### `OnRemoveFromEntity()`
* **Description:** Called automatically when the component is removed from the entity. Restores movement by removing the `rooted` tag, re-enabling physics mass, and clearing the speed multiplier on `locomotor`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — registered per source entity to auto-cleanup when a source is destroyed.
- **Pushes:** `rooted` — fired once on component addition; `unrooted` — fired once on component removal.
