import Image from 'next/image'

interface UserProfileProps {
    fullName: string
    email: string
    avatarUrl?: string
}

export default function UserProfile({ fullName, email, avatarUrl }: UserProfileProps) {
    return (
        <div className="flex items-center gap-3">
            {/* Avatar */}
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={50}
                    height={50}
                    className="rounded-full"
                />
            ) : (
                // Fallback if no profile picture
                <div className="w-[50px] h-[50px] rounded-full bg-foreground/20 flex items-center justify-center font-bold text-foreground">
                    {fullName?.charAt(0).toUpperCase()}  {/* Show first letter as fallback */}
                </div>
            )}

            {/* Info */}
            <div>
                <p className="font-bold text-foreground">{fullName}</p>
                <p className="text-muted text-sm">{email}</p>
            </div>
        </div>
    )
}