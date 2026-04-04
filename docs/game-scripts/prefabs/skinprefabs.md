---
id: skinprefabs
title: Skinprefabs
description: This module registers cosmetic skin prefabs for characters, items, structures, and tools using CreatePrefabSkin, defining initialization callbacks, rarity levels, and skin-specific behavior including bloom effects and color changes.
tags: [prefabs, skins, cosmetics, items, characters]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: prefabs
source_hash: 47ea6c09
system_scope: inventory
---

# Skinprefabs

> Based on game build **718694** | Last updated: 2026-04-04

## Overview

The `skinprefabs.lua` file serves as the central registry for all cosmetic skin definitions in Don't Starve Together. It uses the `CreatePrefabSkin` helper function to register hundreds of skin prefabs covering characters, weapons, tools, furniture, structures, clothing, and pets. Each skin definition includes metadata such as rarity level, base prefab reference, initialization callbacks (`init_fn`), and optional skin tags. The module contains specialized logic for certain skins with dynamic behavior, most notably the `backpack_labrat` skin which features bloom effects, color changes based on player insulation status, and event-driven visual reactions to lightning, attacks, haunting, and freezing. The file accumulates all skin definitions into a `prefs` table that is returned for use by the skin system. External initialization functions (named `*_init_fn`) are referenced throughout to apply skin-specific setup logic when instances are created.

## Usage example

```lua
-- Register a custom skin prefab for an item
table.insert(prefs, CreatePrefabSkin("skin_axe_golden", {
    base_prefab = "axe",
    skin_name = "Golden Axe",
    rarity = "rare",
    init_fn = function(inst, skin_custom)
        axe_init_fn(inst, "golden", skin_custom)
    end,
    skin_tags = {"axe", "tool", "golden"}
}))

-- Define initialization callback for a character skin
local function walter_custom_init_fn(inst, skin_custom)
    -- Apply character-specific skin logic
    inst.components.appearance:SetSkinBuild("walter_custom")
end

-- Register character skin with portrait animation
table.insert(prefs, CreatePrefabSkin("walter_victorian", {
    base_prefab = "walter",
    skin_name = "Victorian Walter",
    rarity = "epic",
    init_fn = walter_custom_init_fn,
    portrait_anim = "walter_victorian_portrait"
}))

return prefs
```

## Dependencies & tags

**External dependencies:**
- `CreatePrefabSkin` -- Global function used to register skin prefab definitions into the prefs table.
- `prefs` -- Global or upvalue table used to store registered skin prefabs.
- `Various *_init_fn functions` -- External initialization functions (e.g., goggleshat_init_fn, hammer_init_fn) called by the init_fn closure to apply skin-specific logic.
- `Vector3` -- DST global used for 3D position offset in campfire_cabin skin init_fn.
- `abigail_init_fn` -- Initialization callback function for Abigail character skins.
- `backpack_init_fn` -- External initialization function referenced in skin definitions.
- `treasurechest_init_fn` -- External initialization function called by treasure chest skin init_fn callbacks.
- `winterhat_init_fn` -- Called within init_fn closure to initialize various winter hat skins.

**Components used:**
- `inventoryitem` -- Accessed to change the image name when setting backpack colour.
- `bloomer` -- Used to push bloom effects for the labrat backpack fx.
- `inventory` -- Checked for insulation status to determine lightning reaction.

**Tags:**
- None

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `followfx_postinit(inst, fx)`
* **Description:** Initializes the bloom effect and color for the backpack labrat follow fx.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
  - `fx` -- The follow fx entity instance.
* **Returns:** `nil`
* **Error states:** None

### `initialize(inst)`
* **Description:** Sets up event listeners for the backpack labrat skin to handle lightning and haunted events.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
* **Returns:** `nil`
* **Error states:** None

### `uninitialize(inst)`
* **Description:** Cleans up event listeners and resets backpack labrat properties.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
* **Returns:** `nil`
* **Error states:** None

### `onequip(inst, owner)`
* **Description:** Registers event listeners on the owner when the backpack is equipped.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
  - `owner` -- The player entity equipping the backpack.
* **Returns:** `nil`
* **Error states:** None

### `onunequip(inst, owner)`
* **Description:** Removes event listeners from the owner when the backpack is unequipped.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
  - `owner` -- The player entity unequipping the backpack.
* **Returns:** `nil`
* **Error states:** None

### `onsave(inst, data)`
* **Description:** Saves the backpack labrat colour state.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
  - `data` -- The table to save data into.
* **Returns:** `nil`
* **Error states:** None

### `onload(inst, data, ents)`
* **Description:** Restores the backpack labrat colour state and updates visuals.
* **Parameters:**
  - `inst` -- The entity instance of the backpack.
  - `data` -- The table containing saved data.
  - `ents` -- Entity reference table for loading.
* **Returns:** `nil`
* **Error states:** None

### `init_fn (winona_spotlight_spike)(inst, skin_custom)`
* **Description:** Initialization callback for the winona_spotlight_spike skin that calls winona_spotlight_init_fn.
* **Parameters:**
  - `inst` -- Entity instance of the skin prefab
  - `skin_custom` -- Custom skin data table
* **Returns:** `nil`
* **Error states:** None

## Events & listeners

**Listens to:**
- `haunted` -- Triggered when the entity is haunted by a ghost.

**Pushes:**
- None
