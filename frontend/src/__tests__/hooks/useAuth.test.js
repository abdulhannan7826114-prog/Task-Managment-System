import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider } from '../../context/AuthContext'
import { useAuth } from '../../hooks/useAuth'

describe('useAuth Hook', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('token')
    expect(result.current).toHaveProperty('login')
    expect(result.current).toHaveProperty('logout')
  })

  it('should update user and token on login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    const mockToken = 'test-token-123'

    act(() => {
      result.current.login(mockUser, mockToken)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
  })

  it('should clear user and token on logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    const mockUser = { id: '1', name: 'Test User' }
    const mockToken = 'test-token-123'

    act(() => {
      result.current.login(mockUser, mockToken)
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })

  it('should persist token to localStorage on login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    const mockUser = { id: '1', name: 'Test User' }
    const mockToken = 'test-token-123'

    act(() => {
      result.current.login(mockUser, mockToken)
    })

    expect(localStorage.getItem('token')).toBe(mockToken)
  })

  it('should remove token from localStorage on logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    const mockUser = { id: '1', name: 'Test User' }
    const mockToken = 'test-token-123'

    act(() => {
      result.current.login(mockUser, mockToken)
    })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should throw error if used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider'
    )
  })
})
