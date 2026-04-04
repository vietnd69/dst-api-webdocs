---
id: appraisable
title: Appraisable
description: Provides callback hooks for entities to validate and perform appraisal actions on targets.
tags: [interaction, utility, callback]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 3ca64b3b
system_scope: entity
---

# Appraisable

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Appraisable` is a lightweight component that defines custom logic for appraisal interactions. It does not implement appraisal behavior itself but instead exposes two callback fields (`canappraisefn` and `appraisefn`) that prefab scripts must populate. This allows different entities to define unique conditions for when they can appraise a target and what occurs when the appraisal succeeds.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("appraisable")

-- Define validation logic
inst.components.appraisable.canappraisefn = function(inst, target)
    return target:IsValid() and not target:IsInLimbo()
end

-- Define action logic
inst.components.appraisable.appraisefn = function(inst, target)
    inst.components.inspectable:ShowInspectionText(target)
end

-- Check and execute
if inst.components.appraisable:CanAppraise(target) then
    inst.components.appraisable:Appraise(target)
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canappraisefn` | function | `nil` | Custom function to validate if a target can be appraised. |
| `appraisefn` | function | `nil` | Custom function executed when an appraisal occurs. |
| `inst` | entity | `nil` | The entity instance that owns this component. |

## Main functions
### `CanAppraise(target)`
*   **Description:** Checks if the entity is allowed to appraise the specified target. If `canappraisefn` is set, it calls that function; otherwise, it returns `true` by default.
*   **Parameters:** `target` (entity) - The entity instance to evaluate for appraisal.
*   **Returns:** `boolean` - `true` if appraisal is allowed, `false` otherwise.
*   **Error states:** Returns `true` if `canappraisefn` is not defined.

### `Appraise(target)`
*   **Description:** Executes the appraisal action on the specified target. If `appraisefn` is set, it calls that function; otherwise, nothing happens.
*   **Parameters:** `target` (entity) - The entity instance to appraise.
*   **Returns:** Nothing.
*   **Error states:** Silently exits if `appraisefn` is not defined.

## Events & listeners
None identified.