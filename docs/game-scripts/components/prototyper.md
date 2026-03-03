---
id: prototyper
title: Prototyper
description: Manages prototype unlock states for crafting stations by tracking active doers and maintaining linked tech trees.
tags: [crafting, techtree, unlock]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 922c291a
system_scope: crafting
---

# Prototyper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Prototyper` is a component responsible for managing the activation state of crafting stations that support prototype unlocking (e.g., workbenches, altars). It tracks which entities (`doers`) have activated the station, maintains associated tech trees, and handles lifecycle events such as activation/deactivation and recipe crafting. It is typically attached to prefabs that serve as crafting stations with unlockable recipes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("prototyper")

inst.components.prototyper.onturnon = function(inst)
    print("Prototyper turned on")
end

inst.components.prototyper.onturnoff = function(inst)
    print("Prototyper turned off")
end

inst.components.prototyper.onactivate = function(inst, doer, recipe)
    print("Recipe " .. recipe.name .. " crafted by " .. Doer:GetDebugString())
end

inst.components.prototyper:TurnOn(some_doer)
```

## Dependencies & tags
**Components used:** `craftingstation` (optional; used in `Activate` to update recipe crafting limits)  
**Tags:** Adds `prototyper` to the host entity on construction; removes it on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trees` | table | `TechTree.Create()` | Internal tech trees data structure representing unlocked prototypes. |
| `on` | boolean | `false` | Whether the prototyper is currently active (i.e., has at least one doer). |
| `onturnon` | function | `nil` | Optional callback fired when the prototyper transitions from inactive to active (no doers → ≥1 doer). |
| `onturnoff` | function | `nil` | Optional callback fired when the prototyper transitions from active to inactive (≥1 doer → no doers). |
| `onturnonfordoer` | function | `nil` | Optional per-doer callback fired when a specific doer turns the prototyper on. |
| `onturnofffordoer` | function | `nil` | Optional per-doer callback fired when a specific doer turns the prototyper off. |
| `onactivate` | function | `nil` | Optional callback fired when `Activate()` is called (e.g., when a recipe is crafted at the station). |
| `doers` | table | `{}` | Map of active doers (`entity → true`). Used to track who has activated the station. |

## Main functions
### `TurnOn(doer)`
*   **Description:** Registers a doer as having activated this prototyper. If this is the first doer, also triggers the global `onturnon` callback and sets `on = true`.
*   **Parameters:** `doer` (entity) - The entity turning the prototyper on.
*   **Returns:** Nothing.
*   **Error states:** No effect if `doer` is already registered.

### `TurnOff(doer)`
*   **Description:** Removes the doer’s activation. If this was the last doer, triggers the global `onturnoff` callback and sets `on = false`.
*   **Parameters:** `doer` (entity) - The entity turning the prototyper off.
*   **Returns:** Nothing.
*   **Error states:** No effect if `doer` is not currently registered.

### `GetTechTrees()`
*   **Description:** Returns a deep copy of the internal tech trees table.
*   **Parameters:** None.
*   **Returns:** table — A copy of `self.trees`, safe for external modification.
*   **Error states:** None.

### `Activate(doer, recipe)`
*   **Description:** Reports that a recipe was crafted at this prototyper. Invokes `craftingstation:RecipeCrafted` (if present) to decrement the recipe’s craft limit, and fires the `onactivate` callback.
*   **Parameters:**  
  `doer` (entity) — The entity that crafted the recipe.  
  `recipe` (table) — The recipe object, expected to have at least a `name` field (`recipe.name`).  
*   **Returns:** Nothing.
*   **Error states:** If `craftingstation` is absent, the recipe limit logic is skipped; otherwise the call proceeds normally.

## Events & listeners
- **Listens to:** `onremove` — Used to automatically `TurnOff` a doer if it is removed from the world while still registered as an active doer. Callback registered per doer.
- **Pushes:** None.
