---
id: eater
title: Eater
description: This component manages an entity's ability to eat, defining its diet, processing food consumption, and applying resulting stat changes.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 5258c060
---

# Eater

## Overview
The Eater component is a fundamental part of Don't Starve Together's entity component system, granting an entity the capability to consume food items. It defines what an entity can eat (its diet), what foods it prefers, how various food types affect its health, hunger, and sanity, and manages attributes like the time since it last ate. This component also handles the application of specific tags to the entity, reflecting its dietary traits (e.g., `strongstomach`, `_eater` tags for specific food groups).

## Dependencies & Tags
This component itself doesn't explicitly add other components to the `inst`, but it heavily interacts with other components that are expected to be present on the `inst` entity or on the `food` entity being consumed:
*   **On `inst` (the eating entity):**
    *   `health`: To apply health benefits/penalties from food.
    *   `hunger`: To apply hunger benefits/penalties from food.
    *   `sanity`: To apply sanity benefits/penalties from food.
    *   `foodmemory`: To apply food multipliers based on remembered foods.
    *   `inventoryitem`: To check ownership when feeding entities in containers.
    *   `rideable`: To check if the feeder is the rider when feeding mounts.
*   **On `food` (the consumed item):**
    *   `edible`: Essential for determining food values and handling consumption.
    *   `perishable`: To check for spoilage.

**Tags added to `inst` by this component:**
*   `[FOODGROUP/FOODTYPE]_eater`: Added dynamically based on `self.caneat` and specific `SetCanEat...` functions (e.g., `omni_eater`, `horrible_eater`, `gears_eater`, `nitre_eater`, `raw_eater`).
*   `strongstomach`: Added by `SetStrongStomach(true)`.
*   `eatsrawmeat`: Added by `SetCanEatRawMeat(true)`.
*   `ignoresspoilage`: Added by `SetIgnoresSpoilage(true)`.
*   `nospoiledfood`: Added by `SetRefusesSpoiledFood(true)`.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `nil` | A reference to the entity this component is attached to. |
| `strongstomach` | `boolean` | `false` | If true, the entity gains the "strongstomach" tag, indicating it may ignore negative effects of certain foods (e.g., monster meat). |
| `preferseating` | `table` | `{ FOODGROUP.OMNI }` | A list of food groups or types the entity prefers to eat. Used to determine if an entity "prefers" a food. |
| `caneat` | `table` | `{ FOODGROUP.OMNI }` | A list of food groups or types the entity is capable of eating. This property is dynamically linked to entity tags via a metamethod. |
| `oneatfn` | `function` | `nil` | An optional callback function to be executed when the entity successfully eats food. Signature: `(inst, food, feeder)`. |
| `lasteattime` | `number` | `nil` | The game time (from `GetTime()`) when the entity last consumed food. |
| `ignoresspoilage` | `boolean` | `false` | If true, the entity gains the "ignoresspoilage" tag and is not affected by food spoilage. |
| `eatwholestack` | `boolean` | `false` | If true, when the entity eats an item from a stack, the entire stack is consumed. |
| `healthabsorption` | `number` | `1` | A multiplier applied to the health gained from food. |
| `hungerabsorption` | `number` | `1` | A multiplier applied to the hunger gained from food. |
| `sanityabsorption` | `number` | `1` | A multiplier applied to the sanity gained from food. |
| `preferseatingtags` | `table` | `nil` | An optional table of additional tags that the entity specifically prefers in food. If set, foods must have one of these tags to be preferred. |
| `cacheedibletags` | `table` or `boolean` | `nil` | Caches the processed edible tags derived from `self.caneat`. Can be set to `false` to disable caching. |
| `eatsrawmeat` | `boolean` | `false` (implicit) | If true, the entity gains the "eatsrawmeat" tag, allowing it to eat raw meat without penalties. |
| `nospoiledfood` | `boolean` | `false` (implicit) | If true, the entity gains the "nospoiledfood" tag and will refuse to eat spoiled food. |
| `custom_stats_mod_fn` | `function` | `nil` | An optional function that can be used to modify the final health, hunger, and sanity delta values after absorption, before they are applied. Signature: `(inst, health_delta, hunger_delta, sanity_delta, food, feeder)`. |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Clears all dietary tags from the entity when the component is removed.
*   **Parameters:** None.

### `SetDiet(caneat, preferseating)`
*   **Description:** Sets the entity's dietary rules, specifying what it can eat and what it prefers. This will update the associated tags on the entity.
*   **Parameters:**
    *   `caneat`: (`table`) A list of `FOODGROUP` or `FOODTYPE` values the entity is physically capable of eating.
    *   `preferseating`: (`table`, optional) A list of `FOODGROUP` or `FOODTYPE` values the entity prefers. If not provided, it defaults to `caneat`.

### `SetAbsorptionModifiers(health, hunger, sanity)`
*   **Description:** Sets multipliers for the health, hunger, and sanity values gained from consumed food.
*   **Parameters:**
    *   `health`: (`number`) Multiplier for health gain.
    *   `hunger`: (`number`) Multiplier for hunger gain.
    *   `sanity`: (`number`) Multiplier for sanity gain.

### `TimeSinceLastEating()`
*   **Description:** Returns the amount of game time that has passed since the entity last ate.
*   **Parameters:** None.

### `HasBeen(time)`
*   **Description:** Checks if the entity has not eaten within a specified amount of game time, or if it has never eaten.
*   **Parameters:**
    *   `time`: (`number`) The duration (in seconds) to check against.

### `OnSave()`
*   **Description:** Prepares component data for saving the game. It saves the `time_since_eat` if the entity has ever eaten.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Loads component data from a saved game. It restores `lasteattime` based on the saved `time_since_eat`.
*   **Parameters:**
    *   `data`: (`table`) The table containing saved component data.

### `SetCanEatHorrible()`
*   **Description:** Adds `FOODTYPE.HORRIBLE` to both the `preferseating` and `caneat` lists, and adds the `horrible_eater` tag to the entity.
*   **Parameters:** None.

### `SetCanEatGears()`
*   **Description:** Adds `FOODTYPE.GEARS` to both the `preferseating` and `caneat` lists, and adds the `gears_eater` tag to the entity.
*   **Parameters:** None.

### `SetCanEatNitre(can_eat)`
*   **Description:** Toggles the entity's ability and preference for eating `FOODTYPE.NITRE`. Adds or removes the `nitre_eater` tag accordingly.
*   **Parameters:**
    *   `can_eat`: (`boolean`) If true, the entity can eat Nitre; if false, it cannot.

### `SetCanEatRaw()`
*   **Description:** Adds `FOODTYPE.RAW` to both the `preferseating` and `caneat` lists, and adds the `raw_eater` tag to the entity.
*   **Parameters:** None.

### `SetPrefersEatingTag(tag)`
*   **Description:** Adds a specific tag to the list of `preferseatingtags`, indicating additional food tags the entity prefers.
*   **Parameters:**
    *   `tag`: (`string`) The tag to add to the preferred eating tags.

### `SetStrongStomach(is_strong)`
*   **Description:** Toggles the entity's "strong stomach" trait. If true, adds the `strongstomach` tag; otherwise, removes it.
*   **Parameters:**
    *   `is_strong`: (`boolean`) If true, the entity has a strong stomach; if false, it does not.

### `SetCanEatRawMeat(can_eat)`
*   **Description:** Toggles the entity's ability to eat raw meat without penalties. If true, adds the `eatsrawmeat` tag; otherwise, removes it.
*   **Parameters:**
    *   `can_eat`: (`boolean`) If true, the entity can eat raw meat; if false, it cannot.

### `SetIgnoresSpoilage(ignores)`
*   **Description:** Toggles whether the entity ignores food spoilage effects. If true, adds the `ignoresspoilage` tag; otherwise, removes it.
*   **Parameters:**
    *   `ignores`: (`boolean`) If true, the entity ignores spoilage; if false, it does not.

### `SetRefusesSpoiledFood(refuses)`
*   **Description:** Toggles whether the entity refuses to eat spoiled food. If true, adds the `nospoiledfood` tag; otherwise, removes it.
*   **Parameters:**
    *   `refuses`: (`boolean`) If true, the entity refuses spoiled food; if false, it does not.

### `SetOnEatFn(fn)`
*   **Description:** Sets a custom function to be called immediately after the entity successfully eats food.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It receives `(inst, food, feeder)` as arguments.

### `DoFoodEffects(food)`
*   **Description:** Determines if an entity should receive the standard positive or negative effects from a given food, considering specific traits like `strongstomach` or `eatsrawmeat`.
*   **Parameters:**
    *   `food`: (`Entity`) The food item being considered.

### `GetEdibleTags()`
*   **Description:** Generates and returns a list of "edible_" tags based on the `caneat` property. This list can be cached.
*   **Parameters:** None.

### `Eat(food, feeder)`
*   **Description:** Handles the process of an entity consuming a food item. It checks if the entity prefers the food, calculates stat changes (health, hunger, sanity) with absorption and multipliers, applies them, triggers `oneat` events, and updates the `lasteattime`.
*   **Parameters:**
    *   `food`: (`Entity`) The food item to be eaten.
    *   `feeder`: (`Entity`, optional) The entity that is feeding `self.inst`. Defaults to `self.inst` if not provided.

### `TestFood(food, testvalues)`
*   **Description:** A helper function that checks if a food item has any of the tags or food types specified in `testvalues`.
*   **Parameters:**
    *   `food`: (`Entity`) The food item to test.
    *   `testvalues`: (`table`) A list of `FOODGROUP` or `FOODTYPE` values to check against.

### `PrefersToEat(food)`
*   **Description:** Determines if the entity "prefers" to eat a given food item, taking into account `preferseating`, `preferseatingtags`, and `nospoiledfood` rules. This is a stricter check than `CanEat`.
*   **Parameters:**
    *   `food`: (`Entity`) The food item to check.

### `CanEat(food)`
*   **Description:** Determines if the entity is physically capable of eating a given food item based on its `caneat` list.
*   **Parameters:**
    *   `food`: (`Entity`) The food item to check.

## Events & Listeners
This component pushes the following events:
*   `inst:PushEvent("oneat", { food = food, feeder = feeder })`: Triggered on the `inst` entity when it successfully eats food.
*   `feeder:PushEvent("feedincontainer")`: Triggered on the `feeder` if the `inst` is an `inventoryitem` being fed while inside a container opened by the `feeder`.
*   `feeder:PushEvent("feedmount", { food = food, eater = self.inst })`: Triggered on the `feeder` if the `inst` is a `rideable` mount and the `feeder` is its rider.