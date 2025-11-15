import { describe, expect, it } from 'vitest'
import { MAIN_SIDEBAR_CONFIG } from './main-sidebar-config'
import {
  AdminClients,
  AdminHealthPlans,
  AdminPhysicians,
  AdminUsers,
  Dashboard,
  Home,
} from '@/routes'

describe('MAIN_SIDEBAR_CONFIG', () => {
  describe('structure validation', () => {
    it('should have correct number of top-level items', () => {
      expect(MAIN_SIDEBAR_CONFIG).toHaveLength(3)
    })

    it('should have all required properties for each item', () => {
      MAIN_SIDEBAR_CONFIG.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('title')
        expect(item).toHaveProperty('icon')
      })
    })

    it('should have unique ids for all items', () => {
      const ids = MAIN_SIDEBAR_CONFIG.map(item => item.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('Home section', () => {
    it('should have Home as first item', () => {
      const homeItem = MAIN_SIDEBAR_CONFIG[0]
      expect(homeItem.id).toBe('1')
      expect(homeItem.title).toBe('Home')
      expect(homeItem.href).toBe(Home({}))
    })

    it('should not have isAdminOnly flag', () => {
      const homeItem = MAIN_SIDEBAR_CONFIG[0]
      expect(homeItem.isAdminOnly).toBeUndefined()
    })

    it('should not have items array', () => {
      const homeItem = MAIN_SIDEBAR_CONFIG[0]
      expect(homeItem.items).toBeUndefined()
    })
  })

  describe('Reporting section', () => {
    const reportingSection = MAIN_SIDEBAR_CONFIG[1]

    it('should have correct id and title', () => {
      expect(reportingSection.id).toBe('2')
      expect(reportingSection.title).toBe('Reporting')
    })

    it('should have items array', () => {
      expect(reportingSection.items).toBeDefined()
      expect(Array.isArray(reportingSection.items)).toBe(true)
    })

    it('should have Dashboard as sub-item', () => {
      const dashboardItem = reportingSection.items?.[0]
      expect(dashboardItem).toBeDefined()
      expect(dashboardItem?.id).toBe('2.1')
      expect(dashboardItem?.title).toBe('Dashboard')
      expect(dashboardItem?.href).toBe(Dashboard({}))
    })

    it('should have exactly one sub-item', () => {
      expect(reportingSection.items).toHaveLength(1)
    })
  })

  describe('Admin section', () => {
    const adminSection = MAIN_SIDEBAR_CONFIG[2]

    it('should have correct id and title', () => {
      expect(adminSection.id).toBe('3')
      expect(adminSection.title).toBe('Admin')
    })

    it('should be marked as admin only', () => {
      expect(adminSection.isAdminOnly).toBe(true)
    })

    it('should have items array with 4 sub-items', () => {
      expect(adminSection.items).toBeDefined()
      expect(adminSection.items).toHaveLength(4)
    })

    it('should have Users sub-item', () => {
      const usersItem = adminSection.items?.[0]
      expect(usersItem).toBeDefined()
      expect(usersItem?.id).toBe('3.1')
      expect(usersItem?.title).toBe('Users')
      expect(usersItem?.href).toBe(AdminUsers({}))
      expect(usersItem?.isAdminOnly).toBe(true)
    })

    it('should have Clients sub-item', () => {
      const clientsItem = adminSection.items?.[1]
      expect(clientsItem).toBeDefined()
      expect(clientsItem?.id).toBe('3.2')
      expect(clientsItem?.title).toBe('Clients')
      expect(clientsItem?.href).toBe(AdminClients({}))
      expect(clientsItem?.isAdminOnly).toBe(true)
    })

    it('should have Health Plans sub-item', () => {
      const healthPlansItem = adminSection.items?.[2]
      expect(healthPlansItem).toBeDefined()
      expect(healthPlansItem?.id).toBe('3.3')
      expect(healthPlansItem?.title).toBe('Health Plans')
      expect(healthPlansItem?.href).toBe(AdminHealthPlans({}))
      expect(healthPlansItem?.isAdminOnly).toBe(true)
    })

    it('should have Physicians sub-item', () => {
      const physiciansItem = adminSection.items?.[3]
      expect(physiciansItem).toBeDefined()
      expect(physiciansItem?.id).toBe('3.4')
      expect(physiciansItem?.title).toBe('Physicians')
      expect(physiciansItem?.href).toBe(AdminPhysicians({}))
      expect(physiciansItem?.isAdminOnly).toBe(true)
    })

    it('should have all sub-items marked as admin only', () => {
      adminSection.items?.forEach(item => {
        expect(item.isAdminOnly).toBe(true)
      })
    })

    it('should have unique ids for all sub-items', () => {
      const subItemIds = adminSection.items?.map(item => item.id) || []
      const uniqueIds = new Set(subItemIds)
      expect(uniqueIds.size).toBe(subItemIds.length)
    })

    it('should have icons for all sub-items', () => {
      adminSection.items?.forEach(item => {
        expect(item.icon).toBeDefined()
      })
    })
  })

  describe('id hierarchy', () => {
    it('should use consistent id pattern for nested items', () => {
      const reportingItems = MAIN_SIDEBAR_CONFIG[1].items || []
      reportingItems.forEach(item => {
        expect(item.id).toMatch(/^2\.\d+$/)
      })
    })

    it('should use consistent id pattern for admin items', () => {
      const adminItems = MAIN_SIDEBAR_CONFIG[2].items || []
      adminItems.forEach(item => {
        expect(item.id).toMatch(/^3\.\d+$/)
      })
    })
  })

  describe('icons', () => {
    it('should have icons for all top-level items', () => {
      MAIN_SIDEBAR_CONFIG.forEach(item => {
        expect(item.icon).toBeDefined()
        expect(typeof item.icon).toBe('function')
      })
    })

    it('should have icons for all nested items', () => {
      MAIN_SIDEBAR_CONFIG.forEach(section => {
        section.items?.forEach(item => {
          expect(item.icon).toBeDefined()
          expect(typeof item.icon).toBe('function')
        })
      })
    })
  })

  describe('route consistency', () => {
    it('should have valid href for all items with href', () => {
      const allItems = [
        MAIN_SIDEBAR_CONFIG[0],
        ...(MAIN_SIDEBAR_CONFIG[1].items || []),
        ...(MAIN_SIDEBAR_CONFIG[2].items || []),
      ]

      allItems.forEach(item => {
        if (item.href) {
          expect(typeof item.href).toBe('string')
          expect(item.href.length).toBeGreaterThan(0)
        }
      })
    })
  })
})