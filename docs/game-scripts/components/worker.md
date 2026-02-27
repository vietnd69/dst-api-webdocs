---
id: worker
title: Worker
description: Manages action effectiveness levels for an entity, enabling permission checks and weighted action capability evaluation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0e8b6475
---

# Worker

## Overview
The `Worker` component tracks which actions an entity is capable of performing and the associated effectiveness level (e.g., speed or proficiency multiplier) for each action. It serves as a lightweight, data-driven interface for determining whether an entity can execute a given action and how efficiently it can perform it.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `actions` | `table` | `{}` | A dictionary mapping action names (strings) to numeric effectiveness values (e.g., 0.5, 1.0, 2.0). Absence of an action key implies the entity cannot perform that action. |

## Main Functions

### `GetEffectiveness(action)`
* **Description:** Returns the effectiveness value for a given action. Returns `0` if the action is not registered.
* **Parameters:**  
  `action` (string) — The name of the action to query.

### `SetAction(action, effectiveness)`
* **Description:** Registers or updates the effectiveness level for a specific action. If `effectiveness` is omitted or `nil`, defaults to `1`.
* **Parameters:**  
  `action` (string) — The name of the action to configure.  
  `effectiveness` (number, optional) — A numeric value indicating how effectively the entity performs this action (e.g., 1.0 = baseline, 2.0 = double speed). Use `0` to disable or unregister.

### `CanDoAction(action)`
* **Description:** Checks whether the entity is permitted to perform a given action. Returns `true` only if the action exists as a key in the `actions` table (regardless of its effectiveness value).
* **Parameters:**  
  `action` (string) — The name of the action to check.

## Events & Listeners
None.