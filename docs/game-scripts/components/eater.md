---
id: eater
title: Eater
description: Manages an entity's ability to consume food items, applying health, hunger, and sanity effects while handling diet restrictions and spoilage tolerance.
tags: [consumption, diet, food, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5258c060
system_scope: entity
---

# Eater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Eater` component governs how an entity consumes food, including which foods it can eat, dietary preferences, and the magnitude of nutritional benefits or penalties. It is typically added to characters, creatures, and entities capable of eating. The component integrates with `edible`, `health`, `hunger`, `sanity`, `perishable`, `foodaffinity`, and `foodmemory` components to compute precise stat changes during consumption. Tag management is used internally to indicate compatibility with specific food types (e.g., `rawmeat_eater`, `spoiled_eater`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("eater")
inst.components.eater:SetDiet({ FOODGROUP.OMNI }, { FOODGROUP.OMNI })
inst.components.eater:SetStrongStomach(true)
inst.components.eater:SetIgnoresSpoilage(true)
inst.components.eater:SetCanEatRaw()
```

## Dependencies & tags
**Components used:** `edible`, `health`, `hunger`, `sanity`, `perishable`, `foodaffinity`, `foodmemory`, `inventoryitem`, `container`, `rideable`  
**Tags:** Adds/removes food-type tags dynamically (e.g., `"edible_"..v`, `"strongstomach"`, `"eatsrawmeat"`, `"ignoresspoilage"`, `"nospoiledfood"`, `"<type>_eater"`); checks `"spoiled"`, `"monstermeat"`, `"rawmeat"` on food items.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `eater` | boolean | `false` | Flag indicating the entity is capable of eating. |
| `strongstomach` | boolean | `false` | Whether the entity can safely consume Monster Meat without sanity loss. |
| `preferseating` | table | `{ FOODGROUP.OMNI }` | List of preferred food groups/Types the entity likes to eat. |
| `caneat` | table | `{ FOODGROUP.OMNI }` | List of food groups/Types the entity is physically capable of eating. |
| `ignoresspoilage` | boolean | `false` | Whether spoilage effects are ignored on food (perishable only). |
| `eatwholestack` | boolean | `false` | Whether the entire stack is consumed at once. |
| `eatsrawmeat` | boolean | `false` | Whether the entity can eat raw meat without penalty. |
| `nospoiledfood` | boolean | `false` | Whether the entity refuses to eat spoiled food. |
| `healthabsorption` | number | `1` | Multiplier applied to health values gained from food. |
| `hungerabsorption` | number | `1` | Multiplier applied to hunger values gained from food. |
| `sanityabsorption` | number | `1` | Multiplier applied to sanity values gained from food. |
| `lasteattime` | number? | `nil` | Timestamp of the last time the entity ate. |

## Main functions
### `SetDiet(caneat, preferseating)`
* **Description:** Configures what food types the entity can eat (`caneat`) and prefers to eat (`preferseating`). Calls `oncaneat` to manage associated tags.
* **Parameters:** `caneat` (table) - list of edible food groups/Types; `preferseating` (table?) - list of preferred food groups/Types, defaults to `caneat` if `nil`.
* **Returns:** Nothing.

### `SetAbsorptionModifiers(health, hunger, sanity)`
* **Description:** Sets absorption multipliers for stat gains from consumed food.
* **Parameters:** `health` (number), `hunger` (number), `sanity` (number) - multipliers (e.g., `0.5` for half effect, `2` for double).
* **Returns:** Nothing.

### `TimeSinceLastEating()`
* **Description:** Returns how many seconds have passed since the entity last ate.
* **Parameters:** None.
* **Returns:** `number` - seconds elapsed, or `nil` if never eaten.

### `HasBeen(time)`
* **Description:** Checks if enough time has elapsed since the last eating event.
* **Parameters:** `time` (number) - threshold in seconds.
* **Returns:** `boolean` - `true` if `lasteattime` is `nil` or elapsed time ≥ `time`.

### `OnSave()`
* **Description:** Serialization helper for saving state.
* **Parameters:** None.
* **Returns:** `table?` - `{ time_since_eat = <seconds> }` if `lasteattime` exists, else `nil`.

### `OnLoad(data)`
* **Description:** Deserialization helper for restoring state after loading.
* **Parameters:** `data` (table) - must contain `time_since_eat` (number) to restore `lasteattime`.
* **Returns:** Nothing.

### `SetCanEatHorrible()`
* **Description:** Grants the entity the ability to eat `HORRIBLE`-type food and updates related tags.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetCanEatGears()`
* **Description:** Grants the entity the ability to eat `GEARS`-type food and updates related tags.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetCanEatNitre(can_eat)`
* **Description:** Enables or disables ability to eat `NITRE`-type food.
* **Parameters:** `can_eat` (boolean) - whether the entity can now eat Nitre.
* **Returns:** Nothing.

### `SetCanEatRaw()`
* **Description:** Grants the entity the ability to eat raw food items.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetStrongStomach(is_strong)`
* **Description:** Enables/disables strong stomach status, allowing consumption of Monster Meat without sanity loss.
* **Parameters:** `is_strong` (boolean).
* **Returns:** Nothing.

### `SetCanEatRawMeat(can_eat)`
* **Description:** Enables/disables eating raw meat without associated penalties.
* **Parameters:** `can_eat` (boolean).
* **Returns:** Nothing.

### `SetIgnoresSpoilage(ignores)`
* **Description:** Enables/disables ignoring of spoilage effects on food.
* **Parameters:** `ignores` (boolean).
* **Returns:** Nothing.

### `SetRefusesSpoiledFood(refuses)`
* **Description:** Enables/disables refusal to eat spoiled food (overrides default behavior).
* **Parameters:** `refuses` (boolean).
* **Returns:** Nothing.

### `SetOnEatFn(fn)`
* **Description:** Sets a custom callback function triggered immediately after food consumption logic completes.
* **Parameters:** `fn` (function) - signature: `fn(eater_entity, food, feeder_entity)`.
* **Returns:** Nothing.

### `DoFoodEffects(food)`
* **Description:** Determines whether food-specific exceptions apply (e.g., Monster Meat is safe if `strongstomach`, raw meat safe if `eatsrawmeat`, or food affinity matches).
* **Parameters:** `food` (Entity) - the food item being evaluated.
* **Returns:** `boolean` - `true` if the food’s “bad” effects should still be applied, `false` otherwise.

### `GetEdibleTags()`
* **Description:** Returns a list of tags indicating which food categories the entity can eat (e.g., `{"edible_OMNI", "edible_RAWMEAT"}`).
* **Parameters:** None.
* **Returns:** `table` - list of `string` tags.

### `Eat(food, feeder)`
* **Description:** Consumes the given food item, applying health, hunger, and sanity changes. Handles stack consumption, food memory, and custom callbacks.
* **Parameters:** `food` (Entity) - the food to eat; `feeder` (Entity?) - the entity feeding or acting on behalf of the eater (defaults to `self.inst`).
* **Returns:** `boolean` - `true` if food was eaten (i.e., `PrefersToEat(food)` passed), else `nil`.
* **Error states:** Returns `nil` if `PrefersToEat` returns `false`; early exits if no consumable stat changes are possible.

### `TestFood(food, testvalues)`
* **Description:** Internal helper to check if a food item matches any of the specified edible food types or groups.
* **Parameters:** `food` (Entity?) - food item to test; `testvalues` (table) - list of food types/groups (e.g., `self.preferseating`).
* **Returns:** `boolean` - `true` if food contains a matching `"edible_<type>"` tag.

### `PrefersToEat(food)`
* **Description:** Checks if the entity *prefers* to eat the food (includes tag, spoilage, and diet checks).
* **Parameters:** `food` (Entity) - food item.
* **Returns:** `boolean` - `true` if the entity prefers to eat the food.
* **Error states:** Returns `false` for `"winter_food4"` (fruitcake) on players; returns `false` if food is spoiled and `nospoiledfood` is set; returns `false` if `preferseatingtags` are defined and food lacks them.

### `CanEat(food)`
* **Description:** Checks if the entity is *physically capable* of eating the food, ignoring preference or spoilage.
* **Parameters:** `food` (Entity) - food item.
* **Returns:** `boolean` - `true` if food is within the `caneat` list.

## Events & listeners
- **Listens to:** None (no event registration via `inst:ListenForEvent` in this component).
- **Pushes:** `"oneat"` (after consumption succeeds) with `{ food = food, feeder = feeder }`; `"feedincontainer"` (to `feeder` if eating from a container); `"feedmount"` (to `feeder` if eating as a mount).
- **Listeners on `food`:** Not directly registered, but calls `food.components.edible:OnEaten()` and `food.components.edible:HandleEatRemove()`.
