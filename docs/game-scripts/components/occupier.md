---
id: occupier
title: Occupier
description: Tracks ownership of an entity by assigning and retrieving an owner reference.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 47604145
---

# Occupier

## Overview
The Occupier component provides simple owner management for an entity by storing and exposing a reference to the entity's current owner. It does not enforce or manage ownership logic itself—only stores and returns the owner value.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned via constructor) | Reference to the entity instance the component is attached to. |
| `owner` | `Entity?` | `nil` | Reference to the entity's owner (e.g., a player or another entity). Can be `nil`. |

## Main Functions
### `GetOwner()`
* **Description:** Returns the current owner reference stored in the component.
* **Parameters:** None.

### `SetOwner(owner)`
* **Description:** Assigns a new owner to the entity. Accepts any entity reference (or `nil` to clear ownership).
* **Parameters:**
  * `owner` (`Entity?`) — The entity to set as the owner. May be `nil`.