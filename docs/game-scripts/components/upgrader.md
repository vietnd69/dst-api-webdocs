---
id: upgrader
title: Upgrader
description: Provides upgrade eligibility logic for an entity based on its type, target compatibility, and user permissions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 1c914b16
---

# Upgrader

## Overview
This component determines whether an entity (the "upgrader") can perform upgrades on a target entity (e.g., a structure or item). It enforces two conditions: the upgrader must support the target's upgrade type, and the entity performing the upgrade (`doer`) must carry the appropriate tag (`<type>_upgradeuser`).

## Dependencies & Tags
The component itself does not add or remove tags on the host entity. However:
- It relies on the `upgradeable` component being present on the target entity (accessed via `target.components.upgradeable.upgradetype`).
- It reads the `upgradeable` component’s `upgradetype` property.
- It checks for the existence of a tag `<upgradetype>_upgradeuser` on the `doer` entity.

No explicit tag management is performed by this component’s constructor.

## Properties

| Property       | Type   | Default Value                     | Description |
|----------------|--------|-----------------------------------|-------------|
| `upgradetype`  | string | `UPGRADETYPES.DEFAULT`            | The type of upgrades this upgrader supports. Used to match against target upgrade types and check for user tags. |
| `upgradevalue` | number | `1`                               | Represents the magnitude or level of upgrade power—currently unused in the provided code. |

## Main Functions

### `CanUpgrade(target, doer)`
* **Description:** Checks whether this upgrader can legally upgrade the given target entity. Enforces compatibility based on upgrade type and user permissions.
* **Parameters:**
  * `target`: The entity to be upgraded. Must have a `upgradeable` component with a public `upgradetype` property.
  * `doer`: The entity performing the upgrade action. Must have a tag matching `<upgradetype>_upgradeuser` (e.g., `"structure_upgrader"` → `"structure_upgradeuser"`).

## Events & Listeners
None.