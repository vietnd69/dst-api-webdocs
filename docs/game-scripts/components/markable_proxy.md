---
id: markable_proxy
title: Markable Proxy
description: A proxy component that delegates markable behavior to another entity's markable component and manages the "markable_proxy" tag based on whether marking is allowed.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ce2727f4
---

# Markable Proxy

## Overview
The `Markable_proxy` component acts as a wrapper that forwards marking operations (e.g., `Mark`, `SetMarkable`, `HasMarked`) to a referenced entity's `markable` component. It also dynamically applies or removes the `"markable_proxy"` tag on its own entity based on the value of `canbemarked`, ensuring consistent tagging without requiring direct tag management elsewhere.

## Dependencies & Tags
- **Referenced Components:** `markable` (expected on the `proxy` entity)
- **Tags Added/Removed:** Dynamically adds/removes the `"markable_proxy"` tag on `self.inst` depending on `canbemarked`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | *nil* | The entity instance this component is attached to. |
| `proxy` | `GObject?` | `nil` | Optional target entity whose `markable` component is delegated to. |
| `canbemarked` | `boolean` | *inferred from `onmarkable`* | Controls whether the `"markable_proxy"` tag is added (`true`) or removed (`false`). Set via the class initializer function. |

## Main Functions

### `Mark(doer)`
* **Description:** Delegates the `Mark` call to the referenced `proxy` entity's `markable` component, if it exists.
* **Parameters:**
  - `doer`: The entity performing the marking action (typically a player or NPC).

### `SetMarkable(markable)`
* **Description:** Updates the internal `canbemarked` state and delegates `SetMarkable` to the `proxy`'s `markable` component. This also triggers the `onmarkable` callback, which updates the `"markable_proxy"` tag.
* **Parameters:**
  - `markable`: A boolean indicating whether the proxy entity should now be markable.

### `HasMarked(doer)`
* **Description:** Delegates the `HasMarked` call to the referenced `proxy` entity's `markable` component, if it exists. Returns `nil` if no proxy or `markable` component is available.
* **Parameters:**
  - `doer`: The entity to check for a prior marking.

## Events & Listeners
None.