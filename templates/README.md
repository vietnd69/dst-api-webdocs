# Documentation Templates

This directory contains standardized templates for creating consistent documentation across the Don't Starve Together API documentation site.

## Available Templates

1. **Component Template** (`component-template.md`)
   - Use for documenting game components that can be added to entities
   - Includes sections for properties, methods, integration, and examples

2. **Core System Template** (`core-system-template.md`)
   - Use for documenting core game systems and mechanics
   - Includes sections for concepts, features, integration, and patterns

3. **Data Type Template** (`data-type-template.md`)
   - Use for documenting data types and data structures
   - Includes sections for properties, methods, creation, and operations

4. **Example Template** (`example-template.md`)
   - Use for creating implementation examples and tutorials
   - Includes sections for prerequisites, implementation steps, and troubleshooting

5. **Global System Template** (`global-system-template.md`)
   - Use for documenting global objects and systems (like TheWorld, ThePlayer, etc.)
   - Includes sections for properties, methods, events, and client/server distinctions

## How to Use

1. Copy the appropriate template for your document type.
2. Fill in all sections with relevant content.
3. Remove any sections that aren't applicable to what you're documenting.
4. Ensure all links to other documentation are correct.
5. Update the frontmatter with correct id, title, sidebar_position, and version.

## Template Structure

Each template includes:

- **Frontmatter** - Metadata at the top of the file
- **Introduction** - Overview of the topic
- **Main content sections** - Details about the topic
- **Code examples** - Practical usage examples
- **Related content** - Links to other relevant documentation

## Mandatory Sections

While templates can be adjusted as needed, the following sections should always be included:

- Title and introduction
- Basic usage example
- Properties and/or methods (if applicable)
- At least one complete code example
- "See also" section with related content 