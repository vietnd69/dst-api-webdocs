---
id: polly_rogers
title: Polly Rogers
description: "Provides the definition and shared logic for two companion creatures: a flying bird (Polly Rogers) and a salt-shedding amphibious dog (Salty Dog), each with distinct behaviors, appearances, and interactions."
tags: [animal, companion, pet, bird, amphibious]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d17a813c
system_scope: entity
---

# Polly Rogers

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This prefabs file defines two companion creatures—`polly_rogers` (a flying crow-like bird) and `salty_dog` (a salt-shedding, amphibious dog). They share core gameplay mechanics via the `fn_common()` helper, including locomotion, inventory, health, combat, and follower behavior. The dog variant adds salt-based progression logic, amphibious capabilities (enter/exit water handling), and visual state transitions. Both variants use a shared brain (`pollyrogerbrain.lua`) and state graphs for AI and animation control.

## Usage example
```lua
-- Spawn a Polly Rogers bird companion
local polly = SpawnPrefab("polly_rogers")
polly.Transform:SetPosition(x, y, z)
polly:DoTaskInTime(0, function() polly.components.follower:SetMaster(player) end)

-- Spawn a Salty Dog companion
local dog = SpawnPrefab("salty_dog")
dog.Transform:SetPosition(x, y, z)
dog:DoTaskInTime(0, function() dog.components.follower:SetMaster(player) end)

-- Manually trigger salt shedding (for modding purposes)
if dog.components.counter then
    dog.ShedSalt = dog.ShedSalt or function() end
    dog:ShedSalt()
end
```

## Dependencies & tags
**Components used:** `locomotor`, `eater`, `follower`, `health`, `combat`, `lootdropper`, `inspectable`, `inventory`, `embarker`, `counter`, `timer`, `amphibiouscreature`, `inventoryitem`, `inventoryitemmoisture`, `rainimmunity`
**Tags:** `animal`, `prey`, `smallcreature`, `untrappable`, `companion`, `noplayertarget`, `ignorewalkableplatformdrowning`, `NOBLOCK`, `bird` (polly only), `flying` (polly only)

## Properties
No public properties are defined or exposed on the prefab instances themselves. Configuration is done via `TUNING` constants and component properties (e.g., `TUNING.POLLY_ROGERS_WALK_SPEED`, `inst.components.health.maxhealth`).

## Main functions
### `fn_common(flying)`
* **Description:** Shared constructor logic for both Polly Rogers variants. Sets up basic entity components, physics, tags, locomotion, and core systems. Must be called before variant-specific setup.
* **Parameters:** `flying` (boolean) — if `true`, creates the bird variant; otherwise, creates the dog variant.
* **Returns:** `inst` — the configured entity instance.

### `ShedSalt(inst)`
* **Description:** Removes and spawns one `saltrock` prefab for the dog when its salt counter is > 0. Resets salt visuals.
* **Parameters:** `inst` (Entity) — the dog instance.
* **Returns:** Nothing.
* **Error states:** Early exit if the `counter` component is missing or salt count is zero.

### `ShedAllSalt(inst)`
* **Description:** Removes *all* salt and spawns multiple `saltrock` items (one per salt unit). Resets salt visuals.
* **Parameters:** `inst` (Entity) — the dog instance.
* **Returns:** Nothing.
* **Error states:** Early exit if the `counter` component is missing or salt count is zero.

### `UpdateSaltVisuals(inst)`
* **Description:** Updates the dog's animation overrides (using `salty_dog` bank) based on current salt count (mapped to 1 of 3 stages: 0=none, 1=stage1, 2=stage2).
* **Parameters:** `inst` (Entity) — the dog instance.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Timer callback used for regenerating salt in the dog while out of water. Increases salt count up to `TUNING.SALTY_DOG_MAX_SALT_COUNT`.
* **Parameters:** `inst` (Entity), `data` (table) — must contain `{ name = "salty" }`.
* **Returns:** Nothing.

### `OnEnterWater(inst)`
* **Description:** Pauses or restarts the salt regeneration timer when the dog enters water. Used by `amphibiouscreature` component.
* **Parameters:** `inst` (Entity) — the dog instance.
* **Returns:** Nothing.

### `OnExitWater(inst)`
* **Description:** Pauses the salt regeneration timer when the dog exits water. Used by `amphibiouscreature` component.
* **Parameters:** `inst` (Entity) — the dog instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — handled by `OnTimerDone` to regenerate salt periodically while out of water.
- **Pushes:** No events are pushed directly by this file; events are managed by components like `timer` and `amphibiouscreature`.