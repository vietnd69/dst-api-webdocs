---
id: sanityaura
title: Sanityaura
description: Computes and provides sanity-affecting aura values for an entity within a configurable range, applying optional falloff based on distance.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 74bb3dde
---

# Sanityaura

## Overview
This component attaches to an entity to represent a static or dynamic source of sanity-affecting aura (e.g., light sources, ambient structures). It calculates the effective sanity aura delivered to an observer based on distance, supporting custom aura strength and falloff functions. The entity is tagged as `"sanityaura"` while the component is attached.

## Dependencies & Tags
- Adds tag `"sanityaura"` to the entity on construction.
- Removes tag `"sanityaura"` from the entity when removed (via `OnRemoveFromEntity`).
- Relies on external tunings: `TUNING.SANITY_EFFECT_RANGE` for default maximum range.
- Does not declare or use other components directly (e.g., no `health`, `brain`, etc.).

## Properties
| Property      | Type         | Default Value                      | Description |
|---------------|--------------|------------------------------------|-------------|
| `inst`        | `Entity`     | (passed to constructor)            | Reference to the entity the component is attached to. |
| `aura`        | `number`     | `0`                                | Base aura value used when no custom `aurafn` is defined. |
| `max_distsq`  | `number?`    | `nil` (falls back to `SANITY_EFFECT_RANGE_SQ`) | Squared maximum effective distance for aura influence; if `nil`, uses `TUNING.SANITY_EFFECT_RANGE^2`. |
| `aurafn`      | `function?`  | `nil`                              | Optional function `(inst, observer) -> number` that dynamically computes aura value per observer. If `nil`, static `aura` is used. |
| `fallofffn`   | `function?`  | `nil`                              | Optional function `(inst, observer, distsq) -> number` that adjusts the aura based on distance. If `nil`, distance-based division uses `max(1, distsq)`. |

> **Note**: `max_distsq`, `aurafn`, and `fallofffn` are declared as commented-out in the constructor, but they are used in `GetBaseAura()` and `GetAura()`. This implies they may be set externally (e.g., by mods) after construction.

## Main Functions

### `GetBaseAura(observer)`
* **Description:** Returns the raw (unfiltered) aura value at the entity's location, *without* any distance-based falloff applied. Useful for calculating absolute influence or debugging.
* **Parameters:**
  - `observer`: `Entity` — The entity for which aura is being evaluated (may be used by dynamic `aurafn` implementations).

### `GetAura(observer)`
* **Description:** Computes the effective sanity aura delivered to the observer, applying distance-based falloff. Returns `0` if the observer is outside the effective range.
* **Parameters:**
  - `observer`: `Entity` — The entity receiving the aura influence.
* **Implementation Notes:**
  - Computes squared distance (`distsq`) between observer and this entity.
  - If `distsq > max_distsq` (or default `SANITY_EFFECT_RANGE_SQ`), returns `0`.
  - Otherwise, retrieves base aura (via `GetBaseAura(observer)`) and divides by:
    - `fallofffn(inst, observer, distsq)` if provided, otherwise `max(1, distsq)`.

## Events & Listeners
None identified.