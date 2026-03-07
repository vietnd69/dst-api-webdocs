---
id: ruinsrelic
title: Ruinsrelic
description: A utility prefab factory that generates destroyable, non-functional relic items (e.g., plates, bowls, chairs) for Ruins levels, enabling loot dropping, furniture interaction, and Shadeling spawning on chairs.
tags: [loot, furniture, environment, ruins]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 14b12b12
system_scope: environment
---

# Ruinsrelic

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`ruinsrelic` is a prefab factory function used to generate static, non-interactive decorative or functional relic items for Ruins levels—such as plates, bowls, vases, chairs, and tables. These prefabs are crafted by players but serve no gameplay purpose beyond decoration or as part of Ruins-level challenges. Items can be destroyed with a hammer to yield loot, and chairs may spawn Shadelings under specific conditions. The factory embeds behavior for destruction, furniture interaction, and Shadeling spawning, but only in the master simulation context.

## Usage example
```lua
-- Creating a ruinsrelic chair with Shadeling support and obstacle physics
local chair = require("prefabs/ruinsrelic").item("chair", true, "rock", 0.25, 1)
-- The returned prefab will:
--   - be marked with tags: "structure", "limited_chair", "uncomfortable_chair"
--   - respond to hammering by dropping loot and removing itself
--   - spawn a Shadeling if placed in a Nightmare-zone node and the chair is empty
--   - handle furniture decoration events if decor type (non-chair/table)
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `lootdropper`, `furnituredecor`, `inventoryitem`, `sittable` (chairs only), `follower` (decor items only), `soundemitter`, `animstate`, `transform`, `network`.

**Tags added/used:**  
- `furnituredecor` (added to decor-type items for decoration compatibility),  
- `structure`, `limited_chair`, `uncomfortable_chair` (added to chairs),  
- Checked via `inst:HasTag("burnt")` (via `lootdropper`), `decoration`, `monster`, `animal` (via `lootdropper` event hooks).  

**External component calls:**  
- `TheWorld.components.ruinsshadelingspawner:TrySpawnShadeling(inst)`  
- `inst.components.workable:SetWorkable(bool)`  
- `inst.components.lootdropper:DropLoot()`  
- `inst.components.furnituredecor.onputonfurniture / ontakeofffurniture`  

## Properties
No public properties are defined outside the constructor logic. Internal state is managed via instance variables (`inst.chairtask`, `inst.noshadelingtask`, `inst.entity`) and component fields.

## Main functions
### `item(name, animated, sound, radius, deploy_smart_radius)`
*   **Description:** Factory function that constructs and returns a Prefab for a ruins relic item. Parameters define item type and behavior (e.g., whether it is decorative, animated, or has collision). Handles entity creation, component setup, and world-specific (master) logic.
*   **Parameters:**
    - `name` (string) – base name for the item (`"plate"`, `"bowl"`, `"chair"`, etc.).
    - `animated` (boolean) – if `true`, the item plays `"hit"` animation on build.
    - `sound` (string) – material sound used during build (`"pot"` or `"rock"`).
    - `radius` (number) – collision radius for obstacle physics; zero or negative defaults to inventory physics.
    - `deploy_smart_radius` (number, optional) – controls deploy spacing; if `nil`, item is treated as decor.
*   **Returns:** Prefab definition table (suitable for returning from a `prefabs/*.lua` file).
*   **Error states:** None documented; `radius` and `deploy_smart_radius` have defaults within the function.

## Events & listeners
- **Listens to:**  
  - `onbuilt` (master only) – triggers `OnBuilt` function, which may play build animations/sounds, spawn Shadeling-related timers for chairs, and push Chevolution events.  
  - `becomeunsittable` (master, via `sittable` on chairs) – cancels pending Shadeling spawns when the chair becomes unsittable.  
  - `onremove` (master) – cancels Shadeling spawn tasks when chair or spawned Shadeling is removed.  
  - `ruins_shadeling_looted` (master) – cleans up Shadeling references when looted.

- **Pushes:**  
  - `CHEVO_makechair` (master only, for chairs) – triggers Chevolution event when a chair is built.  
  - `entity_droploot` (via `lootdropper:DropLoot`) – fired when loot is dropped.

- **Event hooks assigned to components:**  
  - `furnituredecor.onputonfurniture = OnPutOnFurniture`  
  - `furnituredecor.ontakeofffurniture = OnTakeOffFurniture`  
  - `workable.onfinish = OnHammered`  
