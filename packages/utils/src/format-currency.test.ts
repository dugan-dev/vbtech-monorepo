import { describe, expect, it } from 'vitest'
import { formatCurrency } from './format-currency'

describe('formatCurrency', () => {
  describe('basic formatting', () => {
    it('should format a positive number as USD currency', () => {
      const result = formatCurrency({ value: 1234.56 })
      expect(result).toBe('$1,234.56')
    })

    it('should format a negative number as USD currency', () => {
      const result = formatCurrency({ value: -1234.56 })
      expect(result).toBe('-$1,234.56')
    })

    it('should format zero', () => {
      const result = formatCurrency({ value: 0 })
      expect(result).toBe('$0.00')
    })

    it('should format small decimal values', () => {
      const result = formatCurrency({ value: 0.01 })
      expect(result).toBe('$0.01')
    })

    it('should format large numbers with proper comma separation', () => {
      const result = formatCurrency({ value: 1234567.89 })
      expect(result).toBe('$1,234,567.89')
    })
  })

  describe('string input handling', () => {
    it('should handle valid string numbers', () => {
      const result = formatCurrency({ value: '1234.56' })
      expect(result).toBe('$1,234.56')
    })

    it('should handle string integers', () => {
      const result = formatCurrency({ value: '1234' })
      expect(result).toBe('$1,234.00')
    })

    it('should handle string with leading zeros', () => {
      const result = formatCurrency({ value: '0001234.56' })
      expect(result).toBe('$1,234.56')
    })

    it('should return original string for NaN values', () => {
      const result = formatCurrency({ value: 'not-a-number' })
      expect(result).toBe('not-a-number')
    })

    it('should return original string for empty string', () => {
      const result = formatCurrency({ value: '' })
      expect(result).toBe('')
    })

    it('should handle infinity values', () => {
      const result = formatCurrency({ value: 'Infinity' })
      expect(result).toBe('Infinity')
    })
  })

  describe('currency options', () => {
    it('should format as EUR currency', () => {
      const result = formatCurrency({ 
        value: 1234.56, 
        currency: 'EUR',
        locale: 'de-DE'
      })
      expect(result).toContain('1.234,56')
    })

    it('should format as GBP currency', () => {
      const result = formatCurrency({ 
        value: 1234.56, 
        currency: 'GBP',
        locale: 'en-GB'
      })
      expect(result).toContain('1,234.56')
    })

    it('should format as JPY currency (no decimals)', () => {
      const result = formatCurrency({ 
        value: 1234.56, 
        currency: 'JPY',
        locale: 'ja-JP'
      })
      expect(result).toContain('1,235')
    })
  })

  describe('custom options', () => {
    it('should respect minimumFractionDigits option', () => {
      const result = formatCurrency({ 
        value: 1234, 
        options: { minimumFractionDigits: 0 }
      })
      expect(result).toBe('$1,234')
    })

    it('should respect maximumFractionDigits option', () => {
      const result = formatCurrency({ 
        value: 1234.56789, 
        options: { maximumFractionDigits: 3 }
      })
      expect(result).toBe('$1,234.568')
    })

    it('should handle custom notation', () => {
      const result = formatCurrency({ 
        value: 1234567, 
        options: { notation: 'compact' as const }
      })
      expect(result).toContain('1')
    })
  })

  describe('edge cases', () => {
    it('should handle very large numbers', () => {
      const result = formatCurrency({ value: 999999999999.99 })
      expect(result).toBe('$999,999,999,999.99')
    })

    it('should handle very small positive numbers', () => {
      const result = formatCurrency({ value: 0.001 })
      expect(result).toBe('$0.00')
    })

    it('should handle negative zero', () => {
      const result = formatCurrency({ value: -0 })
      expect(result).toBe('$0.00')
    })

    it('should handle decimal precision edge cases', () => {
      const result = formatCurrency({ value: 1234.995 })
      expect(result).toBe('$1,235.00')
    })

    it('should round correctly', () => {
      const result = formatCurrency({ value: 1234.565 })
      expect(result).toBe('$1,234.57')
    })
  })

  describe('locale variations', () => {
    it('should format for French locale', () => {
      const result = formatCurrency({ 
        value: 1234.56,
        locale: 'fr-FR',
        currency: 'EUR'
      })
      expect(result).toContain('1')
      expect(result).toContain('234')
    })

    it('should format for Chinese locale', () => {
      const result = formatCurrency({ 
        value: 1234.56,
        locale: 'zh-CN',
        currency: 'CNY'
      })
      expect(result).toContain('1,234.56')
    })
  })
})