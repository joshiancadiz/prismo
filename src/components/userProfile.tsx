import Image from 'next/image'

interface UserProfileProps {
    fullName: string
    email: string
    avatarUrl?: string
}

export default function UserProfile({ fullName, email, avatarUrl }: UserProfileProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar */}
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={50}
                    height={50}
                    style={{ borderRadius: '50%' }}
                />
            ) : (
                // Fallback if no profile picture
                <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                }}>
                    {fullName?.charAt(0).toUpperCase()}  {/* Show first letter as fallback */}
                </div>
            )}

            {/* Info */}
            <div>
                <p style={{ fontWeight: 'bold' }}>{fullName}</p>
                <p style={{ color: 'gray', fontSize: '14px' }}>{email}</p>
            </div>
        </div>
    )
}