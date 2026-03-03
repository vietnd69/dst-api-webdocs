---
id: epicscare
title: Epicscare
description: Triggers a scare effect on nearby entities within a specified radius, excluding certain tags and including only entities matching one of a set of required tags.
tags: [combat, ai, crowd-control]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e9d93700
system_scope: entity
---

# Epicscare

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Epicscare` is a utility component that enables an entity to broadcast a "scare" effect to qualifying nearby entities. It queries entities in a radius using `TheSim:FindEntities`, applying inclusion and exclusion tag filters, then pushes an `epicscare` event to qualifying targets. This is typically used by special abilities or events (e.g., Abigail's summoning, boss alerts) to trigger fear, flee, or disruption behavior in affected creatures.

The component relies on the `health` component to exclude dead entities and respects visibility and self-exclusion checks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("epicscare")
inst.components.epicscare:SetRange(20)
inst.components.epicscare:SetDefaultDuration(3)
inst.components.epicscare:Scare()
```

## Dependencies & tags
**Components used:** `health` (for `IsDead()` check during entity filtering)  
**Tags:** Excludes `epic`, `INLIMBO`; requires at least one of `"_combat"`, `"locomotor"` in target entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `15` | Radius around the owner entity in which to apply the scare effect. |
| `defaultduration` | number | `5` | Default duration (seconds) passed to targets if no explicit duration is provided to `Scare`. |
| `scaremusttags` | table or `nil` | `nil` | Tags that *all* qualifying entities *must* have. |
| `scareexcludetags` | table | `{ "epic", "INLIMBO" }` | Tags that exclude entities from being scared. |
| `scareoneoftags` | table | `{ "_combat", "locomotor" }` | Entities must have *at least one* of these tags to be scared. |

## Main functions
### `SetRange(range)`
* **Description:** Sets the radius (in game units) within which entities will be scanned for scaring.
* **Parameters:** `range` (number) — the new search radius.
* **Returns:** Nothing.

### `SetDefaultDuration(duration)`
* **Description:** Sets the fallback duration (in seconds) to use when `Scare()` is called without an explicit duration argument.
* **Parameters:** `duration` (number) — the new default duration.
* **Returns:** Nothing.

### `Scare(duration)`
* **Description:** Finds and frightens qualifying entities within `range`. Each affected entity receives an `epicscare` event with metadata.
* **Parameters:** `duration` (number, optional) — if omitted, uses `self.defaultduration`.
* **Returns:** Nothing.
* **Error states:** None. Skips entities that are the scare source itself, not visible, or dead (via `health:IsDead()`).

## Events & listeners
- **Pushes:** `epicscare` — sent to each qualifying entity with payload `{ scarer = self.inst, duration = ... }`. Affected entities should have handlers for this event to implement fear behavior (e.g., fleeing, stunned).
- **Listens to:** None.
