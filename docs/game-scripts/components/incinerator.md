---
id: incinerator
title: Incinerator
description: Manages the logic and execution of incinerating items contained within an entity's container, including callback hooks, sound playback, and event dispatching.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3997c3ce
---

# Incinerator

## Overview
The `Incinerator` component enables an entity to incinerate all or selectively filtered items in its container. It supports customizable incineration criteria via function callbacks, handles sound playback upon destruction (including live entity sounds), and dispatches events such as `onincinerated`, `murdered`, and `killed` to notify other systems.

## Dependencies & Tags
- **Component Dependencies:** Relies on the entity having a `container` component to access and destroy contents.
- **Entity Interaction:** May interact with items possessing `stackable`, `health`, `murderable`, and `murderable` (sic) components to determine behavior and sound.
- **Tags:** None explicitly added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onincineratefn` | `function?` | `nil` | Optional callback invoked *after* incineration completes. Receives `inst` (the incinerator entity) as the sole argument. |
| `shouldincinerateitemfn` | `function?` | `nil` | Optional predicate function used to determine if an item should be incinerated. Receives `(incinerator_inst, item)` and returns `true`/`false`. |
| `incinerate_doer` | `entity or nil` | `nil` (temporary) | Internal reference to the entity performing the incineration, set during `Incinerate()` and cleared afterward. Used for event context. |

> **Note:** The component itself is initialized in its constructor with no explicit public properties beyond the two function callback fields. `incinerate_doer` is transiently set during incineration and is not exposed via a public setter.

## Main Functions

### `SetOnIncinerateFn(fn)`
* **Description:** Sets the callback function to execute once incineration is fully completed.
* **Parameters:**
  * `fn` (`function`): A function accepting one argument — the incinerator entity (`inst`). May be `nil` to remove the callback.

### `SetShouldIncinerateItemFn(fn)`
* **Description:** Sets the predicate function used to decide whether a specific item should be incinerated during `Incinerate()`.
* **Parameters:**
  * `fn` (`function`): A function accepting `(incinerator_inst, item)` and returning `true` to incinerate the item or `false` to skip it. May be `nil`, in which case all items are incinerated.

### `Incinerate(doer)`
* **Description:** Initiates incineration of all items in the container that pass the `shouldincinerateitemfn` filter (or all items if no filter is set). Triggers associated sounds and events per item.
* **Parameters:**
  * `doer` (`entity`): The entity performing the incineration. Used to emit `murdered` and `killed` events for living items.
* **Returns:** `true` if the incineration process was started (container present), `false` otherwise.

### `ShouldIncinerateItem(item)`
* **Description:** Checks whether a given item satisfies the incineration criteria using the configured `shouldincinerateitemfn`.
* **Parameters:**
  * `item` (`entity`): The candidate item to be incinerated.
* **Returns:** `true` if the item should be incinerated, `false` otherwise.

## Events & Listeners

- **Events Emitted:**
  - `onincinerated` — pushed on each incinerated item, with payload `{ incinerator = inst, doer = doer }`.
  - `murdered` — pushed on the `doer` entity for incinerated items that have `health` or `murderable` components, with payload `{ victim = item, stackmult = stacksize, incinerated = true }`.
  - `killed` — pushed on the `doer` *only* if the item also has a `combat` component, with the same payload as `murdered`.

- **Event Listeners:** None — the component does not subscribe to any external events directly.