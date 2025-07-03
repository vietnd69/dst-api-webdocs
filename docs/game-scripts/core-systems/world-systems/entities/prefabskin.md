---
id: prefabskin
title: Prefab Skins
description: Visual skin system for customizing prefab appearance and functionality
sidebar_position: 5
slug: game-scripts/core-systems/prefabskin
last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Prefab Skins

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added flotationcushion and sisturn skin functions |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `prefabskin` module provides a comprehensive system for applying visual and functional skins to prefabs in Don't Starve Together. It handles skin application, clearing, sound effects, and specialized skin behaviors for different types of items including equipment, furniture, and tools.

## Usage Example

```lua
-- Apply a skin to an item
local function ApplySkinToItem(inst, skin_name)
    if inst.SetSkin then
        inst:SetSkin(skin_name)
    end
end

-- Basic skin functions
basic_init_fn(inst, "backpack_luxury", "swap_backpack")
basic_clear_fn(inst, "swap_backpack")
```

## Configuration Tables

### BASE_TORSO_TUCK {#base-torso-tuck}

**Type:** `table`

**Status:** `stable`

**Description:**
Defines how torso skins interact with other clothing layers.

**Values:**
- `"full"` - Torso goes behind pelvis slot
- `"none"` - Torso goes above the skirt  
- `"skirt"` - Torso goes between skirt and pelvis (default)

**Example:**
```lua
-- Configure torso tucking for a specific skin
BASE_TORSO_TUCK["fancy_shirt"] = "full"
```

### BASE_ALTERNATE_FOR_BODY / BASE_ALTERNATE_FOR_SKIRT {#base-alternate}

**Type:** `table`

**Status:** `stable`

**Description:**
Defines alternate builds for body and skirt components when certain skins are applied.

### SKIN_FX_PREFAB {#skin-fx-prefab}

**Type:** `table`

**Status:** `stable`

**Description:**
Maps skin names to special effect prefabs that should be spawned with the skin.

### SKIN_SOUND_FX {#skin-sound-fx}

**Type:** `table`

**Status:** `stable`

**Description:**
Maps skin names to sound effect configurations for various interactions.

**Structure:**
```lua
SKIN_SOUND_FX["skin_name"] = {
    hit = "sound_id",           -- Weapon hit sounds
    small = "sound_id",         -- Small whip sounds
    large = "sound_id",         -- Large whip sounds
    equip = "sound_id",         -- Equipment sounds
    place = "sound_id",         -- Chest place sounds
    open = "sound_id",          -- Chest open sounds
    close = "sound_id",         -- Chest close sounds
    wrap = "sound_id",          -- Bundle wrap sounds
    net = "sound_id",           -- Bug net sounds
    genericuse = "sound_id",    -- Generic use sounds
    cast = "sound_id",          -- Staff cast sounds
    preteleport = "sound_id",   -- Orange staff pre-teleport
    postteleport = "sound_id",  -- Orange staff post-teleport
}
```

## Core Skin Functions

### AddSkinSounds(inst) {#addskinSounds}

**Status:** `stable`

**Description:**
Applies sound effects to an instance based on its skin configuration.

**Parameters:**
- `inst` (EntityScript): The entity instance to apply sounds to

**Example:**
```lua
-- Automatically called when skins are applied
-- Adds appropriate sound overrides based on SKIN_SOUND_FX data
```

### RemoveSkinSounds(inst) {#removeskinsounds}

**Status:** `stable`

**Description:**
Removes all skin-specific sound effects from an instance.

**Parameters:**
- `inst` (EntityScript): The entity instance to remove sounds from

### basic_init_fn(inst, build_name, def_build, filter_fn) {#basic-init-fn}

**Status:** `stable`

**Description:**
Standard initialization function for applying skins to basic items.

**Parameters:**
- `inst` (EntityScript): The entity instance
- `build_name` (string): Name of the skin build to apply
- `def_build` (string): Default build name to fall back to
- `filter_fn` (function, optional): Function to filter/modify skin names

**Example:**
```lua
-- Apply a backpack skin
basic_init_fn(inst, "backpack_luxury", "swap_backpack")

-- Apply with custom filter
basic_init_fn(inst, "weapon_golden", "sword", function(skin_name)
    return skin_name .. "_special"
end)
```

### basic_clear_fn(inst, def_build) {#basic-clear-fn}

**Status:** `stable`

**Description:**
Standard function for removing skins and reverting to default appearance.

**Parameters:**
- `inst` (EntityScript): The entity instance
- `def_build` (string): Default build to revert to

**Example:**
```lua
-- Remove skin and revert to default
basic_clear_fn(inst, "swap_backpack")
```

## Specialized Skin Functions

### Backpack Skins

#### backpack_init_fn(inst, build_name, fns) {#backpack-init-fn}

**Status:** `stable`

**Description:**
Specialized skin initialization for backpack items with additional functionality callbacks.

**Parameters:**
- `inst` (EntityScript): The backpack instance
- `build_name` (string): Skin build name
- `fns` (table): Table containing `initialize` and `uninitialize` callback functions

**Example:**
```lua
local backpack_skin_fns = {
    initialize = function(inst)
        -- Custom initialization for this skin
        inst:AddTag("fancy_backpack")
    end,
    uninitialize = function(inst)
        -- Cleanup when skin is removed
        inst:RemoveTag("fancy_backpack")
    end
}

backpack_init_fn(inst, "backpack_luxury", backpack_skin_fns)
```

#### backpack_clear_fn(inst) {#backpack-clear-fn}

**Status:** `stable`

**Description:**
Removes backpack skin and calls cleanup functions.

**Parameters:**
- `inst` (EntityScript): The backpack instance

### Weapon Skins

#### hambat_init_fn(inst, build_name) {#hambat-init-fn}

**Status:** `stable`

**Description:**
Applies skin to ham bat weapons.

#### batbat_init_fn(inst, build_name) {#batbat-init-fn}

**Status:** `stable`

**Description:**
Applies skin to bat bat weapons.

#### boomerang_init_fn(inst, build_name) {#boomerang-init-fn}

**Status:** `stable`

**Description:**
Applies skin to boomerang weapons.

### Armor Skins

#### armor_bramble_init_fn(inst, build_name) {#armor-bramble-init-fn}

**Status:** `stable`

**Description:**
Applies skin to bramble armor with specialized handling.

### Equipment Skins

#### beef_bell_init_fn(inst, build_name) {#beef-bell-init-fn}

**Status:** `stable`

**Description:**
Applies skin to beef bell with special inventory icon handling for linked/unlinked states.

#### eyeturret_init_fn(inst, build_name) {#eyeturret-init-fn}

**Status:** `stable`

**Description:**
Complex skin application for eye turrets including symbol overrides and base structure integration.

### Furniture Skins

#### wood_chair_init_fn(inst, build_name) {#wood-chair-init-fn}

**Status:** `stable`

**Description:**
Applies skin to wooden chairs including back component synchronization.

#### stone_table_round_init_fn(inst, build_name) {#stone-table-round-init-fn}

**Status:** `stable`

**Description:**
Applies skin to round stone tables.

### Special Item Skins

#### staff_tornado_init_fn(inst, build_name) {#staff-tornado-init-fn}

**Status:** `stable`

**Description:**
Applies skin to tornado staff and sets up linked skin name for tornado effects.

**Example:**
```lua
-- Links tornado staff skin to tornado effect skin
-- "tornado_stick_fire" becomes linked to "tornado_fire"
```

#### succulent_potted_init_fn(inst, build_name) {#succulent-potted-init-fn}

**Status:** `stable`

**Description:**
Applies skin to potted succulents with plant component clearing.

#### flotationcushion_init_fn(inst, build_name) {#flotationcushion-init-fn}

**Status:** `added in 676312`

**Source:** [dst-scripts/prefabskin.lua](mdc:dst-api-webdocs/dst-scripts/prefabskin.lua)

**Description:**
Applies skin to flotation cushion items. Uses basic initialization with default "flotationcushion" build.

**Parameters:**
- `inst` (EntityScript): The flotation cushion instance
- `build_name` (string): Name of the skin build to apply

**Example:**
```lua
flotationcushion_init_fn(inst, "flotationcushion_formal")
```

#### flotationcushion_clear_fn(inst, build_name) {#flotationcushion-clear-fn}

**Status:** `added in 676312`

**Description:**
Removes skin from flotation cushion and reverts to default appearance.

**Parameters:**
- `inst` (EntityScript): The flotation cushion instance
- `build_name` (string): Build name (unused but maintains function signature)

#### sisturn_init_fn(inst, build_name) {#sisturn-init-fn}

**Status:** `modified in 676312`

**Source:** [dst-scripts/prefabskin.lua](mdc:dst-api-webdocs/dst-scripts/prefabskin.lua)

**Description:**
Applies skin to sister turn decorative furniture. Enhanced to include flower decoration updates alongside sound effects.

**Parameters:**
- `inst` (EntityScript): The sister turn instance
- `build_name` (string): Name of the skin build to apply

**Example:**
```lua
sisturn_init_fn(inst, "sisturn_marble")
-- Updates both visual skin and flower decorations
```

**Version History:**
- Modified in build 676312: Added `UpdateFlowerDecor()` call for proper decoration synchronization

#### sisturn_clear_fn(inst) {#sisturn-clear-fn}

**Status:** `modified in 676312`

**Description:**
Removes skin from sister turn and reverts to default appearance. Enhanced to update flower decorations when clearing skins.

**Parameters:**
- `inst` (EntityScript): The sister turn instance

**Version History:**
- Modified in build 676312: Added `UpdateFlowerDecor()` call to ensure decorations are properly reset

## Character Equipment Skins

### Clothing Integration

The skin system integrates with character clothing systems:

```lua
-- Torso items can be configured for layering
BASE_TORSO_TUCK["fancy_vest"] = "none"  -- Appears above skirts
BASE_TORSO_TUCK["tucked_shirt"] = "full" -- Goes behind pelvis

-- Alternate builds for compatibility
BASE_ALTERNATE_FOR_BODY["special_skin"] = "alternate_body_build"
BASE_ALTERNATE_FOR_SKIRT["special_skin"] = "alternate_skirt_build"
```

### Hat and Accessory Skins

```lua
-- Desert hat skins
deserthat_init_fn(inst, "hat_desert_safari")

-- Goggle hat skins  
goggleshat_init_fn(inst, "hat_goggles_steampunk")

-- Beefalo hat skins
beefalohat_init_fn(inst, "beefalohat_royal")
```

## Advanced Skin Features

### Winona Battery Skins

The system includes complex skin handling for Winona's battery items:

```lua
-- High-power battery with multiple symbol overrides
winona_battery_high_init_fn(inst, "winonabattery_high_glass")

-- Handles both placed batteries and inventory items
-- Synchronizes multiple visual components
```

### Container Skins

Special handling for containers that change appearance when opened:

```lua
-- Chest skins with open/closed states
magician_chest_init_fn(inst, "chest_magician_tesla")

-- Handles inventory icon changes for container states
```

### Sound Integration

Skins can override interaction sounds:

```lua
-- Define custom sounds for a weapon skin
SKIN_SOUND_FX["sword_crystal"] = {
    hit = "crystal_sword_hit",
    equip = "crystal_sword_equip"
}

-- Sounds are automatically applied when skin is set
```

## Common Usage Patterns

### Creating a New Skin

```lua
-- 1. Define the skin function
function my_item_royal_init_fn(inst, build_name)
    basic_init_fn(inst, build_name, "my_item_default")
    
    -- Add any special behavior
    if not TheWorld.ismastersim then
        return
    end
    
    -- Custom skin logic
    inst:AddTag("royal_quality")
end

function my_item_royal_clear_fn(inst)
    basic_clear_fn(inst, "my_item_default")
    inst:RemoveTag("royal_quality")
end

-- 2. Register custom sounds if needed
SKIN_SOUND_FX["my_item_royal"] = {
    equip = "royal_item_equip",
    genericuse = "royal_item_use"
}
```

### Complex Multi-Component Skins

```lua
-- For items with multiple visual components
function complex_item_init_fn(inst, build_name)
    basic_init_fn(inst, build_name, "complex_item_default")
    
    -- Update related components
    if inst.secondary_component then
        inst.secondary_component.AnimState:SetSkin(build_name, "secondary_default")
    end
    
    -- Update linked entities
    if inst.attached_effect then
        inst.attached_effect:SetSkin(build_name:gsub("item_", "effect_"))
    end
end
```

## Related Modules

- [Prefab Skins Data](./prefabskins.md): Skin definitions and mappings
- [Prefabs](./prefabs.md): Core prefab system
- [Skin Assets](./skin_assets.md): Asset management for skins
- [Character Utilities](./characterutil.md): Character-specific skin handling
