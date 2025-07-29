---
id: tiledefs
title: TileDefs
description: Complete definitions of all vanilla ground tiles including ocean, land, impassable, and noise tiles with their properties
sidebar_position: 1
slug: game-scripts/core-systems/tiledefs
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# TileDefs

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `TileDefs` module contains the complete definitions of all vanilla ground tiles in Don't Starve Together. It uses the TileManager to register tile ranges and add all default tiles with their visual properties, sounds, and gameplay characteristics. This file defines the foundation of the world's visual and interactive landscape.

## Usage Example

```lua
-- Access specific tile IDs after tiledefs loads
print("Grass tile ID:", WORLD_TILES.GRASS)
print("Ocean tile ID:", WORLD_TILES.OCEAN_COASTAL)

-- Check if a tile has specific properties
if GROUND_HARD[WORLD_TILES.ROCKY] then
    print("Rocky tiles are hard - cannot be dug")
end

if GROUND_FLOORING[WORLD_TILES.WOODFLOOR] then
    print("Wood floor tiles act as flooring")
end
```

## Tile Categories

### Impassable Tiles

Tiles that cannot be traversed by entities:

#### IMPASSABLE {#impassable}
- **Ground Name:** "Impassable"
- **Description:** Completely impassable terrain that blocks all movement
- **Properties:** Cannot be traversed by any entity

#### FAKE_GROUND {#fake-ground}
- **Ground Name:** "Fake Ground" 
- **Description:** Fake ground tile used for special rendering effects
- **Properties:** Appears as ground but functions as impassable

### Ocean Tiles

Water tiles supporting boat navigation and ocean gameplay:

#### OCEAN_COASTAL_SHORE {#ocean-coastal-shore}
- **Ground Name:** "Coastal Shore"
- **Ocean Depth:** SHALLOW
- **Properties:** Shoreline area, walkable by wading
- **Sounds:** Marsh movement sounds
- **Wave Tint:** Shallow water tinting
- **Description:** Transition zone between land and ocean

#### OCEAN_BRINEPOOL_SHORE {#ocean-brinepool-shore}
- **Ground Name:** "Brinepool Shore"
- **Ocean Depth:** SHALLOW
- **Properties:** Special shore area for brine pools
- **Colors:** Distinctive red-tinted appearance
- **Wave Tint:** Brinepool coloring

#### OCEAN_COASTAL {#ocean-coastal}
- **Ground Name:** "Coastal Ocean"
- **Ocean Depth:** SHALLOW
- **Properties:** Shallow coastal waters suitable for small boats
- **Wave Tint:** Standard shallow water effects

#### OCEAN_WATERLOG {#ocean-waterlog}
- **Ground Name:** "Waterlogged Ocean"
- **Ocean Depth:** SHALLOW
- **Properties:** Waterlogged areas with standard ocean properties
- **Wave Tint:** Clear water appearance

#### OCEAN_BRINEPOOL {#ocean-brinepool}
- **Ground Name:** "Brinepool"
- **Ocean Depth:** SHALLOW
- **Properties:** Special brine pool areas
- **Colors:** Distinct brine pool coloring
- **Wave Tint:** Brinepool effects

#### OCEAN_SWELL {#ocean-swell}
- **Ground Name:** "Swell Ocean"
- **Ocean Depth:** BASIC
- **Properties:** Standard ocean depth with swells
- **Wave Tint:** Standard ocean appearance

#### OCEAN_ROUGH {#ocean-rough}
- **Ground Name:** "Rough Ocean"
- **Ocean Depth:** DEEP
- **Properties:** Deep ocean with rough conditions
- **Wave Tint:** Darker, more turbulent appearance

#### OCEAN_HAZARDOUS {#ocean-hazardous}
- **Ground Name:** "Hazardous Ocean"
- **Ocean Depth:** VERY_DEEP
- **Properties:** Deepest, most dangerous ocean areas
- **Wave Tint:** Dark, threatening appearance

### Land Tiles

Solid ground tiles supporting structures and land-based gameplay:

#### ROAD {#road}
- **Ground Name:** "Road"
- **Properties:** Hard, roadway tile with cobblestone texture
- **Sounds:** Dirt movement sounds
- **Special:** Part of road system, very hard surface
- **Turf:** Available as "road" turf item

#### PEBBLEBEACH {#pebblebeach}
- **Ground Name:** "Pebble Beach"
- **Properties:** Rocky beach terrain
- **Sounds:** Custom pebblebeach movement sounds
- **Turf:** Available as "pebblebeach" turf

#### MONKEY_GROUND {#monkey-ground}
- **Ground Name:** "Pirate Beach"
- **Properties:** Monkey Island beach terrain
- **Sounds:** Pebblebeach-style movement
- **Turf:** Available as "monkey_ground" turf

#### SHELLBEACH {#shellbeach}
- **Ground Name:** "Shell Beach"
- **Properties:** Beach area covered in shells
- **Sounds:** Rocky movement sounds
- **Turf:** Available as "shellbeach" turf

#### MARSH {#marsh}
- **Ground Name:** "Marsh"
- **Properties:** Swampy, muddy terrain
- **Sounds:** Marsh-specific movement sounds
- **Turf:** Available as "marsh" turf

#### ROCKY {#rocky}
- **Ground Name:** "Rocky"
- **Properties:** Hard rocky terrain, cannot be dug
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "rocky" turf

#### SAVANNA {#savanna}
- **Ground Name:** "Savanna"
- **Properties:** Grassland with yellow grass texture
- **Sounds:** Tall grass movement sounds
- **Turf:** Available as "savanna" turf

#### FOREST {#forest}
- **Ground Name:** "Forest"
- **Properties:** Standard forest ground
- **Sounds:** Woods movement sounds
- **Turf:** Available as "forest" turf

#### GRASS {#grass}
- **Ground Name:** "Grass"
- **Properties:** Basic grass terrain
- **Sounds:** Grass movement sounds
- **Turf:** Available as "grass" turf

#### DIRT {#dirt}
- **Ground Name:** "Dirt"
- **Properties:** Cannot be dug up, basic dirt
- **Sounds:** Dirt movement sounds
- **Special:** Immune to terraforming

#### DECIDUOUS {#deciduous}
- **Ground Name:** "Deciduous"
- **Properties:** Deciduous forest ground
- **Sounds:** Carpet-like movement sounds
- **Turf:** Available as "deciduous" turf

#### DESERT_DIRT {#desert-dirt}
- **Ground Name:** "Desert Dirt"
- **Properties:** Desert terrain
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "desertdirt" turf

### Cave Tiles

Underground terrain for cave environments:

#### CAVE {#cave}
- **Ground Name:** "Cave"
- **Properties:** Basic cave ground
- **Sounds:** Dirt movement with cave acoustics
- **Turf:** Available as "cave" turf

#### FUNGUS {#fungus}
- **Ground Name:** "Blue Fungus"
- **Properties:** Fungal cave terrain (blue)
- **Sounds:** Moss movement sounds
- **Turf:** Available as "fungus" turf

#### FUNGUSRED {#fungusred}
- **Ground Name:** "Red Fungus"
- **Properties:** Fungal cave terrain (red)
- **Sounds:** Moss movement sounds
- **Turf:** Available as "fungus_red" turf

#### FUNGUSGREEN {#fungusgreen}
- **Ground Name:** "Green Fungus"
- **Properties:** Fungal cave terrain (green)
- **Sounds:** Moss movement sounds
- **Turf:** Available as "fungus_green" turf

#### FUNGUSMOON {#fungusmoon}
- **Ground Name:** "Moon Fungus"
- **Properties:** Lunar fungal terrain
- **Sounds:** Custom grotto footstep sounds
- **Turf:** Available as "fungus_moon" turf

#### SINKHOLE {#sinkhole}
- **Ground Name:** "Sinkhole"
- **Properties:** Transitional sinkhole terrain
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "sinkhole" turf

#### UNDERROCK {#underrock}
- **Ground Name:** "Under Rock"
- **Properties:** Hard rocky cave terrain
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "underrock" turf

#### MUD {#mud}
- **Ground Name:** "Mud"
- **Properties:** Muddy cave terrain
- **Sounds:** Mud movement sounds
- **Turf:** Available as "mud" turf

### Ruins Tiles

Ancient ruins terrain with special properties:

#### ARCHIVE {#archive}
- **Ground Name:** "Archives"
- **Properties:** Hard ancient archive terrain
- **Sounds:** Marble movement sounds
- **Turf:** Available as "archive" turf

#### BRICK_GLOW {#brick-glow}
- **Ground Name:** "Pale Bricks"
- **Properties:** Hard glowing ruins bricks
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "ruinsbrick_glow" turf

#### BRICK {#brick}
- **Ground Name:** "Glowing Bricks"
- **Properties:** Hard ruins bricks with glow
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "ruinsbrick" turf

#### TILES_GLOW {#tiles-glow}
- **Ground Name:** "Pale Tiles"
- **Properties:** Hard glowing ruins tiles
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "ruinstiles_glow" turf

#### TILES {#tiles}
- **Ground Name:** "Glowing Tiles"
- **Properties:** Hard ruins tiles with glow
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "ruinstiles" turf

#### TRIM_GLOW {#trim-glow}
- **Ground Name:** "Pale Trim"
- **Properties:** Hard glowing ruins trim
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "ruinstrim_glow" turf

#### TRIM {#trim}
- **Ground Name:** "Glowing Trim"
- **Properties:** Hard ruins trim with glow
- **Sounds:** Dirt movement sounds
- **Turf:** Available as "ruinstrim" turf

### Flooring Tiles

Craftable floor tiles with special properties:

#### SCALE {#scale}
- **Ground Name:** "Scale"
- **Properties:** Hard flooring with fire resistance
- **Flashpoint Modifier:** +250 (highly fire resistant)
- **Sounds:** Marble movement sounds
- **Turf:** Available as "dragonfly" turf

#### WOODFLOOR {#woodfloor}
- **Ground Name:** "Wood"
- **Properties:** Hard wooden flooring
- **Sounds:** Wood movement sounds
- **Turf:** Available as "woodfloor" turf

#### CHECKER {#checker}
- **Ground Name:** "Checkers"
- **Properties:** Hard checkered flooring
- **Sounds:** Marble movement sounds
- **Turf:** Available as "checkerfloor" turf

#### MOSAIC_GREY {#mosaic-grey}
- **Ground Name:** "Grey Mosaic"
- **Properties:** Hard decorative flooring
- **Sounds:** Marble movement sounds
- **Turf:** Available as "mosaic_grey" turf

#### MOSAIC_RED {#mosaic-red}
- **Ground Name:** "Red Mosaic"
- **Properties:** Hard decorative flooring
- **Sounds:** Marble movement sounds
- **Turf:** Available as "mosaic_red" turf

#### MOSAIC_BLUE {#mosaic-blue}
- **Ground Name:** "Blue Mosaic"
- **Properties:** Hard decorative flooring
- **Sounds:** Marble movement sounds
- **Turf:** Available as "mosaic_blue" turf

#### CARPET {#carpet}
- **Ground Name:** "Carpet"
- **Properties:** Hard carpet flooring
- **Sounds:** Carpet movement sounds
- **Turf:** Available as "carpetfloor" turf

#### CARPET2 {#carpet2}
- **Ground Name:** "Carpet"
- **Properties:** Hard alternative carpet flooring
- **Sounds:** Carpet movement sounds
- **Turf:** Available as "carpetfloor2" turf

#### BEARD_RUG {#beard-rug}
- **Ground Name:** "Beard Rug"
- **Properties:** Hard beard hair flooring
- **Sounds:** Carpet movement sounds
- **Turf:** Available as "beard_rug" turf

### Special Tiles

Unique tiles for specific game mechanics:

#### METEOR {#meteor}
- **Ground Name:** "Meteor"
- **Properties:** Meteoric terrain from lunar impact
- **Sounds:** Custom meteor movement sounds
- **Turf:** Available as "meteor" turf

#### MONKEY_DOCK {#monkey-dock}
- **Ground Name:** "Docks"
- **Properties:** Cannot be dug, hard flooring, temporary tile
- **Sounds:** Custom dock movement sounds
- **Special:** Invisible tile type, temporary placement

#### OCEAN_ICE {#ocean-ice}
- **Ground Name:** "Ice Floe"
- **Properties:** Cannot be dug, hard, temporary, no ground overlays
- **Sounds:** Ice slab movement sounds
- **Special:** Temporary ice formation on ocean

#### CHARLIE_VINE {#charlie-vine}
- **Ground Name:** "Charlie Vine"
- **Properties:** Cannot be dug, hard, invisible, temporary, no overlays
- **Sounds:** Grass movement sounds
- **Special:** Invisible vine tile

#### ROPE_BRIDGE {#rope-bridge}
- **Ground Name:** "Rope Bridge"
- **Properties:** Cannot be dug, hard, invisible, temporary, no overlays
- **Sounds:** Cave bridge movement sounds
- **Special:** Bridge spanning gaps

#### RIFT_MOON {#rift-moon}
- **Ground Name:** "Lunar Rift"
- **Properties:** Cannot be dug, hard, temporary
- **Sounds:** Meteor movement sounds
- **Special:** Lunar rift terrain

### Event Tiles

Special tiles for limited-time events:

#### QUAGMIRE_GATEWAY {#quagmire-gateway}
- **Ground Name:** "Gorge Gateway"
- **Properties:** Event-specific gateway terrain
- **Sounds:** Woods movement sounds

#### QUAGMIRE_CITYSTONE {#quagmire-citystone}
- **Ground Name:** "Gorge Citystone"
- **Properties:** Event city stone terrain
- **Sounds:** Dirt movement sounds

#### QUAGMIRE_PARKFIELD {#quagmire-parkfield}
- **Ground Name:** "Gorge Park Grass"
- **Properties:** Event park grass terrain
- **Sounds:** Carpet movement sounds

#### QUAGMIRE_PARKSTONE {#quagmire-parkstone}
- **Ground Name:** "Gorge Park Path"
- **Properties:** Event park path terrain
- **Sounds:** Dirt movement sounds

#### QUAGMIRE_PEATFOREST {#quagmire-peatforest}
- **Ground Name:** "Gorge Peat Forest"
- **Properties:** Event peat forest terrain
- **Sounds:** Marsh movement sounds

#### QUAGMIRE_SOIL {#quagmire-soil}
- **Ground Name:** "Gorge Soil"
- **Properties:** Event soil terrain
- **Sounds:** Mud movement sounds

#### FARMING_SOIL {#farming-soil}
- **Ground Name:** "Farming Soil"
- **Properties:** Temporary farming soil
- **Sounds:** Mud movement sounds
- **Special:** Temporary tile for farming

#### LAVAARENA_TRIM {#lavaarena-trim}
- **Ground Name:** "Forge Trim"
- **Properties:** Event arena trim
- **Sounds:** Dirt movement sounds

#### LAVAARENA_FLOOR {#lavaarena-floor}
- **Ground Name:** "Forge Floor"
- **Properties:** Event arena floor
- **Sounds:** Dirt movement sounds

### Noise Tiles

Special tiles used for texture blending:

- **FUNGUSMOON_NOISE** - Moon fungus noise blending
- **METEORMINE_NOISE** - Meteor mine noise blending
- **METEORCOAST_NOISE** - Meteor coast noise blending
- **DIRT_NOISE** - Dirt noise blending
- **ABYSS_NOISE** - Abyss noise blending
- **GROUND_NOISE** - General ground noise blending
- **CAVE_NOISE** - Cave noise blending
- **FUNGUS_NOISE** - Fungus noise blending

## Ocean Color Schemes

The file defines several ocean color schemes used for different water types:

### COASTAL_SHORE_OCEAN_COLOR
- **Primary:** Light blue with low opacity
- **Secondary:** Teal with medium opacity
- **Dusk:** Dark with low opacity
- **Minimap:** Blue-gray

### COASTAL_OCEAN_COLOR
- **Primary:** Bright cyan with very low opacity
- **Secondary:** Blue with medium opacity
- **Dusk:** Blue-green with medium opacity
- **Minimap:** Blue-gray

### SWELL_OCEAN_COLOR
- **Primary:** Bright cyan with very low opacity
- **Secondary:** Dark blue with high opacity
- **Dusk:** Dark blue-green with medium opacity
- **Minimap:** Dark blue

### ROUGH_OCEAN_COLOR
- **Primary:** Blue-green with low opacity
- **Secondary:** Very dark blue with high opacity
- **Dusk:** Very dark blue-green with high opacity
- **Minimap:** Dark blue

### HAZARDOUS_OCEAN_COLOR
- **Primary:** White with low opacity
- **Secondary:** Very dark blue with medium opacity
- **Dusk:** Black with high opacity
- **Minimap:** Very dark blue

### BRINEPOOL_OCEAN_COLOR
- **Primary:** Cyan with medium opacity
- **Secondary:** Dark blue with high opacity
- **Dusk:** Very dark blue with high opacity
- **Minimap:** Gray-blue

## Wave Tints

Different ocean areas use specific wave tinting:

- **shallow:** `{0.8, 0.9, 1}` - Slightly blue-tinted
- **rough:** `{0.65, 0.84, 0.94}` - Blue-gray tint
- **swell:** `{0.65, 0.84, 0.94}` - Blue-gray tint
- **brinepool:** `{0.65, 0.92, 0.94}` - Cyan-tinted
- **hazardous:** `{0.40, 0.50, 0.62}` - Dark gray-blue
- **waterlog:** `{1, 1, 1}` - No tinting

## Tile Properties

### Movement Properties
- **hard:** Tile cannot be dug up with shovel
- **flooring:** Tile acts as constructed flooring
- **roadways:** Tile is part of the road system
- **cannotbedug:** Tile is immune to terraforming
- **nogroundoverlays:** Tile doesn't show snow/mud overlays
- **isinvisibletile:** Tile has special invisible rendering
- **istemptile:** Tile is temporary and uses undertile system

### Sound Properties
- **runsound:** Sound played when running on tile
- **walksound:** Sound played when walking on tile
- **snowsound:** Sound played when moving on snowy tile
- **mudsound:** Sound played when moving on muddy tile
- **pickupsound:** Sound played when picking up turf

### Visual Properties
- **flashpoint_modifier:** Modifies fire spread behavior
- **colors:** Primary and secondary colors for blending
- **wavetint:** Color tinting for ocean wave effects
- **ocean_depth:** Depth category for ocean tiles

## Global Tables

After tile registration, several global tables are populated:

- **WORLD_TILES:** Contains all tile ID constants
- **INVERTED_WORLD_TILES:** Maps tile IDs back to names
- **GROUND_NAMES:** Human-readable names for tiles
- **GROUND_FLOORING:** Tracks which tiles are flooring
- **GROUND_HARD:** Tracks which tiles are hard
- **GROUND_ROADWAYS:** Tracks which tiles are roadways
- **TERRAFORM_IMMUNE:** Tracks which tiles cannot be terraformed
- **GROUND_NOGROUNDOVERLAYS:** Tracks tiles without overlays
- **GROUND_INVISIBLETILES:** Tracks invisible tiles
- **GROUND_ISTEMPTILE:** Tracks temporary tiles

## Usage in Modding

The tile system supports modding through proper tile ranges:

```lua
-- Mods should register their own tile ranges
TileManager.RegisterTileRange("MODNAME_TILES", 2000, 2255)

-- Then add custom tiles
TileManager.AddTile(
    "CUSTOM_TERRAIN",
    "MODNAME_TILES",
    {ground_name = "Custom Terrain"},
    ground_definition,
    minimap_definition,
    turf_definition
)
```

## Protection System

The module uses protection flags to prevent interference:

- `mod_protect_TileManager = false` initially allows tile registration
- `allow_existing_GROUND_entry = true` allows vanilla tile updates
- After loading, protection is enabled to prevent conflicts

## Related Modules

- [TileManager](./tilemanager.md): Core tile management system
- [TileGroups](./tilegroups.md): Tile categorization and validation
- [World Tile Definitions](../map/worldtiledefs.md): Core tile constants

## Source Reference

**File:** `scripts/tiledefs.lua`

**Key Implementation Notes:**
- Registers all vanilla tile ranges using TileManager
- Defines ocean color schemes and wave tinting effects
- Creates complete tile definitions with visual and audio properties
- Maintains compatibility with legacy tile IDs
- Supports both gameplay and rendering requirements
