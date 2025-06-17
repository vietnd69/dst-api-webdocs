---
id: tuning
title: TUNING System
sidebar_position: 12
last_updated: 2024-05-01
---
*Last Update: 2024-05-01*
# TUNING System

*API Version: 624447*

The `TUNING` table is a central configuration system in Don't Starve Together that stores game balance values, constants, and settings that affect virtually every aspect of gameplay. It contains thousands of values that determine everything from character stats and creature behaviors to item properties and world settings.

## Overview

The `TUNING` table acts as a global repository for game balance values. Using a centralized table for these constants makes it easier to:

1. Balance the game holistically
2. Modify game parameters through modding
3. Maintain consistency across similar objects

## Basic Usage

`TUNING` values can be accessed directly in any script that has access to the global scope:

```lua
-- Reference TUNING values directly in game scripts
local max_health = TUNING.WILSON_HEALTH
local spear_damage = TUNING.SPEAR_DAMAGE

-- Use TUNING values for component initialization
inst.components.health:SetMaxHealth(TUNING.PIG_HEALTH)
inst.components.combat:SetDefaultDamage(TUNING.PIG_DAMAGE)
inst.components.combat:SetAttackPeriod(TUNING.PIG_ATTACK_PERIOD)
```

## Accessing TUNING in Mods

For mod scripts, you need to access `TUNING` through the global namespace:

```lua
-- In modmain.lua
local TUNING = GLOBAL.TUNING

-- Access values via the local reference
print("Default player health:", TUNING.WILSON_HEALTH)

-- Or access directly through GLOBAL
print("Default player health:", GLOBAL.TUNING.WILSON_HEALTH)
```

## Key TUNING Categories

### Character Stats

```lua
-- Base character values (Wilson's values are the standard)
TUNING.WILSON_HEALTH = 150           -- Base health
TUNING.WILSON_HUNGER = 150           -- Stomach size
TUNING.WILSON_SANITY = 200           -- Max sanity
TUNING.WILSON_ATTACK_PERIOD = 0.4    -- Attack cooldown
TUNING.WILSON_HUNGER_RATE = 75/480   -- Hunger drain per segment

-- Other character-specific values
TUNING.WENDY_HEALTH = 150
TUNING.ABIGAIL_LIGHTING.INTENSITY = 0.8
TUNING.WOLFGANG_HUNGER = 200
TUNING.WOLFGANG_HUNGER_RATE_MULT_WIMPY = 1.5
```

### Item Properties

```lua
-- Weapon damage
TUNING.SPEAR_DAMAGE = 34
TUNING.AXE_DAMAGE = 27.2
TUNING.NIGHTSWORD_DAMAGE = 68

-- Tool uses (durability)
TUNING.AXE_USES = 100
TUNING.PICKAXE_USES = 33
TUNING.SHOVEL_USES = 25
TUNING.HAMMER_USES = 75
TUNING.SPEAR_USES = 150

-- Stack sizes
TUNING.STACK_SIZE_LARGEITEM = 10
TUNING.STACK_SIZE_MEDITEM = 20
TUNING.STACK_SIZE_SMALLITEM = 40
TUNING.STACK_SIZE_TINYITEM = 60

-- Light values
TUNING.TORCH_LIGHT = 2.5
TUNING.CAMPFIRE_LIGHT_RADIUS = 3.0
TUNING.FIREPIT_LIGHT_RADIUS = 3.5
```

### Creature Stats

```lua
-- Pig stats
TUNING.PIG_HEALTH = 250
TUNING.PIG_DAMAGE = 33
TUNING.PIG_ATTACK_PERIOD = 3
TUNING.PIG_TARGET_DIST = 16
TUNING.PIG_MAX_STUN_LOCKS = 2

-- Spider stats
TUNING.SPIDER_HEALTH = 100
TUNING.SPIDER_DAMAGE = 20
TUNING.SPIDER_ATTACK_PERIOD = 3
TUNING.SPIDER_TARGET_DIST = 4
TUNING.SPIDER_WARRIOR_HEALTH = 200
TUNING.SPIDER_WARRIOR_DAMAGE = 20
```

### Time and World Settings

```lua
-- Time constants
TUNING.SEG_TIME = 30                 -- Seconds per segment
TUNING.TOTAL_DAY_TIME = 480          -- Seconds in a full day (16 segments)
TUNING.DAY_SEGS_DEFAULT = 10         -- Number of day segments
TUNING.DUSK_SEGS_DEFAULT = 4         -- Number of dusk segments
TUNING.NIGHT_SEGS_DEFAULT = 2        -- Number of night segments

-- Food spoilage times (in days)
TUNING.PERISH_SUPERFAST = 1
TUNING.PERISH_FAST = 2
TUNING.PERISH_MED = 6
TUNING.PERISH_SLOW = 10
TUNING.PERISH_PRESERVED = 20
```

### Food and Healing Values

```lua
-- Hunger restoration
TUNING.CALORIES_TINY = 9.375
TUNING.CALORIES_SMALL = 12.5
TUNING.CALORIES_MEDSMALL = 18.75
TUNING.CALORIES_MED = 25
TUNING.CALORIES_LARGE = 37.5
TUNING.CALORIES_HUGE = 75

-- Health restoration
TUNING.HEALING_TINY = 1
TUNING.HEALING_SMALL = 3
TUNING.HEALING_MEDSMALL = 8
TUNING.HEALING_MED = 20
TUNING.HEALING_MEDLARGE = 30
TUNING.HEALING_LARGE = 40
TUNING.HEALING_HUGE = 60

-- Sanity restoration
TUNING.SANITY_SUPERTINY = 1
TUNING.SANITY_TINY = 5
TUNING.SANITY_SMALL = 10
TUNING.SANITY_MED = 15
TUNING.SANITY_MEDLARGE = 20
TUNING.SANITY_LARGE = 33
TUNING.SANITY_HUGE = 50
```

### Combat and Damage

```lua
-- Damage types multipliers
TUNING.FIRE_DAMAGE_MULT = 1.0
TUNING.ELECTRIC_DAMAGE_MULT = 1.5
TUNING.POISON_DAMAGE_MULT = 1.0
TUNING.ICE_DAMAGE_MULT = 1.0

-- Combat tuning
TUNING.PLAYER_DAMAGE_TAKEN_MOD = 1.0
TUNING.SPRING_COMBAT_MOD = 1.33      -- Combat modifier during spring
```

## Nested TUNING Structures

Some TUNING values are organized in nested tables for better organization:

```lua
-- Boat settings
TUNING.BOAT = {
    HEALTH = 600,
    MASS = 1000,
    SAIL_FORCE = 5,
    RUDDER_TURN_SPEED = 0.6,
    WIND_FORCE = 1.2,
    WAVE_FORCE = 2.0,
    DRAG = 0.15
}

-- Character-specific TUNING
TUNING.WARLY_FOOD_MULT = {
    SANITY = 1.2,
    HEALTH = 1.3,
    HUNGER = 1.2
}

-- Tech tree definitions
TUNING.PROTOTYPER_TREES = {
    SCIENCEMACHINE = TechTree.Create({
        SCIENCE = 1
    }),
    ALCHEMYMACHINE = TechTree.Create({
        SCIENCE = 2,
        MAGIC = 1
    }),
    SHADOWMANIPULATOR = TechTree.Create({
        MAGIC = 3
    }),
    ANCIENTALTAR_LOW = TechTree.Create({
        ANCIENT = 2
    })
}
```

## Modifying TUNING Values

You can modify `TUNING` values in mods to change game balance:

```lua
-- In modmain.lua
-- Modify character stats
GLOBAL.TUNING.WILSON_HEALTH = 200        -- Increase Wilson's health
GLOBAL.TUNING.WILSON_HUNGER_RATE = 0.5   -- Decrease hunger drain rate

-- Modify weapon damage
GLOBAL.TUNING.SPEAR_DAMAGE = 40          -- Increase spear damage
GLOBAL.TUNING.HAMBAT_DAMAGE = 70         -- Increase ham bat damage

-- Add new TUNING values for your mod
GLOBAL.TUNING.MYMOD = {
    SPECIAL_ITEM_DAMAGE = 50,
    SPECIAL_ITEM_USES = 150,
    CUSTOM_CREATURE_HEALTH = 300
}
```

## Creating Character-Specific TUNING Values

For custom characters, it's a good practice to add your character's TUNING values:

```lua
-- In modmain.lua
GLOBAL.TUNING.CUSTOMCHARACTER_HEALTH = 120
GLOBAL.TUNING.CUSTOMCHARACTER_HUNGER = 175
GLOBAL.TUNING.CUSTOMCHARACTER_SANITY = 180
GLOBAL.TUNING.CUSTOMCHARACTER_DAMAGE_MULTIPLIER = 1.2
```

## Best Practices

1. **Reference existing values**: Scale your new values relative to existing ones for better balance.
   ```lua
   TUNING.MYITEM_DAMAGE = TUNING.SPEAR_DAMAGE * 1.2  -- 20% stronger than a spear
   ```

2. **Use the namespace pattern**: Group related values in a nested table.
   ```lua
   TUNING.MYMOD = {
       ITEM_DAMAGE = 30,
       ITEM_USES = 100,
       CREATURE_HEALTH = 200
   }
   ```

3. **Document your changes**: Add comments explaining significant balance changes.
   ```lua
   -- Increased to make early game less punishing
   TUNING.HUNGER_RATE = TUNING.WILSON_HUNGER_RATE * 0.8
   ```

4. **Be consistent with naming**: Follow the all-caps convention and descriptive naming.
   ```lua
   -- Good: Clear, descriptive, all caps
   TUNING.MYITEM_DAMAGE = 35
   
   -- Bad: Inconsistent with game convention
   TUNING.myItemDamage = 35
   ```

## Common TUNING Values Reference

Below is a reference of commonly used TUNING values by category:

### Character Stats
- `WILSON_HEALTH`: 150
- `WILSON_HUNGER`: 150
- `WILSON_SANITY`: 200
- `WILSON_ATTACK_PERIOD`: 0.4
- `WILSON_HUNGER_RATE`: 75/480 (~0.156)
- `WILSON_WALK_SPEED`: 4
- `WILSON_RUN_SPEED`: 6

### Weapon Damage
- `NIGHTSWORD_DAMAGE`: 68
- `SPEAR_DAMAGE`: 34
- `HAMBAT_DAMAGE`: 59.5
- `AXE_DAMAGE`: 27.2
- `BATBAT_DAMAGE`: 42.5
- `RUINS_BAT_DAMAGE`: 59.5
- `WATHGRITHR_SPEAR_DAMAGE`: 42.5

### Tool Durability
- `AXE_USES`: 100
- `PICKAXE_USES`: 33
- `SHOVEL_USES`: 25
- `HAMMER_USES`: 75
- `SPEAR_USES`: 150
- `FISHINGROD_USES`: 9
- `BUGNET_USES`: 10
- `NIGHTSWORD_USES`: 100

### Creature Stats
- `PIG_HEALTH`: 250
- `BEEFALOHERD_DAMAGE`: 34
- `SPIDER_HEALTH`: 100
- `SPIDER_DAMAGE`: 20
- `HOUND_HEALTH`: 150
- `HOUND_DAMAGE`: 20
- `KOALEFANT_HEALTH`: 500
- `KOALEFANT_DAMAGE`: 50
- `TALLBIRD_HEALTH`: 400
- `TALLBIRD_DAMAGE`: 50 