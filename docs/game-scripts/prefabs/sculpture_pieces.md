---
id: sculpture_pieces
title: Sculpture Pieces
description: Represents collectible, reusable sculpture parts used in crafting and inventory; equipped to modify character appearance.
tags: [crafting, inventory, appearance]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aca08ab0
system_scope: inventory
---

# Sculpture Pieces

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sculpture_pieces.lua` file defines prefabs for three distinct decorative sculpture components (knight head, bishop head, and rook nose). These are unique, non-potable, heavy items that can be equipped to a character's body slot to override the `swap_body` animation symbol—visually altering the character's appearance. They are also salvageable, repairable using `MATERIALS.SCULPTURE`, and hauntable. The prefabs are created via a factory function `makepiece(name)` and are not singular components but rather full prefab definitions.

## Usage example
```lua
-- Example of adding and equipping a sculpture piece (e.g., knight head)
local inst = CreateEntity()
inst:AddPrefab("sculpture_knighthead")
inst.components.equippable:Equip()
-- Equipped: character's swap_body animation symbol is replaced with "swap_sculpture_knighthead"
inst.components.equippable:Unequip()
-- Unequipped: the override symbol is cleared
```

## Dependencies & tags
**Components used:**  
`heavyobstaclephysics`, `inspectable`, `inventoryitem`, `equippable`, `repairer`, `submersible`, `symbolswapdata`, `hauntable`  

**Tags added:**  
`irreplaceable`, `nonpotatable`, `heavy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"SUSPICIOUSMARBLE"` | Used for scrapbook categorization. |
| `scrapbook_scale` | number | `0.85` | Scale factor for scrapbook preview. |
| ` PHYSICS_RADIUS` | number | `0.1` | Global constant used for physics and minimap radius. |

## Main functions
### `makepiece(name)`
* **Description:** Factory function that constructs a prefab for a sculpture piece of a given name (e.g., `"knighthead"`), configuring its visual, physical, and gameplay properties.
* **Parameters:**  
  `name` (string) — The identifier used to construct asset paths and swap symbol names (e.g., `"swap_sculpture_"..name`).  
* **Returns:** A `Prefab` instance for `sculpture_`..`name`.  
* **Error states:** None.

### `onequip(inst, owner)`
* **Description:** Called when the sculpture piece is equipped. Sets the `swap_body` animation symbol override on the owner to the sculpture-specific animation bank.
* **Parameters:**  
  `inst` (Entity) — The sculpture piece instance.  
  `owner` (Entity) — The character equipper.  
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Called when the sculpture piece is unequipped. Clears the `swap_body` animation override on the owner.
* **Parameters:**  
  `inst` (Entity) — The sculpture piece instance.  
  `owner` (Entity) — The character unequipper.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly defined in this file. (Components like `submersible` and `heavyobstaclephysics` may internally register listeners.)
- **Pushes:** None explicitly defined in this file.