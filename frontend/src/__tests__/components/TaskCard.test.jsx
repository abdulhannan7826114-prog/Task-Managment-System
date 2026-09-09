import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '../../components/TaskCard'

describe('TaskCard Component', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'Todo',
    priority: 'High',
    dueDate: '2024-12-31T00:00:00Z'
  }

  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  it('should render task card with title', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('should display task status badge', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Todo')).toBeInTheDocument()
  })

  it('should display task priority badge', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('should display task description', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask._id)
  })

  it('should format due date correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(/Due: 12\/31\/2024/)).toBeInTheDocument()
  })
})
