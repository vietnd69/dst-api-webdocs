---
id: playeractionpicker
title: Playeractionpicker
description: Determines valid player actions based on context (mouse position, target, held item, and modifiers).
tags: [player, input, action, inventory, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 15757341
system_scope: player
---

# Playeractionpicker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerActionPicker` resolves contextual player actions (left-click, right-click, double-click, and hover states) into concrete executable actions. It sits at the intersection of input handling, inventory, world state, and gameplay systems, aggregating action proposals from attached prefabs, items, and components (`SCENE`, `USEITEM`, `EQUIPPED`, `POINT`, `INVENTORY`), then filters and sorts them by priority and validity. It integrates with `PlayerController`, `AOETargeting`, and container systems to ensure correct action behavior under modifiers like `FORCE_STACK`, `FORCE_INSPECT`, and boat steering.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("playeractionpicker")

-- Register a container to enable its actions
inst.components.playeractionpicker:RegisterContainer(mycontainer)

-- Get left-click actions at a world position
local actions = inst.components.playeractionpicker:GetLeftClickActions(Vector3(x, y, z), target_entity)

-- Push/pop an action filter to temporarily override action availability
local function myFilter(inst, action) return action.action ~= ACTIONS.DROP end
inst.components.playeractionpicker:PushActionFilter(myFilter, 10)
inst.components.playeractionpicker:PopActionFilter(myFilter)
```

## Dependencies & tags
**Components used:** `playercontroller`, `boatcannonuser`, `container`, `inventory`, `rider`, `combat`, `aoetargeting`, `aoecharging`  
**Tags:** Checks `hostile`, `inspectable`, `walkableplatform`, `walkableperipheral`, `ignoremouseover`, `repairer`, `deployable`, `allow_action_on_impassable`; adds none.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `EntityScript` | — | Owner entity (typically player). |
| `map` | `WorldMap` | `TheWorld.Map` | Map geometry/accessibility reference. |
| `containers` | table | `{}` | Mapping of container → unregister callback. |
| `leftclickoverride` | function or `nil` | `nil` | Custom override for left-click action resolution. |
| `rightclickoverride` | function or `nil` | `nil` | Custom override for right-click action resolution. |
| `pointspecialactionsfn` | function or `nil` | `nil` | Function returning special point-based actions (e.g., double-tap or touch gestures). |
| `actionfilterstack` | table | `{}` | Stack of action filter entries: `{fn = function, priority = number}`. |
| `actionfilter` | function or `nil` | `nil` | Currently active filter function; `nil` means no filtering. |

## Main functions
### `RegisterContainer(container)`
*   **Description:** Registers a container entity to participate in action resolution. A callback is attached to the container’s `"onremove"` event to auto-unregister on destruction.  
*   **Parameters:** `container` (`EntityScript` or `nil`) — entity to register.  
*   **Returns:** Nothing.

### `UnregisterContainer(container)`
*   **Description:** Removes a previously registered container and cleans up event callbacks.  
*   **Parameters:** `container` (`EntityScript` or `nil`) — entity to unregister.  
*   **Returns:** Nothing.

### `HasContainerWidgetAction()`
*   **Description:** Returns `true` if any containers are currently registered and contributing actions.  
*   **Parameters:** None.  
*   **Returns:** `boolean`.

### `PushActionFilter(filterfn, priority)`
*   **Description:** Adds an action filter function to the top of the priority stack; the highest-priority active filter is used during action sorting.  
*   **Parameters:**  
    - `filterfn` (`function`): `(inst, action) -> boolean` — returns `true` if action is allowed.  
    - `priority` (`number`, optional): priority level; defaults to `0`.  
*   **Returns:** Nothing.

### `PopActionFilter(filterfn)`
*   **Description:** Removes a filter from the stack. If `filterfn` is `nil`, removes the highest-priority filter unconditionally.  
*   **Parameters:** `filterfn` (`function` or `nil`) — filter to remove.  
*   **Returns:** Nothing.

### `SortActionList(actions, target, useitem)`
*   **Description:** Sorts action proposals by priority (via `OrderByPriority`) and applies the active `actionfilter`. For `CASTAOE` actions, it attaches the effective AOE range (`useitem.components.aoetargeting:GetRange()`). Constructs `BufferedAction` objects for valid actions.  
*   **Parameters:**  
    - `actions` (`table`): List of `ACTIONS` or action tables.  
    - `target` (`EntityScript`, `Vector3`, or `nil`): Action target.  
    - `useitem` (`EntityScript` or `nil`): Item being used (to determine AOE range).  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetSceneActions(useitem, right)`
*   **Description:** Collects scene-level actions for an item or the player. If no actions exist and inspection is valid, adds `WALKTO` as fallback (unless AOE targeting is active on right-click).  
*   **Parameters:**  
    - `useitem` (`EntityScript`): Item or player performing actions.  
    - `right` (`boolean`): `true` for right-click context (alt actions), `false` for left-click.  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetUseItemActions(target, useitem, right)`
*   **Description:** Collects actions for `useitem` applied to `target`.  
*   **Parameters:**  
    - `target` (`EntityScript`): Target entity.  
    - `useitem` (`EntityScript`): Item performing the action.  
    - `right` (`boolean`): Context flag.  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetSteeringActions(inst, pos, right)`
*   **Description:** Returns steering-related actions if the player is steering a boat. Returns `STOP_STEERING_BOAT` (right) or `SET_HEADING` (left, non-controller).  
*   **Parameters:**  
    - `inst` (`EntityScript`): Player entity.  
    - `pos` (`Vector3`): Click position.  
    - `right` (`boolean`): Context flag.  
*   **Returns:** `table` of `BufferedAction` or `nil`.

### `GetCannonAimActions(inst, pos, right)`
*   **Description:** Returns boat cannon aiming/shooting actions if a cannon is active.  
*   **Parameters:**  
    - `inst` (`EntityScript`): Player entity.  
    - `pos` (`Vector3`): Click position.  
    - `right` (`boolean`): Context flag.  
*   **Returns:** `table` of `BufferedAction` or `nil`.

### `GetPointActions(pos, useitem, right, target)`
*   **Description:** Collects point-based actions (e.g., drop, throw, place). Enforces `wholestack` option unless `CONTROL_FORCE_STACK` is held.  
*   **Parameters:**  
    - `pos` (`Vector3`): Click position.  
    - `useitem` (`EntityScript`): Item performing the action.  
    - `right` (`boolean` or `nil`): Context flag.  
    - `target` (`EntityScript` or `nil`): Optional target (e.g., for `DROP` on a container).  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetPointSpecialActions(pos, useitem, right, usereticulepos)`
*   **Description:** Invokes `pointspecialactionsfn` if defined (e.g., for touch/double-tap actions). Supports an optional second position return (`pos2`) for reticule-based targeting.  
*   **Parameters:**  
    - `pos` (`Vector3`): Initial click position.  
    - `useitem` (`EntityScript` or `nil`).  
    - `right` (`boolean` or `nil`).  
    - `usereticulepos` (`boolean`): Indicates whether to use reticule position instead of raw `pos`.  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetDoubleClickActions(pos, dir, target)`
*   **Description:** Invokes `doubleclickactionsfn` if defined (not shown in this file but expected). Supports an optional second position return.  
*   **Parameters:**  
    - `pos` (`Vector3` or `nil`): Double-click position (mouse).  
    - `dir` (`Vector3` or `nil`): Direction (WASD/analog).  
    - `target` (`EntityScript` or `nil`): Target under mouse.  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetEquippedItemActions(target, useitem, right)`
*   **Description:** Collects actions triggered by the equipped `useitem` on `target`.  
*   **Parameters:**  
    - `target` (`EntityScript`): Target entity.  
    - `useitem` (`EntityScript`): Equipped item.  
    - `right` (`boolean`): Context flag.  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetInventoryActions(useitem, right)`
*   **Description:** Collects inventory-related actions (`DROP`, `THROW`, `EAT`, etc.). Overrides to `ACTIONS.DROP` when `CONTROL_FORCE_TRADE` is held; enforces `wholestack` unless `CONTROL_FORCE_STACK` is held.  
*   **Parameters:**  
    - `useitem` (`EntityScript`): Item in hand.  
    - `right` (`boolean`): Context flag.  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetLeftClickActions(position, target)`
*   **Description:** Resolves the full set of left-click actions. Checks overrides, steering, cannon aim, item use (on entities or point), scene inspection/attack/equipped-item actions, and point special actions.  
*   **Parameters:**  
    - `position` (`Vector3`): World click position.  
    - `target` (`EntityScript` or `nil`): Entity under mouse (or `nil` for point).  
*   **Returns:** `table` of `BufferedAction` instances.

### `GetRightClickActions(position, target, spellbook)`
*   **Description:** Resolves the full set of right-click actions. Handles containers, item use, equipped weapons (including stripping actions for `CASTAOE`), scene inspection/attack/equipped-item actions, point special actions, and AOE passability logic. Respects `disable_right_click` (set by steering/cannon precedence).  
*   **Parameters:**  
    - `position` (`Vector3`): World click position.  
    - `target` (`EntityScript` or `nil`): Entity under mouse (or `nil` for point).  
    - `spellbook` (`EntityScript` or `nil`): Optional spellbook (used for AOE targeting).  
*   **Returns:** `table` of `BufferedAction` instances.

### `DoGetMouseActions(position, target, spellbook)`
*   **Description:** Main entry point for retrieving top-priority left- and right-click actions. Handles AOE targeting state, point visibility (darkness), and filters out redundant actions (e.g., `CLOSESPELLBOOK` on self). Returns the highest-priority action for each button, if any.  
*   **Parameters:**  
    - `position` (`Vector3` or `nil`): Mouse position in world.  
    - `target` (`EntityScript` or `nil`): Entity under mouse.  
    - `spellbook` (`EntityScript` or `nil`): Active spellbook for AOE targeting.  
*   **Returns:** `BufferedAction` (LMB), `BufferedAction` (RMB or `nil`).

## Events & listeners
- **Listens to:** `"onremove"` on registered containers to trigger `UnregisterContainer`.
