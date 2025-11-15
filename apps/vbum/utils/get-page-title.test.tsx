import { describe, expect, it } from 'vitest'
import { getPageTitle } from './get-page-title'
import {
  AdminClients,
  AdminHealthPlans,
  AdminPhysicians,
  AdminUsers,
  Dashboard,
  Home,
  RateLimit,
} from '@/routes'

describe('getPageTitle', () => {
  describe('recognized routes', () => {
    it('should return "Home" for Home route', () => {
      const pathname = Home({})
      const result = getPageTitle(pathname)
      expect(result).toBe('Home')
    })

    it('should return "User Administration" for AdminUsers route', () => {
      const pathname = AdminUsers({})
      const result = getPageTitle(pathname)
      expect(result).toBe('User Administration')
    })

    it('should return "Manage Clients" for AdminClients route', () => {
      const pathname = AdminClients({})
      const result = getPageTitle(pathname)
      expect(result).toBe('Manage Clients')
    })

    it('should return "Manage Health Plans" for AdminHealthPlans route', () => {
      const pathname = AdminHealthPlans({})
      const result = getPageTitle(pathname)
      expect(result).toBe('Manage Health Plans')
    })

    it('should return "Manage Physicians" for AdminPhysicians route', () => {
      const pathname = AdminPhysicians({})
      const result = getPageTitle(pathname)
      expect(result).toBe('Manage Physicians')
    })

    it('should return "Dashboard" for Dashboard route', () => {
      const pathname = Dashboard({})
      const result = getPageTitle(pathname)
      expect(result).toBe('Dashboard')
    })

    it('should return empty string for RateLimit route', () => {
      const pathname = RateLimit({ secs: 0 })
      const result = getPageTitle(pathname)
      expect(result).toBe('')
    })

    it('should return empty string for RateLimit route with different secs', () => {
      const pathname = RateLimit({ secs: 60 })
      const result = getPageTitle(pathname)
      expect(result).toBe('')
    })
  })

  describe('unrecognized routes', () => {
    it('should throw error for unknown pathname', () => {
      const unknownPath = '/unknown/path'
      expect(() => getPageTitle(unknownPath)).toThrow()
    })

    it('should include pathname in error message', () => {
      const unknownPath = '/invalid/route'
      expect(() => getPageTitle(unknownPath)).toThrow(`Unknown pathname: ${unknownPath}`)
    })

    it('should throw for empty string pathname', () => {
      expect(() => getPageTitle('')).toThrow()
    })

    it('should throw for undefined-like paths', () => {
      expect(() => getPageTitle('/undefined')).toThrow()
    })
  })

  describe('optional slug parameter', () => {
    it('should accept slug parameter even if not used', () => {
      const pathname = Home({})
      const result = getPageTitle(pathname, 'some-slug')
      expect(result).toBe('Home')
    })

    it('should work without slug parameter', () => {
      const pathname = Dashboard({})
      const result = getPageTitle(pathname)
      expect(result).toBe('Dashboard')
    })
  })

  describe('all admin routes', () => {
    it('should handle all admin routes correctly', () => {
      const adminRoutes = [
        { pathname: AdminUsers({}), expected: 'User Administration' },
        { pathname: AdminClients({}), expected: 'Manage Clients' },
        { pathname: AdminHealthPlans({}), expected: 'Manage Health Plans' },
        { pathname: AdminPhysicians({}), expected: 'Manage Physicians' },
      ]

      adminRoutes.forEach(({ pathname, expected }) => {
        expect(getPageTitle(pathname)).toBe(expected)
      })
    })
  })
})