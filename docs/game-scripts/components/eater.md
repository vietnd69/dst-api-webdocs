---
id: eater
title: Eater
description: Manages an entity's diet, food consumption, and stat absorption from edible items.
tags: [consumption, diet, stats]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 55874bbd
system_scope: entity
---

# Eater

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Eater` defines what an entity can consume, tracks eating history, and applies health, hunger, and sanity effects from food items. It works alongside `edible`, `health`, `hunger`, and `sanity` components to process food consumption. The component manages diet restrictions, spoilage handling, and absorption modifiers for different character types.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("eater")
inst.components.eater:SetDiet({ FOODGROUP.MEAT }, { FOODGROUP.MEAT })
inst.components.eater:SetAbsorptionModifiers(1.5, 1.0, 0.5)
inst.components.eater:SetStrongStomach(true)

-- Check if entity can eat a food item
if inst.components.eater:CanEat(food) then
    inst.components.eater:Eat(food)
end
```

## Dependencies & tags
**Components used:**
- `edible` -- reads food stats via `GetHealth`, `GetHunger`, `GetSanity`, `GetStackMultiplier`, `HandleEatRemove`, `OnEaten`
- `health` -- applies health delta via `DoDelta`
- `hunger` -- applies hunger delta via `DoDelta`
- `sanity` -- applies sanity delta via `DoDelta`
- `foodmemory` -- tracks eaten foods via `GetFoodMultiplier`, `RememberFood`
- `foodaffinity` -- checks food preferences via `HasPrefabAffinity`
- `perishable` -- checks spoilage state via `IsSpoiled`
- `inventoryitem` -- gets grand owner via `GetGrandOwner`
- `container` -- checks if opened by feeder via `IsOpenedBy`
- `rideable` -- gets rider via `GetRider`
- `playercontroller` -- gets remote interaction via `GetRemoteInteraction`

**Tags:**
- `{foodtype}_eater` -- added/removed based on `caneat` diet (e.g., `omni_eater`, `meat_eater`)
- `strongstomach` -- added when strong stomach enabled
- `eatsrawmeat` -- added when raw meat eating enabled
- `ignoresspoilage` -- added when spoilage ignoring enabled
- `nospoiledfood` -- added when spoiled food refusal enabled
- `spoiledprocessor` -- added when entity can process spoiled items
- `allspoiledprocessor` -- added when entity processes all spoiled perishables

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that owns this component. |
| `eater` | boolean | `false` | Whether this entity is an eater (legacy flag). |
| `strongstomach` | boolean | `false` | Whether the entity has a strong stomach for monster meat. |
| `preferseating` | table | `{ FOODGROUP.OMNI }` | List of food groups the entity prefers to eat. |
| `caneat` | table | `{ FOODGROUP.OMNI }` | List of food groups the entity can eat. |
| `oneatfn` | function | `nil` | Callback function called when entity eats food. |
| `lasteattime` | number | `nil` | Timestamp of the last time the entity ate. |
| `ignoresspoilage` | boolean | `false` | Whether the entity ignores food spoilage penalties. |
| `eatwholestack` | boolean | `false` | Whether the entity consumes entire food stacks at once. |
| `healthabsorption` | number | `1` | Multiplier for health gained from food. |
| `hungerabsorption` | number | `1` | Multiplier for hunger gained from food. |
| `sanityabsorption` | number | `1` | Multiplier for sanity gained from food. |
| `spoiledprocessor` | boolean | `nil` | Whether the entity can process spoiled food items. |
| `allspoiledprocessor` | boolean | `nil` | Whether the entity processes all spoiled perishables, not just rot. |
| `eatsrawmeat` | boolean | `nil` | Whether the entity can eat raw meat without penalties. |
| `nospoiledfood` | boolean | `nil` | Whether the entity refuses spoiled food. |
| `preferseatingtags` | table | `nil` | List of tags that food must have to be preferred. |
| `cacheedibletags` | table/boolean | `nil` | Cached edible tags, or `false` to disable caching. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up eater tags when the component is removed from the entity. Called automatically by the engine.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetDiet(caneat, preferseating)`
* **Description:** Sets the diet for the entity, defining what food groups can be eaten and which are preferred.
* **Parameters:**
  - `caneat` -- table of food groups the entity can eat
  - `preferseating` -- table of preferred food groups (defaults to `caneat` if nil)
* **Returns:** None
* **Error states:** None

### `SetAbsorptionModifiers(health, hunger, sanity)`
* **Description:** Sets absorption rate multipliers for health, hunger, and sanity gained from food.
* **Parameters:**
  - `health` -- number multiplier for health absorption
  - `hunger` -- number multiplier for hunger absorption
  - `sanity` -- number multiplier for sanity absorption
* **Returns:** None
* **Error states:** None

### `TimeSinceLastEating()`
* **Description:** Returns the time elapsed since the entity last ate food.
* **Parameters:** None
* **Returns:** Number representing seconds since last eating, or `nil` if never ate.
* **Error states:** None

### `HasBeen(time)`
* **Description:** Checks if enough time has passed since the entity last ate.
* **Parameters:** `time` -- number of seconds to check against
* **Returns:** `true` if entity never ate or time since eating >= `time`, otherwise `false`.
* **Error states:** None

### `OnSave()`
* **Description:** Serializes the eater state for save data.
* **Parameters:** None
* **Returns:** Table with `time_since_eat` if `lasteattime` is set, otherwise `nil`.
* **Error states:** None

### `OnLoad(data)`
* **Description:** Deserializes the eater state from save data.
* **Parameters:** `data` -- table containing `time_since_eat` from save
* **Returns:** None
* **Error states:** None

### `SetCanEatHorrible()`
* **Description:** Enables the entity to eat horrible food type (e.g., monster meat for certain characters).
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetCanEatGears()`
* **Description:** Enables the entity to eat gears (e.g., WX-78 character).
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetCanEatNitre(can_eat)`
* **Description:** Enables or disables the entity's ability to eat nitre.
* **Parameters:** `can_eat` -- boolean to enable or disable nitre eating
* **Returns:** None
* **Error states:** None

### `SetCanEatRaw()`
* **Description:** Enables the entity to eat raw food type.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetPrefersEatingTag(tag)`
* **Description:** Adds a tag that food must have to be preferred by this entity.
* **Parameters:** `tag` -- string tag that preferred food must have
* **Returns:** None
* **Error states:** None

### `SetStrongStomach(is_strong)`
* **Description:** Enables or disables strong stomach, allowing consumption of monster meat without penalties.
* **Parameters:** `is_strong` -- boolean to enable or disable strong stomach
* **Returns:** None
* **Error states:** None

### `SetCanEatRawMeat(can_eat)`
* **Description:** Enables or disables the entity's ability to eat raw meat without negative effects.
* **Parameters:** `can_eat` -- boolean to enable or disable raw meat eating
* **Returns:** None
* **Error states:** None

### `SetIgnoresSpoilage(ignores)`
* **Description:** Enables or disables ignoring food spoilage penalties.
* **Parameters:** `ignores` -- boolean to enable or disable spoilage ignoring
* **Returns:** None
* **Error states:** None

### `SetRefusesSpoiledFood(refuses)`
* **Description:** Enables or disables refusal of spoiled food items.
* **Parameters:** `refuses` -- boolean to enable or disable spoiled food refusal
* **Returns:** None
* **Error states:** None

### `SetSpoiledProcessor(processor, allspoiled)`
* **Description:** Sets the entity as a processor of spoiled food items (e.g., pigs eating rot).
* **Parameters:**
  - `processor` -- boolean to enable or disable spoiled processing
  - `allspoiled` -- boolean to process all spoiled perishables, not just rot
* **Returns:** None
* **Error states:** None

### `IsSpoiledProcessor()`
* **Description:** Checks if the entity is a spoiled food processor.
* **Parameters:** None
* **Returns:** `true` if entity is a spoiled processor, otherwise `false`.
* **Error states:** None

### `CanProcessSpoiledItem(food)`
* **Description:** Checks if the entity can process a specific spoiled food item.
* **Parameters:** `food` -- entity instance of the food item
* **Returns:** `true` if entity is a spoiled processor and food is spoiled, otherwise `false`.
* **Error states:** Errors if `food` has no `edible` component (nil dereference on `food.components.edible` — no guard present).

### `SetOnEatFn(fn)`
* **Description:** Sets a callback function to be called when the entity eats food.
* **Parameters:** `fn` -- function with signature `fn(inst, food, feeder)`
* **Returns:** None
* **Error states:** None

### `DoFoodEffects(food)`
* **Description:** Determines if food effects (health/hunger/sanity) should apply based on entity's diet restrictions.
* **Parameters:** `food` -- entity instance of the food item
* **Returns:** `true` if effects should apply, `false` if entity has immunity (strong stomach, raw meat eater, or food affinity).
* **Error states:** None

### `GetEdibleTags()`
* **Description:** Returns a list of edible tags based on the entity's diet for targeting purposes.
* **Parameters:** None
* **Returns:** Table of tag strings (e.g., `edible_omni`, `edible_meat`).
* **Error states:** None

### `Eat(food, feeder)`
* **Description:** Consumes a food item, applying health, hunger, and sanity effects based on the entity's diet and absorption modifiers.
* **Parameters:**
  - `food` -- entity instance of the food item to eat
  - `feeder` -- entity instance feeding this entity (defaults to `self.inst`)
* **Returns:** `true` if food was eaten successfully, `false` if entity does not prefer to eat the food.
* **Error states:** Errors if `food` has no `edible` component (nil dereference on `food.components.edible` — no guard present).

### `TestFood(food, testvalues)`
* **Description:** Tests if a food item matches a list of food groups or types.
* **Parameters:**
  - `food` -- entity instance of the food item
  - `testvalues` -- table of food groups or types to test against
* **Returns:** `true` if food matches any test value, otherwise `false`.
* **Error states:** None

### `PrefersToEat(food)`
* **Description:** Checks if the entity prefers to eat a specific food item based on diet, spoilage, and tag preferences.
* **Parameters:** `food` -- entity instance of the food item
* **Returns:** `true` if entity prefers to eat the food, otherwise `false`.
* **Error states:** Errors if `food` has no `perishable` component when `nospoiledfood` is enabled (nil dereference on `food.components.perishable` — no guard present).

### `CanEat(food)`
* **Description:** Checks if the entity can eat a specific food item based on its diet.
* **Parameters:** `food` -- entity instance of the food item
* **Returns:** `true` if entity can eat the food, otherwise `false`.
* **Error states:** None

### `IsTryingToFeedMe(inst)`
* **Description:** Checks if another entity is attempting to feed this entity via buffered action or remote interaction.
* **Parameters:** `inst` -- entity instance to check for feeding action
* **Returns:** `true` if `inst` is trying to feed this entity, otherwise `false`.
* **Error states:** None

## Events & listeners
- **Pushes:** `oneat` - fired when entity eats food (data: `{ food, feeder }`)
- **Pushes:** `feedincontainer` - fired when feeding occurs through a container
- **Pushes:** `feedmount` - fired when feeding a mount (data: `{ food, eater }`)