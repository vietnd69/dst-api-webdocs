---
id: moonaltarlink
title: Moonaltarlink
description: Manages bidirectional linking between a central entity and multiple moon altar components, positioning the entity at the average location of the altars during link establishment.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 92dc9172
---

# Moonaltarlink

## Overview
This component enables an entity to dynamically link with and track a set of moon altars, calculating and occupying the centroid position of the linked altars. When linked, it assigns itself to each altar's `moonaltarlinktarget.link` property and invokes optional callbacks on both the altars and itself. When broken, it nullifies those references and triggers unlink callbacks.

## Dependencies & Tags
- Requires target altars to have the `moonaltarlinktarget` component.
- Does not automatically add or remove entity tags.
- Uses `Transform` component on `self.inst` and target altars for position management.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected) | Reference to the entity this component is attached to. |
| `altars` | `table` or `nil` | `nil` | Array of altar entities currently linked. Populated on `EstablishLink`, cleared on `BreakLink`. |
| `onlinkfn` | `function` or `nil` | `nil` | Optional callback invoked *after* link establishment; called as `onlinkfn(self.inst, altars)`. |
| `onlinkbrokenfn` | `function` or `nil` | `nil` | Optional callback invoked *after* link is broken; called as `onlinkbrokenfn(self.inst, self.altars)`. |

## Main Functions

### `EstablishLink(altars)`
* **Description:** Links the component's entity to a list of moon altar entities. Computes the arithmetic mean of the X and Z world positions of all altars and moves the entity to that centroid (Y is set to 0). For each altar, sets `moonaltarlinktarget.link` to `self.inst` and triggers the altar's `onlinkfn` if defined.
* **Parameters:**  
  `altars` (table) — An array (list) of altar entities, each expected to have the `moonaltarlinktarget` component.

### `BreakLink()`
* **Description:** Severs all existing links to altars. Clears `moonaltarlinktarget.link` on each altar, invokes the altar's `onlinkbrokenfn` if defined, and finally calls `self.onlinkbrokenfn` (if set). Resets the `altars` array to `nil`.
* **Parameters:** None.

## Events & Listeners
None. This component does not register or dispatch any events via `inst:ListenForEvent` or `inst:PushEvent`.