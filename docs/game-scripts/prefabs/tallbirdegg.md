---
id: tallbirdegg
title: Tallbirdegg
description: A hatchable egg prefab that requires specific environmental conditions to successfully hatch into a smallbird, spoil, or produce different loot based on temperature exposure.
tags: [entity, hatchable, inventory, perishable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 272ce43f
system_scope: entity
---

# Tallbirdegg

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
`Tallbirdegg` is a prefab definition responsible for creating the tallbird egg entity and its variants (`tallbirdegg`, `tallbirdegg_cracked`, `tallbirdegg_cooked`). It implements logic for temperature-sensitive hatching (via the `hatchable` component), perishability (for cooked variants), looting (based on temperature exposure), and inventory interaction. The egg can hatch into a `smallbird`, crack (transitioning to `tallbirdegg_cracked`), or perish and drop loot (e.g., `cookedsmallmeat` if too hot, `wetgoop` if too cold). It integrates with multiple systems: `inventoryitem`, `edible`, `floater`, `hatchable`, `perishable`, `lootdropper`, and `playerprox`.

## Usage example
```lua
-- Create a pristine tallbird egg and configure its hatching behavior
local egg = SpawnPrefab("tallbirdegg")
egg.Transform:SetPosition(x, y, z)
-- The egg automatically starts hatching logic updates via hatchable component

-- The egg transitions to cracked state when cracked time elapses
-- If near a player and on valid ground after hatch time, it hatches
-- Temperature is managed by external systems (e.g., seasonal events, heat sources)
```

## Dependencies & tags
**Components used:** `cookable`, `edible`, `floater`, `hatchable`, `inspectable`, `inventoryitem`, `lootdropper`, `perishable`, `playerprox`, `talker`, `stackable`, `hauntable`
**Tags:** Adds `cattoy`, `tallbirdegg`, `donotautopick` (only on cracked variant), `cookable` (only on pristine egg); checks for `burnt`, `structure`.

## Properties
No public properties are defined directly in the prefabs. Property access is mediated via attached components (e.g., `inst.components.hatchable.state`, `inst.components.edible.healthvalue`).

## Main functions
The `Prefab` returns three prefabs: `tallbirdegg`, `tallbirdegg_cracked`, and `tallbirdegg_cooked`. Each uses internal functions for instantiation.

### `commonfn(anim, withsound, cookable)`
*   **Description:** Common prefab setup shared between pristine and cooked egg variants. Initializes transform, animstate, sound, network, physics, inventory, edible, and optionally cookable components.
*   **Parameters:**  
    - `anim` (string) – animation bank name.  
    - `withsound` (boolean) – whether to add `SoundEmitter`.  
    - `cookable` (boolean) – whether to add the `cookable` component.
*   **Returns:** `inst` – the entity instance.
*   **Error states:** Returns early on client if `not TheWorld.ismastersim`.

### `defaultfn(anim)`
*   **Description:** Instantiates the pristine tallbird egg. Adds `hatchable`, `playerprox`, and sets up hatching behaviors and floater parameters.
*   **Parameters:**  
    - `anim` (string) – animation name for initial state.
*   **Returns:** `inst` – the pristine egg entity.
*   **Error states:** Returns early on client if `not TheWorld.ismastersim`.

### `normalfn()`
*   **Description:** Convenience wrapper to call `defaultfn("egg")` and spawn the standard tallbird egg.
*   **Parameters:** None.
*   **Returns:** `inst` – pristine egg entity.
*   **Error states:** None.

### `crackedfn()`
*   **Description:** Instantiates the cracked tallbird egg variant (`tallbirdegg_cracked`). Sets state to `comfy`, adds proximity listener for hatching check, and configures eating behavior.
*   **Parameters:** None.
*   **Returns:** `inst` – cracked egg entity.
*   **Error states:** Returns early on client if `not TheWorld.ismastersim`.

### `cookedfn()`
*   **Description:** Instantiates the cooked tallbird egg (`tallbirdegg_cooked`). Adds `stackable`, sets perishability, and configures edible values.
*   **Parameters:** None.
*   **Returns:** `inst` – cooked egg entity.
*   **Error states:** None.

### `Hatch(inst)`
*   **Description:** Spawns a `smallbird` at the egg's location, triggers the `hatch` stategraph on it, awards the `hatch_tallbirdegg` radial achievement, and removes the egg.
*   **Parameters:** `inst` (Entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `CheckHatch(inst)`
*   **Description:** Evaluates whether the cracked egg should hatch: checks if a player is within proximity, the egg is not held, the state is `hatch`, and the location is valid ground.
*   **Parameters:** `inst` (Entity) – the cracked egg entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnDropped(inst)`
*   **Description:** Called when the egg is dropped from inventory. Restarts hatchable updates and triggers hatching check if conditions are met; plays uncomfortable sounds if egg is in `uncomfy` state.
*   **Parameters:** `inst` (Entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnPutInInventory(inst)`
*   **Description:** Called when the egg is placed into inventory. Stops hatchable updates and kills uncomfortable sounds.
*   **Parameters:** `inst` (Entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnLoadPostPass(inst)`
*   **Description:** Handles load order dependency: if the inventoryitem component reports the egg is held, invokes `OnPutInInventory`.
*   **Parameters:** `inst` (Entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `GetStatus(inst)`
*   **Description:** Returns the current status text for the egg’s inspection UI (`"HOT"` or `"COLD"` if in `uncomfy` state, else `nil`).
*   **Parameters:** `inst` (Entity) – the egg entity.
*   **Returns:** `string?` – status string or `nil`.
*   **Error states:** None.

### `DropLoot(inst)`
*   **Description:** Adds `lootdropper` component, sets loot based on temperature (`loot_hot` or `loot_cold`), and drops loot.
*   **Parameters:** `inst` (Entity) – the egg entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnHatchState(inst, state)`
*   **Description:** Handles transitions for the `hatchable` component's state changes (`crack`, `uncomfy`, `comfy`, `hatch`, `dead`). Modifies animation, spawns cracked egg or perish effects, and manages sounds.
*   **Parameters:**  
    - `inst` (Entity) – the egg entity.  
    - `state` (string) – new state (`"crack"`, `"uncomfy"`, `"comfy"`, `"hatch"`, `"dead"`).
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnEaten(inst, eater)`
*   **Description:** Called when a `tallbirdegg_cracked` is eaten. Triggers talker-based line via `eater.components.talker`.
*   **Parameters:**  
    - `inst` (Entity) – the cracked egg entity.  
    - `eater` (Entity) – the entity consuming the egg.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `animover` (only on `dead` state) – removes the egg after death animation completes.
- **Pushes:**  
  - Indirect via components: `hatchable` may fire `hatchfail`, `hatchstart`, `hatch`, `uncomfy`, `comfy`, `dead`.  
  - `entity_droploot` (via `lootdropper:DropLoot`).