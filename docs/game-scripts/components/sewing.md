---
id: sewing
title: Sewing
description: A utility component that enables repairing tagged entities using a sewing kit by consuming fuel and applying repair value.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: d0dfd891
---

# Sewing

## Overview
This component provides a `DoSewing` method that repairs eligible targets (those with the `"needssewing"` tag) by consuming fuel or stackable quantity from the sewing kit entity. It is typically attached to items like the Sewing Kit and coordinates interactions with the target’s `fueled` component, the kit’s own consumable components (`finiteuses` or `stackable`), and supports optional post-repair callbacks and achievement tracking.

## Dependencies & Tags
- `target.components.fueled`: Required to apply repair (via `DoDelta`).
- `inst.components.finiteuses` or `inst.components.stackable`: Used to consume the tool (optional).
- `inst`: Must be an entity capable of acting as a tool (e.g., Sewing Kit); no tags are added/removed by this component itself.
- Listens for no internal events itself, but triggers side effects like achievements.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repair_value` | number | `1` | The amount of fuel (HP) restored to a target per sewing operation. |
| `inst` | EntityInstance | *(passed in constructor)* | Reference to the entity this component is attached to (e.g., Sewing Kit). |
| `onsewn` | function | `nil` | Optional callback invoked after successful sewing; accepts `(self.inst, target, doer)` arguments. |

## Main Functions

### `DoSewing(target, doer)`
* **Description:** Attempts to repair the given `target` entity if it has the `"needssewing"` tag. Consumes one use of the sewing kit (either via `finiteuses` or `stackable`), applies `repair_value` to the target’s `fueled` component, triggers an achievement for the `doer`, and invokes the optional `onsewn` callback if defined. Returns `true` on success or `nil` if the target is not eligible.
* **Parameters:**
  - `target`: Entity – The entity to repair; must have the `"needssewing"` tag and a `fueled` component.
  - `doer`: Entity – The entity performing the sewing (e.g., a player); used for achievement granting and context.

## Events & Listeners
None.