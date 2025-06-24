---
id: plantregistrydata
title: Plant Registry Data
description: Data management system for tracking discovered plants, growth stages, fertilizers, and oversized plant pictures in the farming system
sidebar_position: 6
slug: api-vanilla/core-systems/plantregistrydata
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Plant Registry Data

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `PlantRegistryData` class manages persistent data for the farming system's plant discovery mechanics. It tracks which plants and growth stages players have discovered, fertilizer knowledge, and stores oversized plant pictures with associated player data.

## Usage Example

```lua
-- Access the global plant registry
local registry = ThePlayer.components.plantregistrydata

-- Learn a plant stage
registry:LearnPlantStage("carrot", 3)

-- Check if player knows a fertilizer
if registry:KnowsFertilizer("fertilizer_basic") then
    -- Player has discovered this fertilizer
end

-- Check plant discovery progress
local percent = registry:GetPlantPercent("potato", PLANT_DEFS.potato.plantregistryinfo)
```

## Class Definition

### PlantRegistryData()

**Status:** `stable`

**Description:**
Constructor that initializes a new plant registry data instance with empty plant, fertilizer, and picture collections.

**Properties:**
- `plants` (table): Maps plant names to their discovered growth stages
- `fertilizers` (table): Maps fertilizer names to discovery status
- `pictures` (table): Maps plant names to oversized picture data
- `filters` (table): Current filter settings for plant registry UI
- `last_selected_card` (table): Last selected card for each plant in UI

## Plant Knowledge Methods

### GetKnownPlants() {#get-known-plants}

**Status:** `stable`

**Description:**
Returns a table of all plants that have at least one discovered growth stage.

**Returns:**
- (table): Dictionary of plant names to their stage data

**Example:**
```lua
local known_plants = registry:GetKnownPlants()
for plant_name, stages in pairs(known_plants) do
    print("Player knows plant:", plant_name)
end
```

### GetKnownPlantStages(plant) {#get-known-plant-stages}

**Status:** `stable`

**Description:**
Returns the discovered growth stages for a specific plant.

**Parameters:**
- `plant` (string): The plant prefab name

**Returns:**
- (table): Dictionary mapping stage numbers to discovery status

**Example:**
```lua
local carrot_stages = registry:GetKnownPlantStages("carrot")
for stage, known in pairs(carrot_stages) do
    if known then
        print("Knows carrot stage:", stage)
    end
end
```

### IsAnyPlantStageKnown(plant) {#is-any-plant-stage-known}

**Status:** `stable`

**Description:**
Checks if the player has discovered any growth stage for the specified plant.

**Parameters:**
- `plant` (string): The plant prefab name

**Returns:**
- (boolean): True if any stage is known, false otherwise

**Example:**
```lua
if registry:IsAnyPlantStageKnown("potato") then
    -- Show potato in the plant registry UI
end
```

### KnowsPlantStage(plant, stage) {#knows-plant-stage}

**Status:** `stable`

**Description:**
Checks if a specific growth stage of a plant has been discovered.

**Parameters:**
- `plant` (string): The plant prefab name
- `stage` (number): The growth stage number

**Returns:**
- (boolean): True if the stage is known, false otherwise

**Example:**
```lua
if registry:KnowsPlantStage("carrot", 4) then
    print("Player has seen fully grown carrots")
end
```

### KnowsSeed(plant, plantregistryinfo) {#knows-seed}

**Status:** `stable`

**Description:**
Determines if the player knows what seed produces the specified plant by checking if any discovered stage reveals seed information.

**Parameters:**
- `plant` (string): The plant prefab name
- `plantregistryinfo` (table): Plant registry information from plant definition

**Returns:**
- (boolean): True if seed information is known

**Example:**
```lua
local plant_def = PLANT_DEFS.carrot
if registry:KnowsSeed("carrot", plant_def.plantregistryinfo) then
    -- Show seed information in UI
end
```

### KnowsPlantName(plant, plantregistryinfo, research_stage) {#knows-plant-name}

**Status:** `stable`

**Description:**
Checks if the player knows the name of the plant through discovered stages or a specific research stage.

**Parameters:**
- `plant` (string): The plant prefab name
- `plantregistryinfo` (table): Plant registry information from plant definition
- `research_stage` (number): Optional specific stage to check

**Returns:**
- (boolean): True if plant name is known

**Example:**
```lua
local plant_def = PLANT_DEFS.tomato
if registry:KnowsPlantName("tomato", plant_def.plantregistryinfo) then
    -- Display the actual plant name instead of "Unknown Plant"
end
```

## Fertilizer Knowledge Methods

### KnowsFertilizer(fertilizer) {#knows-fertilizer}

**Status:** `stable`

**Description:**
Checks if the player has discovered the specified fertilizer.

**Parameters:**
- `fertilizer` (string): The fertilizer prefab name

**Returns:**
- (boolean): True if fertilizer is known

**Example:**
```lua
if registry:KnowsFertilizer("fertilizer_basic") then
    -- Show fertilizer in plant registry UI
end
```

### LearnFertilizer(fertilizer) {#learn-fertilizer}

**Status:** `stable`

**Description:**
Records discovery of a new fertilizer and syncs with online inventory if enabled.

**Parameters:**
- `fertilizer` (string): The fertilizer prefab name

**Returns:**
- (boolean): True if this was a new discovery, false if already known

**Example:**
```lua
local was_new = registry:LearnFertilizer("fertilizer_growth_formula")
if was_new then
    -- Show discovery notification
end
```

## Picture Management Methods

### HasOversizedPicture(plant) {#has-oversized-picture}

**Status:** `stable`

**Description:**
Checks if an oversized picture has been taken for the specified plant.

**Parameters:**
- `plant` (string): The plant prefab name

**Returns:**
- (boolean): True if picture exists

**Example:**
```lua
if registry:HasOversizedPicture("giant_potato") then
    -- Show picture in plant registry
end
```

### GetOversizedPictureData(plant) {#get-oversized-picture-data}

**Status:** `stable`

**Description:**
Retrieves the stored data for an oversized plant picture, including weight, player, and clothing information.

**Parameters:**
- `plant` (string): The plant prefab name

**Returns:**
- (table): Picture data including weight, player, clothing, base skin, mode, and optional beard data

**Example:**
```lua
local picture_data = registry:GetOversizedPictureData("giant_carrot")
if picture_data then
    print("Record weight:", picture_data.weight)
    print("Record holder:", picture_data.player)
end
```

### TakeOversizedPicture(plant, weight, player, beardskin, beardlength) {#take-oversized-picture}

**Status:** `stable`

**Description:**
Records a new oversized plant picture if the weight exceeds the current record. Captures player appearance including clothing and skins.

**Parameters:**
- `plant` (string): The plant prefab name
- `weight` (number): The plant's weight
- `player` (EntityScript): The player entity
- `beardskin` (string): Optional beard skin for characters with beards
- `beardlength` (number): Optional beard length

**Returns:**
- (boolean): True if picture was recorded (new record or first picture)

**Example:**
```lua
local success = registry:TakeOversizedPicture("giant_potato", 15.5, ThePlayer)
if success then
    -- Show achievement or notification
end
```

## Progress and Statistics

### GetPlantPercent(plant, plantregistryinfo) {#get-plant-percent}

**Status:** `stable`

**Description:**
Calculates the discovery percentage for a plant based on known growth stages and fullgrown variants.

**Parameters:**
- `plant` (string): The plant prefab name
- `plantregistryinfo` (table): Plant registry information from plant definition

**Returns:**
- (number): Percentage of plant discovered (0.0 to 1.0)

**Example:**
```lua
local plant_def = PLANT_DEFS.carrot
local progress = registry:GetPlantPercent("carrot", plant_def.plantregistryinfo)
print("Carrot discovery:", math.floor(progress * 100) .. "%")
```

### LearnPlantStage(plant, stage) {#learn-plant-stage}

**Status:** `stable`

**Description:**
Records discovery of a new plant growth stage and updates UI card selection based on completion status.

**Parameters:**
- `plant` (string): The plant prefab name
- `stage` (number): The growth stage number

**Returns:**
- (boolean): True if this was a new discovery

**Example:**
```lua
local was_new = registry:LearnPlantStage("potato", 2)
if was_new then
    -- Play discovery sound or show notification
end
```

## UI State Management

### ClearFilters() {#clear-filters}

**Status:** `stable`

**Description:**
Resets all plant registry UI filters to their default state.

**Example:**
```lua
registry:ClearFilters()
-- All plants will now be visible in the registry UI
```

### SetFilter(category, value) {#set-filter}

**Status:** `stable`

**Description:**
Sets a filter value for the plant registry UI and marks data as dirty for saving.

**Parameters:**
- `category` (string): The filter category name
- `value` (any): The filter value

**Example:**
```lua
registry:SetFilter("season", "summer")
registry:SetFilter("discovered", true)
```

### GetFilter(category) {#get-filter}

**Status:** `stable`

**Description:**
Retrieves the current value for a plant registry UI filter.

**Parameters:**
- `category` (string): The filter category name

**Returns:**
- (any): The current filter value

**Example:**
```lua
local season_filter = registry:GetFilter("season")
if season_filter == "winter" then
    -- Show only winter plants
end
```

### GetLastSelectedCard(plant) {#get-last-selected-card}

**Status:** `stable`

**Description:**
Returns the last selected card (stage or summary) for a plant in the registry UI.

**Parameters:**
- `plant` (string): The plant prefab name

**Returns:**
- (string/number): The card identifier (stage number or "summary")

**Example:**
```lua
local last_card = registry:GetLastSelectedCard("carrot")
-- Restore UI to show the last viewed card
```

### SetLastSelectedCard(plant, card) {#set-last-selected-card}

**Status:** `stable`

**Description:**
Records which card was last selected for a plant in the registry UI.

**Parameters:**
- `plant` (string): The plant prefab name
- `card` (string/number): The card identifier (stage number or "summary")

**Example:**
```lua
registry:SetLastSelectedCard("potato", "summary")
-- UI will remember to show summary card next time
```

## Data Persistence

### Save(force_save) {#save}

**Status:** `stable`

**Description:**
Saves the plant registry data to persistent storage if enabled and data has been modified.

**Parameters:**
- `force_save` (boolean): If true, saves regardless of dirty flag

**Example:**
```lua
registry:Save(true) -- Force immediate save
```

### Load() {#load}

**Status:** `stable`

**Description:**
Loads plant registry data from persistent storage asynchronously. Data is restored to the instance when loading completes.

**Example:**
```lua
registry:Load()
-- Data will be available after the async operation completes
```

### ApplyOnlineProfileData() {#apply-online-profile-data}

**Status:** `stable`

**Description:**
Synchronizes plant registry data with online inventory when available. Decodes plant stages and oversized picture data from online storage.

**Returns:**
- (boolean): True if synchronization was successful

**Example:**
```lua
if registry:ApplyOnlineProfileData() then
    -- Online data has been synchronized
end
```

## Constants and Dependencies

### Required Modules

The module depends on several plant and fertilizer definition files:

- `prefabs/farm_plant_defs`: Provides `PLANT_DEFS` for plant configurations
- `prefabs/weed_defs`: Provides `WEED_DEFS` for weed configurations  
- `prefabs/fertilizer_nutrient_defs`: Provides `FERTILIZER_DEFS` for fertilizer data

### Platform Settings

```lua
local USE_SETTINGS_FILE = PLATFORM ~= "PS4" and PLATFORM ~= "NACL"
```

Settings file usage is disabled on PS4 and NACL platforms due to platform-specific limitations.

## Data Structure Examples

### Plant Stage Data Structure
```lua
-- Example of plants table structure
plants = {
    carrot = {
        [1] = true,  -- Stage 1 discovered
        [2] = true,  -- Stage 2 discovered
        [4] = true   -- Stage 4 discovered (stage 3 still unknown)
    },
    potato = {
        [1] = true,
        [2] = true,
        [3] = true,
        [4] = true   -- Fully discovered
    }
}
```

### Fertilizer Data Structure
```lua
-- Example of fertilizers table structure
fertilizers = {
    fertilizer_basic = true,
    fertilizer_growth_formula = true,
    fertilizer_nutrient_formula = true
}
```

### Picture Data Structure
```lua
-- Example of pictures table structure
pictures = {
    giant_potato = {
        weight = "15.75",
        player = "wilson",
        clothing = {
            body = "wilson_body_default",
            hand = "wilson_hand_default", 
            legs = "wilson_legs_default",
            feet = "wilson_feet_default"
        },
        base = "wilson_base_default",
        mode = "normal_skin"
    }
}
```

## Integration Examples

### With Plant Discovery System
```lua
-- When a plant stage is observed
local function OnPlantStageObserved(inst, stage)
    local registry = ThePlayer.components.plantregistrydata
    local plant_name = inst.prefab
    
    if registry:LearnPlantStage(plant_name, stage) then
        -- First time seeing this stage
        ThePlayer.components.talker:Say("I should note this in my plant registry!")
    end
end
```

### With Fertilizer System
```lua
-- When using a fertilizer
local function OnFertilizerUsed(fertilizer_name)
    local registry = ThePlayer.components.plantregistrydata
    
    if registry:LearnFertilizer(fertilizer_name) then
        -- First time using this fertilizer
        registry:Save(true) -- Force save new discovery
    end
end
```

### With Giant Crop System
```lua
-- When harvesting an oversized crop
local function OnGiantCropHarvested(inst, harvester, weight)
    local registry = harvester.components.plantregistrydata
    
    if registry:TakeOversizedPicture(inst.prefab, weight, harvester) then
        -- New record set!
        harvester.components.talker:Say("This is the biggest one I've ever grown!")
    end
end
```

## Related Modules

- [Farm Plant Definitions](./farm_plant_defs.md): Defines plant growth stages and registry information
- [Fertilizer Definitions](./fertilizer_nutrient_defs.md): Defines fertilizer types and properties
- [Weed Definitions](./weed_defs.md): Defines weed types that can be discovered
- [Player Profile](./playerprofile.md): Manages persistent player data including plant registry
- [Inventory System](./inventory.md): Handles online synchronization of plant discoveries
