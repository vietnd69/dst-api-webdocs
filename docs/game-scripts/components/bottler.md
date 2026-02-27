---
id: bottler
title: Bottler
description: Manages the action of 'bottling' an entity by executing a configurable callback function on a valid target.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: fef73250
---

# Bottler

## Overview
The `Bottler` component provides a generic framework for items that can "bottle" other entities. Its primary responsibility is to hold a custom callback function that defines the specific logic for the bottling action. When its `Bottle` method is called, it verifies the target has the `canbebottled` tag and then executes this callback, making it a flexible system for defining various bottling behaviors.

## Dependencies & Tags
None identified.

## Properties

| Property     | Type     | Default Value | Description                                                                        |
|--------------|----------|---------------|------------------------------------------------------------------------------------|
| `inst`       | `Entity` | `inst`        | A reference to the entity instance to which this component is attached.            |
| `onbottlefn` | `function` | `nil`         | The callback function to execute when a valid target is bottled.                   |

## Main Functions

### `SetOnBottleFn(fn)`
* **Description:** Sets or replaces the callback function that is executed when the `Bottle` method is called. This function defines the specific outcome of the bottling action.
* **Parameters:**
    * `fn` (function): The function to be called. It will receive the bottler's entity instance, the target entity, and the action's doer as arguments.

### `Bottle(target, doer)`
* **Description:** Attempts to perform the bottling action on a given target. If an `onbottlefn` has been set and the target is valid and has the `canbebottled` tag, the function is executed.
* **Parameters:**
    * `target` (Entity): The entity to be bottled.
    * `doer` (Entity): The entity performing the bottling action.