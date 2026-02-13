---
id: crittertraits
title: Crittertraits
description: This component tracks and manages dynamic personality traits for critters, influencing their behavior and reactions based on player interactions.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Crittertraits

## Overview
The `crittertraits` component is responsible for giving critters dynamic personality traits based on the player's interactions with them and their activities. It tracks scores for various traits like "wellfed," "playful," "combat," and "crafty," decaying them over time. A "dominant trait" emerges from these scores, which can influence the critter's behavior and can be locked under certain conditions.

## Dependencies & Tags
This component relies on several other components for its functionality and interacts with entity tags.

**Dependencies:**
*   `inst.components.follower`: Used to get the critter's leader (owner) to listen for their actions.
*   `inst.components.edible`: Checked on food items eaten by the critter to determine trait score multipliers.
*   `inst.components.timer`: Used to schedule regular trait decay and dominant trait refreshing.

**Tags Added to the Critter:**
*   `trait_[TRAITNAME]`: A tag is added to the critter when a specific trait becomes dominant (e.g., `trait_PLAYFUL`).

**Tags Checked:**
*   `stale` (on the critter itself) and `fresh`, `preparedfood` (on food items) to modify trait increases.
*   `smallcreature`, `monster` (on a combat target) to filter combat trait increases.
*   `wall` (on a target of `finishedwork` event) to filter crafting trait increases.

## Properties
| Property              | Type      | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                          |
| :-------------------- | :-------- | :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst`                | `Entity`  | `(self)`      | A reference to the owning `Entity` instance this component is attached to.                                                                                                                                                                                                                                                                                                                          |
| `traitscore`          | `table`   | `{}`          | A table storing the current numerical score for each defined critter trait (e.g., "WELLFED", "PLAYFUL", "COMBAT", "CRAFTY"). All traits from `TUNING.CRITTER_TRAITS` are initialized to 0.                                                                                                                                                                                                           |
| `dominanttrait`       | `string?` | `nil`         | The name of the trait currently identified as dominant, if any. This is typically the trait with the highest positive `traitscore`. When set, an `inst` tag `trait_[dominanttrait]` is added.                                                                                                                                                                                                          |
| `dominanttraitlocked` | `boolean?`| `nil`         | If `true`, the `dominanttrait` is prevented from changing. This typically occurs after feeding a critter its favorite food ("goodies").                                                                                                                                                                                                                                                                 |
| `onpetfn`             | `function?`| `nil`         | An optional callback function to be executed when the critter is petted, accepting the critter instance and the petter as arguments. Can be set via `SetOnPetFn`.                                                                                                                                                                                                                                     |
| `pettask`             | `Task?`   | `nil`         | A handle to a scheduled task that tracks if the critter is "waiting to be petted" after performing a nuzzle. Used internally to determine if petting should grant a bonus "playful" score.                                                                                                                                                                                                          |

## Main Functions
### `SetOnPetFn(fn)`
*   **Description:** Sets a custom callback function to be invoked when the critter is petted.
*   **Parameters:**
    *   `fn` (`function`): The function to call. It will receive the critter instance and the petter entity as arguments.

### `OnPet(petter)`
*   **Description:** Triggers the critter's "emote_pet" state and executes the custom `onpetfn` if set. This is typically called by a game event.
*   **Parameters:**
    *   `petter` (`Entity`): The entity that is petting the critter.

### `StartTracking()`
*   **Description:** Initializes the component's event listeners for both the critter and its owner (leader). This sets up the system for tracking interactions that influence trait scores and starts the trait decay and dominant trait refresh timers.
*   **Parameters:** None.

### `IncTracker(name, multiplier)`
*   **Description:** Increases the score for a specified trait. The increase is influenced by a base value defined in `TUNING.CRITTER_TRAITS`, a provided multiplier, and a small bias if the trait is currently dominant. Scores are capped at `TRAIT_MAX`.
*   **Parameters:**
    *   `name` (`string`): The name of the trait to increment (e.g., "WELLFED", "PLAYFUL"). Case-insensitive as it's converted to uppercase.
    *   `multiplier` (`number`, optional): A value to multiply the base trait increase by. Defaults to 1 if not provided.

### `DecayTraits()`
*   **Description:** Reduces the score of all traits based on their individual decay rates defined in `TUNING.CRITTER_TRAITS` and a global decay tick rate. Scores are floored at `TRAIT_MIN`.
*   **Parameters:** None.

### `SetDominantTrait(trait)`
*   **Description:** Sets the critter's dominant trait. If a previous dominant trait existed, its corresponding tag is removed, and the new trait's tag (`trait_[TRAIT]`) is added to the critter instance.
*   **Parameters:**
    *   `trait` (`string?`): The name of the trait to set as dominant, or `nil` to clear the dominant trait. Case-insensitive as it's converted to uppercase.

### `IsDominantTrait(trait)`
*   **Description:** Checks if a specified trait is currently the dominant trait.
*   **Parameters:**
    *   `trait` (`string`): The name of the trait to check. Case-insensitive as it's converted to uppercase.
*   **Returns:** (`boolean`) `true` if the trait is dominant, `false` otherwise.

### `RefreshDominantTrait()`
*   **Description:** Re-evaluates all trait scores to determine if a new dominant trait should be set. If `dominanttraitlocked` is `true`, this function does nothing. If a new dominant trait is identified, `SetDominantTrait` is called, and a "crittertraitchanged" event is pushed. Metrics are also logged.
*   **Parameters:** None.

### `OnSave()`
*   **Description:** Returns a table containing data necessary to save the component's current state, including the dominant trait, its locked status, and all trait scores.
*   **Parameters:** None.
*   **Returns:** (`table`) A table with `dominanttrait`, `dominanttraitlocked`, and `traitscore` data.

### `OnLoad(data)`
*   **Description:** Loads the component's state from saved data, setting the dominant trait, its locked status, and trait scores. Handles legacy "AFFECTIONATE" trait data by merging it into "PLAYFUL".
*   **Parameters:**
    *   `data` (`table`): The table of saved data previously generated by `OnSave()`.

### `GetDebugString()`
*   **Description:** Generates a formatted string representing the current state of the critter's traits, suitable for debugging purposes.
*   **Parameters:** None.
*   **Returns:** (`string`) A multi-line string showing the dominant trait and scores for all traits.

## Events & Listeners
This component listens for various events on the critter itself and its owner (leader) to update trait scores and manage its state. It also pushes an event when the dominant trait changes.

**Listens For (on `self.inst` - the critter):**
*   `oneat`: Triggers when the critter eats food, influencing "WELLFED" scores based on food quality and freshness.
*   `perished`: Triggers when the critter dies, decreasing "WELLFED" score.
*   `critter_onpet`: Triggers when the critter is directly petted, increasing "PLAYFUL" score (with a bonus if previously nuzzled).
*   `critter_onnuzzle`: Triggers when the critter nudges the player, starting a timer for "wants to be petted."
*   `oncritterplaying`: Triggers when the critter performs a play action, increasing "PLAYFUL" score.
*   `timerdone`: Triggers when an internal timer expires. Used to call `DecayTraits` (for "decay" timer) and `RefreshDominantTrait` (for "dominant" timer).

**Listens For (on `owner` - the critter's leader):**
*   `killed`: Triggers when the owner kills another entity, increasing "COMBAT" score.
*   `onhitother`: Triggers when the owner hits another entity, increasing "COMBAT" score.
*   `death`: Triggers when the owner dies, decreasing "COMBAT" score.
*   `finishedwork`: Triggers when the owner finishes a crafting/building action (excluding walls), increasing "CRAFTY" score and potentially queuing a "crafty" emote.
*   `unlockrecipe`: Triggers when the owner unlocks a new recipe, significantly increasing "CRAFTY" score.
*   `builditem`: Triggers when the owner builds an item, increasing "CRAFTY" score and potentially queuing a "crafty" emote.
*   `buildstructure`: Triggers when the owner builds a structure, significantly increasing "CRAFTY" score and potentially queuing a "crafty" emote.

**Pushes/Triggers (from `self.inst` - the critter):**
*   `crittertraitchanged`: Pushed when the critter's `dominanttrait` changes.
    *   **Data:** `{ trait = string }` - The name of the new dominant trait.