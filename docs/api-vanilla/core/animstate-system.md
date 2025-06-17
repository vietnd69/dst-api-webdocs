---
id: animstate-system
title: AnimState System
sidebar_position: 5
last_updated: 2024-08-08
version: 625420
---
*Last Update: 2024-08-08*
# AnimState System

*API Version: 625420*

The AnimState system is responsible for managing entity animations, visual appearances, and graphic effects in Don't Starve Together. It provides the interface between the game's logic and the visual representation of entities.

## Basic Usage

```lua
-- Add an AnimState to an entity
entity.entity:AddAnimState()

-- Configure the AnimState
entity.AnimState:SetBank("wilson")
entity.AnimState:SetBuild("wilson")
entity.AnimState:PlayAnimation("idle")
```

## Core Concepts

### Banks and Builds

- **Bank**: Defines the animation rig and structure (skeleton)
- **Build**: Defines the visual appearance (textures and art)

```lua
-- Set the animation bank and build
entity.AnimState:SetBank("spider") -- Animation structure
entity.AnimState:SetBuild("spider_build") -- Visual assets
```

### Animations

Animations are sequences of frames that create motion:

```lua
-- Play a single animation
entity.AnimState:PlayAnimation("attack")

-- Play an animation and then loop another
entity.AnimState:PlayAnimation("attack")
entity.AnimState:PushAnimation("idle_loop", true) -- true means loop

-- Check if an animation is finished
local is_finished = entity.AnimState:AnimDone()
```

### Symbol Overrides

Symbol overrides allow for customizing specific parts of an animation:

```lua
-- Override the "swap_object" symbol with a tool's graphics
entity.AnimState:OverrideSymbol("swap_object", "swap_axe", "swap_axe")

-- Clear a specific override
entity.AnimState:ClearOverrideSymbol("swap_object")

-- Clear all overrides
entity.AnimState:ClearAllOverrideSymbols()
```

## Visual Effects

### Scaling and Flipping

```lua
-- Set uniform scale
entity.AnimState:SetScale(1.2, 1.2)

-- Flip horizontally (mirror)
entity.AnimState:SetScale(-1, 1)

-- Get current scale
local scale_x, scale_y = entity.AnimState:GetScale()
```

### Coloration and Tinting

```lua
-- Tint the entity with a color
entity.AnimState:SetMultColor(1, 0, 0, 1) -- Red tint (RGBA)

-- Add a highlight color
entity.AnimState:SetHighlightColour(1, 1, 0, 1) -- Yellow highlight

-- Set additive blending
entity.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
```

### Visibility and Layers

```lua
-- Hide the entire entity
entity.AnimState:Hide()

-- Show the entity
entity.AnimState:Show()

-- Hide specific parts/layers
entity.AnimState:Hide("ARM")
entity.AnimState:Show("ARM")

-- Set render layer (depth)
entity.AnimState:SetLayer(LAYER_BACKGROUND)
entity.AnimState:SetSortOrder(3)

-- Force single pass rendering (added in API 625420)
entity.AnimState:SetForceSinglePass(true) -- For UIAnims with alpha fades on clients without stencil buffers
```

## Animation Events

Animations can trigger events at specific frames:

```lua
-- Listen for animation events
entity:ListenForEvent("animover", function(inst)
    print("Animation completed!")
end)

entity:ListenForEvent("animqueueover", function(inst)
    print("Animation queue completed!")
end)
```

## Integration with Other Systems

The AnimState system works closely with:

- **Transform**: For positioning and scaling entities
- **Physics**: For aligning visuals with collision areas
- **State Graph**: For coordinating animations with entity states
- **Sound Emitter**: For synchronizing sounds with animations

## Common Use Cases

### Character Customization

```lua
-- Change character appearance
local function CustomizeCharacter(inst, skin_mode)
    if skin_mode == "normal" then
        inst.AnimState:SetBuild("wilson")
    elseif skin_mode == "formal" then
        inst.AnimState:SetBuild("wilson_formal")
    elseif skin_mode == "survivor" then
        inst.AnimState:SetBuild("wilson_survivor")
    end
end
```

### Tool/Weapon Visuals

```lua
-- Show a tool in character's hand
local function EquipTool(inst, tool)
    if tool.prefab == "axe" then
        inst.AnimState:OverrideSymbol("swap_object", "swap_axe", "swap_axe")
    elseif tool.prefab == "pickaxe" then
        inst.AnimState:OverrideSymbol("swap_object", "swap_pickaxe", "swap_pickaxe")
    end
    
    inst.AnimState:Show("ARM_carry")
    inst.AnimState:Hide("ARM_normal")
end

-- Remove tool visual
local function UnequipTool(inst)
    inst.AnimState:ClearOverrideSymbol("swap_object")
    inst.AnimState:Hide("ARM_carry")
    inst.AnimState:Show("ARM_normal")
end
```

### Visual Effects

```lua
-- Ghost effect
local function MakeGhost(inst)
    inst.AnimState:SetBank("ghost")
    inst.AnimState:SetBuild("ghost")
    inst.AnimState:PlayAnimation("idle", true)
    inst.AnimState:SetMultColor(1, 1, 1, 0.6) -- Transparent
    inst.AnimState:UsePointFiltering(true)
end

-- Burning effect
local function ApplyBurningEffect(inst)
    inst.AnimState:SetBloomEffectHandle("shaders/anim.ksh")
    inst.AnimState:SetMultColor(0.8, 0.5, 0.3, 1)
end
```

## Performance Considerations

- **Limit Animation Changes**: Frequent animation changes can impact performance
- **Use Symbol Overrides Sparingly**: Each override requires additional resources
- **Consider Visibility**: Hide entities that don't need to be rendered
- **Use Layers Appropriately**: Proper layer usage improves rendering efficiency
- **Watch Animation Count**: Too many simultaneous animations can reduce frame rate

## Best Practices

1. **Match Banks and Builds**: Ensure the bank and build are compatible
2. **Manage Animation Transitions**: Use PushAnimation for smooth transitions
3. **Clean Up Overrides**: Clear overrides when they're no longer needed
4. **Use Appropriate Animations**: Don't play detailed animations for distant entities
5. **Coordinate with Sound**: Synchronize animations with sound effects for immersion

## See also

- [Entity System](entity-system.md) - For the overall entity framework
- [Transform](../shared-properties/transform.md) - For positioning animated entities
- [Physics](physics.md) - For physical interaction with visuals
- [StateGraph System](stategraph-system.md) - For coordinating animations with states
- [Custom Animations](../examples/custom-stategraphs-and-animations.md) - For creating custom animations
