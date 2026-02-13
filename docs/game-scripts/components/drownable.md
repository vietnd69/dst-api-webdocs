---
id: drownable
title: Drownable
description: Manages an entity's interaction with water and void environments, handling conditions for falling, applying drowning penalties, and managing emergency teleportation.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Drownable

## Overview
The `Drownable` component makes an entity susceptible to falling into the ocean or the void. It provides checks to determine if an entity is over unsafe terrain, triggers appropriate "sink" or "fall" events, applies damage and status penalties (like hunger, sanity, moisture) when drowning, and handles emergency teleportation back to a safe location. It also manages the dropping of inventory items upon falling.

## Dependencies & Tags
This component relies on the presence of several other components on its `inst` (or items it interacts with) for full functionality:
*   `health`: For checking invincibility and applying health penalties.
*   `sleeper`: To wake up the entity when falling.
*   `inventory`: For managing item drops and checking flotation devices.
*   `moisture`: To apply wetness penalties.
*   `hunger`: To apply hunger penalties.
*   `sanity`: To apply sanity penalties.
*   `Transform`: For getting and setting the entity's world position.
*   `Physics`: For teleporting the entity.

Additionally, it interacts with components found on items:
*   `flotationdevice`: On items to prevent drowning damage.
*   `equippable`: On items to check if they are equipped.
*   `inventoryitem`: On items to check the `keepondrown` property.

Tags utilized (not added/removed by this component):
*   `player` (on `self.inst`): Used for camera effects during "WashAshore" and "VoidArrive".
*   `stronggrip` (on `self.inst`): Prevents certain item drops.
*   `irreplaceable` (on items): Prevents specific items from being dropped.

## Properties
| Property                      | Type       | Default Value | Description                                                                                             |
| :---------------------------- | :--------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`                        | `Entity`   | -             | The entity this component is attached to.                                                               |
| `enabled`                     | `boolean`  | `true`        | Controls whether the entity is currently susceptible to drowning or falling checks. Initialized to `true` after a brief delay, unless explicitly set otherwise. |
| `ontakedrowningdamage`        | `function` | `nil`         | A custom callback function executed when the entity takes drowning damage.                              |
| `customtuningsfn`             | `function` | `nil`         | A custom function that, if provided, can override default drowning damage tunings.                      |
| `src_x`, `src_y`, `src_z`     | `number`   | `nil`         | The world coordinates of the entity just before it falls into the ocean or void.                        |
| `dest_x`, `dest_y`, `dest_z`  | `number`   | `nil`         | The target world coordinates for emergency teleportation after falling.                                 |
| `shoulddropitemsfn`           | `function` | `nil`         | A custom function that, if provided, determines whether the entity should drop its inventory items.     |
| `teleport_pt_stack`           | `table`    | `nil`         | A stack of custom teleport destination points, potentially set by other game logic for specific overrides. |
| `teleport_pt_stack_ent_onremoved` | `function` | `nil`         | An internal callback used to clean up entries in `teleport_pt_stack` when an associated source entity is removed. |

## Main Functions
### `SetOnTakeDrowningDamageFn(fn)`
*   **Description:** Sets a custom function to be called when the entity takes drowning damage. This allows for custom handling or additional effects.
*   **Parameters:**
    *   `fn` (`function`): The function to call, which receives the `inst` and the `tunings` table as arguments.

### `SetCustomTuningsFn(fn)`
*   **Description:** Sets a custom function that can provide alternative drowning damage tunings based on the entity.
*   **Parameters:**
    *   `fn` (`function`): The function to call, which receives the `inst` as an argument and should return a tunings table.

### `IsInDrownableMapBounds(x, y, z)`
*   **Description:** Checks if the given world coordinates are within the playable map bounds, primarily used to ignore out-of-bounds entities for drowning logic.
*   **Parameters:**
    *   `x` (`number`): The X-coordinate.
    *   `y` (`number`): The Y-coordinate.
    *   `z` (`number`): The Z-coordinate.

### `IsSafeFromFalling()`
*   **Description:** Determines if the entity is currently in a "safe" state or location where it should not fall. This includes being on a platform, outside map bounds, or on visual ground.
*   **Parameters:** None.

### `IsOverVoid()`
*   **Description:** Checks if the entity is currently positioned over an "invalid" map tile, which typically represents the void, provided it's not already in a safe location.
*   **Parameters:** None.

### `IsOverWater()`
*   **Description:** Checks if the entity is currently positioned over an ocean tile, provided it's not already in a safe location.
*   **Parameters:** None.

### `ShouldDrown()`
*   **Description:** Determines if the entity should be actively drowning based on its position over water and general eligibility checks (e.g., component `enabled`, not invincible).
*   **Parameters:** None.

### `ShouldFallInVoid()`
*   **Description:** Determines if the entity should be actively falling into the void based on its position over void tiles and general eligibility checks.
*   **Parameters:** None.

### `GetFallingReason()`
*   **Description:** Returns the specific reason for falling (`FALLINGREASON.OCEAN` or `FALLINGREASON.VOID`) if the entity is in a falling state.
*   **Parameters:** None.

### `CheckDrownable()`
*   **Description:** Performs the core check for whether the entity should fall into the ocean or void. If so, it pushes the corresponding event (`"onsink"` or `"onfallinvoid"`).
*   **Parameters:** None.

### `Teleport()`
*   **Description:** Teleports the entity to the previously set `dest_x`, `dest_y`, `dest_z` coordinates, attempting to find a walkable offset if necessary.
*   **Parameters:** None.

### `GetWashingAshoreTeleportSpot(excludeclosest)`
*   **Description:** (Note: Code comment indicates this function might be unused.) Calculates a suitable teleport spot on the shore from the entity's current ocean position, considering walkable offsets.
*   **Parameters:**
    *   `excludeclosest` (`boolean`): If true, attempts to find a shore point that is not the closest.

### `WashAshore()`
*   **Description:** Initiates the "washing ashore" process. It teleports the entity to a safe shore location, applies screen fade effects for players, and triggers the `"on_washed_ashore"` event.
*   **Parameters:** None.

### `ShouldDropItems()`
*   **Description:** Determines if the entity should drop its inventory items, considering the "stronggrip" tag and any custom `shoulddropitemsfn`.
*   **Parameters:** None.

### `GetTeleportPtFor(src)`
*   **Description:** Retrieves a custom teleport point previously pushed onto the stack for a specific source.
*   **Parameters:**
    *   `src` (`any`): The source associated with the teleport point.

### `PushTeleportPt(src, pt)`
*   **Description:** Pushes a custom teleport point onto an internal stack, associating it with a source. If the source is an entity, it listens for its removal to clean up the stack.
*   **Parameters:**
    *   `src` (`any`): The source (e.g., an entity) setting this teleport point.
    *   `pt` (`Vector3`): The `Vector3` object representing the desired teleport destination.

### `PopTeleportPt(src)`
*   **Description:** Removes a custom teleport point associated with a specific source from the stack.
*   **Parameters:**
    *   `src` (`any`): The source whose teleport point should be removed.

### `GetTeleportPtOverride()`
*   **Description:** Retrieves the most recently pushed custom teleport point from the stack, if any, for overriding default teleport destinations.
*   **Parameters:** None.

### `OnFallInOcean(shore_x, shore_y, shore_z)`
*   **Description:** Handles the initial setup when the entity falls into the ocean. It stores the entity's current position, determines a destination shore point (using overrides or finding one), wakes up the entity, and handles dropping the active and equipped hand items.
*   **Parameters:**
    *   `shore_x` (`number`, optional): The preferred X-coordinate for the shore destination.
    *   `shore_y` (`number`, optional): The preferred Y-coordinate for the shore destination.
    *   `shore_z` (`number`, optional): The preferred Z-coordinate for the shore destination.

### `VoidArrive()`
*   **Description:** Initiates the "void arrive" process. It teleports the entity to a safe location, applies screen fade effects for players, and triggers the `"on_void_arrive"` event.
*   **Parameters:** None.

### `OnFallInVoid(teleport_x, teleport_y, teleport_z)`
*   **Description:** Handles the initial setup when the entity falls into the void. It stores the entity's current position, determines a destination teleport point (using overrides or finding one), and wakes up the entity.
*   **Parameters:**
    *   `teleport_x` (`number`, optional): The preferred X-coordinate for the teleport destination.
    *   `teleport_y` (`number`, optional): The preferred Y-coordinate for the teleport destination.
    *   `teleport_z` (`number`, optional): The preferred Z-coordinate for the teleport destination.

### `GetDrowningDamageTuning()`
*   **Description:** Determines the appropriate drowning damage tunings for the entity, prioritizing custom tunings, then prefab-specific tunings, and finally default player or creature tunings.
*   **Parameters:** None.

### `TakeDrowningDamage()`
*   **Description:** Applies various penalties (moisture, hunger, health, sanity) to the entity due to drowning, scaling them based on whether it's shallow ocean. It also checks for and utilizes flotation devices.
*   **Parameters:** None.

### `DropInventory()`
*   **Description:** Drops a portion of the entity's inventory items when it falls into the water or void, excluding "irreplaceable" items or those with `keepondrown`. The number of items dropped is scaled based on whether it's shallow ocean.
*   **Parameters:** None.

## Events & Listeners
*   **Listens for:**
    *   `"onremove"` (on entities that were used as `src` for `PushTeleportPt`): Cleans up corresponding entries in `teleport_pt_stack`.
*   **Pushes/Triggers:**
    *   `"onsink"`: Triggered when `CheckDrownable` determines the entity is over water and should sink.
    *   `"onfallinvoid"`: Triggered when `CheckDrownable` determines the entity is over the void and should fall.
    *   `"on_washed_ashore"`: Triggered after the entity has been teleported to shore by `WashAshore`.
    *   `"on_void_arrive"`: Triggered after the entity has been teleported to safety by `VoidArrive`.