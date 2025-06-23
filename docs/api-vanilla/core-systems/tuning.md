---
title: Tuning System
description: Documentation of the Don't Starve Together tuning system
sidebar_position: 4
slug: /tuning
last_updated: 2023-06-15
build_version: 675312
change_status: stable
---

# Tuning System

The Tuning system in Don't Starve Together provides game balance values that control almost every aspect of gameplay, including damage values, tool durability, character stats, and time settings.

## Version History

| Date | Build | Changes |
|------|-------|---------|
| 2023-06-15 | 675312 | Initial documentation |

## Overview

The Tuning system consists of a global `TUNING` table that contains hundreds of values used to balance the game. This table is populated in `tuning.lua` and provides a central location for adjusting gameplay parameters across the entire game. The tuning values control:

- Character-specific stats (health, hunger, sanity)
- Tool durability and damage values
- Item stack sizes and crafting requirements
- Day/night cycle timing
- Combat mechanics and damage formulas
- World generation parameters
- Creature behavior and spawn rates

These values are used throughout the codebase to maintain consistent game balance and make adjustments easier without changing code logic.

## Core Tuning Tables

The tuning system uses several global tables:

```lua
TUNING = {}           -- Main table containing all balance values
TUNING_MODIFIERS = {} -- Table for functions that modify tuning values
ORIGINAL_TUNING = {}  -- Stores original values when modified
```

## Time Constants

Time is one of the most fundamental tuning aspects, governing the day/night cycle and many game mechanics:

```lua
TUNING.SEG_TIME = 30                -- Time in seconds for one segment
TUNING.TOTAL_DAY_TIME = 480         -- Total day length (16 segments)
TUNING.DAY_SEGS_DEFAULT = 10        -- Number of daytime segments
TUNING.DUSK_SEGS_DEFAULT = 4        -- Number of dusk segments
TUNING.NIGHT_SEGS_DEFAULT = 2       -- Number of night segments
```

## Character Stats

Character base stats are defined in the tuning file:

```lua
TUNING.WILSON_HEALTH = 150          -- Base health
TUNING.WILSON_HUNGER = 150          -- Base hunger capacity
TUNING.WILSON_HUNGER_RATE = 75/480  -- Hunger drain per second
TUNING.WILSON_SANITY = 200          -- Base sanity
```

Other characters often have their stats defined as modifiers of these base values.

## Weapon Damage and Durability

The tuning file defines both damage values and uses (durability) for weapons:

```lua
TUNING.BASE_SURVIVOR_ATTACK = 34    -- Base player damage
TUNING.NIGHTSWORD_DAMAGE = 68       -- Dark Sword damage (2x base)
TUNING.HAMBAT_DAMAGE = 59.5         -- Ham Bat damage (1.75x base)
TUNING.SPEAR_DAMAGE = 34            -- Spear damage (1x base)

TUNING.NIGHTSWORD_USES = 100        -- Dark Sword durability
TUNING.HAMBAT_USES = 100            -- Ham Bat durability
TUNING.SPEAR_USES = 150             -- Spear durability
```

## Stack Sizes

Items have different stack sizes based on their category:

```lua
TUNING.STACK_SIZE_LARGEITEM = 10    -- Large items (logs, rocks)
TUNING.STACK_SIZE_MEDITEM = 20      -- Medium items (grass, twigs)
TUNING.STACK_SIZE_SMALLITEM = 40    -- Small items (berries, seeds)
TUNING.STACK_SIZE_TINYITEM = 60     -- Tiny items (petals, butterfly wings)
```

## Multiplayer Balance

The tuning system includes special multiplayer balance modifiers:

```lua
TUNING.MULTIPLAYER_ATTACK_MODIFIER = 1
TUNING.MULTIPLAYER_GOLDENTOOL_MODIFIER = 1
TUNING.MULTIPLAYER_ARMOR_DURABILITY_MODIFIER = 0.7
TUNING.MULTIPLAYER_ARMOR_ABSORPTION_MODIFIER = 1
```

## Modifying Tuning Values

The tuning system provides a function to safely modify values:

```lua
AddTuningModifier(tuning_var, fn, tuning_value)
```

When using this function:
- `tuning_var`: The TUNING value to modify (e.g., "WILSON_HEALTH")
- `fn`: A function that transforms the value
- `tuning_value`: Default value if the tuning value doesn't exist yet

## Common Tuning Categories

### Tool Durability

```lua
TUNING.AXE_USES = 100
TUNING.HAMMER_USES = 75
TUNING.SHOVEL_USES = 25
TUNING.PITCHFORK_USES = 25
TUNING.PICKAXE_USES = 33
```

### Food & Hunger

```lua
TUNING.CALORIES_TINY = 9.375       -- Tiny food value
TUNING.CALORIES_SMALL = 12.5       -- Small food value
TUNING.CALORIES_MEDSMALL = 18.75   -- Medium-small food value
TUNING.CALORIES_MED = 25           -- Medium food value
TUNING.CALORIES_LARGE = 37.5       -- Large food value
TUNING.CALORIES_HUGE = 75          -- Huge food value
TUNING.CALORIES_SUPERHUGE = 150    -- Super huge food value
```

### Health & Damage

```lua
TUNING.HEALING_TINY = 1            -- Tiny healing
TUNING.HEALING_SMALL = 3           -- Small healing
TUNING.HEALING_MEDSMALL = 8        -- Medium-small healing
TUNING.HEALING_MED = 20            -- Medium healing
TUNING.HEALING_MEDLARGE = 30       -- Medium-large healing
TUNING.HEALING_LARGE = 40          -- Large healing
TUNING.HEALING_HUGE = 60           -- Huge healing
TUNING.HEALING_SUPERHUGE = 100     -- Super huge healing
```

### Sanity

```lua
TUNING.SANITY_SUPERTINY = 1        -- Super tiny sanity change
TUNING.SANITY_TINY = 5             -- Tiny sanity change
TUNING.SANITY_SMALL = 10           -- Small sanity change
TUNING.SANITY_MED = 15             -- Medium sanity change
TUNING.SANITY_MEDLARGE = 20        -- Medium-large sanity change
TUNING.SANITY_LARGE = 33           -- Large sanity change
TUNING.SANITY_HUGE = 50            -- Huge sanity change
```

## In-Game Modification

The tuning system supports runtime modification through:

1. World settings overrides:
```lua
-- In worldsettings_overrides.lua
ApplyTestTuning("tuning_var", new_value)
```

2. Mod overrides, which can replace any tuning value:
```lua
-- In a mod
TUNING.WILSON_HEALTH = 200  -- Change Wilson's health to 200
```

## Character-Specific Tuning

The tuning system includes many character-specific values:

```lua
-- Wendy's ghost sister
TUNING.ABIGAIL_SPEED = 5
TUNING.ABIGAIL_HEALTH = 600
TUNING.ABIGAIL_DAMAGE_PER_SECOND = 10
TUNING.ABIGAIL_FLOWER_COOLDOWN = total_day_time*2

-- WX-78 module system 
TUNING.WX78_HEALTH = 125
TUNING.WX78_HUNGER = 125
TUNING.WX78_SANITY = 150
```

## Related Systems

The tuning system interacts closely with these systems:

- **Constants System**: Defines non-balancing constants
- **Recipe System**: Uses tuning for crafting requirements
- **Character System**: Uses tuning for unique character abilities
- **Combat System**: Uses tuning for damage calculations

## Examples

### Using Tuning Values in Code

```lua
-- Creating a weapon with tuned damage
function MakeWeapon(inst)
    local weapon = inst:AddComponent("weapon")
    weapon:SetDamage(TUNING.SPEAR_DAMAGE)
    weapon:SetRange(TUNING.DEFAULT_ATTACK_RANGE)
end

-- Setting character stats
function SetupCharacter(inst)
    inst.components.health:SetMaxHealth(TUNING.WILSON_HEALTH)
    inst.components.hunger:SetMax(TUNING.WILSON_HUNGER)
    inst.components.sanity:SetMax(TUNING.WILSON_SANITY)
end
```

### Modifying Tuning in a Mod

```lua
-- In modmain.lua
TUNING.SPEAR_DAMAGE = TUNING.SPEAR_DAMAGE * 1.5 -- Make spears 50% stronger

-- Using AddTuningModifier for safer changes
AddTuningModifier("WILSON_HEALTH", function(health) return health * 1.2 end)
```
