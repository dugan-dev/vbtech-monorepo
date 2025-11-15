import { describe, expect, it } from 'vitest'
import { PhysicianFormSchema, PhysicianFormDefaultValues } from './physician-form-schema'

describe('PhysicianFormSchema', () => {
  describe('valid inputs', () => {
    it('should validate a complete valid physician form', () => {
      const validData = {
        name: 'Dr. John Smith',
        clients: ['client123456', 'client789012'],
        rateReview: 50.00,
        rateDenyWithdraw: 75.00,
        rateP2p: 100.00,
        notes: 'Experienced cardiologist',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Dr. John Smith')
        expect(result.data.clients).toEqual(['client123456', 'client789012'])
        expect(result.data.rateReview).toBe(50.00)
        expect(result.data.rateDenyWithdraw).toBe(75.00)
        expect(result.data.rateP2p).toBe(100.00)
        expect(result.data.notes).toBe('Experienced cardiologist')
        expect(result.data.isActive).toBe(true)
      }
    })

    it('should validate with minimum required fields', () => {
      const minimalData = {
        name: 'Dr. A',
        clients: ['client123456'],
        rateReview: 0.01,
        rateDenyWithdraw: 0.01,
        rateP2p: 0.01,
        notes: '',
        isActive: false,
      }

      const result = PhysicianFormSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })

    it('should coerce string numbers to numbers', () => {
      const dataWithStringNumbers = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: '50.00',
        rateDenyWithdraw: '75.50',
        rateP2p: '100',
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(dataWithStringNumbers)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.rateReview).toBe('number')
        expect(result.data.rateReview).toBe(50.00)
        expect(result.data.rateDenyWithdraw).toBe(75.50)
        expect(result.data.rateP2p).toBe(100)
      }
    })

    it('should transform empty notes string to undefined', () => {
      const dataWithEmptyNotes = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(dataWithEmptyNotes)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.notes).toBeUndefined()
      }
    })

    it('should accept maximum length name', () => {
      const longName = 'Dr. ' + 'A'.repeat(96) // Total 100 characters
      const data = {
        name: longName,
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept maximum length notes', () => {
      const longNotes = 'A'.repeat(1000)
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: longNotes,
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.notes).toBe(longNotes)
      }
    })

    it('should accept multiple clients', () => {
      const data = {
        name: 'Dr. Smith',
        clients: [
          'client123456',
          'client789012',
          'client345678',
          'client901234',
        ],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.clients).toHaveLength(4)
      }
    })
  })

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const data = {
        name: '',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required')
      }
    })

    it('should reject name exceeding 100 characters', () => {
      const tooLongName = 'Dr. ' + 'A'.repeat(97) // 101 characters
      const data = {
        name: tooLongName,
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty clients array', () => {
      const data = {
        name: 'Dr. Smith',
        clients: [],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required')
      }
    })

    it('should reject client IDs with incorrect length', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['short', 'toolongclientid'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject zero review rate', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 0,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least $0.01')
      }
    })

    it('should reject negative review rate', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: -50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive')
      }
    })

    it('should reject negative deny/withdraw rate', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: -75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject negative P2P rate', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: -100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject notes exceeding 1000 characters', () => {
      const tooLongNotes = 'A'.repeat(1001)
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: tooLongNotes,
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject non-boolean isActive', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: 'yes' as any,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject invalid rate formats', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 'not-a-number',
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('default values', () => {
    it('should have correct default values structure', () => {
      expect(PhysicianFormDefaultValues.name).toBe('')
      expect(PhysicianFormDefaultValues.clients).toEqual([])
      expect(PhysicianFormDefaultValues.rateReview).toBe('')
      expect(PhysicianFormDefaultValues.rateDenyWithdraw).toBe('')
      expect(PhysicianFormDefaultValues.rateP2p).toBe('')
      expect(PhysicianFormDefaultValues.notes).toBe('')
      expect(PhysicianFormDefaultValues.isActive).toBe(true)
    })

    it('should be valid after filling in required fields', () => {
      const filledData = {
        ...PhysicianFormDefaultValues,
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50,
        rateDenyWithdraw: 75,
        rateP2p: 100,
      }

      const result = PhysicianFormSchema.safeParse(filledData)
      expect(result.success).toBe(true)
    })
  })

  describe('edge cases and boundary values', () => {
    it('should accept rate of exactly 0.01', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 0.01,
        rateDenyWithdraw: 0.01,
        rateP2p: 0.01,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject rate of 0.009', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 0.009,
        rateDenyWithdraw: 75,
        rateP2p: 100,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should handle very large rates', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 999999.99,
        rateDenyWithdraw: 999999.99,
        rateP2p: 999999.99,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle decimal precision in rates', () => {
      const data = {
        name: 'Dr. Smith',
        clients: ['client123456'],
        rateReview: 50.555,
        rateDenyWithdraw: 75.999,
        rateP2p: 100.123,
        notes: '',
        isActive: true,
      }

      const result = PhysicianFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})