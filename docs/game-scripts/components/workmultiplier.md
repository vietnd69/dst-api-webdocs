---
id: workmultiplier
title: Workmultiplier
description: Manages action-specific work multipliers for an entity, allowing dynamic modification of work output via additive source-based modifiers.
tags: [work, modifier, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7f0dc60e
system_scope: entity
---

# Workmultiplier

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorkMultiplier` is a component that tracks and computes effective work multipliers for specific actions performed by an entity. It supports multiple sources contributing to a multiplier for the same action via the `SourceModifierList` utility, where the final multiplier for an action is determined by its active modifiers. The component also supports a custom resolution function (`specialfn`) that can override the default multiplier behavior for specific work actions.

This component is typically attached to entities capable of performing work, such as characters or machines, and integrates with the action system to adjust how much work is performed per interaction.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("workmultiplier")

-- Set a multiplier for "chop" action from a specific source
inst.components.workmultiplier:AddMultiplier("chop", 1.5, "axe_bonus")

-- Query the current multiplier for "chop"
local mult = inst.components.workmultiplier:GetMultiplier("chop")  -- returns 1.5

-- Remove the source modifier
inst.components.workmultiplier:RemoveMultiplier("chop", "axe_bonus")

-- Register a custom resolution function
inst.components.workmultiplier:SetSpecialMultiplierFn(function(inst, action, target, tool, numworks, recoil)
    if action == "mine" and recoil then
        return numworks * 0.5
    end
    return numworks
end)
```

## Dependencies & tags
**Components used:** None directly via `inst.components.X`. Relies on the external utility `util/sourcemodifierlist.lua`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GetMultiplier(action)`
* **Description:** Returns the effective multiplier for a given action. The multiplier is computed by aggregating all modifiers added for that action via `AddMultiplier`.
* **Parameters:** `action` (string) - the action name (e.g., `"chop"`, `"mine"`, `"dig"`).
* **Returns:** number — the multiplier value. Defaults to `1` if no modifiers exist for the action.
* **Error states:** Returns `1` if no modifiers are present for `action`.

### `AddMultiplier(action, multiplier, source)`
* **Description:** Registers a modifier for a specific action, identified by a unique source string. If multiple sources apply multipliers to the same action, they are combined by `SourceModifierList`.
* **Parameters:** 
  - `action` (string) - the action name.
  - `multiplier` (number) - the multiplier value to apply (typically `>= 0`).
  - `source` (string) - a unique identifier for the modifier source (e.g., `"perk_dig_speed"`).
* **Returns:** Nothing.

### `RemoveMultiplier(action, source)`
* **Description:** Removes a previously registered modifier for a given action and source.
* **Parameters:** 
  - `action` (string) - the action name.
  - `source` (string) - the source identifier of the modifier to remove.
* **Returns:** Nothing.

### `SetSpecialMultiplierFn(fn)`
* **Description:** Assigns a custom function to override how work amounts are resolved for specific actions. This function is invoked by `ResolveSpecialWorkAmount`.
* **Parameters:** `fn` (function) - a function that accepts `(inst, action, target, tool, numworks, recoil)` and returns a modified work amount (typically `number`).
* **Returns:** Nothing.

### `ResolveSpecialWorkAmount(action, target, tool, numworks, recoil)`
* **Description:** Applies the custom resolution function (if set) to determine the effective work amount. If no function is set, returns `numworks` unchanged.
* **Parameters:** 
  - `action` (string) - the action being performed.
  - `target` (Entity or nil) - the target entity of the action, if any.
  - `tool` (Entity or nil) - the tool used, if any.
  - `numworks` (number) - the base number of work units.
  - `recoil` (boolean) - whether the action is being processed in the recoil phase.
* **Returns:** number — the resolved work amount.
* **Error states:** Returns `numworks` if no custom function is set.

## Events & listeners
None identified.
