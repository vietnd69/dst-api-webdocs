---
id: componentutil
title: Component Utilities
description: Utility functions and helper systems for common gameplay mechanics and entity management in DST
sidebar_position: 8

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Component Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Component Utilities** module (`componentutil.lua`) provides a comprehensive collection of helper functions that support various gameplay mechanics and component interactions in Don't Starve Together. These utilities serve as a bridge between low-level engine functionality and high-level gameplay systems, offering standardized solutions for common operations that span across multiple components.

Key features include entity state management, world manipulation, combat targeting, bridge construction, inventory management, and specialized systems for character abilities like Winona's rose glasses and Walter's Woby courier.

## Usage Example

```lua
-- Check if an entity is dead
if IsEntityDead(target, true) then
    -- Handle dead entity logic
    return
end

-- Get stack size safely
local stack_size = GetStackSize(item)

-- Check for meat in inventory (rabbit king system)
if HasMeatInInventoryFor(player) then
    -- Player has meat items
end
```

## Entity State Functions

### IsEntityDead(inst, require_health) {#isentitydead}

**Status:** `stable`

**Description:**
Checks if an entity is considered dead based on its health component status.

**Parameters:**
- `inst` (Entity): The entity to check
- `require_health` (boolean): If `true`, entities without health component are considered dead

**Returns:**
- (boolean): Whether the entity is dead

**Example:**
```lua
-- Check if target is dead, requiring health component
if IsEntityDead(target, true) then
    print("Target is dead or has no health")
end

-- Check if target is dead, allowing entities without health
if IsEntityDead(target, false) then
    print("Target is dead")
end
```

### IsEntityDeadOrGhost(inst, require_health) {#isentitydeadorghost}

**Status:** `stable`

**Description:**
Extended death check that also considers ghost players as "dead" for gameplay purposes.

**Parameters:**
- `inst` (Entity): The entity to check
- `require_health` (boolean): If `true`, entities without health component are considered dead

**Returns:**
- (boolean): Whether the entity is dead or a ghost

**Example:**
```lua
if IsEntityDeadOrGhost(player, true) then
    -- Handle dead or ghost player
    return
end
```

### GetStackSize(inst) {#getstacksize}

**Status:** `stable`

**Description:**
Returns the stack size of an item, defaulting to 1 if the item is not stackable.

**Parameters:**
- `inst` (Entity): The entity to check

**Returns:**
- (number): Stack size (1 if not stackable)

**Example:**
```lua
local stack_size = GetStackSize(item)
print("Item stack size:", stack_size)
```

## World Manipulation

### HandleDugGround(dug_ground, x, y, z) {#handledugground}

**Status:** `stable`

**Description:**
Handles the creation of turf items when ground is dug up, including physics and wetness inheritance.

**Parameters:**
- `dug_ground` (WORLD_TILES): The ground tile type that was dug
- `x, y, z` (number): World position coordinates

**Example:**
```lua
-- Handle ground being dug at position
HandleDugGround(WORLD_TILES.GRASS, x, y, z)
```

**Features:**
- Creates appropriate turf item based on ground type
- Inherits world wetness at the position
- Adds realistic physics for natural drop behavior
- Falls back to sinkhole effect if no turf available

### FindVirtualOceanEntity(x, y, z, r) {#findvirtualoceanentity}

**Status:** `stable`

**Description:**
Locates virtual ocean entities within a specified radius for ocean interaction systems.

**Parameters:**
- `x, y, z` (number): Search center coordinates
- `r` (number, optional): Search radius (defaults to MAX_PHYSICS_RADIUS)

**Returns:**
- (Entity or nil): Virtual ocean entity if found, `nil` otherwise

**Example:**
```lua
local ocean_entity = FindVirtualOceanEntity(x, y, z, 10)
if ocean_entity then
    -- Interact with virtual ocean
end
```

## Combat Target Classification

### NON_LIFEFORM_TARGET_TAGS {#non-lifeform-target-tags}

**Status:** `stable`

**Description:**
Tag collection defining non-living targets that can be attacked but aren't considered alive.

**Tags:**
- `"structure"`: Buildings and structures
- `"wall"`: Wall structures
- `"balloon"`: Balloon entities
- `"groundspike"`: Ground spike traps
- `"smashable"`: Smashable objects
- `"veggie"`: Plant-like entities (lureplants, etc.)

### SOULLESS_TARGET_TAGS {#soulless-target-tags}

**Status:** `stable`

**Description:**
Tag collection for entities without souls, immune to soul-draining effects. Includes shadows, chess pieces, and non-lifeforms.

**Additional Tags:**
- `"soulless"`: Explicitly soulless entities
- `"chess"`: Chess piece creatures
- `"shadow"`: Shadow creatures
- `"shadowcreature"`: Shadow creature variants
- `"shadowminion"`: Shadow minions
- `"shadowchesspiece"`: Shadow chess pieces

**Example:**
```lua
local function CanDrainSoul(target)
    return not target:HasOneOfTags(SOULLESS_TARGET_TAGS)
end
```

## Tile Change Handling

### TempTile_HandleTileChange(x, y, z, tile) {#temptile-handletilechange}

**Status:** `stable`

**Description:**
Main handler for temporary tile changes, routing to appropriate ocean or void handlers.

**Parameters:**
- `x, y, z` (number): Tile coordinates
- `tile` (WORLD_TILES): New tile type

**Example:**
```lua
-- Handle tile change at position
TempTile_HandleTileChange(x, y, z, WORLD_TILES.OCEAN_SHALLOW)
```

### TempTile_HandleTileChange_Ocean(x, y, z) {#temptile-handletilechange-ocean}

**Status:** `stable`

**Description:**
Handles entity behavior when tiles change to ocean, including drowning and item handling.

**Parameters:**
- `x, y, z` (number): Tile coordinates

**Features:**
- Triggers "onsink" event for entities with drownable component
- Finds shore points for teleportation
- Handles inventory items and destroys invalid entities
- Accounts for tile overhang calculations

### TempTile_HandleTileChange_Void(x, y, z) {#temptile-handletilechange-void}

**Status:** `stable`

**Description:**
Handles entities falling into void tiles, including teleportation and destruction logic.

**Parameters:**
- `x, y, z` (number): Tile coordinates

**Features:**
- Triggers "onfallinvoid" event
- Supports entities with abyss_fall state
- Teleports entities with drownable component
- Destroys entities that can't handle void

## Bridge Construction System

### Bridge_DeployCheck_Helper(inst, pt, options) {#bridge-deploycheck-helper}

**Status:** `stable`

**Description:**
Comprehensive system for validating and calculating bridge placement with geometric optimization.

**Parameters:**
- `inst` (Entity): The deploying entity/item
- `pt` (Vector3): Target deployment point
- `options` (table, optional): Configuration options

**Options Table:**
- `maxlength` (number): Maximum bridge length in tiles
- `isvalidtileforbridgeatpointfn` (function): Custom tile validation function
- `candeploybridgeatpointfn` (function): Custom deployment validation function
- `requiredworldcomponent` (string): Required world component name
- `deployskipfirstlandtile` (boolean): Skip first land tile in calculations

**Returns:**
- `success` (boolean): Whether bridge can be deployed
- `spots` (array): Calculated placement positions with direction data

**Example:**
```lua
local options = {
    maxlength = 8,
    isvalidtileforbridgeatpointfn = MyCustomValidationFunction,
    candeploybridgeatpointfn = MyCustomDeployFunction
}

local success, spots = Bridge_DeployCheck_Helper(inst, target_point, options)
if success then
    for i, spot in ipairs(spots) do
        -- Deploy bridge segment at spot.x, spot.y, spot.z
        -- Use spots.direction for bridge orientation
    end
end
```

**Features:**
- Automatic direction detection based on surrounding terrain
- Support for different bridge types through callback functions
- Geometric optimization for natural bridge placement
- Validation of start and end points
- Handles overhang calculations and corner cases

## Charlie Residue System

### MakeRoseTarget_CreateFuel(inst) {#makerosetarget-createfuel}

**Status:** `stable`

**Description:**
Creates entities that interact with Winona's rose glasses to generate nightmare fuel.

**Parameters:**
- `inst` (Entity): Entity to make into a rose target

**Example:**
```lua
-- Make entity create fuel when activated by rose glasses
MakeRoseTarget_CreateFuel(inst)
```

### MakeRoseTarget_CreateFuel_IncreasedHorror(inst) {#makerosetarget-createfuel-increasedhorror}

**Status:** `stable`

**Description:**
Creates rose targets with increased chance to generate horror fuel (upgraded version).

**Parameters:**
- `inst` (Entity): Entity to make into an enhanced rose target

### DecayCharlieResidueAndGoOnCooldownIfItExists(inst) {#decaycharlieresidue-cooldown}

**Status:** `stable`

**Description:**
Forces decay of Charlie residue and puts rose glasses on cooldown if the component exists.

**Parameters:**
- `inst` (Entity): Entity with potential roseinspectableuser component

**Example:**
```lua
-- Force residue decay and cooldown
DecayCharlieResidueAndGoOnCooldownIfItExists(player)
```

### DecayCharlieResidueIfItExists(inst) {#decaycharlieresidue}

**Status:** `stable`

**Description:**
Forces decay of Charlie residue without affecting cooldown state.

**Parameters:**
- `inst` (Entity): Entity with potential roseinspectableuser component

## Close Inspector Utilities

### CLOSEINSPECTORUTIL.IsValidTarget(doer, target) {#closeinspector-isvalidtarget}

**Status:** `stable`

**Description:**
Validates if a target entity can be closely inspected with rose glasses.

**Parameters:**
- `doer` (Entity): The player using rose glasses
- `target` (Entity): The target entity to inspect

**Returns:**
- (boolean): Whether target is valid for close inspection

**Exclusions:**
- Entities with mass (Physics:GetMass() ~= 0)
- Entities with locomotor component
- Inventory items
- Character entities

### CLOSEINSPECTORUTIL.IsValidPos(doer, pos) {#closeinspector-isvalidpos}

**Status:** `stable`

**Description:**
Validates if a position can be used for close inspection based on rose point configurations.

**Parameters:**
- `doer` (Entity): The player using rose glasses
- `pos` (Vector3): The position to inspect

**Returns:**
- (boolean): Whether position is valid for close inspection

### CLOSEINSPECTORUTIL.CanCloseInspect(doer, targetorpos) {#closeinspector-cancloseinspect}

**Status:** `stable`

**Description:**
Comprehensive check for close inspection capability, validating equipment and conditions.

**Parameters:**
- `doer` (Entity): The player attempting close inspection
- `targetorpos` (Entity or Vector3): Target entity or position

**Returns:**
- (boolean): Whether close inspection is possible

**Example:**
```lua
if CLOSEINSPECTORUTIL.CanCloseInspect(player, target) then
    -- Perform close inspection
end
```

## Inventory Management

### SetDesiredMaxTakeCountFunction(prefab, callback) {#setdesiredmaxtakecount}

**Status:** `stable`

**Description:**
Sets custom pickup logic for specific item types to control quantities taken from containers.

**Parameters:**
- `prefab` (string): Prefab name to set function for
- `callback` (function): Function that returns desired pickup count

**Example:**
```lua
-- Set custom pickup logic for specific item
SetDesiredMaxTakeCountFunction("custom_item", function(item, container, doer)
    return math.min(10, item.components.stackable:StackSize())
end)
```

### GetDesiredMaxTakeCountFunction(prefab) {#getdesiredmaxtakecount}

**Status:** `stable`

**Description:**
Retrieves the custom pickup function for a specific prefab.

**Parameters:**
- `prefab` (string): Prefab name to get function for

**Returns:**
- (function or nil): Custom pickup function if set

### HasMeatInInventoryFor(inst) {#hasmeatininventory}

**Status:** `stable`

**Description:**
Checks if player has meat items in inventory, used by rabbit king system.

**Parameters:**
- `inst` (Entity): Player entity to check

**Returns:**
- (boolean): Whether player has meat items

**Example:**
```lua
if HasMeatInInventoryFor(player) then
    -- Player has meat, rabbit king will react
end
```

**Features:**
- Excludes small creatures (like rabbits)
- Respects equipment that hides meat items
- Only counts FOODTYPE.MEAT items

## Food System Utilities

### PICKABLE_FOOD_PRODUCTS {#pickable-food-products}

**Status:** `stable`

**Description:**
Constant table defining which pickable items are considered food sources.

**Included Products:**
- `ancientfruit_nightvision`: Ancient fruit
- `berries`: Regular berries
- `berries_juicy`: Juicy berries
- `blue_cap`, `green_cap`, `red_cap`: Mushrooms
- `cactus_meat`: Cactus flesh
- `carrot`: Carrots
- `cave_banana`: Cave bananas
- `cutlichen`: Cut lichen
- `wormlight_lesser`: Lesser wormlight

### IsFoodSourcePickable(inst) {#isfoodsourcepickable}

**Status:** `stable`

**Description:**
Determines if an entity can be picked for food, supporting AI behavior and automation systems.

**Parameters:**
- `inst` (Entity): Entity to check

**Returns:**
- (boolean): Whether entity is a pickable food source

**Example:**
```lua
if IsFoodSourcePickable(plant) then
    -- This plant provides food when picked
end
```

## Woby Courier System

### GetWobyCourierChestPosition(inst) {#getwobycourrierchestposition}

**Status:** `stable`

**Description:**
Retrieves the chest position for Walter's Woby courier system.

**Parameters:**
- `inst` (Entity): Walter entity with woby commands

**Returns:**
- `x, z` (number, number): Chest coordinates if valid
- `nil, nil`: If no valid chest position

**Example:**
```lua
local chest_x, chest_z = GetWobyCourierChestPosition(walter)
if chest_x then
    -- Valid chest position found
    local chest_pos = Vector3(chest_x, 0, chest_z)
end
```

## Placement System

### UpdateAxisAlignmentValues(intervals) {#updateaxisalignmentvalues}

**Status:** `stable`

**Description:**
Updates axis-aligned placement settings for building alignment, supporting mod compatibility.

**Parameters:**
- `intervals` (number): New alignment interval value

**Example:**
```lua
-- Set alignment to half-tile precision
UpdateAxisAlignmentValues(0.5)
```

### CycleAxisAlignmentValues() {#cycleaxisalignmentvalues}

**Status:** `stable`

**Description:**
Cycles through predefined alignment values for building placement grid.

**Alignment Values:**
- Half wall (2): Largest grid
- Wall (1): Default grid
- Half tile (0.5): Fine grid
- Tile (0.25): Finest grid

**Example:**
```lua
-- Cycle to next alignment setting
CycleAxisAlignmentValues()
```

## Arena Management

### WAGPUNK_ARENA_COLLISION_DATA {#wagpunk-arena-collision-data}

**Status:** `stable`

**Description:**
Predefined collision barrier positions and configurations for the Wagpunk Arena.

**Data Format:**
Each entry contains: `{x, z, rotation, sfxlooper}`
- `x, z` (number): Position coordinates
- `rotation` (number): Barrier rotation angle in degrees
- `sfxlooper` (boolean): Whether barrier should have sound effects

**Example:**
```lua
-- Access barrier data for arena setup
for _, barrier_data in ipairs(WAGPUNK_ARENA_COLLISION_DATA) do
    local x, z, rotation, has_sfx = unpack(barrier_data)
    -- Create barrier at position with settings
end
```

## Cleanup Utilities

### ClearSpotForRequiredPrefabAtXZ(x, z, r) {#clearspotforrequiredprefab}

**Status:** `stable`

**Description:**
Removes entities from a specified area while respecting protected entity tags.

**Parameters:**
- `x, z` (number): Center coordinates for clearing
- `r` (number): Radius to clear around the center

**Protected Tags:**
- `"INLIMBO"`: Entities not in the world
- `"NOCLICK"`: Non-interactive entities  
- `"FX"`: Visual effects
- `"irreplaceable"`: Important entities that shouldn't be destroyed

**Example:**
```lua
-- Clear area for structure placement
ClearSpotForRequiredPrefabAtXZ(x, z, 2.0)
```

**Features:**
- Uses physics radius for accurate collision detection
- Safely destroys entities within specified area
- Prevents destruction of critical game entities

## Constants

### WOBYCOURIER_NO_CHEST_COORD

**Value:** Coordinate value indicating no chest is set

**Status:** `stable`

**Description:** Used by Woby courier system to indicate invalid chest coordinates.

### MAX_PHYSICS_RADIUS

**Status:** `stable`

**Description:** Maximum physics radius for entity searches and collision detection.

### TILE_SCALE

**Status:** `stable`

**Description:** Scale value for tile calculations in bridge construction and world manipulation.

## Performance Considerations

### Entity Searching
- Functions use optimized entity finding with appropriate tag filters
- Radius-based searches include overhang calculations for accuracy
- Cached results where possible to avoid repeated calculations

### Memory Management
- Helper functions avoid creating unnecessary temporary objects
- Tag collections are defined as constants to reduce allocation
- Entity validation prevents processing of invalid entities

### Bridge Construction Optimization
- Complex geometric calculations broken into specialized helper functions
- Ray-tracing algorithm minimizes redundant tile checks
- Direction detection uses efficient mathematical comparisons

## Best Practices

### ✅ Recommended Usage
- Use entity state functions for consistent death checking across systems
- Leverage bridge construction helpers for custom bridge implementations
- Utilize food classification systems for nutrition and AI mechanics
- Check entity validity before performing operations
- Use appropriate tag collections for combat targeting logic
- Validate world components before accessing advanced features

### ❌ Usage Warnings
- Don't assume entities have specific components without checking
- Don't ignore the `require_health` parameter in death checking functions
- Don't modify global tag collections directly
- Don't skip validation when using bridge construction helpers
- Don't assume inventory items are always valid
- Don't call tile change handlers directly without proper context validation

## Error Handling

### Entity Validation
```lua
-- Always check entity validity before operations
if ent:IsValid() then
    -- Perform operations safely
end
```

### Component Existence Checks
```lua
-- Verify component exists before accessing
local component = inst.components.targetcomponent
if component ~= nil then
    component:DoSomething()
end
```

### World State Validation
```lua
-- Validate world components for advanced features
if TheWorld.components.requiredcomponent then
    -- Use advanced functionality safely
end
```

## Related Systems

- **[Actions](./actions.md)**: Action system that utilizes these utility functions
- **[ComponentActions](./componentactions.md)**: Component-specific action implementations
- **[EntityScript](./entityscript.md)**: Core entity functionality and state management
- **[BufferedAction](./bufferedaction.md)**: Action queuing system integration
- **[Networking](./networking.md)**: Client-server communication for utility functions

---

*These utility functions form the foundation for many gameplay mechanics in Don't Starve Together. They provide consistent, reusable solutions for common operations across the game's component systems.*
