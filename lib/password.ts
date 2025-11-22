export interface PasswordRequirement {
    label: string
    test: (password: string) => boolean
    passed?: boolean
}

export const passwordRequirements: PasswordRequirement[] = [
    {
        label: 'At least 8 characters',
        test: (pw) => pw.length >= 8,
    },
    {
        label: 'At least one uppercase letter',
        test: (pw) => /[A-Z]/.test(pw),
    },
    {
        label: 'At least one lowercase letter',
        test: (pw) => /[a-z]/.test(pw),
    },
    {
        label: 'At least one number',
        test: (pw) => /[0-9]/.test(pw),
    },
    {
        label: 'At least one special character (!@#$%^&*)',
        test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
    },
]

export function validatePasswordStrength(password: string): boolean {
    return passwordRequirements.every((req) => req.test(password))
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
    return passwordRequirements.map((req) => ({
        ...req,
        passed: req.test(password),
    }))
}

export function getPasswordStrengthScore(password: string): number {
    const passedCount = passwordRequirements.filter((req) => req.test(password)).length
    return Math.floor((passedCount / passwordRequirements.length) * 4)
}
