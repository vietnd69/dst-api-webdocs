---
id: constants
title: Constants
sidebar_position: 11
---

# Constants

Don't Starve Together has many predefined constants and values used throughout the codebase. Below are the important constant groups and how to use them.

## Animation Constants

Constants related to animation and display:

```lua
-- Animation Orientation
ANIM_ORIENTATION = {
    BillBoard = 0,        -- Always faces the camera
    OnGround = 1,         -- Sits on the ground, can rotate
    OnGroundFixed = 2     -- Fixed on the ground
}

-- Animation Sort Order (Z-ordering)
ANIM_SORT_ORDER = {
    OCEAN_UNDERWATER = 0,
    OCEAN_WAVES = 1,
    OCEAN_BOAT = 2,
    OCEAN_BOAT_BUMPERS = 3,
    OCEAN_SKYSHADOWS = 4,
    OCEAN_WHIRLPORTAL = 1
}

-- Animation Sort Order Below Ground
ANIM_SORT_ORDER_BELOW_GROUND = {
    UNDERWATER = 0,
    BOAT_TRAIL = 1,
    BOAT_LIP = 2,
    UNUSED = 3
}
```

## Collision Groups

Collision groups define how entities physically interact with each other:

```lua
COLLISION = {
    GROUND = 32,
    BOAT_LIMITS = 64,
    LAND_OCEAN_LIMITS = 128,     -- Physics wall between land and ocean
    LIMITS = 128 + 64,           -- BOAT_LIMITS + LAND_OCEAN_LIMITS
    ITEMS = 256,
    CHARACTERS = 1024,
    FLYERS = 2048,
    OBSTACLES = 512,
    GIANTS = 16384               -- Collide with large obstacles
}
```

## Camera Constants

```lua
CAMERASHAKE = {
    FULL = 0,      -- Shake entire camera
    SIDE = 1,      -- Shake horizontally
    VERTICAL = 2   -- Shake vertically
}
```

## UI Constants

```lua
-- Anchor positions for UI elements
ANCHOR_MIDDLE = 0
ANCHOR_LEFT = 1
ANCHOR_RIGHT = 2
ANCHOR_TOP = 1
ANCHOR_BOTTOM = 2

-- Background colors for UI
BGCOLOURS = {
    FULL = RGB(255, 255, 255),
    HALF = RGB(128, 128, 128),
    GREY = RGB(75, 75, 75),
    RED = RGB(255, 89, 46),
    YELLOW = RGB(255, 196, 45),
    PURPLE = RGB(184, 87, 198)
}

-- Blend modes for rendering
BLENDMODE = {
    Disabled = 0,
    AlphaBlended = 1,
    Additive = 2,
    Premultiplied = 3,
    InverseAlpha = 4,
    AlphaAdditive = 5,
    VFXTest = 6
}
```

## Weather Constants

```lua
SEASONS = {
    AUTUMN = "autumn",
    WINTER = "winter",
    SPRING = "spring",
    SUMMER = "summer"
}

PRECIPITATION = {
    NONE = "none",
    RAIN = "rain",
    SNOW = "snow"
}

MOISTURE_SOURCES = {
    PRECIP = "precipitation",
    FLOOD = "flood",
    OCEAN = "ocean",
    PUDDLE = "puddle",
    WATER_SPRAY = "water_spray"
}

GROUND_OVERLAYS = {
    PUDDLES = "puddles_overlay",
    SNOW = "snow_overlay"
}
```

## Damage Types

```lua
DAMAGETYPES = {
    PHYSICAL = "physical",
    FIRE = "fire",
    STARVATION = "starvation",
    POISON = "poison",
    ELECTRIC = "electric",
    COLD = "cold",
    DARKNESS = "darkness"
}

TUNING.FIRE_DAMAGE = 3
TUNING.POISON_DAMAGE = 1.5
TUNING.ELECTRIC_DAMAGE = 2
TUNING.COLD_DAMAGE = 1
```

## Tag Constants

```lua
-- Character tags
PLAYER_TAGS = { "player", "character" }
SANITY_TAGS = { "crazy", "insane" }
HEALTH_TAGS = { "injured", "wounded" }

-- Entity state tags
BURNABLE_TAGS = { "canburnable", "burnable" }
FREEZABLE_TAGS = { "canfreeze", "freezable" }
EDIBLE_TAGS = { "edible_VEGGIE", "edible_MEAT", "edible_ELEMENTAL" }
```

## Using Constants in Mods

Constants can be used in your mod:

```lua
-- Use in modmain.lua
AddPrefabPostInit("yourprefab", function(inst)
    -- Add collision to entity
    local physics = inst.entity:AddPhysics()
    physics:SetCollisionGroup(COLLISION.OBSTACLES)
    physics:CollidesWith(COLLISION.CHARACTERS + COLLISION.ITEMS)
    
    -- Set animation orientation
    local anim = inst.entity:GetAnimState()
    anim:SetOrientation(ANIM_ORIENTATION.OnGround)
    anim:SetSortOrder(ANIM_SORT_ORDER.OCEAN_BOAT)
    
    -- Assign damage type
    inst.components.combat:SetDefaultDamage(TUNING.FIRE_DAMAGE)
end)
```

## TUNING Constants

TUNING is a special table containing game balance values that are widely used:

```lua
-- Typical values in TUNING
TUNING = {
    -- Character stats
    WILSON_HEALTH = 150,
    WILSON_HUNGER = 150,
    WILSON_SANITY = 200,
    
    -- Damage values
    SPEAR_DAMAGE = 34,
    AXE_DAMAGE = 27,
    
    -- Hunger drain
    HUNGER_RATE = 0.75,
    
    -- Item properties
    STACK_SIZE_LARGEITEM = 10,
    STACK_SIZE_MEDITEM = 20,
    STACK_SIZE_SMALLITEM = 40,
    
    -- Light values
    TORCH_LIGHT = 2.5,
    CAMPFIRE_LIGHT = 3.0
}
```

## Customizing Constants in Mods

You can override constants in your mod:

```lua
-- In modmain.lua
TUNING.WILSON_HEALTH = 200     -- Increase Wilson's health
TUNING.SPEAR_DAMAGE = 40       -- Increase spear damage

-- Add new constants
TUNING.MY_MOD_CONSTANT = 123

-- Override values in existing tables
SEASONS.MODSEASON = "modseason"
``` 