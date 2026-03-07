---
id: cave_vent_mite
title: Cave Vent Mite
description: A hostile cavern-dwelling creature that alternates between solid and vent phases, deals damage, and gains planar properties near shadow rifts.
tags: [combat, ai, environment, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9717e499
system_scope: entity
---

# Cave Vent Mite

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The cave vent mite is a hostile entity that toggles between a physical state with movement capabilities and an immobile vent state embedded in walls. It uses a custom stategraph and brain to manage behavior, and integrates with several components including `combat`, `sleeper`, `eater`, and `lootdropper`. Its unique mechanics include shielding via `acidinfusible` and `combat` components, dynamic planar damage when near shadow rifts via `planarentity` and `planardamage`, and conditional loot drops. It is nocturnal, immune to electric damage when shielded, and exhibits hauntable panic behavior.

## Usage example
This prefab is instantiated internally by the game engine and not typically created directly by mods. However, modders may reference its behavior when designing similar entities or modifying its components post-creation:
```lua
-- Example: Modifying health on spawn (not recommended practice for prefabs)
inst:AddTag("custom_vent_mite")
if inst.components.health then
    inst.components.health:SetMaxHealth(200)
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sleeper`, `locomotor`, `lootdropper`, `sanityaura`, `drownable`, `knownlocations`, `eater`, `timer`, `acidinfusible`, `burnable`, `inspectable`, `planarentity`, `planardamage`, `hauntable`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`.

**Tags added:** `monster`, `hostile`, `scarytoprey`, `smallcreature`, `electricdamageimmune` (conditional), `shadow_aligned` (conditional), `_combat`, `character` (via `IsValidTarget`), `eatsrawmeat`, `strongstomach`, `HORRIBLE_eater`.

## Properties
No public properties are initialized or documented in the constructor. The prefab sets instance methods and rely on internal component state.

## Main functions
### `SetVentPhysics(inst)`
*   **Description:** Configures the entity's physics to simulate a wall-embedded vent (mass=0, obstacle collision group). Called when transitioning into the vent phase.
*   **Parameters:** `inst` (Entity) - The entity instance to modify.
*   **Returns:** Nothing.
*   **Error states:** Only applies changes if `inst.isvent` is not `true`; otherwise, it does nothing.

### `SetCharacterPhysics(inst)`
*   **Description:** Restores standard character movement physics (using `ChangeToCharacterPhysics`). Called when transitioning out of the vent phase.
*   **Parameters:** `inst` (Entity) - The entity instance to modify.
*   **Returns:** Nothing.
*   **Error states:** Only applies changes if `inst.isvent` is not `false`; otherwise, it does nothing.

### `SetShield(inst, shielded)`
*   **Description:** Toggles the shielded state: applies `shellabsorb` damage reduction, pauses the shield cooldown timer, extinguishes burning, sets acid FX level, and toggles electric damage immunity. Calls `SetUpChanceLoot` after updating state.
*   **Parameters:** `inst` (Entity), `shielded` (boolean).
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `UpdateRift(inst)`
*   **Description:** Detects if a shadow rift is active and conditionally adds/removes planar-related components (`planarentity`, `planardamage`) and associated tags/symbols. Adjusts loot drops accordingly.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `GetStatus(inst)`
*   **Description:** Returns `"VENTING"` if the entity is currently shielded and embedded in a vent; otherwise returns `nil`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `string` or `nil`.
*   **Error states:** None documented.

## Events & listeners
- **Listens to:** `ms_riftaddedtopool`, `ms_riftremovedfrompool` (on `TheWorld`) – triggers `UpdateRift` via `UpdateRift_Bridge` handler.
- **Pushes:** None directly (relies on component events via `inst:PushEvent` in attached components).
