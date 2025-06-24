---
id: scrapbook-prefabs
title: Scrapbook Prefabs
description: Registry of all prefabs that can be discovered and documented in the in-game scrapbook
sidebar_position: 51
slug: core-systems/scrapbook-prefabs
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Scrapbook Prefabs

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `scrapbook_prefabs` module defines the complete registry of prefabs that can be discovered and documented in Don't Starve Together's in-game scrapbook system. This comprehensive list includes creatures, items, structures, and other entities that players can encounter and learn about during gameplay.

## Usage Example

```lua
-- Check if a prefab is included in the scrapbook
local PREFABS = require("scrapbook_prefabs")

if PREFABS["wilson"] then
    print("Wilson is documented in the scrapbook")
end

-- Iterate through all scrapbook prefabs
for prefab_name, included in pairs(PREFABS) do
    if included then
        print("Prefab in scrapbook:", prefab_name)
    end
end
```

## Data Structure

### PREFABS {#prefabs-table}

**Type:** `table`

**Status:** `stable`

**Description:**
A lookup table containing all prefabs that are included in the scrapbook system. Each entry maps a prefab name to `true` if it should appear in the scrapbook.

**Structure:**
```lua
local PREFABS = {
    ["prefab_name"] = true,
    -- ... more entries
}
```

## Prefab Categories

The scrapbook includes prefabs from the following major categories:

### Characters & Companions
```lua
-- Main characters
["wilson"] = true,
["willow"] = true,
["wolfgang"] = true,
["wendy"] = true,
["wx78"] = true,
["wickerbottom"] = true,
["woodie"] = true,
["wes"] = true,
["waxwell"] = true,
["wathgrithr"] = true,
["webber"] = true,
["winona"] = true,
["warly"] = true,
["wortox"] = true,
["wormwood"] = true,
["wurt"] = true,
["walter"] = true,
["wanda"] = true,

-- Companions and pets
["abigail"] = true,
["chester"] = true,
["hutch"] = true,
["polly_rogers"] = true,
["wobybig"] = true,
```

### Creatures & Mobs
```lua
-- Hostile creatures
["hound"] = true,
["firehound"] = true,
["icehound"] = true,
["spider"] = true,
["spider_warrior"] = true,
["tallbird"] = true,
["tentacle"] = true,

-- Neutral creatures
["beefalo"] = true,
["koalefant_summer"] = true,
["koalefant_winter"] = true,
["rabbit"] = true,
["crow"] = true,
["robin"] = true,

-- Boss creatures
["deerclops"] = true,
["dragonfly"] = true,
["bearger"] = true,
["moose"] = true,
["klaus"] = true,
["beequeen"] = true,
["antlion"] = true,
["toadstool"] = true,
```

### Items & Tools
```lua
-- Basic tools
["axe"] = true,
["pickaxe"] = true,
["shovel"] = true,
["hammer"] = true,

-- Weapons
["spear"] = true,
["tentaclespike"] = true,
["hambat"] = true,
["nightsword"] = true,

-- Armor
["armorgrass"] = true,
["armorwood"] = true,
["footballhat"] = true,
["minerhat"] = true,
```

### Structures & Buildings
```lua
-- Crafting stations
["researchlab"] = true,
["researchlab2"] = true,
["researchlab3"] = true,
["researchlab4"] = true,

-- Storage
["treasurechest"] = true,
["icebox"] = true,
["saltbox"] = true,

-- Survival structures
["campfire"] = true,
["firepit"] = true,
["tent"] = true,
["siestahut"] = true,
```

### Food & Cooking
```lua
-- Raw ingredients
["meat"] = true,
["monstermeat"] = true,
["smallmeat"] = true,
["berries"] = true,
["carrot"] = true,

-- Cooked foods
["cookedmeat"] = true,
["meatballs"] = true,
["honeynuggets"] = true,
["dragonpie"] = true,

-- Crock pot dishes
["baconeggs"] = true,
["honeyham"] = true,
["kabobs"] = true,
["perogies"] = true,
```

### Natural Resources
```lua
-- Basic materials
["log"] = true,
["rocks"] = true,
["flint"] = true,
["cutgrass"] = true,
["twigs"] = true,

-- Advanced materials
["goldnugget"] = true,
["redgem"] = true,
["bluegem"] = true,
["purplegem"] = true,
["thulecite"] = true,
```

## Special Categories

### Event Items
```lua
-- Winter's Feast ornaments
["winter_ornament_plain1"] = true,
["winter_ornament_fancy1"] = true,
["winter_ornament_light1"] = true,
["winter_ornament_boss_deerclops"] = true,

-- Halloween items
["halloweencandy_1"] = true,
["pumpkin_lantern"] = true,
["costume_doll_body"] = true,

-- Chinese New Year items (when available)
["dragonheadhat"] = true,
["dragonbodyhat"] = true,
["dragontailhat"] = true,
["redlantern"] = true,
```

### Ocean Content
```lua
-- Ocean structures
["boat"] = true,
["mast"] = true,
["anchor"] = true,
["boat_cannon"] = true,

-- Sea creatures
["shark"] = true,
["cookiecutter"] = true,
["whale"] = true,
["squid"] = true,

-- Ocean resources
["kelp"] = true,
["barnacle"] = true,
["salt"] = true,
```

### Lunar/Shadow Content
```lua
-- Lunar items
["moonrocknugget"] = true,
["moonglass"] = true,
["purebrilliance"] = true,

-- Shadow items
["shadowheart"] = true,
["voidcloth"] = true,
["armor_voidcloth"] = true,
```

## Excluded Prefabs

Some prefabs are intentionally excluded from the scrapbook, typically indicated by commented-out entries:

```lua
-- Examples of excluded prefabs
--["hareball"] = true,          -- Not included
--["antchovies"] = true,        -- Not included
--["fish"] = true,              -- Deprecated prefab
--["diviningrod"] = true,       -- Not included
```

## Functions

### Accessing the Registry

The module returns the PREFABS table directly:

```lua
local scrapbook_prefabs = require("scrapbook_prefabs")

-- Check if a specific prefab is in the scrapbook
local function IsInScrapbook(prefab_name)
    return scrapbook_prefabs[prefab_name] == true
end

-- Get count of all scrapbook entries
local function GetScrapbookEntryCount()
    local count = 0
    for prefab, included in pairs(scrapbook_prefabs) do
        if included then
            count = count + 1
        end
    end
    return count
end

-- Get all scrapbook prefab names
local function GetAllScrapbookPrefabs()
    local prefabs = {}
    for prefab, included in pairs(scrapbook_prefabs) do
        if included then
            table.insert(prefabs, prefab)
        end
    end
    return prefabs
end
```

## Integration with Scrapbook System

The prefab registry integrates with other scrapbook components:

```lua
-- Example integration with scrapbook partitions
local scrapbook_partitions = require("scrapbookpartitions")

-- Set a prefab as seen in game
local function RecordPrefabSeen(prefab_name)
    if scrapbook_prefabs[prefab_name] then
        scrapbook_partitions:SetSeenInGame(prefab_name)
    end
end

-- Check if prefab should be included in scrapbook
local function ShouldTrackInScrapbook(prefab_name)
    return scrapbook_prefabs[prefab_name] == true
end
```

## Usage Patterns

### Validation
```lua
-- Validate prefab before scrapbook operations
local function ValidatePrefabForScrapbook(prefab)
    if not scrapbook_prefabs[prefab] then
        print("Warning: Prefab", prefab, "not tracked in scrapbook")
        return false
    end
    return true
end
```

### Discovery Systems
```lua
-- Award scrapbook progress for discovering new prefabs
local function OnPrefabDiscovered(prefab)
    if scrapbook_prefabs[prefab] then
        -- This prefab counts for scrapbook completion
        ThePlayer:PushEvent("scrapbook_discovery", { prefab = prefab })
    end
end
```

### Statistics
```lua
-- Calculate scrapbook completion percentage
local function CalculateScrapbookCompletion()
    local total_entries = 0
    local discovered_entries = 0
    
    for prefab, included in pairs(scrapbook_prefabs) do
        if included then
            total_entries = total_entries + 1
            if TheScrapbookPartitions:WasSeenInGame(prefab) then
                discovered_entries = discovered_entries + 1
            end
        end
    end
    
    return math.floor((discovered_entries / total_entries) * 100)
end
```

## Development Notes

- The prefab list is manually curated and updated with new content releases
- Commented entries indicate prefabs that were considered but excluded
- Event-specific items may have limited availability
- Some prefabs redirect to proxy entries for scrapbook purposes

## Related Modules

- [Scrapbook Partitions](./scrapbookpartitions.md): Data management and storage system
- [Scrapbook Data](../screens/redux/scrapbookdata.md): UI data structure for scrapbook entries
- [Prefabs](./prefabs.md): Core prefab system
