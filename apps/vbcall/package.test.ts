import { describe, it, expect } from 'vitest'
import pkg from './package.json' assert { type: 'json' }

describe('apps/vbcall/package.json', () => {
  it('should have the correct name field', () => {
    expect(pkg.name).toBe('vbcall')
  })

  it('should have a valid semver version', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(-.+)?$/)
  })

  it('should specify module type as "module"', () => {
    expect(pkg.type).toBe('module')
  })

  it('should include the expected scripts', () => {
    const keys = Object.keys(pkg.scripts)
    expect(keys).toEqual(
      expect.arrayContaining(['dev', 'build', 'start', 'lint'])
    )
  })

  it('should declare essential dependencies', () => {
    const deps = pkg.dependencies
    expect(deps).toHaveProperty('@aws-amplify/adapter-nextjs')
    expect(deps).toHaveProperty('@aws-sdk/client-cognito-identity-provider')
    expect(deps).toHaveProperty('next')
    expect(deps).toHaveProperty('react')
  })

  it('should not have an empty dependencies object', () => {
    expect(Object.keys(pkg.dependencies).length).toBeGreaterThan(0)
  })
})