---
id: appraisable
title: Appraisable
description: Provides customizable logic for determining if an entity can be appraised and executing the appraisal action.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# appraisable

## Overview
The `appraisable` component allows an entity to define custom logic for how it can be "appraised" by another entity (the `target`). It provides two optional callback functions: one to determine if an appraisal is currently possible (`canappraisefn`), and another to execute the actual appraisal action (`appraisefn`). This makes entities "appraisable" in a highly customizable way, deferring specific appraisal behavior to the entity's configuration.

## Dependencies & Tags
None identified. This component is typically added to an entity, and other systems (e.g., player actions, UI scripts) would then call its methods.

## Properties
| Property         | Type     | Default Value | Description                                                                                                                                                                             |
| :--------------- | :------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canappraisefn`  | `function` | `nil`         | An optional callback function with the signature `function(inst, target)` that determines if `inst` can be appraised by `target`. It should return `true` if appraisal is possible, or `false` (optionally with a failure reason string) otherwise. |
| `appraisefn`     | `function` | `nil`         | An optional callback function with the signature `function(inst, target)` that is executed when `inst` is appraised by `target`. This function defines the specific appraisal effect.     |

## Main Functions
### `CanAppraise(target)`
*   **Description:** Checks whether the entity, `self.inst`, can currently be appraised by the `target` entity. If a `canappraisefn` is defined, it will be called to make this determination. Otherwise, appraisal is always considered possible.
*   **Parameters:**
    *   `target`: The `inst` (entity) attempting to appraise this entity.

### `Appraise(target)`
*   **Description:** Executes the appraisal action for the entity, `self.inst`, by the `target` entity. If an `appraisefn` is defined, it will be called to perform the specific appraisal effect.
*   **Parameters:**
    *   `target`: The `inst` (entity) performing the appraisal.

## Events & Listeners
None identified.