---
id: birds
title: Birds
description: Defines and instantiates bird prefabs with shared logic, including loot dropping, mutation behavior, and canary-specific gas poisoning mechanics.
tags: [prefab, creature, bird]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9d4c04ce
system_scope: entity
---

# Birds

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`birds.lua` defines a factory function `makebird()` that creates multiple bird entity prefabs (crow, robin, canary, etc.) with shared components and behavior. All birds inherit logic for flight, pickup,睡觉, mutation, and interaction with environmental systems (e.g., toadstool gas, hunger, loot spawner). Bird prefabs are reskins of `crow` with customizable appearance, sounds, and loot.

The component does not implement a standalone ECS component; instead, it's a prefab generator used by the game to instantiate bird entities. Key interactions include:
- Integration with `sleeper`, `eater`, `locomotor`, `inventoryitem`, `cookable`, `health`, `lootdropper`, `hauntable`, `halloweenmoonmutable`, and `periodicspawner`.
- Specialized canary behavior via `occupier` and `toadstoolspawner` to track gas exposure.
- Event-based coordination with `birdspawner` for population tracking.

## Usage example
Bird prefabs are instantiated automatically by the game during world generation. To manually spawn a bird:

```lua
local bird = Prefab("canary", ...):Spawn()
bird.Transform:SetPosition(x, y, z)
```

In modding, create a custom bird by calling `makebird` with unique parameters:
```lua
local mybird = require "prefabs/birds"
local customBird = makebird("mybird", "mybird", false, "crow")
```

## Dependencies & tags
**Components used:** `locomotor`, `sleeper`, `eater`, `inventoryitem`, `cookable`, `health`, `lootdropper`, `occupier`, `hauntable`, `halloweenmoonmutable`, `periodicspawner`, `inspectable`, `combat`, `sleep`, `age`.  
**Tags added:** `"bird"`, `"smallcreature"`, `"likewateroffducksback"`, `"stunnedbybomb"`, `"noember"`, `"cookable"`, and the bird's name (e.g., `"crow"`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lunar_mutation_chance` | number | `TUNING.BIRD_PRERIFT_MUTATION_SPAWN_CHANCE` | Chance for mutation during pre-rift spawn. |
| `gestalt_possession_chance` | number | `TUNING.BIRD_RIFT_POSSESSION_SPAWN_CHANCE` | Chance for mutation during gestalt/rift spawn. |
| `trappedbuild` | string | `"birdname_build"` | Build asset name used when trapped (e.g., in a net). |
| `spawn_lunar_mutated_tuning` | string | `"SPAWN_MUTATED_BIRDS"` | Tuning key used for lunar mutation spawn rules. |
| `spawn_gestalt_mutated_tuning` | string | `"SPAWN_MUTATED_BIRDS_GESTALT"` | Tuning key used for gestalt mutation spawn rules. |
| `flyawaydistance` | number | `TUNING.BIRD_SEE_THREAT_DISTANCE` or `TUNING.WATERBIRD_SEE_THREAT_DISTANCE` | Detection range for predators. |
| `_gaslevel` | number | `0` | Gas exposure level (canary only); increases with exposure, triggers mutation event. |
| `_gasuptask` / `_gasdowntask` | Task | `nil` | Periodic tasks for gas level management (canary only). |

## Main functions
### `makebird(name, soundname, no_feather, bank, custom_loot_setup, water_bank)`
*   **Description:** Factory function to create a bird prefab definition. Generates assets, prefabs, and component setup logic.
*   **Parameters:** 
    * `name` (string) — Prefab name (e.g., `"crow"`).
    * `soundname` (string or table) — Sound bank base name, or `{ name = "...", bank = "..." }` for custom banks.
    * `no_feather` (boolean) — If true, skips adding `"feather_<name>"` to the prefabs list.
    * `bank` (string) — Anim bank override (default: `"crow"`).
    * `custom_loot_setup` (function) — Optional function to customize loot dropper setup.
    * `water_bank` (string) — If provided, enables floating and uses alternate anim bank when in water.
*   **Returns:** `Prefab` — A prefabricated entity definition ready for spawning.
*   **Error states:** None explicitly handled; relies on `Prefabs[name]` uniqueness and correct asset paths.

### `SpawnPrefabChooser(inst)`
*   **Description:** Chooses a drop item based on player proximity, game age, and luck. Used by `periodicspawner` to drop items near birds.
*   **Parameters:** `inst` — The bird entity instance.
*   **Returns:** string or `nil` — Prefab name to spawn (e.g., `"seeds"`, `"flint"`), or `nil`.
*   **Error states:** Returns `nil` if no drop should occur based on player age, luck chance, or seasonal constraints.

### `TestGasLevel(inst, gaslevel)`
*   **Description:** (Canary-only) Evaluates chance to mutate into `canary_poisoned` based on gas exposure level.
*   **Parameters:** 
    * `gaslevel` (number) — Current gas exposure level (must be `> 12` to have non-zero chance).
*   **Returns:** `nil` — Fires `"birdpoisoned"` event if mutation occurs.
*   **Error states:** Only triggers for canaries and if a valid `occupier` cage exists.

### `StartInhalingGas(inst)`, `StopInhalingGas(inst)`, `StartExhalingGas(inst)`, `StopExhalingGas(inst)`
*   **Description:** (Canary-only) Manage gas-level tracking via periodic tasks during exposure/removal from gas-emitting zones (e.g., toadstools).
*   **Parameters:** `inst` — The canary instance.
*   **Returns:** `nil`.
*   **Error states:** None; safe to call repeatedly (idempotent).

### `OnCanaryOccupied(inst, cage)`
*   **Description:** (Canary-only) Listener for `occupier` changes; starts/stops gas inhalation based on cage attachment.
*   **Parameters:** `cage` — The occupier entity (expected to have `"cage"` tag).
*   **Returns:** `nil`.
*   **Error states:** No-op if `cage` lacks `"cage"` tag or `TheWorld.components.toadstoolspawner` is `nil`.

### `halloweenmoonmutablefn()`
*   **Description:** Randomly returns mutated prefab name for Halloween moon events.
*   **Parameters:** None.
*   **Returns:** `"bird_mutant"` or `"bird_mutant_spitter"` based on `0.8` probability.

## Events & listeners
- **Listens to:**  
  `"ontrapped"` — Traps birds in traps, updating trap symbols.  
  `"attacked"` — Summons up to 5 nearby birds to flee home.  
  `"death"`, `"onremove"`, `"enterlimbo"` — Removes bird from `birdspawner` tracking.  
  `"floater_startfloating"` / `"floater_stopfloating"` — Swaps anim bank for water birds.  
  `"birdpoisoned"` (canary only) — Decreases internal gas level on other birds’ mutation.  
  `"exitlimbo"` — Cancels gas tasks when bird respawns.
- **Pushes:**  
  `"gohome"` — Sent to nearby birds during `attacked` event.  
  `"birdpoisoned"` (canary only) — Broadcasts to `TheWorld` and cage when canary poisons.  
  (None other.)
