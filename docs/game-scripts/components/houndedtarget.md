---
id: houndedtarget
title: Houndedtarget
description: Manages weighting for entity selection as a hound target and tracks sources that qualify it as a hound thief.
tags: [ai, combat, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f37a9309
system_scope: entity
---

# Houndedtarget

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Houndedtarget` is a lightweight component that enables an entity to be evaluated as a target for hounds during hound attacks. It maintains two key values: a target weight multiplier (used to influence how likely the entity is to be chosen by hounds) and a list of sources that make the entity a hound thief. The component uses `SourceModifierList` to aggregate weighted contributions and supports backward compatibility with a legacy boolean flag (`hound_thief`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("houndedtarget")
inst.components.houndedtarget:AddTargetWeight(1.5)
inst.components.houndedtarget:AddHoundThiefSource("player", true)
local weight = inst.components.houndedtarget:GetTargetWeight()
local is_thief = inst.components.houndedtarget:IsHoundThief()
```

## Dependencies & tags
**Components used:** None (uses `SourceModifierList` utility but does not require it as a component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target_weight_mult` | `SourceModifierList` | `new SourceModifierList(inst)` | Aggregates modifiers affecting how strongly the entity is targeted by hounds. |
| `hound_thief_sources` | `SourceModifierList` | `new SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks sources that mark the entity as a hound thief; uses boolean mode (any source enables thief status). |
| `hound_thief` | boolean | `false` | Legacy flag for backward compatibility; deprecated. |

## Main functions
### `GetTargetWeight()`
*   **Description:** Returns the current cumulative target weight multiplier for this entity.
*   **Parameters:** None.
*   **Returns:** `number` — The weighted multiplier value; used by the hound AI to probabilistically select targets.
*   **Error states:** Returns `0` if no modifiers have been added.

### `IsHoundThief()`
*   **Description:** Determines whether the entity should be treated as a hound thief.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if *any* source in `hound_thief_sources` is active or if the deprecated `hound_thief` flag is `true`.
*   **Error states:** Returns `false` if no thief sources are active and `hound_thief` is `false`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
