import { describe, expect, it } from 'vitest'
import { CaseFormSchema, CaseFormDefaultValues } from './case-form-schema'

describe('CaseFormSchema', () => {
  describe('valid inputs', () => {
    it('should validate a complete valid case form', () => {
      const validData = {
        assignedTo: 'user123',
        caseId: 'CASE-2024-001',
        clientPubId: 'client123456',
        planPubId: 'plan12345678',
        procedureCode: 'CPT-12345',
        status: 'Under Review',
        followUpAction: 'Pending physician review',
        p2pSuccessful: 'Yes',
        escalatedToMD: 'Yes',
        mdName: 'Dr. Jane Doe',
        remarks: 'Urgent case requiring immediate attention',
      }

      const result = CaseFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toMatchObject(validData)
      }
    })

    it('should validate with minimum required fields', () => {
      const minimalData = {
        assignedTo: 'u',
        caseId: 'C',
        clientPubId: 'c',
        planPubId: 'p',
        procedureCode: 'P',
        status: 'S',
        followUpAction: 'F',
        p2pSuccessful: 'N',
        escalatedToMD: 'N',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })

    it('should transform empty mdName to undefined', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: 'Test',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.mdName).toBeUndefined()
      }
    })

    it('should transform empty remarks to undefined', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: 'Dr. Smith',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.remarks).toBeUndefined()
      }
    })

    it('should accept maximum length caseId (255 chars)', () => {
      const longCaseId = 'CASE-' + 'A'.repeat(250)
      const data = {
        assignedTo: 'user123',
        caseId: longCaseId,
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept maximum length procedureCode (255 chars)', () => {
      const longCode = 'CPT-' + 'A'.repeat(251)
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: longCode,
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept maximum length mdName (255 chars)', () => {
      const longName = 'Dr. ' + 'A'.repeat(251)
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'Yes',
        escalatedToMD: 'Yes',
        mdName: longName,
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept maximum length remarks (255 chars)', () => {
      const longRemarks = 'A'.repeat(255)
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: longRemarks,
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle various status values', () => {
      const statuses = ['Not reviewed', 'Under Review', 'Approved', 'Denied', 'Pending']
      
      statuses.forEach(status => {
        const data = {
          assignedTo: 'user123',
          caseId: 'CASE-001',
          clientPubId: 'client123',
          planPubId: 'plan123',
          procedureCode: 'CPT-001',
          status,
          followUpAction: 'Review',
          p2pSuccessful: 'No',
          escalatedToMD: 'No',
          mdName: '',
          remarks: '',
        }

        const result = CaseFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should handle Yes/No values for boolean-like fields', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'N/A',
        p2pSuccessful: 'Yes',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.p2pSuccessful).toBe('Yes')
        expect(result.data.escalatedToMD).toBe('No')
      }
    })
  })

  describe('invalid inputs', () => {
    it('should reject empty assignedTo', () => {
      const data = {
        assignedTo: '',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required')
      }
    })

    it('should reject empty caseId', () => {
      const data = {
        assignedTo: 'user123',
        caseId: '',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject caseId exceeding 255 characters', () => {
      const tooLongCaseId = 'CASE-' + 'A'.repeat(251)
      const data = {
        assignedTo: 'user123',
        caseId: tooLongCaseId,
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty clientPubId', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: '',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty planPubId', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: '',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty procedureCode', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: '',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject procedureCode exceeding 255 characters', () => {
      const tooLongCode = 'CPT-' + 'A'.repeat(252)
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: tooLongCode,
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty status', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: '',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty followUpAction', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: '',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty p2pSuccessful', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: '',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty escalatedToMD', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: '',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject mdName exceeding 255 characters', () => {
      const tooLongName = 'Dr. ' + 'A'.repeat(252)
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'Yes',
        escalatedToMD: 'Yes',
        mdName: tooLongName,
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject remarks exceeding 255 characters', () => {
      const tooLongRemarks = 'A'.repeat(256)
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: tooLongRemarks,
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const incompleteData = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        // Missing other required fields
      }

      const result = CaseFormSchema.safeParse(incompleteData)
      expect(result.success).toBe(false)
    })
  })

  describe('default values', () => {
    it('should have correct default values structure', () => {
      expect(CaseFormDefaultValues).toEqual({
        assignedTo: '',
        caseId: '',
        clientPubId: '',
        planPubId: '',
        procedureCode: '',
        status: 'Not reviewed',
        followUpAction: 'N/A',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      })
    })

    it('should have sensible defaults for status-like fields', () => {
      expect(CaseFormDefaultValues.status).toBe('Not reviewed')
      expect(CaseFormDefaultValues.followUpAction).toBe('N/A')
      expect(CaseFormDefaultValues.p2pSuccessful).toBe('No')
      expect(CaseFormDefaultValues.escalatedToMD).toBe('No')
    })

    it('should be valid after filling in required identifiers', () => {
      const filledData = {
        ...CaseFormDefaultValues,
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
      }

      const result = CaseFormSchema.safeParse(filledData)
      expect(result.success).toBe(true)
    })
  })

  describe('edge cases and special characters', () => {
    it('should handle special characters in caseId', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-2024-001/ABC-#123',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: '',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle unicode characters in remarks', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: 'Patient has café allergy 🏥',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should handle newlines in remarks', () => {
      const data = {
        assignedTo: 'user123',
        caseId: 'CASE-001',
        clientPubId: 'client123',
        planPubId: 'plan123',
        procedureCode: 'CPT-001',
        status: 'New',
        followUpAction: 'Review',
        p2pSuccessful: 'No',
        escalatedToMD: 'No',
        mdName: '',
        remarks: 'Line 1\nLine 2\nLine 3',
      }

      const result = CaseFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})