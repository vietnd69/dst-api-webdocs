---
id: api-update-example
title: API Update Example - Waterlogged Update
sidebar_position: 7
last_updated: 2023-07-06
slug: /api/update-example
---
*Last Update: 2023-07-06*
# API Update Example: Waterlogged Update

This document demonstrates how to document API changes using a real-world example from the Waterlogged Update (released in March 2022). This update introduced significant changes to the boat system and added new water-related features.

## Game Update: Waterlogged Update (March 2022)

The Waterlogged Update focused on enhancing the water and boat mechanics in Don't Starve Together. It introduced new boat types, water-related components, and improved the API for creating custom boats and water content.

### New Features

#### Boat Customization API

**Description**: The update introduced a comprehensive API for creating custom boat types with different properties, allowing mods to define new boat prefabs with unique characteristics.

**API Reference**:
```lua
-- New boat component
BoatCustomization = Class(function(self, inst)
    self.inst = inst
    self.decor_items = {}
    self.decor_slots = {}
    self.item_data = {}
end)

-- Key methods
function BoatCustomization:AddDecorSlot(slotname, pos, test_fn, accept_fn)
    -- Implementation details
end

function BoatCustomization:AddDecorType(prefab, build, symbol, slot_type)
    -- Implementation details
end
```

**Usage Example**:
```lua
-- Creating a custom boat with decoration slots
local function MakeCustomBoat()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it a boat
    inst:AddComponent("boat")
    
    -- Add customization
    inst:AddComponent("boatcustomization")
    inst.components.boatcustomization:AddDecorSlot(
        "mast", 
        Vector3(0, 0, 0), 
        function(item) return item:HasTag("boat_mast") end,
        function(item, boat) -- Accept function
            -- Custom logic when item is placed
        end
    )
    
    return inst
end
```

**Notes**:
- The boat customization system is designed to be extensible for mods
- Custom boats must include the base "boat" component
- Decoration slots can have custom validation and acceptance logic

#### Waterlogging Component

**Description**: A new component that tracks how waterlogged an entity is, affecting its performance and potentially causing it to sink.

**API Reference**:
```lua
Waterloggable = Class(function(self, inst)
    self.inst = inst
    self.waterlog = 0
    self.max_waterlog = 100
    self.waterlog_rate = 1
    self.sink_threshold = 0.75
end)

function Waterloggable:SetWaterlogRate(rate)
    self.waterlog_rate = rate
end

function Waterloggable:SetMaxWaterlog(max)
    self.max_waterlog = max
end

function Waterloggable:GetWaterlogPercent()
    return self.waterlog / self.max_waterlog
end

function Waterloggable:IsWaterlogged()
    return self.waterlog >= self.max_waterlog * self.sink_threshold
end
```

**Usage Example**:
```lua
-- Make an entity waterloggable
inst:AddComponent("waterloggable")
inst.components.waterloggable:SetMaxWaterlog(150)
inst.components.waterloggable:SetWaterlogRate(0.5)

-- Check waterlog status
if inst.components.waterloggable:IsWaterlogged() then
    -- Entity is critically waterlogged
end

-- Listen for waterlog events
inst:ListenForEvent("waterlog_change", function(inst, data)
    local percent = data.percent
    -- React to waterlog changes
end)
```

### Changed APIs

#### Boat Component

**Previous Behavior**:
```lua
-- Old boat component had limited configuration
inst:AddComponent("boat")
inst.components.boat.max_health = 200
```

**New Behavior**:
```lua
-- New boat component has expanded configuration options
inst:AddComponent("boat")
inst.components.boat:SetMaxHealth(200)
inst.components.boat:SetBurnTime(30)
inst.components.boat:SetWaterlogAmount(5)
```

**Migration Guide**:
1. Replace direct property assignments with the new setter methods
2. Update any code that reads properties directly to use getter methods
3. Add waterlogging configuration if needed

**Compatibility Notes**:
- Direct property access is still supported but deprecated
- Older boat prefabs will continue to work but won't benefit from new features
- Custom boat mods should update to use the new API for full compatibility

### Deprecated APIs

#### Anchor Item Component

**Deprecated Function/Component**:
```lua
-- The deprecated component
inst:AddComponent("anchor_item")
inst.components.anchor_item.boat_max_velocity = 0
```

**Recommended Alternative**:
```lua
-- The recommended replacement
inst:AddComponent("boatanchor")
inst.components.boatanchor:SetMaxVelocity(0)
```

**Reason for Deprecation**:
The `anchor_item` component was replaced with the more comprehensive `boatanchor` component that provides better integration with the new boat system and supports additional features.

**Timeline**:
The `anchor_item` component will be removed in a future update. Mods should transition to the new `boatanchor` component as soon as possible.

### Removed APIs

#### Fish Prefab

**Removed API**:
```lua
-- The prefab that no longer exists
-- local fish = SpawnPrefab("fish")
```

**Replacement**:
```lua
-- The replacement prefabs
local fish = SpawnPrefab("oceanfish_small_1")
-- or other specific fish types
```

**Migration Steps**:
1. Identify all instances where the "fish" prefab is spawned
2. Replace with appropriate oceanfish prefabs based on the context
3. Update any code that relies on specific properties of the old fish prefab

## Additional Resources

- [Official Waterlogged Update Announcement](https://forums.kleientertainment.com/forums/topic/136860-dont-starve-together-waterlogged-update/)
- [Waterlogged Update on Steam](https://store.steampowered.com/news/app/322330/view/3111417945997598275)
- [Boat Modding Guide](https://forums.kleientertainment.com/forums/topic/137125-modding-guide-custom-boats/)

## Known Issues

- Some older boat mods may experience issues with the new waterlogging system
- Custom boat decorations might need adjustments to work with the new decoration slots
- The `boatcustomization` component has some edge cases when multiple mods modify the same boat type

## Community Feedback

If you encounter issues with the new boat APIs or have suggestions for improvements, please share your feedback on the [Klei Forums](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-beta-modding/) or the [DST Modding Discord](https://discord.gg/dst). 
