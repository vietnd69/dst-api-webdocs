---
id: shadow_beef_bell_curse
title: Shadow Beef Bell Curse
description: Applies health and sanity penalties to a target entity when attached and detached, and spawns a visual effect during its duration.
tags: [combat, debuff, effect, audio]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9360a8a8
system_scope: entity
---

# Shadow Beef Bell Curse

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadow_beef_bell_curse` is a non-persistent, server-only entity that acts as a debuff container for applying delayed health and sanity penalties to a target. It is typically attached to a player or creature via the `debuff` component. Upon detachment (or activation of `TriggerCurse`), it applies a health penalty, optional sanity drain, and triggers camera shake and audio feedback (if not loading from save). A visual effect prefab is spawned mid-duration via `SpawnCurseFx`.

## Usage example
```lua
-- Attaching the debuff to a target
local target = ThePlayer -- or any valid entity
local curse = SpawnPrefab("shadow_beef_bell_curse")
target:AddDebuff("shadow_beef_bell_curse", curse)
```

## Dependencies & tags
**Components used:** `debuff`, `health`, `sanity`  
**Tags:** Adds `CLASSIFIED` to the curse entity itself.

## Properties
No public properties are initialized in the constructor. All behavior is method-driven.

## Main functions
### `OnAttached(inst, target)`
*   **Description:** Called when the debuff is attached to a target. Sets up parent-child relationships, schedulesFX spawn (`SpawnCurseFx`) and final penalty trigger (`TriggerCurse`), and registers a listener to stop the debuff if the target dies.
*   **Parameters:**  
    `inst` (Entity) — the curse entity instance.  
    `target` (Entity) — the entity being cursed.  
*   **Returns:** Nothing.  
*   **Error states:** If `inst.loading` is `true`, it triggers `TriggerCurse` immediately instead of scheduling tasks.

### `OnDetached(inst, target)`
*   **Description:** Called when the debuff is removed. Applies final curse effects to the target (if valid) and destroys the curse entity.
*   **Parameters:**  
    `inst` (Entity) — the curse entity instance.  
    `target` (Entity) — the entity being un-cursed.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `target` is `nil` or not valid; avoids applying effects twice on reload.

### `TriggerCurse(inst)`
*   **Description:** Immediately stops the debuff, effectively ending the curse.
*   **Parameters:** `inst` (Entity).  
*   **Returns:** Nothing.  

### `SpawnCurseFx(inst, target)`
*   **Description:** Spawns and attaches the visual effect prefab `beef_bell_shadow_cursefx` to the target. Does nothing if target is invalid.
*   **Parameters:**  
    `inst` (Entity) — the curse entity.  
    `target` (Entity) — the entity to parent the effect to.  
*   **Returns:** Nothing.  

### `DoCurseEffects(inst, target)`
*   **Description:** Applies health penalty and (if alive) sanity damage to the target, plus camera shake and `consumehealthcost` event (if not loading).
*   **Parameters:**  
    `inst` (Entity).  
    `target` (Entity).  
*   **Returns:** Nothing.  
*   **Error states:** Skips sanity and non-essential effects if `target.components.health:IsDead()` is `true`.

## Events & listeners
- **Listens to:** `death` (on target) — calls `inst.components.debuff:Stop()` to terminate the curse when the target dies.
- **Pushes:** None directly; delegates event dispatching to components (`sanitydelta` from `sanity`, `consumehealthcost`, etc.).
