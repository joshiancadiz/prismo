import { getUser } from '@/lib/supabase/getUser'
import UserProfile from '@/components/userProfile'
import LogoutButton from '@/components/logoutButton'
import ThemeToggle from '@/components/themeToggle'

export default async function SettingsPage() {
    const user = await getUser()

    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-full text-foreground bg-background">
            <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
                    <p className="text-muted mt-2">Manage your account preferences and system configuration.</p>
                </header>

                <div className="space-y-6 pt-4">
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider ml-1">Account</h2>

                        <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-foreground/15">
                            <UserProfile
                                fullName={user.fullName || 'User'}
                                email={user.email || ''}
                                avatarUrl={user.avatarUrl}
                            />
                            <div className="shrink-0 w-full md:w-auto">
                                <LogoutButton />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider ml-1">Preference</h2>
                        <div className="ml-1 pt-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}