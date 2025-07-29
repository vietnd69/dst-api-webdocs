---
id: simutil
title: Simulation Utilities
description: Core utility functions for entity finding, position validation, vision checking, atlas management, and game simulation helpers
sidebar_position: 7
slug: game-scripts/core-systems/simutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Simulation Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Simulation Utilities** module provides essential helper functions for game simulation operations including entity searching, position validation, visibility checking, atlas management, and various game mechanic utilities. This module serves as a foundational layer for many game systems.

## Table of Contents
- [Debug and Deprecated Functions](#debug-and-deprecated-functions)
- [Entity Finding Functions](#entity-finding-functions)
- [Player Finding Functions](#player-finding-functions)
- [Position Validation Functions](#position-validation-functions)
- [Pickup System Functions](#pickup-system-functions)
- [Vision and Visibility Functions](#vision-and-visibility-functions)
- [Game Mechanic Utilities](#game-mechanic-utilities)
- [Atlas Management Functions](#atlas-management-functions)
- [UI and Animation Utilities](#ui-and-animation-utilities)
- [Global Map Icon System](#global-map-icon-system)
- [Special Events System](#special-events-system)

## Debug and Deprecated Functions

### CalledFrom() {#called-from}

**Status:** `stable`

**Description:**
Returns formatted information about the calling function for debugging purposes. Uses debug.getinfo() to trace the call stack.

**Returns:**
- (string): Formatted string containing source file, line number, and function name

**Example:**
```lua
function MyFunction()
    print("Called from: " .. CalledFrom())
    -- Output: "Called from: @scripts/mymodule.lua:25 in MyFunction"
end
```

### GetWorld() {#get-world}

**Status:** `deprecated`

**Description:**
Deprecated function that returns TheWorld. Prints a deprecation warning when used.

**Returns:**
- (entity): TheWorld instance

**Migration:**
```lua
-- Old (deprecated)
local world = GetWorld()

-- New (recommended)
local world = TheWorld
```

### GetPlayer() {#get-player}

**Status:** `deprecated`

**Description:**
Deprecated function that returns ThePlayer. Prints a deprecation warning when used.

**Returns:**
- (entity): ThePlayer instance

**Migration:**
```lua
-- Old (deprecated)
local player = GetPlayer()

-- New (recommended)
local player = ThePlayer
```

## Entity Finding Functions

### FindEntity(inst, radius, fn, musttags, canttags, mustoneoftags) {#find-entity}

**Status:** `stable`

**Description:**
Finds the first entity within radius that matches the given criteria and passes an optional filter function.

**Parameters:**
- `inst` (entity): Center entity for the search
- `radius` (number): Search radius in world units
- `fn` (function): Optional filter function (entity, inst) → boolean
- `musttags` (table): Tags the entity must have
- `canttags` (table): Tags the entity must not have
- `mustoneoftags` (table): Entity must have at least one of these tags

**Returns:**
- (entity or nil): First matching entity, or nil if none found

**Example:**
```lua
-- Find nearest campfire within 10 units
local campfire = FindEntity(player, 10, nil, {"campfire"}, {"burnt"})

-- Find workable entity with custom filter
local workable = FindEntity(player, 5, 
    function(item, player) 
        return item.components.workable ~= nil 
    end, 
    {"structure"})
```

### FindClosestEntity(inst, radius, ignoreheight, musttags, canttags, mustoneoftags, fn) {#find-closest-entity}

**Status:** `stable`

**Description:**
Finds the closest entity within radius that matches criteria. Returns both entity and distance squared.

**Parameters:**
- `inst` (entity): Center entity for the search
- `radius` (number): Search radius in world units
- `ignoreheight` (boolean): Whether to ignore Y-axis for distance calculations
- `musttags` (table): Tags the entity must have
- `canttags` (table): Tags the entity must not have
- `mustoneoftags` (table): Entity must have at least one of these tags
- `fn` (function): Optional filter function

**Returns:**
- (entity or nil): Closest matching entity
- (number or nil): Distance squared to the entity

**Example:**
```lua
local entity, distsq = FindClosestEntity(player, 20, false, {"tree"}, {"burnt"})
if entity then
    print("Found tree at distance:", math.sqrt(distsq))
end
```

### GetRandomInstWithTag(tag, inst, radius) {#get-random-inst-with-tag}

**Status:** `stable`

**Description:**
Returns a random entity with specified tag(s) within radius.

**Parameters:**
- `tag` (string or table): Tag or table of tags to search for
- `inst` (entity): Center entity
- `radius` (number): Search radius

**Returns:**
- (entity or nil): Random matching entity

**Example:**
```lua
-- Get random flower nearby
local flower = GetRandomInstWithTag("flower", player, 15)

-- Get random entity with multiple tags
local structure = GetRandomInstWithTag({"structure", "workable"}, player, 10)
```

## Player Finding Functions

### FindClosestPlayer(x, y, z, isalive) {#find-closest-player}

**Status:** `stable`

**Description:**
Finds the closest player to the given coordinates, optionally filtering by alive/dead status.

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate  
- `z` (number): Z coordinate
- `isalive` (boolean or nil): true for alive only, false for dead only, nil for any

**Returns:**
- (entity or nil): Closest player
- (number or nil): Distance squared to player

**Example:**
```lua
local player, distsq = FindClosestPlayer(0, 0, 0, true)
if player then
    print("Closest living player is", math.sqrt(distsq), "units away")
end
```

### FindClosestPlayerInRange(x, y, z, range, isalive) {#find-closest-player-in-range}

**Status:** `stable`

**Description:**
Finds the closest player within specified range.

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate
- `z` (number): Z coordinate
- `range` (number): Maximum distance to search
- `isalive` (boolean or nil): Alive/dead filter

**Returns:**
- (entity or nil): Closest player within range
- (number or nil): Distance squared

### FindPlayersInRange(x, y, z, range, isalive) {#find-players-in-range}

**Status:** `stable`

**Description:**
Returns a table of all players within specified range.

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate
- `z` (number): Z coordinate
- `range` (number): Search radius
- `isalive` (boolean or nil): Alive/dead filter

**Returns:**
- (table): Array of player entities

**Example:**
```lua
local players = FindPlayersInRange(x, y, z, 20, true)
for _, player in ipairs(players) do
    print("Found player:", player.name)
end
```

### IsAnyPlayerInRange(x, y, z, range, isalive) {#is-any-player-in-range}

**Status:** `stable`

**Description:**
Checks if any player exists within the specified range without returning the players.

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate
- `z` (number): Z coordinate
- `range` (number): Search radius
- `isalive` (boolean or nil): Alive/dead filter

**Returns:**
- (boolean): true if any player is in range

## Position Validation Functions

### FindValidPositionByFan(start_angle, radius, attempts, test_fn) {#find-valid-position-by-fan}

**Status:** `stable`

**Description:**
Searches for a valid position using a fan pattern around a starting angle. The search fans out from the original direction to find a position that meets the test criteria.

**Parameters:**
- `start_angle` (number): Starting angle in radians
- `radius` (number): Distance from center to test
- `attempts` (number): Number of angles to test (default: 8)
- `test_fn` (function): Function that takes offset Vector3 and returns boolean

**Returns:**
- (Vector3 or nil): Valid offset position
- (number or nil): Actual angle used
- (boolean): Whether the position was deflected from original angle

**Example:**
```lua
local offset, angle, deflected = FindValidPositionByFan(
    math.random() * TWOPI, 
    5, 
    8, 
    function(offset)
        local x, z = pos.x + offset.x, pos.z + offset.z
        return TheWorld.Map:IsAboveGroundAtPoint(x, 0, z)
    end
)
```

### FindWalkableOffset(position, start_angle, radius, attempts, check_los, ignore_walls, customcheckfn, allow_water, allow_boats) {#find-walkable-offset}

**Status:** `stable`

**Description:**
Finds a walkable position offset from the given position using fan search pattern.

**Parameters:**
- `position` (Vector3): Starting position
- `start_angle` (number): Starting search angle in radians
- `radius` (number): Search radius
- `attempts` (number): Number of attempts
- `check_los` (boolean): Whether to check line of sight
- `ignore_walls` (boolean): Whether to ignore walls in pathfinding
- `customcheckfn` (function): Custom validation function
- `allow_water` (boolean): Whether water tiles are valid
- `allow_boats` (boolean): Whether boat platforms are valid

**Returns:**
- (Vector3 or nil): Valid offset position
- (number or nil): Angle used
- (boolean): Whether deflected

**Example:**
```lua
local offset = FindWalkableOffset(
    player:GetPosition(), 
    math.random() * TWOPI, 
    8, 
    12, 
    true,  -- check line of sight
    true,  -- ignore walls
    nil,   -- no custom check
    false, -- no water
    false  -- no boats
)
if offset then
    local spawn_pos = player:GetPosition() + offset
end
```

### FindSwimmableOffset(position, start_angle, radius, attempts, check_los, ignore_walls, customcheckfn, allow_boats) {#find-swimmable-offset}

**Status:** `stable`

**Description:**
Similar to FindWalkableOffset but specifically for ocean/water positions.

**Parameters:**
- `position` (Vector3): Starting position
- `start_angle` (number): Starting search angle
- `radius` (number): Search radius
- `attempts` (number): Number of attempts
- `check_los` (boolean): Check line of sight
- `ignore_walls` (boolean): Ignore walls
- `customcheckfn` (function): Custom validation
- `allow_boats` (boolean): Allow boat platforms

**Returns:**
- (Vector3 or nil): Valid water offset position

## Pickup System Functions

### FindPickupableItem(owner, radius, furthestfirst, positionoverride, ignorethese, onlytheseprefabs, allowpickables, worker, extra_filter, inventoryoverride) {#find-pickupable-item}

**Status:** `stable`

**Description:**
Finds an item that can be picked up and placed in the owner's inventory. Handles both ground items and pickable objects like berries.

**Parameters:**
- `owner` (entity): Entity that will pick up the item
- `radius` (number): Search radius
- `furthestfirst` (boolean): Search furthest items first
- `positionoverride` (Vector3): Custom search center position
- `ignorethese` (table): Items to ignore in search
- `onlytheseprefabs` (table): Limit search to specific prefabs
- `allowpickables` (boolean): Include pickable objects (berries, etc.)
- `worker` (entity): Worker entity for validation
- `extra_filter` (function): Additional filter function
- `inventoryoverride` (component): Use this inventory instead of owner's

**Returns:**
- (entity or nil): Pickupable item found
- (boolean): Whether the item is a pickable object

**Example:**
```lua
-- Find any pickupable item nearby
local item, is_pickable = FindPickupableItem(player, 10)
if item then
    if is_pickable then
        player.components.playeractionpicker:DoAction(ACTIONS.PICK, item)
    else
        player.components.playeractionpicker:DoAction(ACTIONS.PICKUP, item)
    end
end

-- Find only specific items
local tool = FindPickupableItem(
    player, 
    15, 
    false, 
    nil, 
    nil, 
    {axe = true, pickaxe = true}  -- only tools
)
```

## Vision and Visibility Functions

### CanEntitySeeInDark(inst) {#can-entity-see-in-dark}

**Status:** `stable`

**Description:**
Checks if an entity can see in the dark through night vision equipment or abilities.

**Parameters:**
- `inst` (entity): Entity to check

**Returns:**
- (boolean): true if entity has night vision

**Example:**
```lua
if CanEntitySeeInDark(player) then
    -- Player can see in dark areas
    print("Player has night vision")
end
```

### CanEntitySeeInStorm(inst) {#can-entity-see-in-storm}

**Status:** `stable`

**Description:**
Checks if an entity can see during storms (sandstorms, etc.) through appropriate equipment.

**Parameters:**
- `inst` (entity): Entity to check

**Returns:**
- (boolean): true if entity can see in storms

### CanEntitySeePoint(inst, x, y, z) {#can-entity-see-point}

**Status:** `stable`

**Description:**
Comprehensive visibility check that considers lighting, night vision, storms, and ink effects.

**Parameters:**
- `inst` (entity): Viewing entity
- `x` (number): Target X coordinate
- `y` (number): Target Y coordinate
- `z` (number): Target Z coordinate

**Returns:**
- (boolean): true if entity can see the point

**Example:**
```lua
local x, y, z = target.Transform:GetWorldPosition()
if CanEntitySeePoint(player, x, y, z) then
    -- Player can see the target location
    player.components.combat:SetTarget(target)
end
```

### CanEntitySeeTarget(inst, target) {#can-entity-see-target}

**Status:** `stable`

**Description:**
Checks if an entity can see a specific target entity.

**Parameters:**
- `inst` (entity): Viewing entity
- `target` (entity): Target entity

**Returns:**
- (boolean): true if inst can see target

## Game Mechanic Utilities

### SpringCombatMod(amount, forced) {#spring-combat-mod}

**Status:** `stable`

**Description:**
Applies spring season combat modifier to amplify damage during spring.

**Parameters:**
- `amount` (number): Base damage amount
- `forced` (boolean): Force spring modifier regardless of season

**Returns:**
- (number): Modified damage amount

**Example:**
```lua
local damage = 50
local spring_damage = SpringCombatMod(damage)
-- During spring: damage * TUNING.SPRING_COMBAT_MOD
-- Other seasons: original damage
```

### SpringGrowthMod(amount, forced) {#spring-growth-mod}

**Status:** `stable`

**Description:**
Applies spring season growth modifier to reduce timer durations during spring.

**Parameters:**
- `amount` (number): Base time amount
- `forced` (boolean): Force spring modifier regardless of season

**Returns:**
- (number): Modified time amount

### ErodeAway(inst, erode_time) {#erode-away}

**Status:** `stable`

**Description:**
Causes an entity to visually erode away over time before being removed.

**Parameters:**
- `inst` (entity): Entity to erode
- `erode_time` (number): Time in seconds for erosion (default: 1)

**Example:**
```lua
-- Make a structure crumble away
ErodeAway(structure, 2.0)
```

### TemporarilyRemovePhysics(obj, time) {#temporarily-remove-physics}

**Status:** `stable`

**Description:**
Temporarily removes physics collision from an object, then restores it.

**Parameters:**
- `obj` (entity): Object to modify
- `time` (number): Duration to remove physics

**Example:**
```lua
-- Allow player to pass through object for 1 second
TemporarilyRemovePhysics(barrier, 1.0)
```

## Atlas Management Functions

### RegisterInventoryItemAtlas(atlas, imagename) {#register-inventory-item-atlas}

**Status:** `stable`

**Description:**
Registers a custom atlas for inventory item images.

**Parameters:**
- `atlas` (string): Atlas file path
- `imagename` (string): Image name in the atlas

**Example:**
```lua
RegisterInventoryItemAtlas("images/custom_items.xml", "my_custom_item")
```

### GetInventoryItemAtlas(imagename, no_fallback) {#get-inventory-item-atlas}

**Status:** `stable`

**Description:**
Gets the atlas file containing a specific inventory item image.

**Parameters:**
- `imagename` (string): Name of the image to find
- `no_fallback` (boolean): Don't fall back to default atlas

**Returns:**
- (string or nil): Atlas file path

**Example:**
```lua
local atlas = GetInventoryItemAtlas("axe")
-- Returns: "images/inventoryimages1.xml" (or appropriate atlas)
```

### GetMinimapAtlas(imagename) {#get-minimap-atlas}

**Status:** `stable`

**Description:**
Gets the atlas file containing a minimap icon image.

**Parameters:**
- `imagename` (string): Minimap icon name

**Returns:**
- (string or nil): Minimap atlas file path

### GetScrapbookIconAtlas(imagename) {#get-scrapbook-icon-atlas}

**Status:** `stable`

**Description:**
Gets the atlas file containing a scrapbook icon image.

**Parameters:**
- `imagename` (string): Scrapbook icon name

**Returns:**
- (string or nil): Scrapbook icon atlas file path

## UI and Animation Utilities

### AnimateUIScale(item, total_time, start_scale, end_scale) {#animate-ui-scale}

**Status:** `stable`

**Description:**
Smoothly animates the scale of a UI element over time.

**Parameters:**
- `item` (widget): UI widget to animate
- `total_time` (number): Animation duration
- `start_scale` (number): Starting scale value
- `end_scale` (number): Ending scale value

**Example:**
```lua
-- Animate button growing from 0.5 to 1.0 over 0.3 seconds
AnimateUIScale(button, 0.3, 0.5, 1.0)
```

### ShakeAllCameras(mode, duration, speed, scale, source_or_pt, maxDist) {#shake-all-cameras}

**Status:** `stable`

**Description:**
Triggers camera shake effect for all players.

**Parameters:**
- `mode` (constant): Shake mode (CAMERASHAKE.FULL, etc.)
- `duration` (number): Shake duration
- `speed` (number): Shake frequency
- `scale` (number): Shake intensity
- `source_or_pt` (entity or Vector3): Shake source for distance calculations
- `maxDist` (number): Maximum distance for shake effect

**Example:**
```lua
-- Shake all cameras for explosion effect
ShakeAllCameras(CAMERASHAKE.FULL, 1.0, 0.02, 1.0, explosion_pos, 20)
```

## Global Map Icon System

### RegisterGlobalMapIcon(inst) {#register-global-map-icon}

**Status:** `stable`

**Description:**
Registers an entity in the global map icons database for efficient batch operations.

**Parameters:**
- `inst` (entity): Entity to register

**Example:**
```lua
-- Register a structure for map icon management
RegisterGlobalMapIcon(structure)
```

### UnregisterGlobalMapIcon(inst) {#unregister-global-map-icon}

**Status:** `stable`

**Description:**
Removes an entity from the global map icons database.

**Parameters:**
- `inst` (entity): Entity to unregister

## Special Events System

### ApplySpecialEvent(event) {#apply-special-event}

**Status:** `stable`

**Description:**
Applies a special world event that affects technology requirements.

**Parameters:**
- `event` (string): Event name or "default"

**Example:**
```lua
-- Apply Halloween event
ApplySpecialEvent(SPECIAL_EVENTS.HALLOWEEN)
```

### DeclareLimitedCraftingRecipe(recipename) {#declare-limited-crafting-recipe}

**Status:** `stable`

**Description:**
Declares a crafting recipe as limited for crafting station management.

**Parameters:**
- `recipename` (string): Name of the recipe

**Example:**
```lua
DeclareLimitedCraftingRecipe("custom_limited_item")
```

## Constants and Data Structures

### Global Variables
- `GlobalMapIconsDB`: Database tracking all registered map icons
  - `insts`: Table mapping entity instances to registration status
  - `prefabs`: Table mapping prefab names to entity collections

### Search Tags
- `PICKUP_MUST_ONEOF_TAGS`: Tags required for pickup search
- `PICKUP_CANT_TAGS`: Tags that exclude items from pickup
- `NO_CHARLIE_TAGS`: Tags that prevent Charlie spawning

## Common Usage Patterns

### Entity Search Pattern
```lua
-- Standard entity search with validation
local entity = FindEntity(inst, range, 
    function(item) 
        return item.components.workable ~= nil and
               item.components.workable:CanBeWorked()
    end, 
    {"structure"}, 
    {"burnt", "INLIMBO"}
)
```

### Position Validation Pattern
```lua
-- Find safe spawn position with custom validation
local offset = FindWalkableOffset(
    center_pos,
    math.random() * TWOPI,
    spawn_radius,
    12,
    true,  -- check LOS
    true,  -- ignore walls
    function(pos)
        -- Custom validation
        return not TheWorld.Map:IsPointNearHole(pos)
    end
)
```

### Atlas Management Pattern
```lua
-- Register and use custom atlas
RegisterInventoryItemAtlas("images/mod_items.xml", "mod_item")
local atlas = GetInventoryItemAtlas("mod_item")
```

## Related Modules

- [**Constants**](./constants.md): Defines constants used in search parameters
- [**EntityScript**](./entityscript.md): Base entity functionality
- [**Components**](../components/index.md): Component system used in entity filtering
- [**Actions**](./actions.md): Action system for pickup interactions
- [**MapUtil**](./maputil.md): Map-related utility functions
- [**MathUtil**](./mathutil.md): Mathematical utilities used in calculations
