---
id: houndedtarget
title: Houndedtarget
description: Manages weighted targeting modifiers and hound thief status for an entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f37a9309
---

# Houndedtarget

## Overview
This component tracks and aggregates modifiers affecting an entity's target weight (influence on AI targeting priority) and determines whether the entity qualifies as a "hound thief" target, primarily used by the Hounded event logic in *Don't Starve Together*.

## Dependencies & Tags
- Depends on `SourceModifierList` utility class for managing additive and boolean modifiers.
- Does not add or remove tags on its own.
- Relies on the host entity (`inst`) to be a valid component host (e.g.,拥有 `inst:AddComponent` support).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (injected) | Reference to the entity this component is attached to. |
| `target_weight_mult` | `SourceModifierList` | `SourceModifierList(inst)` | Tracks numerical modifiers that scale the entity's base target weight. |
| `hound_thief_sources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks boolean flags indicating if the entity should be treated as a hound thief target. |
| `hound_thief` | `boolean` | `false` | *Deprecated* legacy flag; retained for backward compatibility but should not be used. |

## Main Functions

### `GetTargetWeight()`
* **Description:** Returns the current aggregate target weight modifier applied to the entity. This value is used by targeting AI (e.g., Hounded hounds) to prioritize entities.
* **Parameters:** None.

### `IsHoundThief()`
* **Description:** Returns `true` if the entity is considered a hound thief target, either via active `hound_thief_sources` or the legacy `hound_thief` flag.
* **Parameters:** None.

## Events & Listeners
None. This component does not listen for or push events directly.