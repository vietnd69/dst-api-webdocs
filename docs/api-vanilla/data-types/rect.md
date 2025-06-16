---
id: rect
title: Rect
sidebar_position: 3
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Rect

*API Version: 619045*

Rect is a data type representing rectangular areas in Don't Starve Together. It's used for defining boundaries, collision areas, UI layouts, and region-based operations.

## Overview

In Don't Starve Together, the Rect data type is used to define rectangular regions in 2D space. It's commonly used for:

- UI element positioning and boundaries
- Collision detection areas
- Screen regions and viewports
- Selection areas for game interaction
- Texture regions for rendering

Rect objects are defined by their position (typically the top-left corner) and their dimensions (width and height).

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | Number | X-coordinate of the rectangle's left edge |
| `y` | Number | Y-coordinate of the rectangle's top edge |
| `width` | Number | Width of the rectangle |
| `height` | Number | Height of the rectangle |

## Core Methods

### Creation and Initialization

```lua
-- Create a new rectangle
local rect = Rect(x, y, width, height)

-- Create a rectangle from two points
local rect = Rect.FromCorners(x1, y1, x2, y2)

-- Create a zero-sized rectangle at position
local rect = Rect.Point(x, y)
```

### Position and Size

```lua
-- Get corners of the rectangle
local left, top = rect:GetLeft(), rect:GetTop()
local right, bottom = rect:GetRight(), rect:GetBottom()

-- Get center of the rectangle
local centerX, centerY = rect:GetCenter()

-- Get size of the rectangle
local width, height = rect:GetSize()
local area = rect:GetArea()
```

### Transformations

```lua
-- Move the rectangle by an offset
rect:Offset(deltaX, deltaY)

-- Scale the rectangle
rect:Scale(scaleX, scaleY)

-- Expand rectangle in all directions
rect:Inflate(amount)

-- Expand in specific directions
rect:InflateHorz(amount)  -- Horizontally
rect:InflateVert(amount)  -- Vertically
```

### Testing and Intersection

```lua
-- Check if a point is inside the rectangle
local contains = rect:Contains(x, y)

-- Check if rectangle is empty (zero area)
local isEmpty = rect:IsEmpty()

-- Check if two rectangles intersect
local intersects = rect1:Intersects(rect2)

-- Get the intersection of two rectangles
local intersectRect = rect1:GetIntersection(rect2)

-- Get the union of two rectangles
local unionRect = rect1:GetUnion(rect2)
```

## Integration with UI System

Rect objects are extensively used in the UI system for layout and positioning:

```lua
-- Position a UI element using a rectangle
function PositionUIElement(widget, rect)
    widget:SetPosition(rect:GetCenter())
    widget:SetSize(rect:GetSize())
end

-- Create a layout grid
function CreateLayoutGrid(startX, startY, cellWidth, cellHeight, columns, rows)
    local cells = {}
    for y = 0, rows - 1 do
        for x = 0, columns - 1 do
            local cellRect = Rect(
                startX + x * cellWidth,
                startY + y * cellHeight,
                cellWidth,
                cellHeight
            )
            table.insert(cells, cellRect)
        end
    end
    return cells
end
```

## Common Use Cases

### UI Layout

```lua
-- Create a centered panel with padding
function CreateCenteredPanel(screenWidth, screenHeight, panelWidth, panelHeight)
    local centerX = screenWidth / 2
    local centerY = screenHeight / 2
    
    -- Create panel rectangle centered on screen
    local panelRect = Rect(
        centerX - panelWidth / 2,
        centerY - panelHeight / 2,
        panelWidth,
        panelHeight
    )
    
    -- Create content rectangle with padding
    local padding = 10
    local contentRect = Rect(
        panelRect.x + padding,
        panelRect.y + padding,
        panelRect.width - padding * 2,
        panelRect.height - padding * 2
    )
    
    return panelRect, contentRect
end
```

### Collision Detection

```lua
-- Check if two entities' collision rectangles overlap
function CheckCollision(entity1, entity2)
    local rect1 = GetEntityCollisionRect(entity1)
    local rect2 = GetEntityCollisionRect(entity2)
    
    return rect1:Intersects(rect2)
end

-- Get entity collision rectangle
function GetEntityCollisionRect(entity)
    local x, y, z = entity.Transform:GetWorldPosition()
    local width, height = entity.Physics:GetSize()
    
    -- Convert 3D position to 2D rectangle
    return Rect(
        x - width / 2,
        z - height / 2,
        width,
        height
    )
end
```

### Selection Area

```lua
-- Create a selection rectangle from mouse drag
function CreateSelectionRect(startX, startY, endX, endY)
    -- Ensure correct order of corners regardless of drag direction
    local left = math.min(startX, endX)
    local top = math.min(startY, endY)
    local right = math.max(startX, endX)
    local bottom = math.max(startY, endY)
    
    -- Create rectangle from corners
    return Rect.FromCorners(left, top, right, bottom)
end

-- Find entities within selection rectangle
function GetEntitiesInRect(rect)
    local entities = {}
    
    -- Find all entities in the world
    local allEntities = TheSim:FindEntities(0, 0, 0, 1000)
    
    for _, entity in ipairs(allEntities) do
        local x, y, z = entity.Transform:GetWorldPosition()
        
        -- Check if entity position is within rectangle
        if rect:Contains(x, z) then
            table.insert(entities, entity)
        end
    end
    
    return entities
end
```

## See also

- [Vector3 Data Type](vector3.md) - For 3D position representation
- [Vector2 Data Type](vector.md) - For 2D position representation
- [UI System](../core/ui-system.md) - For UI layout using Rect
- [Widgets](../core/widgets.md) - For UI elements that use Rect for positioning
- [Physics System](../core/physics.md) - For collision detection using Rect
