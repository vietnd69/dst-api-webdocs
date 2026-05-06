---
id: playeractionpicker
title: Playeractionpicker
description: Manages player input action selection and prioritization for mouse clicks and keyboard interactions.
tags: [input, actions, player]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: components
source_hash: 9c2a76f0
system_scope: player
---

# Playeractionpicker

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`PlayerActionPicker` is a core player component that determines which actions are available when the player interacts with the world via mouse clicks or keyboard input. It collects potential actions from equipped items, inventory, target entities, and the environment, then filters and sorts them by priority. This component works closely with `playercontroller` for input state and `aoetargeting` for area-of-effect ability targeting.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playeractionpicker")

-- Register a container for widget actions
local container = SpawnPrefab("chest")
inst.components.playeractionpicker:RegisterContainer(container)

-- Push a custom action filter
inst.components.playeractionpicker:PushActionFilter(function(inst, action)
    return action.action ~= ACTIONS.ATTACK
end, 50)

-- Get available actions for a position
local actions = inst.components.playeractionpicker:GetLeftClickActions(position, target)
```

## Dependencies & tags
**External dependencies:**
- `ACTIONS` -- global action constants table
- `BufferedAction` -- creates buffered action instances
- `TheWorld.Map` -- world map reference for passability checks
- `TheInput` -- input handling for controller and mouse state
- `CONTROL_FORCE_STACK`, `CONTROL_FORCE_TRADE`, `CONTROL_FORCE_INSPECT`, `CONTROL_FORCE_ATTACK` -- input control constants
- `EQUIPSLOTS` -- equipment slot constants

**Components used:**
- `inventory` -- retrieves equipped and active items via replica
- `playercontroller` -- checks control press state and AOETargeting status
- `combat` -- checks if target can be attacked
- `container` -- checks if container is read-only
- `stackable` -- checks if item is a stack for drop behavior
- `inventoryitem` -- checks if item is locked in slot
- `spellbook` -- retrieves active spell book for AOETargeting
- `boatcannonuser` -- handles boat cannon aiming and shooting actions
- `aoetargeting` -- checks range, allowwater, alwaysvalid properties

**Tags:**
- `inspectable` -- checked for examine/look actions
- `hostile` -- checked for attack actions
- `walkableplatform` -- excluded from certain interactions
- `ignoremouseover` -- excluded from mouse interactions
- `walkableperipheral` -- allows point actions on peripheral entities
- `steeringboat` -- enables boat steering actions
- `repairer` -- affects right-click behavior on targets
- `deployable` -- affects right-click behavior on targets
- `allow_action_on_impassable` -- allows actions on impassable terrain

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The owning player entity instance. |
| `map` | Map | `TheWorld.Map` | Reference to the world map for passability checks. |
| `containers` | table | `{}` | Table of registered container entities with cleanup callbacks. |
| `leftclickoverride` | function | `nil` | Custom function to override left-click action selection. |
| `rightclickoverride` | function | `nil` | Custom function to override right-click action selection. |
| `pointspecialactionsfn` | function | `nil` | Custom function for special point-based actions. |
| `actionfilterstack` | table | `{}` | Stack of action filter functions with priorities. |
| `actionfilter` | function | `nil` | Currently active highest-priority action filter. |

## Main functions
### `RegisterContainer(container)`
* **Description:** Registers a container entity to listen for its removal and clean up automatically. Adds an event listener for `onremove` on the container.
* **Parameters:** `container` -- Entity instance to register as a container.
* **Returns:** None.
* **Error states:** None.

### `UnregisterContainer(container)`
* **Description:** Unregisters a previously registered container and removes the `onremove` event listener.
* **Parameters:** `container` -- Entity instance to unregister.
* **Returns:** None.
* **Error states:** None.

### `HasContainerWidgetAction()`
* **Description:** Checks if any container widget actions are currently registered.
* **Parameters:** None.
* **Returns:** `true` if containers table is non-empty, `false` otherwise.
* **Error states:** None.

### `OnUpdateActionFilterStack()`
* **Description:** Recalculates the active action filter by finding the highest priority filter in the stack.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `PushActionFilter(filterfn, priority)`
* **Description:** Adds an action filter function to the stack with optional priority. Higher priority filters take precedence.
* **Parameters:**
  - `filterfn` -- Function that takes `(inst, action)` and returns boolean.
  - `priority` -- Number priority value (default `0`).
* **Returns:** None.
* **Error states:** None.

### `PopActionFilter(filterfn)`
* **Description:** Removes an action filter from the stack. If `filterfn` is provided, removes that specific filter; otherwise removes the top filter.
* **Parameters:** `filterfn` -- Function to remove, or `nil` to pop top filter.
* **Returns:** None.
* **Error states:** None.

### `SortActionList(actions, target, useitem)`
* **Description:** Sorts actions by priority and applies the active action filter. Creates `BufferedAction` instances for valid actions.
* **Parameters:**
  - `actions` -- Table of action definitions to sort.
  - `target` -- Target entity or `Vector3` position, or `nil`.
  - `useitem` -- Item entity being used for the action.
* **Returns:** Sorted table of `BufferedAction` instances.
* **Error states:** None

### `GetSceneActions(useitem, right)`
* **Description:** Collects scene-based actions from the useitem. Falls back to `WALKTO` action if no actions found and entity is inspectable.
* **Parameters:**
  - `useitem` -- Entity being used for the action.
  - `right` -- Boolean indicating right-click context.
* **Returns:** Sorted table of `BufferedAction` instances.
* **Error states:** None

### `GetUseItemActions(target, useitem, right)`
* **Description:** Collects actions for using an item on a target entity.
* **Parameters:**
  - `target` -- Target entity for the action.
  - `useitem` -- Item entity being used.
  - `right` -- Boolean indicating right-click context.
* **Returns:** Sorted table of `BufferedAction` instances.
* **Error states:** None.

### `GetSteeringActions(inst, pos, right)`
* **Description:** Returns boat steering actions if the player has the `steeringboat` tag.
* **Parameters:**
  - `inst` -- Player entity instance.
  - `pos` -- Position vector for steering.
  - `right` -- Boolean indicating right-click context.
* **Returns:** Sorted table of `BufferedAction` instances, or `nil` if not steering a boat.
* **Error states:** None.

### `GetCannonAimActions(inst, pos, right)`
* **Description:** Returns boat cannon aiming and shooting actions if the player has a `boatcannonuser` component with an active cannon.
* **Parameters:**
  - `inst` -- Player entity instance.
  - `pos` -- Position vector for aiming.
  - `right` -- Boolean indicating right-click context.
* **Returns:** Sorted table of `BufferedAction` instances, or `nil` if no cannon available.
* **Error states:** None.

### `GetPointActions(pos, useitem, right, target)`
* **Description:** Collects point-based actions at a world position. Modifies `DROP` action to drop whole stack unless `CONTROL_FORCE_STACK` is pressed.
* **Parameters:**
  - `pos` -- World position vector.
  - `useitem` -- Item entity being used.
  - `right` -- Boolean indicating right-click context.
  - `target` -- Optional target entity.
* **Returns:** Sorted table of `BufferedAction` instances.
* **Error states:** Errors if `self.inst.components.playercontroller` is `nil` when checking `IsControlPressed()`.

### `GetPointSpecialActions(pos, useitem, right, usereticulepos)`
* **Description:** Calls the custom `pointspecialactionsfn` if set to get special point-based actions. Supports legacy function signature without `pos2` return.
* **Parameters:**
  - `pos` -- World position vector.
  - `useitem` -- Item entity being used.
  - `right` -- Boolean indicating right-click context.
  - `usereticulepos` -- Boolean indicating if reticule position should be used.
* **Returns:** Sorted table of `BufferedAction` instances, or empty table if no custom function.
* **Error states:** None.

### `GetDoubleClickActions(pos, dir, target)`
* **Description:** Calls the custom `doubleclickactionsfn` if set to handle double-click actions. Supports legacy function signature.
* **Parameters:**
  - `pos` -- Double-click position vector.
  - `dir` -- WASD/analog direction input.
  - `target` -- Double-click mouseover target entity.
* **Returns:** Sorted table of `BufferedAction` instances, or empty table if no custom function.
* **Error states:** None.

### `GetEquippedItemActions(target, useitem, right)`
* **Description:** Collects actions for using an equipped item on a target entity.
* **Parameters:**
  - `target` -- Target entity for the action.
  - `useitem` -- Equipped item entity.
  - `right` -- Boolean indicating right-click context.
* **Returns:** Sorted table of `BufferedAction` instances.
* **Error states:** None.

### `GetInventoryActions(useitem, right)`
* **Description:** Collects inventory-based actions. Handles drop behavior based on `CONTROL_FORCE_TRADE` and `CONTROL_FORCE_STACK` modifiers.
* **Parameters:**
  - `useitem` -- Inventory item entity.
  - `right` -- Boolean indicating right-click context.
* **Returns:** Sorted table of `BufferedAction` instances.
* **Error states:** Errors if `self.inst.components.playercontroller` is `nil` when checking control press states.

### `GetLeftClickActions(position, target)`
* **Description:** Determines all available left-click actions based on position, target, equipped items, and player state. Handles steering, cannon aiming, item usage, and scene interactions.
* **Parameters:**
  - `position` -- World position vector for the click.
  - `target` -- Target entity under cursor, or `nil`.
* **Returns:** Sorted table of `BufferedAction` instances, or empty table.
* **Error states:** Errors if `self.inst.components.playercontroller` is `nil` when checking control states or `self.inst.replica.inventory` is `nil`.

### `GetRightClickActions(position, target, spellbook)`
* **Description:** Determines all available right-click actions. Handles AOETargeting items, container interactions, and spellbook targeting. Checks passability for point actions.
* **Parameters:**
  - `position` -- World position vector for the click.
  - `target` -- Target entity under cursor, or `nil`.
  - `spellbook` -- Optional spellbook entity for AOETargeting.
* **Returns:** Sorted table of `BufferedAction` instances, or empty table.
* **Error states:** Errors if `self.inst.replica.inventory` is `nil` when getting active/equipped items, or if `self.inst.components.playercontroller` is `nil` when checking `IsAOETargeting()`.

### `DoGetMouseActions(position, target, spellbook)`
* **Description:** Main entry point for mouse action selection. Handles AOETargeting state, visibility checks, and filters duplicate or UI-only actions. Returns left and right mouse button actions.
* **Parameters:**
  - `position` -- World position vector, or `nil` to get from input.
  - `target` -- Target entity, or `nil` to get from input.
  - `spellbook` -- Optional spellbook entity.
* **Returns:** Two values: `lmb` (left mouse action) and `rmb` (right mouse action), both `BufferedAction` or `nil`.
* **Error states:** Errors if `self.inst.components.playercontroller` is `nil` when checking AOETargeting state or getting targeting position.

## Events & listeners
- **Listens to:** `onremove` - listens on registered container entities to clean up when containers are removed.