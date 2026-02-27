---
id: rooted
title: Rooted
description: This component locks an entity in place by disabling physics movement and locomotion, while tracking external sources that can unroot it.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3b21a10b
---

# Rooted

## Overview
The `Rooted` component prevents an entity from moving by stopping its physics body and disabling locomotion speed, while allowing other components or systems to "root" or "unroot" it via source tracking. It automatically adds the `rooted` tag on attachment and removes it upon detachment.

## Dependencies & Tags
- Adds the `"rooted"` tag to the entity.
- Requires the `Physics` component (if present) to stop movement and set temporary mass.
- Requires the `locomotor` component (if present) to suppress movement speed.
- No explicit component dependencies beyond standard engine components (`Physics`, `locomotor`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sources` | `table` | `{}` | A set-like table tracking external sources that maintain the rooted state. A source can be the entity itself or another entity/component. When all sources are removed, the component self-deregisters. |

## Main Functions

### `Rooted:OnRemoveFromEntity()`
* **Description:** Cleans up the rooted state: removes the `rooted` tag, restores physics and locomotion mobility, deregisters event callbacks, and fires the `"unrooted"` event.
* **Parameters:** None (called automatically when the component is removed from the entity).

### `Rooted:AddSource(src)`
* **Description:** Registers an external source (`src`) as a reason for the entity remaining rooted. If the source is not the entity itself, it sets up an `"onremove"` event callback to automatically unroot if the source is removed.
* **Parameters:**
  * `src` (*any*): The source object (typically an entity or component) that is keeping the entity rooted.

### `Rooted:RemoveSource(src)`
* **Description:** Unregisters a source and immediately checks if any sources remain; if the source list becomes empty, it triggers component removal.
* **Parameters:**
  * `src` (*any*): The source object to remove.

## Events & Listeners
- **Listens to:**
  - `"onremove"` event on each external source (`src ~= self.inst`), to automatically clean up and potentially unroot the entity when the source is destroyed.
- **Triggers:**
  - `"rooted"` event during component construction (after setup).
  - `"unrooted"` event during cleanup in `OnRemoveFromEntity()`.