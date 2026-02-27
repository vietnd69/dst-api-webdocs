---
id: doaction
title: Doaction
description: Executes an action obtained via a callback function as part of the AI behavior system, managing its lifecycle including success, failure, and timeout.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: brain
source_hash: b0b89653
---

# Doaction

## Overview

The `DoAction` component is a specialized AI behavior node responsible for executing a dynamically-provided action on the entity it is attached to. It inherits from `BehaviourNode`, integrates with the entity's locomotion system via the `locomotor` component, and manages the full lifecycle of the action—including triggering success/failure callbacks, enforcing timeouts, and updating its internal status. It is typically used within AI behavior trees to trigger immediate or time-limited actions such as moving, attacking, or interacting with objects.

## Dependencies & Tags
- **Components used:** `locomotor` (used via `self.inst.components.locomotor:PushAction(...)`)
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this behavior node. |
| `shouldrun` | `Function or value` | — | A predicate function (or value) determining whether the action should be executed; passed to `PushAction`. |
| `action` | `Action or nil` | `nil` | The current action instance returned by `getactionfn`. |
| `getactionfn` | `Function` | — | Callback function that returns an `Action` object for the current context. |
| `time` | `number or nil` | `nil` | Timestamp (from `GetTime()`) when the action was started; used for timeout tracking. |
| `timeout` | `number or nil` | `nil` | Optional maximum duration (in seconds) before the action fails due to timeout. |
| `pendingstatus` | `string or nil` | `nil` | Temporary storage for the next status (`SUCCESS` or `FAILED`) pending update in `Visit()`. |

## Main Functions

### `DoAction:OnFail()`
* **Description:** Sets `pendingstatus` to `FAILED`. Called via the action’s fail callback when the action fails.
* **Parameters:** None.
* **Returns:** `nil`.

### `DoAction:OnSucceed()`
* **Description:** Sets `pendingstatus` to `SUCCESS`. Called via the action’s success callback when the action completes successfully.
* **Parameters:** None.
* **Returns:** `nil`.

### `DoAction:Visit()`
* **Description:** Core behavior node method executed each frame by the behavior tree. Handles starting the action (if `status == READY`), tracking its runtime (including timeout), and updating the status based on action outcome or timeout.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
This component does not register or fire events. It reacts to action lifecycle events via direct callbacks (`AddFailAction`, `AddSuccessAction`) on the `Action` object.