---
id: furniture_chairs
title: Furniture Chairs
description: Factory function that creates chair prefabs with sittable, workable, and burnable properties, supporting both standard and rocking variants.
tags: [furniture, sittable, construction]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 04e7ebd9
system_scope: entity
---

# Furniture Chairs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`furniture_chairs` is a prefab factory script that generates chair and stool prefabs with standardized behaviors, including sittability, hammerable durability, burning mechanics, and optional rocking animations. It defines a shared configuration function `AddChair` used to instantiate concrete chair types (e.g., `wood_chair`, `stone_chair`, `hermit_chair_rocking`). The prefabs integrate with multiple core components: `sittable` for seating, `workable` for hammering/repair, `burnable` for fire response, `lootdropper` for decomposition, and `savedrotation` for rotation persistence.

## Usage example
```lua
-- This file is not meant to be used directly as a component; it returns prefabs.
-- To use a chair, reference one of the generated prefabs (e.g., "wood_chair"):
local chair = SpawnPrefab("wood_chair")
chair.Transform:SetPosition(world_x, world_y, world_z)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `sittable`, `savedrotation`, `workable`, `burnable` (conditional), `propagator` (via `MakeSmallPropagator`, conditional).  
**Tags added per chair type:**  
- `structure`, `faced_chair` or `limited_chair`, `rotatableobject` or `rocking_chair`  
- Special chairs may gain additional tags: `yeehaw` (for `yoth_chair_rocking`), `limited_chair`, `rocking_chair`.  
- Back assets use tag `FX`.  

## Properties
No public properties are defined in this script — it is a factory returning `Prefab` definitions. All state resides within individual prefab instances via component members.

## Main functions
### `AddChair(ret, name, bank, build, facings, hasback, deploy_smart_radius, burnable, inspection_override, kitdata)`
*   **Description:** Helper function that creates and appends chair prefabs (main chair, optional back, optional placer, optional deploy kit) to the `ret` table. Handles asset registration, entity creation, and component setup for each chair variant.
*   **Parameters:**
    - `ret` (table) – Accumulator table of prefabs to return.
    - `name` (string) – Base prefab name (e.g., `"wood_chair"`).
    - `bank` (string) – Animation bank name.
    - `build` (string) – Animation build name.
    - `facings` (number) – Facing mode: `0` (no facing), `4` (four-way), or `8` (eight-way).
    - `hasback` (boolean) – Whether to spawn a separate back asset.
    - `deploy_smart_radius` (number) – Deployment smart radius (e.g., `0.875`).
    - `burnable` (boolean) – Whether the chair can catch fire.
    - `inspection_override` (string) – Localization key for name override in inspection UI.
    - `kitdata` (table or `nil`) – Optional table with deployment and fuel properties to generate a kit item (`deployspacing`, `fuelvalue`, `floatable_data`).
*   **Returns:** Nothing (modifies `ret` in place).

## Events & listeners
- **Listens to:** `onbuilt` – plays place animation and sound, triggers `CHEVO_makechair` event.  
- **Listens to (rocking chairs only):** `ms_sync_chair_rocking` – synchronizes rocking animations between sitter and chair; `becomesittable` – resets rocking animations.  
- **Pushes:** `CHEVO_makechair` – achievement event when chair is built; `entity_droploot` – via `lootdropper`.  
- **Component callbacks:** `OnSave`, `OnLoad`, `OnBurntFn`, `OnWork`, `OnFinish` (via `workable` and `burnable`).