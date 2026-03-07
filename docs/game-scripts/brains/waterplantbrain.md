---
id: waterplantbrain
title: Waterplantbrain
description: Controls the decision-making logic for water plants, determining behavior states such as emergency pollen spraying, stage-specific combat, and cloud spraying based on internal state and environmental conditions.
tags: [ai, environment, combat, boss]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: ba74f6dc
---

# Waterplantbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `WaterplantBrain` component defines the behavior tree logic for water plant entities (e.g., bosses like the Ancient Water Plant). It orchestrates decision-making via a priority-based behavior tree (BT), selecting actions such as emergency cloud spraying, stage-specific attacks, and face-targeting behaviors. This component is attached to entities that have a `_stage` property and `burnable`, `health`, and `sleeper` components, and it relies heavily on state checks from these dependencies to guide behavior transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("waterplantbrain")
inst._stage = 3 -- Example: Fully open stage
inst._can_cloud = true

-- The brain automatically begins executing its behavior tree on `OnStart`
inst:DoTaskInTime(0, function() inst.components.waterplantbrain:OnStart() end)
```

## Dependencies & tags
**Components used:**
- `burnable`: Calls `IsBurning()`, `IsSmoldering()` for emergency cloud logic.
- `health`: Calls `IsDead()` to prevent cloud spraying while dead.
- `sleeper`: Calls `IsAsleep()` to suppress cloud spraying while asleep.

**Tags:** This component does not directly add or remove tags. It *checks* the `"notarget"` tag on potential targets via `target:HasTag("notarget")`, but does not manage it.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._stage` | number | N/A | Current stage of the water plant. Controls whether combat/face behavior is active (stage 3 is fully open). |
| `inst._can_cloud` | boolean | N/A | Flag indicating whether the entity is allowed to spawn pollen clouds. |

## Main functions
### `WaterPlantBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. This function must be called after the entity is fully constructed and all required state variables (e.g., `_stage`, `_can_cloud`) are set. It builds a prioritized behavior tree to manage in-game decisions.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Fails silently if required dependencies (`burnable`, `health`, `sleeper`) are missing — conditional checks inside helper functions (`should_emergency_pollen`, `should_spray_cloud`) will return `false`, effectively disabling cloud spraying. No explicit error handling is present.

### `GetFaceTargetFn(inst)`
* **Description:** Internal helper function used by `FaceEntity` behavior to locate the nearest valid target for face alignment.
* **Parameters:** `inst` (Entity) — the water plant instance.
* **Returns:** `Entity` or `nil` — the closest player within `START_FACE_DIST` that does *not* have the `"notarget"` tag, or `nil` if none exist.
* **Error states:** Returns `nil` if no players are in range or if all nearby players have the `"notarget"` tag.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Internal helper used by `FaceEntity` to determine if the entity should continue facing a given target.
* **Parameters:**  
  - `inst` (Entity) — the water plant instance.  
  - `target` (Entity) — the current face target.  
* **Returns:** `boolean` — `true` if the target is within `KEEP_FACE_DIST` and does *not* have the `"notarget"` tag; otherwise `false`.
* **Error states:** Returns `false` if `target` is `nil` (handled implicitly by `target:HasTag(...)` returning `false` on `nil` in Lua, but in practice `target` is guaranteed non-`nil` from `GetFaceTargetFn`).

### `should_emergency_pollen(inst)`
* **Description:** Evaluates whether the entity should perform an emergency pollen cloud spray (triggered when burning or smoldering).
* **Parameters:** `inst` (Entity) — the water plant instance.
* **Returns:** `boolean` — `true` if `_can_cloud` is `true` and either `burnable:IsBurning()` or `burnable:IsSmoldering()` returns `true`; otherwise `false`.
* **Error states:** Returns `false` if `burnable` component is missing.

### `should_spray_cloud(inst)`
* **Description:** Evaluates whether a routine pollen cloud spray is allowed (based on sleep/death state and `_can_cloud` flag).
* **Parameters:** `inst` (Entity) — the water plant instance.
* **Returns:** `boolean` — `true` only if `_can_cloud` is `true` *and* neither `sleeper:IsAsleep()` nor `health:IsDead()` is `true`; otherwise `false`.
* **Error states:** Returns `false` if `sleeper` or `health` components are missing.

### `spray_cloud(inst)`
* **Description:** Simple wrapper that fires the `"spray_cloud"` event on the entity.
* **Parameters:** `inst` (Entity) — the water plant instance.
* **Returns:** `nil`.
* **Error states:** None — safe even if no listeners are registered for `"spray_cloud"`.

## Events & listeners
- **Listens to:** None. This component does *not* register any event listeners via `inst:ListenForEvent`.
- **Pushes:** `"spray_cloud"` — fired via `inst:PushEvent("spray_cloud")` in both emergency and routine cloud spray logic paths.