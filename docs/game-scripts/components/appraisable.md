---
id: appraisable
title: Appraisable
description: Provides a pluggable appraisal mechanism for entities, allowing custom logic to determine whether a target can be appraised and what happens when appraisal occurs.
tags: [appraisal, utility, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3ca64b3b
system_scope: entity
---

# Appraisable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Appraisable` is a lightweight component that enables entities to define custom appraisal behavior via callback functions. It does not enforce any default appraisal logic but instead exposes two methods—`CanAppraise` and `Appraise`—that delegates to optional callback functions (`canappraisefn` and `appraisefn`). This allows prefabs to easily hook into an appraisal system (e.g., for items like the Geode or鉴定装置-like tools) without modifying core systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("appraisable")

-- Define custom logic
inst.components.appraisable.canappraisefn = function(appraiser, target)
    return target:HasTag("rare") and true or false
end

inst.components.appraisable.appraisefn = function(appraiser, target)
    TheSoundGameThread:PlaySound("pre_mesh/objects/geode_break")
end

-- Later, check and perform appraisal
if inst.components.appraisable:CanAppraise(some_target) then
    inst.components.appraisable:Appraise(some_target)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canappraisefn` | function or `nil` | `nil` | Optional callback `(appraiser, target) -> boolean | string`. If present, used by `CanAppraise` to determine if appraisal is allowed. Returning `false` or a string (failure reason) indicates appraisal is denied; `true` allows it. |
| `appraisefn` | function or `nil` | `nil` | Optional callback `(appraiser, target) -> void`. Executed by `Appraise` to perform the appraisal action (e.g., spawn particles, play sound, update UI). |

## Main functions
### `CanAppraise(target)`
*   **Description:** Checks whether the appraisal is permitted for a given `target`, using the custom `canappraisefn` callback if defined. Returns `true` if no callback is set (default approval).
*   **Parameters:** `target` (Entity) — the entity being appraised.
*   **Returns:** `true`, `false`, or a string (failure reason) — depending on the return value of `canappraisefn`. If `canappraisefn` is `nil`, returns `true`.
*   **Error states:** None. Gracefully handles missing callback by returning `true`.

### `Appraise(target)`
*   **Description:** Executes the appraisal action on the `target`, using the `appraisefn` callback if defined. No-op if no callback is assigned.
*   **Parameters:** `target` (Entity) — the entity being appraised.
*   **Returns:** Nothing.
*   **Error states:** None. Does nothing silently if `appraisefn` is `nil`.

## Events & listeners
None identified
