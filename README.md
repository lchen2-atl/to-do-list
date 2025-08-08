# 📝 Nested Todo List

A modern, interactive todo application that supports nested subtasks for better task organization.

## Features

### ✨ Core Functionality
- **Add Todo Items**: Create main todo items with a simple input interface
- **Nested Subtasks**: Add unlimited levels of subtasks to any todo item
- **Mark Complete**: Check off completed tasks and subtasks
- **Delete Items**: Remove todo items and their subtasks
- **Persistent Storage**: All data is saved to browser localStorage

### 🎯 Nested Todo Features
- **Hierarchical Structure**: Organize tasks with parent-child relationships
- **Visual Nesting**: Clear visual indication of task hierarchy with indentation
- **Cascade Completion**: When a parent task is marked complete, all subtasks are automatically completed
- **Independent Subtasks**: Subtasks can be managed independently of their parent
- **Multi-level Nesting**: Support for deeply nested task structures

### 📊 Statistics
- Real-time count of total tasks (including subtasks)
- Track completed vs. remaining tasks
- Visual progress indication

## How to Use

1. **Add a Main Todo**: Type in the input field and click "Add" or press Enter
2. **Add Subtasks**: Click "+ Subtask" on any todo item to create nested tasks
3. **Complete Tasks**: Check the checkbox to mark items as complete
4. **Delete Tasks**: Use the delete button to remove tasks and all their subtasks
5. **Organize**: Create multiple levels of nesting to organize complex projects

## Example Structure

```
📋 Plan vacation trip
  ✅ Research destinations
  ❌ Book flights
  ❌ Find accommodation
    ❌ Check hotel reviews
    ❌ Compare prices

📋 Complete project presentation
  ✅ Create slides
  ❌ Practice presentation
```

## Technical Details

- **Enhanced JavaScript**: Built upon the original todo app with nested functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Data persists between browser sessions
- **Clean CSS**: Modern styling with nested visual hierarchy

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Classes
- LocalStorage API
- CSS Grid/Flexbox

## File Structure

```
├── index.html      # Main HTML structure with nested support
├── styles.css      # Enhanced CSS with nested todo styling
├── script.js       # Enhanced JavaScript with nested functionality
└── README.md       # This documentation
```

## Getting Started

Simply open `index.html` in your web browser to start organizing tasks with nested subtasks!
