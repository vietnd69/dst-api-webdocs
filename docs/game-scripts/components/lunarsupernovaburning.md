---
id: lunarsupernovaburning
title: Lunarsupernovaburning
description: Applies periodic damage and visual effects to an entity based on nearby sources marked with the "supernovaburning" state tag during the Alter Guardian's Phase 4 lunar supernova mechanic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: aea6a6b8
---

# Lunarsupernovaburning

## Overview
This component manages the lunar burn effect applied during the Alter Guardian's Phase 4 (supernova) mechanic in DST. It tracks sources of "supernovaburning" state, spawns and positions associated visual effects, and periodically inflicts damage on both the entity and its mount (if any), scaled by the number of valid burning sources.

## Dependencies & Tags
- Requires components: `health`, `rider` (optional), `colouradder` (added dynamically), `grogginess` (optional, updated conditionally)
- Adds/removes tags: None (does not modify entity tags directly)
- Removes itself via `inst:RemoveComponent("lunarsupernovaburning")` when no sources remain or the entity becomes invalid/unargetable

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (injected by Class) | The entity this component is attached to |
| `sources` | `table` | `{}` | Map of active sources (keys are entities with "supernovaburning" state) to their visual effect prefabs |
| `firsttick` | `boolean` | `true` | Tracks if this is the first update tick; reset to `nil` after first damage application |
| `wasdamaging` | `boolean` | `false` | Indicates whether damage was applied in the previous update tick |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed: unregisters lunar burn source from health, removes visual tint, and removes all associated visual effect prefabs.
* **Parameters:** None (implicit `self`)

### `GetFxSize()`
* **Description:** Determines the appropriate visual effect size (`small`, `med`, or `large`) and radius based on the entity's physics radius and tags (e.g., `"epic"`, `"largecreature"`), considering mounted entities when applicable.
* **Parameters:** None (implicit `self`)
* **Returns:** Two values: a string (`"small"`, `"med"`, `"large"`) and a numeric radius.

### `AddSource(source)`
* **Description:** Registers a new source entity (expected to have `"supernovaburning"` state) and spawns a corresponding visual effect prefab (`alterguardian_lunar_supernova_burn_fx`). Positions the effect based on relative location during the next update.
* **Parameters:**
  * `source` (`Entity`): The entity being tracked as a lunar burn source.

### `OnUpdate(dt)`
* **Description:** Core logic called every tick. Validates active sources (removing invalid or out-of-range ones), updates visual effect positions, and applies periodic damage and grogginess effects when sources are present. Removes itself if no valid sources remain or the entity becomes untargetable.
* **Parameters:**
  * `dt` (`number`): Delta time (unused explicitly; tick-based logic dominates).

## Events & Listeners
* Listens for component removal via `OnRemoveFromEntity()` (called automatically by the ECS on component removal)
* Does not listen for game events (e.g., via `inst:ListenForEvent`)
* Does not push custom events via `inst:PushEvent`