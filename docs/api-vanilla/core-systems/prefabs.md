---
id: prefabs
title: Prefabs
description: Core prefab system for creating game objects and managing assets
sidebar_position: 34
slug: api-vanilla/core-systems/prefabs
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Prefabs

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `prefabs` module provides the core system for defining and creating game objects in Don't Starve Together. It includes the `Prefab` and `Asset` classes that form the foundation of the game's entity system, along with automatic skin integration support.

## Usage Example

```lua
-- Basic prefab creation
local function my_item()
    local inst = CreateEntity()
    -- Entity setup code
    return inst
end

local my_prefab = Prefab("my_item", my_item, {
    Asset("ANIM", "anim/my_item.zip"),
    Asset("ATLAS", "images/inventoryimages/my_item.xml"),
}, {"log", "flint"})

return my_prefab
```

## Classes

### Prefab

**Status:** `stable`

**Description:**
The `Prefab` class defines a template for creating game objects. Each prefab contains the information needed to instantiate entities with specific properties, assets, and dependencies.

#### Constructor

##### Prefab(name, fn, assets, deps, force_path_search) {#prefab-constructor}

**Parameters:**
- `name` (string): Prefab identifier (path components are automatically removed)
- `fn` (function): Factory function that returns a configured entity instance
- `assets` (table, optional): Array of Asset objects required by this prefab
- `deps` (table, optional): Array of prefab names this prefab depends on
- `force_path_search` (boolean, optional): Whether to force path searching for this prefab

**Returns:**
- (Prefab): New prefab instance

**Example:**
```lua
local function wilson_fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Character-specific setup
    inst:AddTag("player")
    inst:AddTag("character")
    
    return inst
end

local wilson = Prefab("wilson", wilson_fn, {
    Asset("ANIM", "anim/player_basic.zip"),
    Asset("ANIM", "anim/player_idles_shaved.zip"),
    Asset("SOUND", "sound/sfx.fsb"),
    Asset("ATLAS", "images/inventoryimages.xml"),
}, {"beard", "resurrectionstatue"})
```

#### Properties

##### prefab.name {#prefab-name}

**Type:** `string`

**Status:** `stable`

**Description:**
The processed name of the prefab with any path components removed.

**Example:**
```lua
local prefab = Prefab("characters/wilson", wilson_fn)
print(prefab.name) -- Output: "wilson"
```

##### prefab.desc {#prefab-desc}

**Type:** `string`

**Status:** `stable`

**Description:**
Human-readable description of the prefab. Defaults to empty string.

**Example:**
```lua
local prefab = Prefab("wilson", wilson_fn)
prefab.desc = "The Gentleman Scientist"
```

##### prefab.fn {#prefab-fn}

**Type:** `function`

**Status:** `stable`

**Description:**
The factory function that creates and configures entity instances.

**Example:**
```lua
local prefab = Prefab("my_item", function()
    local inst = CreateEntity()
    -- Setup code
    return inst
end)
```

##### prefab.assets {#prefab-assets}

**Type:** `table`

**Status:** `stable`

**Description:**
Array of Asset objects that must be loaded for this prefab.

**Example:**
```lua
local prefab = Prefab("my_item", my_item_fn, {
    Asset("ANIM", "anim/my_item.zip"),
    Asset("ATLAS", "images/inventoryimages/my_item.xml"),
})

-- Access assets
for i, asset in ipairs(prefab.assets) do
    print("Asset:", asset.type, asset.file)
end
```

##### prefab.deps {#prefab-deps}

**Type:** `table`

**Status:** `stable`

**Description:**
Array of prefab names that this prefab depends on, including automatically added skin prefabs.

**Example:**
```lua
local prefab = Prefab("my_weapon", my_weapon_fn, nil, {"log", "flint"})

-- Check dependencies
for i, dep in ipairs(prefab.deps) do
    print("Dependency:", dep)
end
```

##### prefab.force_path_search {#prefab-force-path-search}

**Type:** `boolean`

**Status:** `stable`

**Description:**
Whether the game should force path searching when loading this prefab.

#### Methods

##### prefab:__tostring() {#prefab-tostring}

**Status:** `stable`

**Description:**
Returns a string representation of the prefab for debugging purposes.

**Returns:**
- (string): Formatted string with prefab name and description

**Example:**
```lua
local prefab = Prefab("wilson", wilson_fn)
prefab.desc = "The Gentleman Scientist"
print(tostring(prefab)) -- Output: "Prefab wilson - The Gentleman Scientist"
```

### Asset

**Status:** `stable`

**Description:**
The `Asset` class represents a game asset that must be loaded for a prefab to function properly.

#### Constructor

##### Asset(type, file, param) {#asset-constructor}

**Parameters:**
- `type` (string): Type of asset ("ANIM", "ATLAS", "IMAGE", "SOUND", "MINIMAP_IMAGE", etc.)
- `file` (string): Path to the asset file
- `param` (any, optional): Additional parameter for certain asset types

**Returns:**
- (Asset): New asset instance

**Example:**
```lua
-- Animation asset
local anim_asset = Asset("ANIM", "anim/wilson.zip")

-- Atlas asset
local atlas_asset = Asset("ATLAS", "images/inventoryimages.xml")

-- Sound asset
local sound_asset = Asset("SOUND", "sound/sfx.fsb")

-- Image asset with parameters
local image_asset = Asset("IMAGE", "images/ui.tex")

-- Minimap image
local minimap_asset = Asset("MINIMAP_IMAGE", "wilson")
```

#### Properties

##### asset.type {#asset-type}

**Type:** `string`

**Status:** `stable`

**Description:**
The type of asset being defined.

**Common Types:**
- `"ANIM"` - Animation files (.zip)
- `"ATLAS"` - Texture atlas files (.xml)
- `"IMAGE"` - Image files (.tex)
- `"SOUND"` - Sound files (.fsb)
- `"MINIMAP_IMAGE"` - Minimap icon images
- `"SHADER"` - Shader files
- `"PKGREF"` - Package references

##### asset.file {#asset-file}

**Type:** `string`

**Status:** `stable`

**Description:**
Path to the asset file relative to the game's asset directories.

##### asset.param {#asset-param}

**Type:** `any`

**Status:** `stable`

**Description:**
Optional parameter for assets that require additional configuration.

## Skin Integration

The prefab system automatically integrates with the skin system. When a prefab is created, any available skins for that prefab are automatically added to its dependencies.

### Automatic Skin Dependencies

```lua
-- If PREFAB_SKINS["wilson"] contains skin prefabs, they are automatically added
local wilson = Prefab("wilson", wilson_fn, assets)
-- wilson.deps now includes all Wilson skin prefabs automatically
```

### Checking Skin Integration

```lua
-- Check if a prefab has skins
local function PrefabHasSkins(prefab_name)
    return PREFAB_SKINS[prefab_name] ~= nil
end

-- Get skin count for a prefab
local function GetSkinCount(prefab_name)
    local skins = PREFAB_SKINS[prefab_name]
    return skins and #skins or 0
end

print("Wilson has", GetSkinCount("wilson"), "skins")
```

## Common Usage Patterns

### Basic Item Prefab

```lua
local function my_item_fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    MakeInventoryPhysics(inst)

    inst.AnimState:SetBank("my_item")
    inst.AnimState:SetBuild("my_item")
    inst.AnimState:PlayAnimation("idle")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")

    return inst
end

return Prefab("my_item", my_item_fn, {
    Asset("ANIM", "anim/my_item.zip"),
    Asset("ATLAS", "images/inventoryimages/my_item.xml"),
})
```

### Character Prefab

```lua
local function character_fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()

    MakeCharacterPhysics(inst, 30, .5)

    inst.AnimState:SetBank("wilson")
    inst.AnimState:SetBuild("wilson")
    inst.AnimState:PlayAnimation("idle")

    inst:AddTag("player")
    inst:AddTag("character")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    -- Add character components
    inst:AddComponent("health")
    inst:AddComponent("hunger")
    inst:AddComponent("sanity")
    inst:AddComponent("locomotor")
    inst:AddComponent("inventory")

    return inst
end

return Prefab("my_character", character_fn, {
    Asset("ANIM", "anim/player_basic.zip"),
    Asset("ANIM", "anim/player_idles_shaved.zip"),
    Asset("SOUND", "sound/sfx.fsb"),
}, {"resurrectionstatue"})
```

### Structure Prefab

```lua
local function structure_fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()

    MakeObstaclePhysics(inst, 1)

    inst.AnimState:SetBank("my_structure")
    inst.AnimState:SetBuild("my_structure")
    inst.AnimState:PlayAnimation("idle")

    inst:AddTag("structure")

    inst.entity:SetPristine()

    if not TheWorld.ismastersim then
        return inst
    end

    inst:AddComponent("inspectable")
    inst:AddComponent("lootdropper")
    inst:AddComponent("workable")

    return inst
end

return Prefab("my_structure", structure_fn, {
    Asset("ANIM", "anim/my_structure.zip"),
    Asset("MINIMAP_IMAGE", "my_structure"),
})
```

## Asset Types Reference

### Animation Assets
```lua
Asset("ANIM", "anim/filename.zip")
-- Contains spriter animation data
```

### Atlas Assets
```lua
Asset("ATLAS", "images/inventoryimages.xml")
Asset("ATLAS", "images/inventoryimages/item.xml")
-- Texture atlas definitions
```

### Image Assets
```lua
Asset("IMAGE", "images/inventoryimages.tex")
Asset("IMAGE", "images/ui/button.tex")
-- Individual texture files
```

### Sound Assets
```lua
Asset("SOUND", "sound/sfx.fsb")
Asset("SOUND", "sound/music.fsb")
-- Sound effect and music files
```

### Minimap Assets
```lua
Asset("MINIMAP_IMAGE", "prefab_name")
-- Minimap icon (automatically finds correct file)
```

## Error Handling

### Missing Assets
```lua
-- The game will show errors if required assets are missing
-- Always include necessary assets in the prefab definition
```

### Circular Dependencies
```lua
-- Avoid circular dependencies between prefabs
-- Use proper dependency ordering
```

### Name Conflicts
```lua
-- Prefab names must be unique
-- The last registered prefab with a name wins
```

## Related Modules

- [Prefab List](./prefablist.md): Complete list of all game prefabs
- [Prefab Skins](./prefabskin.md): Visual customization system
- [Prefab Utilities](./prefabutil.md): Helper functions for prefab creation
- [Entity Script](./entityscript.md): Entity creation and management
