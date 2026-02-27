---
id: slingshotmodder
title: Slingshotmodder
description: Manages the opening and closing of the slingshot mod interface for a target entity, enforcing ownership restrictions when applicable.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: a32b38f5
---

# Slingshotmodder

## Overview
The `SlingshotModder` component provides an interface for starting and stopping the slingshot modification process on a target entity (typically a slingshot). It checks ownership restrictions before allowing modification and delegates the actual UI interaction to the target's `slingshotmods` component.

## Dependencies & Tags
- **Component Dependencies:**
  - `linkeditem` (if present on the target) — used to verify ownership.
  - `slingshotmods` (required on the target) — used to invoke `Open` and `Close` methods.
- **Tags:** None identified.

## Properties
No public properties are initialized in the constructor. The component only stores a reference to the entity (`self.inst`) during construction.

## Main Functions
### `StartModding(target, user)`
* **Description:** Attempts to open the slingshot mod interface for the target entity on behalf of the user. Enforces that only the item's owner may modify it if the item is restricted to owner use.
* **Parameters:**
  - `target`: The entity (e.g., a slingshot) to be modified. Must have a `slingshotmods` component to proceed successfully.
  - `user`: The player attempting to start modding. Used for ownership verification and passed to `slingshotmods:Open`.

### `StopModding(target, user)`
* **Description:** Attempts to close the slingshot mod interface for the target entity if open. Returns whether the operation succeeded (based on `slingshotmods:Close`).
* **Parameters:**
  - `target`: The entity whose mod interface should be closed.
  - `user`: The player attempting to stop modding (passed to `slingshotmods:Close`).

## Events & Listeners
None.