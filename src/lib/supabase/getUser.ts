import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) redirect('/login')

    return {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name,
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        emailVerified: user.user_metadata?.email_verified,
    }

}