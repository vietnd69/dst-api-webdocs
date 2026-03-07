---
id: lunarsupernovaburning
title: Lunarsupernovaburning
description: Applies and manages damage and visual effects for the Alter Guardian's lunar supernova ability during Phase 4.
tags: [combat, boss, fx, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: aea6a6b8
system_scope: combat
---

# Lunarsupernovaburning

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LunarSupernovaBurning` is a component used by the Alter Guardian's Phase 4 form to simulate the lunar supernova attack. It maintains a set of source entities (typically minions) that contribute to the burning effect, spawns and positions visual effect prefabs (`alterguardian_lunar_supernova_burn_fx`) around the caster, and periodically deals damage to both the caster and affected mounts. The component integrates closely with the `health`, `rider`, `colouradder`, `combat`, and `grogginess` components, and uses `WagBossUtil` functions for positioning and damage calculations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lunarsupernovaburning")
-- Add a source entity (e.g., a minion) that will emit the burn effect
inst.components.lunarsupernovaburning:AddSource(minion)
-- The component automatically starts updating and managing effects/damage
```

## Dependencies & tags
**Components used:** `health`, `rider`, `colouradder`, `combat`, `grogginess`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sources` | table | `{}` | Map of valid source entities to their associated effect prefabs. |
| `firsttick` | boolean | `true` | Indicates if the first `OnUpdate` call is pending (used for initial damage timing). |
| `wasdamaging` | boolean | `false` | Tracks whether damage was applied in the previous update. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up the component when removed from an entity. Unregisters lunar burn sources, removes colour additions, and destroys all associated effect prefabs.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetFxSize()`
*   **Description:** Determines the appropriate visual size (`"small"`, `"med"`, or `"large"`) and radius for effect prefabs based on the entity’s physics radius and tags. If the entity has a mount, the mount is used instead.
*   **Parameters:** None.
*   **Returns:** Two values: `size` (string: `"small"`, `"med"`, or `"large"`), and `rad` (number: radius used for positioning).
*   **Error states:** Returns default radii if the entity is very small or very large.

### `AddSource(source)`
*   **Description:** Registers a new source entity (e.g., a minion) and spawns a corresponding `alterguardian_lunar_supernova_burn_fx` visual effect. If this is the first source, the effect is shown immediately; otherwise, it is hidden until `OnUpdate` determines visibility.
*   **Parameters:** `source` (entity instance) - the entity acting as a source of the supernova burn.
*   **Returns:** Nothing.
*   **Error states:** No effect if the source is already registered.

### `OnUpdate(dt)`
*   **Description:** Called every tick to manage effect visibility, source validity, and damage application. Removes invalid or out-of-range sources, positions effects, and applies damage proportional to the number of active sources. Also manages lunar burn flags and colour additions.
*   **Parameters:** `dt` (number) - time since last update (unused directly, but passed per component convention).
*   **Returns:** Nothing.
*   **Error states:** 
    *   Removes the component early if no valid sources remain.
    *   Removes the component early if the entity is invincible, dead, in limbo, or otherwise cannot be targeted.
    *   Damage is scaled by `numdots`, which is incremented for each visible, unblocked source.

## Events & listeners
- **Listens to:** None explicitly (uses `inst:StartUpdatingComponent(self)` instead of event callbacks for updates).
- **Pushes:** None. However, it manipulates events via `self.inst.components.health:RegisterLunarBurnSource(...)` and `self.inst.components.health:UnregisterLunarBurnSource(...)`, which internally push `startlunarburn` and `stoplunarburn` events.
