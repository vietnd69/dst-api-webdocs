---
id: tuning
title: Tuning
description: Central game balance and configuration system controlling gameplay parameters across Don't Starve Together
sidebar_position: 3
slug: game-scripts/core-systems/tuning
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Tuning

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Tuning` system provides the central game balance and configuration mechanism for Don't Starve Together. It consists of a global `TUNING` table containing hundreds of numeric values that control almost every aspect of gameplay, including damage values, tool durability, character stats, time settings, and world generation parameters. The system enables consistent game balance and facilitates easy adjustments without modifying core game logic.

## Usage Example

```lua
-- Access tuning values for gameplay mechanics
local player_health = TUNING.WILSON_HEALTH  -- 150
local spear_damage = TUNING.SPEAR_DAMAGE    -- 34
local day_length = TUNING.TOTAL_DAY_TIME    -- 480 seconds

-- Use tuning values in component setup
inst.components.health:SetMaxHealth(TUNING.WILSON_HEALTH)
inst.components.weapon:SetDamage(TUNING.SPEAR_DAMAGE)
```

## Global Tables

### TUNING

**Type:** `table`

**Status:** `stable`

**Description:** The main global table containing all game balance values. Populated by the `Tune()` function during game initialization.

**Structure:**
```lua
TUNING = {
    -- Time constants
    SEG_TIME = 30,
    TOTAL_DAY_TIME = 480,
    
    -- Character stats
    WILSON_HEALTH = 150,
    WILSON_HUNGER = 150,
    WILSON_SANITY = 200,
    
    -- Tool durability and damage
    SPEAR_DAMAGE = 34,
    SPEAR_USES = 150,
    
    -- And hundreds more values...
}
```

### TUNING_MODIFIERS

**Type:** `table`

**Status:** `stable`

**Description:** Table storing modifier functions for tuning values that can be dynamically calculated. Used by the `AddTuningModifier()` function.

### ORIGINAL_TUNING

**Type:** `table`

**Status:** `stable`

**Description:** Backup table storing original tuning values before modifications are applied. Used for restoration purposes.

## Core Functions

### Tune(overrides) {#tune-function}

**Status:** `stable`

**Description:** Main function that populates the TUNING table with all game balance values. Called during game initialization with optional override parameters.

**Parameters:**
- `overrides` (table, optional): Table of override values to modify default tuning

**Example:**
```lua
-- Called internally during game startup
Tune() -- Uses default values

-- Called with overrides
Tune({
    wilson_health = 200,  -- Override Wilson's health
    day_time = 300       -- Override day length
})
```

### AddTuningModifier(tuning_var, fn, tuning_value) {#add-tuning-modifier}

**Status:** `stable`

**Description:** Safely modifies tuning values using a transformation function. Stores the original value and applies the modifier function when the value is accessed.

**Parameters:**
- `tuning_var` (string): Name of the TUNING variable to modify (e.g., "WILSON_HEALTH")
- `fn` (function): Function that transforms the value
- `tuning_value` (number): Default value if the tuning variable doesn't exist

**Example:**
```lua
-- Increase Wilson's health by 20%
AddTuningModifier("WILSON_HEALTH", function(health) 
    return health * 1.2 
end, 150)

-- Add difficulty scaling to damage
AddTuningModifier("SPEAR_DAMAGE", function(damage)
    return damage * GetDifficultyMultiplier()
end, 34)
```

## Time Constants

Time values form the foundation of many game mechanics:

### Core Time Values

| Constant | Value | Description |
|----------|-------|-------------|
| `SEG_TIME` | 30 | Duration of one day segment in seconds |
| `TOTAL_DAY_TIME` | 480 | Total day length (16 segments) |
| `DAY_SEGS_DEFAULT` | 10 | Number of daytime segments |
| `DUSK_SEGS_DEFAULT` | 4 | Number of dusk segments |
| `NIGHT_SEGS_DEFAULT` | 2 | Number of night segments |

**Example:**
```lua
-- Calculate time periods
local day_duration = TUNING.SEG_TIME * TUNING.DAY_SEGS_DEFAULT    -- 300 seconds
local dusk_duration = TUNING.SEG_TIME * TUNING.DUSK_SEGS_DEFAULT  -- 120 seconds
local night_duration = TUNING.SEG_TIME * TUNING.NIGHT_SEGS_DEFAULT -- 60 seconds
```

## Character Statistics

### Base Character Values

| Constant | Value | Description |
|----------|-------|-------------|
| `WILSON_HEALTH` | 150 | Base character health |
| `WILSON_HUNGER` | 150 | Base hunger capacity |
| `WILSON_SANITY` | 200 | Base sanity maximum |
| `WILSON_HUNGER_RATE` | 0.15625 | Hunger drain per second (75/480) |
| `WILSON_ATTACK_PERIOD` | 0.4 | Time between attacks |

**Example:**
```lua
-- Set up character components
function SetupCharacterStats(inst)
    inst.components.health:SetMaxHealth(TUNING.WILSON_HEALTH)
    inst.components.hunger:SetMax(TUNING.WILSON_HUNGER)
    inst.components.sanity:SetMax(TUNING.WILSON_SANITY)
    inst.components.hunger:SetRate(TUNING.WILSON_HUNGER_RATE)
end
```

### Character-Specific Values

**WX-78 Statistics:**
```lua
TUNING.WX78_HEALTH = 125    -- Starting health (lower than Wilson)
TUNING.WX78_HUNGER = 125    -- Starting hunger
TUNING.WX78_SANITY = 150    -- Starting sanity
TUNING.WX78_MIN_HEALTH = 150  -- Minimum upgraded health
TUNING.WX78_MAX_HEALTH = 400  -- Maximum upgraded health
```

## Combat System

### Base Damage Values

| Constant | Value | Description |
|----------|-------|-------------|
| `BASE_SURVIVOR_ATTACK` | 34 | Base player unarmed damage |
| `UNARMED_DAMAGE` | 10 | Damage when completely unarmed |
| `DEFAULT_ATTACK_RANGE` | 2 | Standard melee attack range |
| `DEFAULT_HIT_RECOVERY` | 0.75 | Recovery time after being hit |

### Weapon Damage

**Melee Weapons:**
```lua
TUNING.SPEAR_DAMAGE = 34              -- 1x base damage
TUNING.NIGHTSWORD_DAMAGE = 68         -- 2x base damage
TUNING.HAMBAT_DAMAGE = 59.5           -- 1.75x base damage
TUNING.BATBAT_DAMAGE = 42.5           -- 1.25x base damage
TUNING.SPIKE_DAMAGE = 51              -- 1.5x base damage
TUNING.RUINS_BAT_DAMAGE = 59.5        -- 1.75x base damage
```

**Tool Damage:**
```lua
TUNING.AXE_DAMAGE = 27.2              -- 0.8x base damage
TUNING.PICKAXE_DAMAGE = 27.2          -- 0.8x base damage
TUNING.HAMMER_DAMAGE = 17             -- 0.5x base damage
TUNING.TORCH_DAMAGE = 17              -- 0.5x base damage
```

### Weapon Durability

**Melee Weapons:**
```lua
TUNING.SPEAR_USES = 150
TUNING.NIGHTSWORD_USES = 100
TUNING.HAMBAT_USES = 100
TUNING.BATBAT_USES = 75
TUNING.RUINS_BAT_USES = 200
```

**Tools:**
```lua
TUNING.AXE_USES = 100
TUNING.PICKAXE_USES = 33
TUNING.HAMMER_USES = 75
TUNING.SHOVEL_USES = 25
TUNING.PITCHFORK_USES = 25
```

## Item Stack Sizes

Different item categories have different maximum stack sizes:

| Constant | Value | Category | Examples |
|----------|-------|----------|----------|
| `STACK_SIZE_LARGEITEM` | 10 | Large items | Logs, rocks, gold |
| `STACK_SIZE_MEDITEM` | 20 | Medium items | Grass, twigs, flint |
| `STACK_SIZE_SMALLITEM` | 40 | Small items | Berries, seeds, petals |
| `STACK_SIZE_TINYITEM` | 60 | Tiny items | Butterfly wings, flower petals |
| `STACK_SIZE_PELLET` | 120 | Pellet items | Gunpowder pellets |

**Example:**
```lua
-- Set appropriate stack size for an item
function SetItemStackSize(inst, category)
    local stack_size = TUNING["STACK_SIZE_" .. string.upper(category)]
    inst.components.stackable:SetStackSize(stack_size)
end
```

## Food and Healing Values

### Hunger (Calories) Values

| Constant | Value | Description |
|----------|-------|-------------|
| `CALORIES_TINY` | 9.375 | Tiny food value |
| `CALORIES_SMALL` | 12.5 | Small food value |
| `CALORIES_MEDSMALL` | 18.75 | Medium-small food value |
| `CALORIES_MED` | 25 | Medium food value |
| `CALORIES_LARGE` | 37.5 | Large food value |
| `CALORIES_HUGE` | 75 | Huge food value |
| `CALORIES_SUPERHUGE` | 150 | Super huge food value |

### Health Values

| Constant | Value | Description |
|----------|-------|-------------|
| `HEALING_TINY` | 1 | Tiny healing amount |
| `HEALING_SMALL` | 3 | Small healing amount |
| `HEALING_MEDSMALL` | 8 | Medium-small healing |
| `HEALING_MED` | 20 | Medium healing amount |
| `HEALING_MEDLARGE` | 30 | Medium-large healing |
| `HEALING_LARGE` | 40 | Large healing amount |
| `HEALING_HUGE` | 60 | Huge healing amount |
| `HEALING_SUPERHUGE` | 100 | Super huge healing |

### Sanity Values

| Constant | Value | Description |
|----------|-------|-------------|
| `SANITY_SUPERTINY` | 1 | Super tiny sanity change |
| `SANITY_TINY` | 5 | Tiny sanity change |
| `SANITY_SMALL` | 10 | Small sanity change |
| `SANITY_MED` | 15 | Medium sanity change |
| `SANITY_MEDLARGE` | 20 | Medium-large sanity change |
| `SANITY_LARGE` | 33 | Large sanity change |
| `SANITY_HUGE` | 50 | Huge sanity change |

**Example:**
```lua
-- Set food component values
function SetFoodValues(inst, hunger_size, health_size, sanity_size)
    local hunger_val = TUNING["CALORIES_" .. string.upper(hunger_size)]
    local health_val = TUNING["HEALING_" .. string.upper(health_size)]
    local sanity_val = TUNING["SANITY_" .. string.upper(sanity_size)]
    
    inst.components.edible.hungervalue = hunger_val
    inst.components.edible.healthvalue = health_val
    inst.components.edible.sanityvalue = sanity_val
end
```

## Multiplayer Balance Modifiers

The tuning system includes special modifiers for multiplayer balance:

| Constant | Value | Description |
|----------|-------|-------------|
| `MULTIPLAYER_ATTACK_MODIFIER` | 1 | Player damage modifier in multiplayer |
| `MULTIPLAYER_GOLDENTOOL_MODIFIER` | 1 | Golden tool efficiency modifier |
| `MULTIPLAYER_ARMOR_DURABILITY_MODIFIER` | 0.7 | Armor durability modifier (reduced) |
| `MULTIPLAYER_ARMOR_ABSORPTION_MODIFIER` | 1 | Armor absorption modifier |
| `MULTIPLAYER_WILDLIFE_RESPAWN_MODIFIER` | 1 | Wildlife respawn rate modifier |

**Example:**
```lua
-- Apply multiplayer balance in damage calculations
function CalculatePlayerDamage(base_damage)
    return base_damage * TUNING.MULTIPLAYER_ATTACK_MODIFIER
end

-- Apply multiplayer balance to armor durability
function SetArmorDurability(inst, base_uses)
    local multiplayer_uses = base_uses * TUNING.MULTIPLAYER_ARMOR_DURABILITY_MODIFIER
    inst.components.armor:SetMaxUses(multiplayer_uses)
end
```

## Ocean and Fishing System

The tuning system includes extensive values for ocean fishing mechanics:

### Ocean Fishing Constants

```lua
TUNING.OCEAN_FISHING = {
    MAX_CAST_DIST = 16,              -- Maximum fishing cast distance
    REEL_STRENGTH_MIN = 2,           -- Minimum reel strength
    REEL_STRENGTH_MAX = 3,           -- Maximum reel strength
    LINE_TENSION_HIGH = 0.80,        -- High tension threshold
    LINE_TENSION_GOOD = 0.10,        -- Good tension threshold
    FISHING_CATCH_DIST = 2.5,        -- Distance to catch fish
}
```

### Tackle and Lure Systems

**Bobber Accuracy Modifiers:**
```lua
TUNING.OCEANFISHING_TACKLE = {
    BASE = {
        dist_max = 5,
        dist_min_accuracy = 0.70,
        dist_max_accuracy = 1.30,
        max_angle_offset = 40
    },
    BOBBER_TWIG = {
        dist_max = 2,
        dist_min_accuracy = 0.10,
        max_angle_offset = -10
    }
}
```

## Common Usage Patterns

### Using Tuning Values in Components

```lua
-- Weapon component setup
function SetupWeapon(inst, weapon_type)
    local damage_key = string.upper(weapon_type) .. "_DAMAGE"
    local uses_key = string.upper(weapon_type) .. "_USES"
    
    inst.components.weapon:SetDamage(TUNING[damage_key] or TUNING.BASE_SURVIVOR_ATTACK)
    inst.components.finiteuses:SetMaxUses(TUNING[uses_key] or 100)
end

-- Character stat scaling
function ScaleCharacterStats(inst, scale_factor)
    local base_health = TUNING.WILSON_HEALTH
    local base_hunger = TUNING.WILSON_HUNGER
    local base_sanity = TUNING.WILSON_SANITY
    
    inst.components.health:SetMaxHealth(base_health * scale_factor)
    inst.components.hunger:SetMax(base_hunger * scale_factor)
    inst.components.sanity:SetMax(base_sanity * scale_factor)
end
```

### Modifying Tuning Values

```lua
-- Simple value modification
TUNING.WILSON_HEALTH = 200  -- Direct assignment

-- Safe modification with AddTuningModifier
AddTuningModifier("SPEAR_DAMAGE", function(damage)
    return damage * 1.5  -- 50% damage increase
end, TUNING.SPEAR_DAMAGE)

-- Conditional modification
if GetGameMode() == "easy" then
    TUNING.WILSON_HEALTH = TUNING.WILSON_HEALTH * 1.5
    TUNING.WILSON_HUNGER_RATE = TUNING.WILSON_HUNGER_RATE * 0.75
end
```

### Creating Custom Tuning Categories

```lua
-- Add custom tuning values for mods
TUNING.CUSTOM_WEAPON_DAMAGE = TUNING.BASE_SURVIVOR_ATTACK * 1.3
TUNING.CUSTOM_TOOL_USES = 200
TUNING.CUSTOM_FOOD_VALUE = TUNING.CALORIES_LARGE * 1.2

-- Function to batch-set custom values
function AddCustomTuning(custom_values)
    for key, value in pairs(custom_values) do
        TUNING["CUSTOM_" .. string.upper(key)] = value
    end
end
```

## Integration Notes

### Relationship to Other Systems

The tuning system integrates with virtually all game systems:

- **Component System**: Components use tuning values for initialization
- **Recipe System**: Crafting costs and requirements reference tuning values
- **World Generation**: Spawn rates and world parameters use tuning constants
- **Character System**: Character-specific abilities and stats are tuned
- **Combat System**: All damage and defense calculations use tuning values

### Performance Considerations

- Tuning values are resolved at startup, not runtime
- Direct table access (`TUNING.VALUE`) is very fast (O(1) lookup)
- Modifier functions add slight overhead but provide flexibility
- Consider caching frequently accessed tuning calculations

### Mod Compatibility

The tuning system is designed for mod compatibility:

- Mods can safely override any tuning value
- `AddTuningModifier()` provides safer modification for complex logic
- Original values are preserved in `ORIGINAL_TUNING` table
- Multiple mods can modify the same values if done carefully

## Related Modules

- [Tuning Override](./tuning_override.md): System for disabling specific game mechanics
- [Constants](./constants.md): Non-tunable game constants and enumerations
- [Recipe System](./recipes.md): Crafting system that uses tuning values
- [Component System](../components/index.md): Components that implement tuning values

## Source Reference

**File Location:** `scripts/tuning.lua`

**Global Access:** Available globally as `TUNING` table

**Key Functions:**
- `Tune(overrides)`: Main initialization function
- `AddTuningModifier(tuning_var, fn, tuning_value)`: Safe modification utility

**Dependencies:** 
- `techtree.lua`: Technology tree definitions
