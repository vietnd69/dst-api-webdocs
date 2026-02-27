---
id: murderable
title: Murderable
description: Marks an entity as killable by hostile entities (e.g., Pigs, Houndius) by adding the "murderable" tag.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: da4e1201
---

# Murderable

## Overview
The `Murderable` component enables an entity to be targeted and killed by certain hostile entities (such as pigs, hounds, and other *murderers*) by tagging it with `"murderable"`. It ensures the tag is added on instantiation and cleanly removed when the component is detached from the entity.

## Dependencies & Tags
- **Component Dependency:** None (relies only on core engine functionality).
- **Tags Added:** `"murderable"`  
- **Tags Removed (on removal):** `"murderable"`

## Properties
| Property      | Type   | Default Value | Description                                      |
|---------------|--------|---------------|--------------------------------------------------|
| `inst`        | `Entity` | (passed to constructor) | Reference to the entity the component is attached to. |
| `murdersound` | `string?` | `nil`         | Unused placeholder; no sound is assigned or used. |

## Main Functions
### `Murderable:OnRemoveFromEntity()`
* **Description:** Removes the `"murderable"` tag from the entity when the component is removed, preventing unintended behavior after detachment.  
* **Parameters:** None.

## Events & Listeners
None.