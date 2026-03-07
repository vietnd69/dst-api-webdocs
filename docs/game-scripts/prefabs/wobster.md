---
id: wobster
title: Wobster
description: Defines prefabs for wobster creatures (sheller and moonglass variants) in both ocean and land forms, including their components, state graphs, brains, and lifecycle behaviors such as fishing, landing, death, cooking, and seasonal mutation.
tags: [ocean, creature, combat, lifecycle]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cd22e2ad
system_scope: entity
---

# Wobster

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wobster.lua` file defines the prefabs and entity setup logic for the Wobster creature family — specifically, the standard *sheller* and the seasonal *moonglass* variant. It supports two form states: aquatic (swimming) and terrestrial (landed), each with distinct behaviors for movement, interaction with the ocean fishing system, and transformation (e.g., landing on land, dying, cooking). The file uses components from `complexprojectile`, `oceanfishable`, `cookable`, `edible`, `health`, `locomotor`, `lootdropper`, `perishable`, `weighable`, `inventoryitem`, and `halloweenmoonmutable` to implement realistic movement, physics, and interactions in DST's ECS framework.

## Usage example
```lua
-- Spawn a landed Wobster (Sheller)
local landed_wobster = SpawnPrefab("wobster_sheller_land")
landed_wobster.Transform:SetPosition(x, y, z)

-- Spawn an ocean-dwelling Wobster
local ocean_wobster = SpawnPrefab("wobster_sheller")

-- Check moonglass mutation under lunar alignment
if TheWorld.state and TheWorld.state.lunar_aligned then
    local moonglass = SpawnPrefab("wobster_moonglass")
end
```

## Dependencies & tags
**Components used:**  
`complexprojectile`, `cookable`, `edible`, `halloweenmoonmutable`, `health`, `inspectable`, `inventoryitem`, `locomotor`, `lootdropper`, `oceanfishable`, `perishable`, `stackable`, `tradable`, `weighable`, `knownlocations`, `murderable`, `sleeper`, `combat`

**Tags:**  
`ediblefish_meat`, `ignorewalkableplatforms`, `NOBLOCK`, `NOCLICK`, `notarget`, `oceanfishable`, `oceanfishable_creature`, `oceanfishinghookable`, `swimming`, `animal`, `canbetrapped`, `prey`, `smallcreature`, `whackable`, `smalloceancreature`, `stunnedbybomb`, `cookable`, `weighable_fish`, `lunar_aligned`

## Properties
No public properties are initialized directly on the component itself. Properties like `fish_def`, `_hit_sound`, and `_fades_out` are stored on `inst` (the entity instance) as part of prefab setup logic, not in component instances.

## Main functions
### `on_projectile_landed(inst)`
*   **Description:** Handles what happens when a wobster is launched out of water and lands. If the landing spot is passable (land), it spawns a landed wobster; otherwise, it returns to swimming.
*   **Parameters:** `inst` (entity) — the launched projectile entity.
*   **Returns:** Nothing.
*   **Error states:** None.

### `on_make_projectile(inst)`
*   **Description:** Attaches the `complexprojectile` component and configures projectile behavior when caught via ocean fishing. Transitions the wobster to a launched state and switches collision.
*   **Parameters:** `inst` (entity) — the wobster entity being reeled in.
*   **Returns:** The `inst` entity.
*   **Error states:** None.

### `on_reeling_in(inst, doer, angle)`
*   **Description:** Transitions a partially hooked wobster to fully hooked state and resets struggling behavior upon successful reeling.
*   **Parameters:**  
  `inst` (entity) — the wobster being reeled in.  
  `doer` (entity, optional) — the player reeling.  
  `angle` (number, optional) — angle of pull.
*   **Returns:** Nothing.

### `set_on_rod(inst, rod)`
*   **Description:** Adds or removes tags indicating the wobster is partially hooked or a "scary too ocean prey".
*   **Parameters:**  
  `inst` (entity) — the wobster.  
  `rod` (entity or `nil`) — the fishing rod involved; `nil` means unhooked.
*   **Returns:** Nothing.

### `SetupWeighable(inst)`
*   **Description:** Initializes and randomizes weight data for trophy purposes.
*   **Parameters:** `inst` (entity) — the wobster entity.
*   **Returns:** Nothing.

### `base_water_wobster(build_name, fish_def)`
*   **Description:** Creates and configures an ocean-dwelling wobster with physics, swimming state graph, brain, and fishing components.
*   **Parameters:**  
  `build_name` (string) — animation bank/build name.  
  `fish_def` (table) — definition including `prefab`, `loot`, `lures`, `weight_min`, `weight_max`.
*   **Returns:** The configured entity.
*   **Error states:** Returns early on non-master simulation (client-side).

### `wobster_water()`
*   **Description:** Factory function that returns a standard sheller ocean wobster.
*   **Parameters:** None.
*   **Returns:** Entity of type `wobster_sheller`.

### `moonglass_water()`
*   **Description:** Factory function that returns a moonglass variant ocean wobster and adds the `lunar_aligned` tag.
*   **Parameters:** None.
*   **Returns:** Entity of type `wobster_moonglass`.

### `on_ground_wobster_landed(inst)`
*   **Description:** Handles post-landing logic for landed wobsters: stunned state if on land, respawn as ocean wobster if in water.
*   **Parameters:** `inst` (entity) — the landed wobster.
*   **Returns:** Nothing.

### `on_dropped_as_loot(inst, data)`
*   **Description:** Records the dropper's prefab as override owner for weight tracking.
*   **Parameters:**  
  `inst` (entity) — the landed wobster (as loot).  
  `data` (table or `nil`) — loot drop event data including `dropper`.
*   **Returns:** Nothing.

### `enter_water(inst)`
*   **Description:** Transforms a landed wobster back into its ocean form.
*   **Parameters:** `inst` (entity) — the landed wobster.
*   **Returns:** Nothing.

### `base_land_wobster(build_name, nameoverride, fish_def, fadeout, cook_product)`
*   **Description:** Creates and configures a landed wobster with land-specific components (e.g., `inventoryitem`, `health`, `combat`, `cookable`).
*   **Parameters:**  
  `build_name` (string) — animation bank/build name.  
  `nameoverride` (string) — display name for `inspectable`.  
  `fish_def` (table) — fish definition (same structure as water variant).  
  `fadeout` (boolean) — controls `health.nofadeout`.  
  `cook_product` (string or `nil`) — product prefab name if cookable.
*   **Returns:** The configured entity.
*   **Error states:** Returns early on non-master simulation.

### `wobster_land()`
*   **Description:** Factory function for the sheller landed wobster, applying `halloweenmoonmutable` mutation for moonglass conversion.
*   **Parameters:** None.
*   **Returns:** Entity of type `wobster_sheller_land`.

### `moonglass_land()`
*   **Description:** Factory function for the moonglass landed wobster.
*   **Parameters:** None.
*   **Returns:** Entity of type `wobster_moonglass_land`.

### `lobster_dead_fn()`
*   **Description:** Factory function for a raw dead wobster meat item (sheller variant), adding perishability and cooking support.
*   **Parameters:** None.
*   **Returns:** Entity of type `wobster_sheller_dead`.

### `lobster_dead_cooked_fn()`
*   **Description:** Factory function for a cooked dead wobster meat item.
*   **Parameters:** None.
*   **Returns:** Entity of type `wobster_sheller_dead_cooked`.

## Events & listeners
- **Listens to:**  
  `on_landed` — triggers `on_ground_wobster_landed` to handle post-landing behavior.  
  `on_loot_dropped` — triggers `on_dropped_as_loot` to record owner for weight tracking.  

- **Pushes:**  
  None. (This file defines prefabs, not active event emitters beyond component-provided events.)