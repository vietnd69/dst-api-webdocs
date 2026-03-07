---
id: incinerator
title: Incinerator
description: Handles the destruction of items inside a container when triggered, including optional sound playback, event dispatching, and kill/murder event propagation for living items.
tags: [inventory, destruction, combat, sound]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3997c3ce
system_scope: inventory
---

# Incinerator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Incinerator` component enables an entity to incinerate (destroy) items in its associated `container` component when invoked. It supports custom filtering of which items to destroy, custom sound playback (prioritizing item-specific sounds over `health.murdersound` or `murderable.murdersound`), and firing game events—including `onincinerated` on the item and `murdered`/`killed` on the doer for living items. This component is typically attached to entities like firepits, fireplaces, or trash cans.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst:AddComponent("incinerator")

inst.components.incinerator:SetShouldIncinerateItemFn(function(_, item)
    return item:HasTag("organic") or item:HasTag("trash")
end)

inst.components.incinerator:SetOnIncinerateFn(function(inst)
    inst.SoundEmitter:PlaySound("dontstarve/common/sounds/fire_small")
    -- Visual FX or other logic here
end)

-- Later, when incineration is triggered:
inst.components.incinerator:Incinerate(player)
```

## Dependencies & tags
**Components used:** `container`, `health`, `murderable`, `stackable`, `combat`  
**Tags:** None added or removed directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onincineratefn` | function | `nil` | Optional callback invoked once per incineration operation after container contents are destroyed. |
| `shouldincinerateitemfn` | function | `nil` | Optional predicate function `(inst, item) → boolean` to determine whether a given item should be destroyed. Defaults to `true` if unset. |
| `incinerate_doer` | Entity instance | `nil` (temporary) | Internal reference to the entity performing the incineration during the `Incinerate()` call. Set only for the duration of the operation. |

## Main functions
### `SetOnIncinerateFn(fn)`
* **Description:** Sets a callback function to run after all qualifying items have been destroyed. Typically used for FX, sounds, or state changes on the incinerator entity itself.
* **Parameters:** `fn` (function) — receives the incinerator entity (`inst`) as its only argument.
* **Returns:** Nothing.

### `SetShouldIncinerateItemFn(fn)`
* **Description:** Sets a predicate function used to decide whether a given item should be incinerated. If `nil`, all items in the container are incinerated.
* **Parameters:** `fn` (function) — function with signature `(entity_inst, item_inst) → boolean`.
* **Returns:** Nothing.

### `Incinerate(doer)`
* **Description:** Destroys all items in the container that pass the `shouldincinerateitemfn` filter. Plays associated sounds and fires relevant events for each item. Reports success/failure depending on presence of a `container` component.
* **Parameters:** `doer` (Entity instance) — the entity performing the incineration; used for `murdered`/`killed` event data.
* **Returns:** `true` if the container existed and destruction began; `false` if no `container` component was present.
* **Error states:** Returns `false` if the entity lacks a `container` component; otherwise proceeds silently even if no items were destroyed.

### `ShouldIncinerateItem(item)`
* **Description:** Evaluates whether a specific item should be incinerated, using the configured predicate or defaulting to `true`.
* **Parameters:** `item` (Entity instance) — the item to evaluate.
* **Returns:** `true` if the item should be incinerated; `false` otherwise.

## Events & listeners
- **Listens to:** None (does not register event listeners).
- **Pushes:**
  - `onincinerated` — fired on each destroyed item; payload: `{incinerator = inst, doer = doer}`.
  - `murdered` — fired on the `doer` when incinerating an item with `health` or `murderable` components; payload: `{victim = item, stackmult = stacksize, incinerated = true}`.
  - `killed` — fired on the `doer` if the victim also has a `combat` component; payload: `{victim = item, stackmult = stacksize, incinerated = true}`.
