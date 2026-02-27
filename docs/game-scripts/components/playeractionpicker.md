---
id: playeractionpicker
title: Playeractionpicker
description: Determines available player actions based on context such as mouse position, target entity, held items, and active filters.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 15757341
---

# Playeractionpicker

## Overview
The `PlayerActionPicker` component calculates and prioritizes valid actions for the player based on context (e.g., cursor position, target entity, held item, and controller state). It integrates action definitions from items and the player, applies priority-based filtering, and produces `BufferedAction` instances for UI rendering and execution. It supports left-click, right-click, and special-actions scenarios including steering, cannon aiming, point casting, container interaction, and inventory use.

## Dependencies & Tags
* Depends on: `TheWorld.Map` (via `self.map = TheWorld.Map`), `inst.replica.inventory`, `inst.replica.combat`, `inst.components.playercontroller`, `inst.components.boatcannonuser`, `TheInput`.
* No explicit `inst:AddComponent(...)` calls in this script.
* No tags added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `EntityScript` | (passed to constructor) | The player entity this picker serves. |
| `map` | `WorldMap` | `TheWorld.Map` | Reference to the world map for spatial queries (e.g., passability checks). |
| `containers` | `table` | `{}` | Map of registered containers to cleanup callbacks. |
| `leftclickoverride` | `function?` | `nil` | Optional override function for left-click action generation (`fn(inst, target, position) → actions, usedefault`). |
| `rightclickoverride` | `function?` | `nil` | Optional override function for right-click action generation (`fn(inst, target, position) → actions, usedefault`). |
| `pointspecialactionsfn` | `function?` | `nil` | Function for point-specific actions (e.g., deployables, tools with reticle-based targeting). Signature: `(inst, pos, useitem, right, usereticulepos) → actions, [pos2]`. |
| `actionfilterstack` | `table` | `{}` | Stack of action filter entries: `{ fn = function, priority = number }`. |
| `actionfilter` | `function?` | `nil` | Currently active filter function derived from the highest-priority entry in `actionfilterstack`. |

## Main Functions

### `RegisterContainer(container)`
* **Description:** Registers a container (e.g., inventory, chest) with automatic cleanup when the container is removed.
* **Parameters:** `container` (table or entity) — The container to register.

### `UnregisterContainer(container)`
* **Description:** Unregisters a previously registered container and removes its event listener.
* **Parameters:** `container` (table or entity) — The container to unregister.

### `HasContainerWidgetAction()`
* **Description:** Returns `true` if any containers are currently registered and have associated widget actions.
* **Parameters:** None.

### `PushActionFilter(filterfn, priority)`
* **Description:** Pushes a new action filter function onto the stack with the given priority. Filters modify or restrict which actions are included in the final list.
* **Parameters:**  
  `filterfn` (function) — Filter function `fn(inst, action) → boolean`.  
  `priority` (number, optional, default `0`) — Higher values have higher priority (override lower priorities).

### `PopActionFilter(filterfn)`
* **Description:** Removes a filter function from the stack. If `filterfn` is provided, removes the first matching entry; otherwise removes the top entry.
* **Parameters:**  
  `filterfn` (function, optional) — Specific filter function to remove.

### `SortActionList(actions, target, useitem)`
* **Description:** Sorts a list of actions by priority (descending), applies the active `actionfilter`, and wraps each qualifying action in a `BufferedAction`. Handles AOE range inclusion if `ACTIONS.CASTAOE`.
* **Parameters:**  
  `actions` (table) — List of `ACTIONS.*` constants or pre-constructed actions.  
  `target` (EntityScript or Vector3 or `nil`) — Target entity, point, or `nil` (for point actions).  
  `useitem` (Item or `nil`) — Item being used (if any), used for AOE range checks.

### `GetSceneActions(useitem, right)`
* **Description:** Collects and returns actions available in the scene (e.g., inspecting, using tools on entities). Includes inherent scene actions if no actions are collected.
* **Parameters:**  
  `useitem` (Item or `nil`) — The item in use (or `nil` for entity/ground actions).  
  `right` (boolean) — `true` if for right-click.

### `GetUseItemActions(target, useitem, right)`
* **Description:** Collects actions when using a specific item on a target (e.g., placing, equipping, interacting).
* **Parameters:**  
  `target` (EntityScript or `nil`) — Target entity.  
  `useitem` (Item) — The item being used.  
  `right` (boolean) — `true` if for right-click.

### `GetSteeringActions(inst, pos, right)`
* **Description:** Returns actions for steering a boat (e.g., `SET_HEADING`, `STOP_STEERING_BOAT`) when the player is controlling a vessel.
* **Parameters:**  
  `inst` (EntityScript) — Player entity (unused, kept for signature compatibility).  
  `pos` (Vector3) — Mouse world position.  
  `right` (boolean) — `true` if for right-click.

### `GetCannonAimActions(inst, pos, right)`
* **Description:** Returns actions for aiming or firing a boat cannon.
* **Parameters:** Same as `GetSteeringActions`.

### `GetPointActions(pos, useitem, right, target)`
* **Description:** Collects actions that occur at a point (e.g., placing items on the ground, casting spells).
* **Parameters:**  
  `pos` (Vector3) — World position of the cursor.  
  `useitem` (Item or `nil`) — Item being used.  
  `right` (boolean) — `true` if for right-click.  
  `target` (EntityScript or `nil`) — Optional mouseover target used during point actions.

### `GetPointSpecialActions(pos, useitem, right, usereticulepos)`
* **Description:** Invokes the optional `pointspecialactionsfn` hook for custom point-targeted actions (e.g., deployables with reticle-based targeting).
* **Parameters:** Same as `GetPointActions`, plus `usereticulepos` (boolean) indicating if the reticle position should be used instead of `pos`.

### `GetDoubleClickActions(pos, dir, target)`
* **Description:** Invokes the optional `doubleclickactionsfn` hook for double-click specific actions (e.g., movement double-tap).
* **Parameters:**  
  `pos` (Vector3 or `nil`) — Double-click world position.  
  `dir` (Vector3 or `nil`) — WASD/analog input direction.  
  `target` (EntityScript or `nil`) — Double-click mouseover target.

### `GetEquippedItemActions(target, useitem, right)`
* **Description:** Collects actions using the currently equipped hands item on a target.
* **Parameters:**  
  `target` (EntityScript or `nil`)  
  `useitem` (Item) — Equipped hands item.  
  `right` (boolean) — `true` if for right-click.

### `GetInventoryActions(useitem, right)`
* **Description:** Collects actions available on an item in the player’s inventory (e.g., use, drop, trade).
* **Parameters:**  
  `useitem` (Item) — Item being used.  
  `right` (boolean) — `true` if for right-click.

### `GetLeftClickActions(position, target)`
* **Description:** The core handler for generating left-click actions. Consults overrides, steering/cannon states, and various fallbacks (inventory, equipped item, scene, point).
* **Parameters:**  
  `position` (Vector3 or `nil`) — Mouse world position.  
  `target` (EntityScript or `nil`) — Mouseover target entity.

### `GetRightClickActions(position, target, spellbook)`
* **Description:** The core handler for generating right-click actions. Supports containers, inventory, equipped item, scene, point, and spellbook interactions. Respects AOE targeting state to strip/allow actions.
* **Parameters:**  
  `position` (Vector3)  
  `target` (EntityScript or `nil`)  
  `spellbook` (Item or `nil`) — Currently open spellbook (if any).

### `DoGetMouseActions(position, target, spellbook)`
* **Description:** Top-level method that returns the top-priority `BufferedAction` for left and right mouse clicks. Handles AOE targeting mode, darkness visibility checks, and filters out UI-only actions (e.g., `CLOSESPELLBOOK`).
* **Parameters:** Same as `GetRightClickActions`, plus `position` can be `nil` to derive from input state.
* **Returns:** `lmb`, `rmb` — Up to two `BufferedAction` instances (or `nil`).

## Events & Listeners
* Listens for `"onremove"` event on registered containers to automatically unregister them.
* Does not push events.