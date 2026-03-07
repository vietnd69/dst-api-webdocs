---
id: cookiecutter
title: Cookiecutter
description: A hostile ocean-dwelling predator that targets and drills into boats to consume wood, sharing target information with nearby kin.
tags: [combat, ai, boss, aquatic]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 57c38d0a
system_scope: entity
---

# Cookiecutter

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cookiecutter` prefab represents the Cookiecutter Shark, a marine predator that patrols oceans and targets boats for wood consumption. It utilizes the stategraph and brain systems for autonomous behavior, and interacts with multiple components: `locomotor` (for ocean navigation), `combat` (for attacking), `eater` (to consume wood), `health`, `sanityaura`, `lootdropper`, `sleeper`, `cookiecutterdrill`, and `homeseeker`. It is part of the ECS architecture and does not define custom component logic itself—rather, this file configures the entity with components and sets up behavior hooks via event listeners and lifecycle callbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("cookiecutter")
inst:AddComponent("locomotor")
inst:AddComponent("combat")
inst:AddComponent("eater")
-- ... additional setup as done in the cookiecutter prefab definition ...
inst:DoPeriodicTask(0.25, CheckForBoats)  -- typical targeting behavior
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `sanityaura`, `combat`, `lootdropper`, `inspectable`, `eater`, `sleeper`, `cookiecutterdrill`, `knownlocations`, `childspawner` (via `DoReturn` callback).  
**Tags added:** `monster`, `smallcreature`, `hostile`, `cookiecutter`, `ignorewalkableplatformdrowning`.  
**Tags checked:** `boat`, `INLIMBO`, `fire`, `smolder`, `debuffed` (via `scarytocookiecutters` shared tag logic).

## Properties
No public properties are defined directly by this file. The prefab configures properties on attached components (e.g., `inst.components.locomotor.runspeed`), but does not expose new top-level variables.

## Main functions
### `OnAttacked(inst, data)`
* **Description:** Handler for `attacked` events; triggers fleeing behavior and temporarily marks the cookiecutter with the `scarytocookiecutters` tag. Cancels existing flee timer tasks and starts a new one if attack occurred outside drilling/jumping states.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
  `data` (table) — event data (unused in this handler).  
* **Returns:** Nothing.

### `DoReturn(inst)`
* **Description:** Attempts to return the cookiecutter to its home (e.g., a beach den) via the `childspawner:GoHome` component. If no valid home exists, removes the entity.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** Boolean `true` if successfully returned to home (via `childspawner:GoHome`), otherwise `nil`.

### `findtargetcheck(target)`
* **Description:** Validates that a potential target (boat) is located in ocean terrain, accounting for boat presence.
* **Parameters:**  
  `target` (Entity) — candidate boat entity.  
* **Returns:** `true` if target is in ocean; `false` otherwise.

### `CanTargetBoats(inst)`
* **Description:** Checks whether the cookiecutter can currently target boats—i.e., not fleeing and meeting the minimum time since last eating.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** `true` if eligible to target boats; `false` otherwise.

### `ShareBoatTarget(inst)`
* **Description:**Broadcasts the current boat target to nearby cookiecutters within detection range, enabling cooperative targeting.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance that found a target.  
* **Returns:** Nothing.

### `ValidateTargetWood(inst)`
* **Description:** Verifies that the stored `target_wood` entity is valid, within maximum follow distance, and not in an invalid state (`INLIMBO`, `fire`, `smolder`).
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** The valid `target_wood` entity if valid; `nil` otherwise.

### `CheckForBoats(inst)`
* **Description:** Core targeting task; searches for boats within detection radius during idle states (`drilling`, `jumping`, `busy`). Updates `target_wood`, triggers target sharing, and enforces eating cooldown.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** Nothing.

### `OnEatFn(inst)`
* **Description:** Plays the bite sound effect upon eating wood.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** Nothing.

### `ValidateSpawnPt(inst)`
* **Description:** Ensures the cookiecutter spawns underwater (not on visual ground). Removes the entity if invalid.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** `false` if removed due to invalid spawn point; `true` otherwise.

### `OnEntitySleep(inst)`
* **Description:** Cancels the periodic boat-finding task when the cookiecutter sleeps.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Restarts the periodic boat-finding task (every `0.25` seconds) when the cookiecutter wakes.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** Nothing.

### `OnLoadPostPass(inst)`
* **Description:** Finalization hook after world loading; checks if the cookiecutter spawned atop a boat and forces a `"resurface"` state transition.
* **Parameters:**  
  `inst` (Entity) — the cookiecutter instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to initiate fleeing.
- **Pushes:** None defined in this file (uses `inst:PushEvent` indirectly via stategraph/brain or via other components).
- **Lifecycle hooks:**  
  - `inst.OnEntitySleep = OnEntitySleep`  
  - `inst.OnEntityWake = OnEntityWake`  
  - `inst.DoReturnHome = DoReturn`  
  - `inst.OnLoadPostPass = OnLoadPostPass`