---
id: standardcomponents
title: Standard Components
description: Standard component creation utilities and default behaviors for Don't Starve Together prefabs
sidebar_position: 106
slug: core-systems/standardcomponents
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Standard Components

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `standardcomponents` module provides a comprehensive collection of utility functions for creating standard component configurations and behaviors in Don't Starve Together. It includes makers for burnable components, physics systems, hauntable behaviors, and many other common prefab patterns.

## Usage Example

```lua
-- Create a small burnable structure
MakeSmallBurnable(inst, 15, Vector3(0, 0, 0), true)

-- Add character physics
MakeCharacterPhysics(inst, 75, 0.5)

-- Make item hauntable with launch behavior
MakeHauntableLaunch(inst, 0.5, TUNING.LAUNCH_SPEED_SMALL)
```

## Default Fire Functions

### DefaultIgniteFn(inst) {#default-ignite-fn}

**Status:** `stable`

**Description:**
Default ignition function that starts wildfire if the entity has a burnable component.

**Parameters:**
- `inst` (Entity): The entity being ignited

**Example:**
```lua
-- Used internally by propagator components
local propagator = inst:AddComponent("propagator")
propagator:SetOnFlashPoint(DefaultIgniteFn)
```

### DefaultBurnFn(inst) {#default-burn-fn}

**Status:** `stable`

**Description:**
Default burn function that makes non-structure, non-tree entities not persist when burning.

**Parameters:**
- `inst` (Entity): The entity that is burning

**Behavior:**
- Sets `inst.persists = false` for entities without "tree" or "structure" tags

### DefaultBurntFn(inst) {#default-burnt-fn}

**Status:** `stable`

**Description:**
Default function called when an entity finishes burning. Removes growable component, spawns ash, and removes the entity.

**Parameters:**
- `inst` (Entity): The entity that finished burning

**Effects:**
- Removes growable component if present
- Clears inventory item data
- Sets workable work to 0 (except for hammer actions)
- Spawns ash at entity position (not on ocean)
- Handles stackable size for ash
- Removes the entity

**Example:**
```lua
-- Ash spawning with stack size handling
if inst.components.stackable ~= nil then
    ash.components.stackable:SetStackSize(
        math.min(ash.components.stackable.maxsize, inst.components.stackable.stacksize)
    )
end
```

### DefaultExtinguishFn(inst) {#default-extinguish-fn}

**Status:** `stable`

**Description:**
Default function called when an entity is extinguished. Makes non-structure, non-tree entities persist again.

**Parameters:**
- `inst` (Entity): The entity being extinguished

### DefaultBurntStructureFn(inst) {#default-burnt-structure-fn}

**Status:** `stable`

**Description:**
Comprehensive function for handling structure burning completion. Handles component cleanup, state changes, and visual updates.

**Parameters:**
- `inst` (Entity): The structure that finished burning

**Effects:**
- Adds "burnt" tag and prevents relighting
- Plays "burnt" animation
- Triggers "burntup" event
- Stops all sound effects
- Disables minimap entity
- Sets workable to 1 work left
- Releases and removes child spawner
- Drops and removes container contents
- Stops and removes dryer/stewer/grower/harvestable components
- Removes sleepingbag, spawner, prototyper, wardrobe components
- Handles construction site and inventory item holder cleanup
- Disables light and removes burnable component

### DefaultBurntCorpseFn(inst) {#default-burnt-corpse-fn}

**Status:** `stable`

**Description:**
Default function for corpse burning completion with charring effects.

**Parameters:**
- `inst` (Entity): The corpse that finished burning

**Effects:**
- Applies charring color (0.2, 0.2, 0.2, 1) unless `nocharring` flag set
- Enables fast extinguish
- Adds "NOCLICK" tag
- Sets `persists = false`
- Initiates erosion

### DefaultExtinguishCorpseFn(inst) {#default-extinguish-corpse-fn}

**Status:** `stable`

**Description:**
Default function for corpse extinguishing with delayed erosion.

**Parameters:**
- `inst` (Entity): The corpse being extinguished

**Effects:**
- Applies charring if persists and not `nocharring`
- Adds "NOCLICK" tag
- Sets `persists = false`
- Immediate or delayed erosion based on `fastextinguish`

## Burnable Component Makers

### MakeSmallBurnable(inst, time, offset, structure, sym) {#make-small-burnable}

**Status:** `stable`

**Description:**
Creates a small burnable component with FX level 2 and default burn time of 10 seconds.

**Parameters:**
- `inst` (Entity): The entity to make burnable
- `time` (number, optional): Burn time in seconds (default: 10)
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 0))
- `structure` (boolean, optional): Whether to use structure burn function
- `sym` (string, optional): Symbol name for fire effect

**Returns:**
- (Component): The created burnable component

**Example:**
```lua
-- Create small burnable item with 15 second burn time
local burnable = MakeSmallBurnable(inst, 15)

-- Create small burnable structure with offset
local burnable = MakeSmallBurnable(inst, 20, Vector3(0, 1, 0), true, "fire_symbol")
```

### MakeMediumBurnable(inst, time, offset, structure, sym) {#make-medium-burnable}

**Status:** `stable`

**Description:**
Creates a medium burnable component with FX level 3 and default burn time of 20 seconds.

**Parameters:**
- `inst` (Entity): The entity to make burnable
- `time` (number, optional): Burn time in seconds (default: 20)
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 0))
- `structure` (boolean, optional): Whether to use structure burn function
- `sym` (string, optional): Symbol name for fire effect

**Returns:**
- (Component): The created burnable component

### MakeLargeBurnable(inst, time, offset, structure, sym) {#make-large-burnable}

**Status:** `stable`

**Description:**
Creates a large burnable component with FX level 4 and default burn time of 30 seconds.

**Parameters:**
- `inst` (Entity): The entity to make burnable
- `time` (number, optional): Burn time in seconds (default: 30)
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 0))
- `structure` (boolean, optional): Whether to use structure burn function
- `sym` (string, optional): Symbol name for fire effect

**Returns:**
- (Component): The created burnable component

## Propagator Component Makers

### MakeSmallPropagator(inst) {#make-small-propagator}

**Status:** `stable`

**Description:**
Creates a small fire propagator component with appropriate heat output and spread parameters.

**Parameters:**
- `inst` (Entity): The entity to add propagator to

**Returns:**
- (Component): The created propagator component

**Properties:**
- Flash point: 5-10 (random)
- Decay rate: 0.5
- Propagate range: 3-5 (random)
- Heat output: 3-5 (random)
- Damage range: 2

**Example:**
```lua
local propagator = MakeSmallPropagator(inst)
-- Propagator automatically accepts heat and causes damage
```

### MakeMediumPropagator(inst) {#make-medium-propagator}

**Status:** `stable`

**Description:**
Creates a medium fire propagator component with higher heat output and spread parameters.

**Parameters:**
- `inst` (Entity): The entity to add propagator to

**Returns:**
- (Component): The created propagator component

**Properties:**
- Flash point: 15-25 (random)
- Decay rate: 0.5
- Propagate range: 5-7 (random)
- Heat output: 5-8.5 (random)
- Damage range: 3

### MakeLargePropagator(inst) {#make-large-propagator}

**Status:** `stable`

**Description:**
Creates a large fire propagator component with maximum heat output and spread parameters.

**Parameters:**
- `inst` (Entity): The entity to add propagator to

**Returns:**
- (Component): The created propagator component

**Properties:**
- Flash point: 45-55 (random)
- Decay range: 0.5
- Propagate range: 6-8 (random)
- Heat output: 6-9.5 (random)
- Damage range: 3

## Character Burnable Makers

### MakeSmallBurnableCharacter(inst, sym, offset) {#make-small-burnable-character}

**Status:** `stable`

**Description:**
Creates a small burnable configuration for characters with character fire effects.

**Parameters:**
- `inst` (Entity): The character to make burnable
- `sym` (string, optional): Symbol name for fire effect
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 1))

**Returns:**
- (Component, Component): burnable and propagator components

**Properties:**
- FX level: 1
- Burn time: 6 seconds
- Cannot be lit externally (`canlight = false`)
- Propagator does not accept heat

### MakeMediumBurnableCharacter(inst, sym, offset) {#make-medium-burnable-character}

**Status:** `stable`

**Description:**
Creates a medium burnable configuration for characters.

**Parameters:**
- `inst` (Entity): The character to make burnable
- `sym` (string, optional): Symbol name for fire effect
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 1))

**Returns:**
- (Component, Component): burnable and propagator components

**Properties:**
- FX level: 2
- Burn time: 8 seconds

### MakeLargeBurnableCharacter(inst, sym, offset, scale) {#make-large-burnable-character}

**Status:** `stable`

**Description:**
Creates a large burnable configuration for characters with optional effect scaling.

**Parameters:**
- `inst` (Entity): The character to make burnable
- `sym` (string, optional): Symbol name for fire effect
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 1))
- `scale` (Vector3, optional): Effect scale

**Returns:**
- (Component, Component): burnable and propagator components

**Properties:**
- FX level: 3
- Burn time: 10 seconds
- Uses large propagator

## Corpse Burnable Makers

### MakeSmallBurnableCorpse(inst, time, sym, offset, scale) {#make-small-burnable-corpse}

**Status:** `stable`

**Description:**
Creates a burnable configuration for small corpses with corpse-specific burn behavior.

**Parameters:**
- `inst` (Entity): The corpse to make burnable
- `time` (number, optional): Burn time (default: 6)
- `sym` (string, optional): Symbol name for fire effect
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 1))
- `scale` (Vector3, optional): Effect scale

**Returns:**
- (Component, Component): burnable and propagator components

**Special Behavior:**
- Uses `DefaultExtinguishCorpseFn` and `DefaultBurntCorpseFn`
- Includes charring and erosion effects

### MakeMediumBurnableCorpse(inst, time, sym, offset, scale) {#make-medium-burnable-corpse}

**Status:** `stable`

**Description:**
Creates a burnable configuration for medium corpses.

**Parameters:**
- `inst` (Entity): The corpse to make burnable
- `time` (number, optional): Burn time (default: 8)
- `sym` (string, optional): Symbol name for fire effect
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 1))
- `scale` (Vector3, optional): Effect scale

**Returns:**
- (Component, Component): burnable and propagator components

### MakeLargeBurnableCorpse(inst, time, sym, offset, scale) {#make-large-burnable-corpse}

**Status:** `stable`

**Description:**
Creates a burnable configuration for large corpses with medium propagator.

**Parameters:**
- `inst` (Entity): The corpse to make burnable
- `time` (number, optional): Burn time (default: 10)
- `sym` (string, optional): Symbol name for fire effect
- `offset` (Vector3, optional): Fire effect offset (default: Vector3(0, 0, 1))
- `scale` (Vector3, optional): Effect scale

**Returns:**
- (Component, Component): burnable and propagator components

## Freezable Character Makers

### MakeTinyFreezableCharacter(inst, sym, offset) {#make-tiny-freezable-character}

**Status:** `stable`

**Description:**
Creates a tiny freezable configuration for characters.

**Parameters:**
- `inst` (Entity): The character to make freezable
- `sym` (string, optional): Symbol name for shatter effect
- `offset` (Vector3, optional): Effect offset (default: Vector3(0, 0, 0))

**Returns:**
- (Component): The created freezable component

**Properties:**
- Shatter FX level: 1
- Default resistance

### MakeSmallFreezableCharacter(inst, sym, offset) {#make-small-freezable-character}

**Status:** `stable`

**Description:**
Creates a small freezable configuration for characters.

**Properties:**
- Shatter FX level: 2

### MakeMediumFreezableCharacter(inst, sym, offset) {#make-medium-freezable-character}

**Status:** `stable`

**Description:**
Creates a medium freezable configuration for characters with increased resistance.

**Properties:**
- Shatter FX level: 3
- Resistance: 2

### MakeLargeFreezableCharacter(inst, sym, offset) {#make-large-freezable-character}

**Status:** `stable`

**Description:**
Creates a large freezable configuration for characters.

**Properties:**
- Shatter FX level: 4
- Resistance: 3

### MakeHugeFreezableCharacter(inst, sym, offset) {#make-huge-freezable-character}

**Status:** `stable`

**Description:**
Creates a huge freezable configuration for characters with maximum resistance.

**Properties:**
- Shatter FX level: 5
- Resistance: 4

## Physics Component Makers

### MakeInventoryPhysics(inst, mass, rad) {#make-inventory-physics}

**Status:** `stable`

**Description:**
Creates physics configuration for inventory items with appropriate collision settings.

**Parameters:**
- `inst` (Entity): The entity to add physics to
- `mass` (number, optional): Physics mass (default: 1)
- `rad` (number, optional): Collision radius (default: 0.5)

**Returns:**
- (Physics): The created physics component

**Properties:**
- Friction: 0.1
- Damping: 0
- Restitution: 0.5
- Collision group: COLLISION.ITEMS
- Collision mask: WORLD, OBSTACLES, SMALLOBSTACLES
- Shape: Sphere

**Example:**
```lua
-- Create standard inventory item physics
local physics = MakeInventoryPhysics(inst)

-- Create heavy inventory item with larger radius
local physics = MakeInventoryPhysics(inst, 5, 1.0)
```

### MakeCharacterPhysics(inst, mass, rad) {#make-character-physics}

**Status:** `stable`

**Description:**
Creates physics configuration for characters with appropriate collision and movement settings.

**Parameters:**
- `inst` (Entity): The character to add physics to
- `mass` (number): Physics mass
- `rad` (number): Collision radius

**Returns:**
- (Physics): The created physics component

**Properties:**
- Friction: 0
- Damping: 5
- Collision group: COLLISION.CHARACTERS
- Collision mask: WORLD, OBSTACLES, SMALLOBSTACLES, CHARACTERS, GIANTS
- Shape: Capsule (radius, 1)

### MakeFlyingCharacterPhysics(inst, mass, rad) {#make-flying-character-physics}

**Status:** `stable`

**Description:**
Creates physics configuration for flying characters with barrier crossing support.

**Parameters:**
- `inst` (Entity): The flying character to add physics to
- `mass` (number): Physics mass
- `rad` (number): Collision radius

**Returns:**
- (Physics): The created physics component

**Properties:**
- Collision group: COLLISION.FLYERS
- Collision mask: Conditional based on `TheWorld:CanFlyingCrossBarriers()`
- If can cross barriers: COLLISION.GROUND, COLLISION.FLYERS
- If cannot cross: COLLISION.WORLD, COLLISION.FLYERS

### MakeGiantCharacterPhysics(inst, mass, rad) {#make-giant-character-physics}

**Status:** `stable`

**Description:**
Creates physics configuration for giant characters.

**Parameters:**
- `inst` (Entity): The giant character to add physics to
- `mass` (number): Physics mass
- `rad` (number): Collision radius

**Returns:**
- (Physics): The created physics component

**Properties:**
- Collision group: COLLISION.GIANTS
- Collision mask: WORLD, OBSTACLES, CHARACTERS, GIANTS
- Does not collide with SMALLOBSTACLES

### MakeObstaclePhysics(inst, rad, height) {#make-obstacle-physics}

**Status:** `stable`

**Description:**
Creates physics configuration for static obstacles.

**Parameters:**
- `inst` (Entity): The obstacle to add physics to
- `rad` (number): Collision radius
- `height` (number, optional): Collision height (default: 2)

**Returns:**
- (Physics): The created physics component

**Properties:**
- Adds "blocker" tag
- Mass: 0 (static object)
- Collision group: COLLISION.OBSTACLES
- Collision mask: ITEMS, CHARACTERS, GIANTS
- Shape: Capsule

**Example:**
```lua
-- Create standard obstacle
MakeObstaclePhysics(inst, 1.5, 3)

-- Tree obstacle
inst:AddTag("tree")
MakeObstaclePhysics(inst, 0.5)
```

## Physics Collision Control

### ToggleOffCharacterCollisions(inst) {#toggle-off-character-collisions}

**Status:** `stable`

**Description:**
Disables character-to-character collisions temporarily, useful for special movement states.

**Parameters:**
- `inst` (Entity): The character to modify

**Usage Context:**
Used during dash attacks, teleportation, or other special movement abilities.

### ToggleOnCharacterCollisions(inst) {#toggle-on-character-collisions}

**Status:** `stable`

**Description:**
Re-enables character-to-character collisions with physics radius monitoring.

**Parameters:**
- `inst` (Entity): The character to modify

### ToggleOffAllObjectCollisions(inst) {#toggle-off-all-object-collisions}

**Status:** `stable`

**Description:**
Disables all collision detection for ghost-like movement.

**Parameters:**
- `inst` (Entity): The character to modify

### ToggleOnAllObjectCollisionsAt(inst, x, z) {#toggle-on-all-object-collisions-at}

**Status:** `stable`

**Description:**
Re-enables all collision detection at a specific position.

**Parameters:**
- `inst` (Entity): The character to modify
- `x` (number): World X coordinate
- `z` (number): World Z coordinate

## Hauntable Component Makers

### MakeHauntable(inst, cooldown, haunt_value) {#make-hauntable}

**Status:** `stable`

**Description:**
Creates a basic hauntable component with default cooldown and haunt value.

**Parameters:**
- `inst` (Entity): The entity to make hauntable
- `cooldown` (number, optional): Haunt cooldown (default: TUNING.HAUNT_COOLDOWN_SMALL)
- `haunt_value` (number, optional): Haunt value (default: TUNING.HAUNT_TINY)

**Example:**
```lua
-- Basic hauntable with defaults
MakeHauntable(inst)

-- Custom cooldown and value
MakeHauntable(inst, 10, TUNING.HAUNT_SMALL)
```

### MakeHauntableLaunch(inst, chance, speed, cooldown, haunt_value) {#make-hauntable-launch}

**Status:** `stable`

**Description:**
Creates a hauntable component that launches the entity when haunted.

**Parameters:**
- `inst` (Entity): The entity to make hauntable
- `chance` (number, optional): Launch chance (default: TUNING.HAUNT_CHANCE_ALWAYS)
- `speed` (number, optional): Launch speed (default: TUNING.LAUNCH_SPEED_SMALL)
- `cooldown` (number, optional): Haunt cooldown
- `haunt_value` (number, optional): Haunt value

**Example:**
```lua
-- 50% chance to launch at medium speed
MakeHauntableLaunch(inst, 0.5, TUNING.LAUNCH_SPEED_MEDIUM)
```

### MakeHauntableChangePrefab(inst, newprefab, chance, haunt_value, nofx) {#make-hauntable-change-prefab}

**Status:** `stable`

**Description:**
Creates a hauntable component that transforms the entity into a different prefab when haunted.

**Parameters:**
- `inst` (Entity): The entity to make hauntable
- `newprefab` (string|table): New prefab name or table of prefab names
- `chance` (number, optional): Transform chance (default: TUNING.HAUNT_CHANCE_HALF)
- `haunt_value` (number, optional): Haunt value
- `nofx` (boolean, optional): Whether to skip transformation effects

**Example:**
```lua
-- Transform berry bush into withered version
MakeHauntableChangePrefab(inst, "berrybush_withered", 0.3)

-- Random transformation from multiple options
MakeHauntableChangePrefab(inst, {"ash", "charcoal", "spoiled_food"}, 0.2)
```

### MakeHauntablePanic(inst, panictime, chance, cooldown, haunt_value) {#make-hauntable-panic}

**Status:** `stable`

**Description:**
Creates a hauntable component that makes creatures panic when haunted.

**Parameters:**
- `inst` (Entity): The creature to make hauntable
- `panictime` (number, optional): Panic duration (default: TUNING.HAUNT_PANIC_TIME_SMALL)
- `chance` (number, optional): Panic chance (default: TUNING.HAUNT_CHANCE_ALWAYS)
- `cooldown` (number, optional): Haunt cooldown
- `haunt_value` (number, optional): Haunt value

**Properties:**
- Sets `panicable = true`
- Wakes up sleeping creatures
- Creates panic state with timer

### MakeHauntableFreeze(inst, chance, cooldown, haunt_value) {#make-hauntable-freeze}

**Status:** `stable`

**Description:**
Creates a hauntable component that freezes the entity when haunted.

**Parameters:**
- `inst` (Entity): The entity to make hauntable
- `chance` (number, optional): Freeze chance (default: TUNING.HAUNT_CHANCE_HALF)
- `cooldown` (number, optional): Haunt cooldown
- `haunt_value` (number, optional): Haunt value

**Requirements:**
- Entity must have freezable component
- Only works if not already frozen

## Perishable Creature Makers

### MakeSmallPerishableCreature(inst, starvetime, oninventory, ondropped) {#make-small-perishable-creature}

**Status:** `stable`

**Description:**
Creates a perishable configuration for small creatures that starve when in inventory.

**Parameters:**
- `inst` (Entity): The creature to make perishable
- `starvetime` (number): Time to starve in inventory
- `oninventory` (function, optional): Callback when put in inventory
- `ondropped` (function, optional): Callback when dropped

**Behavior:**
- Starts perishing when put in inventory
- Stops perishing when dropped
- Shows spoilage indication
- Generates loot when perished

**Example:**
```lua
-- Butterfly that lives 2 days in inventory
MakeSmallPerishableCreature(inst, TUNING.TOTAL_DAY_TIME * 2, 
    function(inst, owner)
        -- Custom behavior when captured
    end,
    function(inst)
        -- Custom behavior when released
    end
)
```

### MakeFeedableSmallLivestock(inst, starvetime, oninventory, ondropped) {#make-feedable-small-livestock}

**Status:** `stable`

**Description:**
Creates a feedable livestock configuration that can be fed to reset spoilage.

**Parameters:**
- `inst` (Entity): The livestock to configure
- `starvetime` (number): Time to starve without feeding
- `oninventory` (function, optional): Callback when put in inventory
- `ondropped` (function, optional): Callback when dropped

**Properties:**
- Adds "small_livestock" tag
- Includes eater component for feeding
- Feeding resets perishable percent to 100%

**Example:**
```lua
-- Rabbit that can be fed to keep alive
MakeFeedableSmallLivestock(inst, TUNING.RABBIT_LIFESPAN)

-- Custom diet can be set after
inst.components.eater:SetDiet({ FOODGROUP.VEGGIE }, { FOODGROUP.VEGGIE })
```

## Environmental Effects

### MakeNoGrowInWinter(inst) {#make-no-grow-in-winter}

**Status:** `stable`

**Description:**
Makes pickable plants pause growth during winter season.

**Parameters:**
- `inst` (Entity): The pickable plant

**Requirements:**
- Entity must have pickable component

**Example:**
```lua
-- Berry bush stops growing in winter
inst:AddComponent("pickable")
MakeNoGrowInWinter(inst)
```

### MakeSnowCovered(inst) {#make-snow-covered}

**Status:** `stable`

**Description:**
Adds snow covering visual effects that respond to world snow state.

**Parameters:**
- `inst` (Entity): The entity to add snow effects to

**Effects:**
- Overrides "snow" symbol with snow texture
- Shows/hides snow based on `TheWorld.state.issnowcovered`
- Adds "SnowCovered" tag

### MakeInventoryFloatable(inst, size, offset, scale, swap_bank, float_index, swap_data) {#make-inventory-floatable}

**Status:** `stable`

**Description:**
Makes inventory items float on water with customizable parameters.

**Parameters:**
- `inst` (Entity): The inventory item
- `size` (string, optional): Float size ("small", "medium", "large")
- `offset` (number, optional): Vertical floating offset
- `scale` (Vector3, optional): Float effect scale
- `swap_bank` (string, optional): Animation bank for floating state
- `float_index` (number, optional): Float animation index
- `swap_data` (table, optional): Custom swap data

**Returns:**
- (Component): The created floater component

**Example:**
```lua
-- Small floating item with default settings
MakeInventoryFloatable(inst, "small")

-- Custom floating with animation changes
MakeInventoryFloatable(inst, "medium", 0.2, {1.1, 1.1, 1.1}, "floating_logs", 1)
```

## Fertilizer System

### MakeDeployableFertilizer(inst) {#make-deployable-fertilizer}

**Status:** `stable`

**Description:**
Makes an item deployable as fertilizer on farmable soil.

**Parameters:**
- `inst` (Entity): The fertilizer item

**Returns:**
- (Component): The created deployable component

**Properties:**
- Deploy mode: CUSTOM
- Grid placer: farmable soil
- Keeps item in inventory on deploy
- Adds nutrients to farming manager

**Requirements:**
- Item must have fertilizer component with nutrients defined

**Example:**
```lua
-- Setup fertilizer with nutrients
inst:AddComponent("fertilizer")
inst.components.fertilizer.nutrients = {10, 5, 2} -- Growth, Compost, Manure

-- Make it deployable
MakeDeployableFertilizer(inst)
```

## Regrowth Management

### AddToRegrowthManager(inst) {#add-to-regrowth-manager}

**Status:** `stable`

**Description:**
Registers an entity with the regrowth manager for respawning when removed.

**Parameters:**
- `inst` (Entity): The entity to add to regrowth

**Events:**
- Listens for "onremove" to trigger regrowth
- Listens for "despawnedfromhaunt" to remove from regrowth

### RemoveFromRegrowthManager(inst) {#remove-from-regrowth-manager}

**Status:** `stable`

**Description:**
Unregisters an entity from the regrowth manager.

**Parameters:**
- `inst` (Entity): The entity to remove from regrowth

## Forge System

### MakeForgeRepairable(inst, material, onbroken, onrepaired) {#make-forge-repairable}

**Status:** `stable`

**Description:**
Makes forge items repairable when broken, with automatic unequipping.

**Parameters:**
- `inst` (Entity): The forge item
- `material` (string): Required repair material
- `onbroken` (function, optional): Callback when item breaks
- `onrepaired` (function, optional): Callback when item is repaired

**Compatibility:**
- Works with armor, finiteuses, or fueled components
- Automatically unequips broken items
- Prevents overwriting existing callbacks

**Example:**
```lua
-- Forge weapon repairable with gems
MakeForgeRepairable(inst, "redgem", 
    function(inst) 
        inst.AnimState:PlayAnimation("broken") 
    end,
    function(inst) 
        inst.AnimState:PlayAnimation("fixed") 
    end
)
```

## Waxable Plants

### MakeWaxablePlant(inst) {#make-waxable-plant}

**Status:** `stable`

**Description:**
Makes a plant waxable for preservation using wax spray.

**Parameters:**
- `inst` (Entity): The plant to make waxable

**Properties:**
- Uses WAXED_PLANTS.WaxPlant function
- Requires spray application
- Prevents withering/decay when waxed

## Material Recycling

### MakeCraftingMaterialRecycler(inst, data) {#make-crafting-material-recycler}

**Status:** `stable`

**Description:**
Makes a craftable structure recycle materials into different rewards.

**Parameters:**
- `inst` (Entity): The structure to make a recycler
- `data` (table): Mapping of input materials to output rewards

**Data Format:**
```lua
local recycler_data = {
    ["logs"] = "charcoal",
    ["rocks"] = "flint",
    ["twigs"] = "ash"
}
```

**Behavior:**
- Tracks materials consumed during construction
- Gives recycled rewards after construction
- Handles stackable items properly
- Maintains inventory organization

**Example:**
```lua
-- Campfire that recycles wood to charcoal
local recycling_data = {
    ["log"] = "charcoal"
}
MakeCraftingMaterialRecycler(inst, recycling_data)
```

## Physics Utilities

### RemovePhysicsColliders(inst) {#remove-physics-colliders}

**Status:** `stable`

**Description:**
Removes collision detection while preserving physics component.

**Parameters:**
- `inst` (Entity): The entity to modify

**Behavior:**
- Massive objects: Sets collision mask to GROUND only
- Static objects: Clears collision mask entirely

### PreventCharacterCollisionsWithPlacedObjects(inst) {#prevent-character-collisions-with-placed-objects}

**Status:** `stable`

**Description:**
Prevents character collisions during object placement with adaptive radius.

**Parameters:**
- `inst` (Entity): The placed object

**Features:**
- Monitors nearby characters
- Adjusts collision radius dynamically
- Re-enables collisions when safe

## Related Modules

- [Tuning](./tuning.md): Contains constants used by standard components
- [Components](../components/index.md): Individual component documentation
- [Physics](./physics.md): Core physics system
- [Burnable](../components/burnable.md): Burnable component details
- [Hauntable](../components/hauntable.md): Hauntable component system
- [Propagator](../components/propagator.md): Fire propagation system

## Technical Notes

### Performance Considerations
- Physics radius monitoring uses periodic tasks
- Collision toggles should be used sparingly
- Fire effects have automatic cleanup

### Memory Management
- Component makers use proper reference handling
- Physics collision changes are temporary
- Event listeners are properly cleaned up

### Debugging Support
- DEBUG_MODE flag controls assertion checking
- Component overwrites are detected in development
- Physics state tracking for collision debugging
