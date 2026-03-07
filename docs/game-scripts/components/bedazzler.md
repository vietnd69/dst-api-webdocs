---
id: bedazzler
title: Bedazzler
description: Determines whether a target entity can be bedazzled and performs the bedazzlement action, consuming uses if applicable.
tags: [environment, interaction, state_change]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 97a889e5
system_scope: environment
---

# Bedazzler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Bedazzler` is a utility component that encapsulates the logic for applying the bedazzlement status effect to eligible entities. It validates target conditions (e.g., not burning, not frozen, not already bedazzled) before triggering `bedazzlement:Start()`. This component is typically attached to items used to bedazzle entities (e.g., the Bedazzle Staff), and optionally consumes uses from a `finiteuses` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bedazzler")
inst:AddComponent("finiteuses")
inst.components.bedazzler:SetUseAmount(1)

local target = some_spider_den_entity
if inst.components.bedazzler:CanBedazzle(target) == true then
    inst.components.bedazzler:Bedazzle(target)
end
```

## Dependencies & tags
**Components used:** `burnable`, `freezable`, `bedazzlement`, `finiteuses`.  
**Tags:** Checks `burnt`, `bedazzled`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `use_amount` | number | `1` | Number of uses to consume from `finiteuses` when bedazzling. Set via `SetUseAmount()`. |

## Main functions
### `SetUseAmount(use_amount)`
* **Description:** Configures how many uses to deduct from the `finiteuses` component during bedazzlement. Defaults to `1` if `use_amount` is not set and the bedazzler is used.
* **Parameters:** `use_amount` (number) - number of uses to consume per bedazzle action.
* **Returns:** Nothing.

### `CanBedazzle(target)`
* **Description:** Checks whether the specified target entity can be bedazzled, based on its current state and tags.
* **Parameters:** `target` (Entity) - the entity to evaluate.
* **Returns:** 
  - `true` if the target is eligible.
  - `false, "REASON"` (string) if ineligible, where `REASON` is one of: `"BURNING"`, `"BURNT"`, `"FROZEN"`, `"ALREADY_BEDAZZLED"`.
* **Error states:** Returns early with `false` if any condition prevents bedazzlement.

### `Bedazzle(target)`
* **Description:** Applies the bedazzlement effect to the target entity and, if present, consumes uses from the bedazzler’s `finiteuses` component.
* **Parameters:** `target` (Entity) - the entity to bedazzle.
* **Returns:** Nothing.
* **Error states:** Does nothing if `target.components.bedazzlement` is missing. Consumption of uses occurs only if the bedazzler entity itself has a `finiteuses` component.

## Events & listeners
None identified.
