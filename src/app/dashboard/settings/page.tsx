import { getUser } from '@/utils/supabase/getUser'
import UserProfile from '@/components/userProfile'
import LogoutButton from '@/components/logoutButton'
import ThemeToggle from '@/components/themeToggle'

export default async function SettingsPage() {
    const user = await getUser()

    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-full text-white bg-[#08080A]">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-gray-400 mt-2">Manage your account preferences and system configuration.</p>
                </header>

                <div className="space-y-6 pt-4">
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider ml-1">Account</h2>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-white/20">
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
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider ml-1">Preference</h2>
                        <div className="ml-1 pt-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}