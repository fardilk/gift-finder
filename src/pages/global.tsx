import React from 'react';
import Sidebar from 'src/shared/components/layout/sidebar';
import FloatingAiChat from 'src/shared/components/layout/aibox/FloatingAiChat';
import ProfileMenu from 'src/shared/components/layout/ProfileMenu';
import ChildMenu from 'src/shared/components/layout/ChildMenu';
import { MenuProvider } from 'src/shared/components/layout/MenuContext';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { isProfileComplete, getProfileCompletionMessage } from 'src/shared/utils/profileValidation';

type GlobalLayoutProps = {
    children: React.ReactNode;
};

export default function GlobalLayout({ children }: GlobalLayoutProps) {
    const { isAuthenticated, isGuest, user } = useAuth();
    const navigate = useNavigate();

    return (
        <MenuProvider>
            <div className="flex min-h-screen gap-6 bg-slate-50/70 p-6 text-slate-900">
                <Sidebar />

                <main className="flex flex-1 items-start gap-6 relative min-w-0">
                    {/* Content area takes remaining space */}
                    <div className="relative flex-1 min-w-0">
                        {(isAuthenticated || isGuest) && (
                            // Fixed so the topbar stays steady (does not move) while scrolling
                            <div className="fixed left-0 right-0 top-2 z-50 px-6 flex justify-between pointer-events-none">
                                <div
                                    className="pointer-events-auto"
                                    style={{ transform: 'translateX(19.5em)' }}
                                >
                                    <ChildMenu />
                                </div>
                                <div
                                    className="pointer-events-auto"
                                >
                                    <ProfileMenu />
                                </div>
                            </div>
                        )}

                        <div
                            className="flex flex-col rounded-3xl border border-purple-100 bg-white/80 p-8 shadow-lg shadow-purple-100/70 backdrop-blur w-full"
                            style={{ marginTop: '3em' }}
                        >
                            {children}
                        </div>
                    </div>

                </main>

                {/* Floating AI chat - visible only for signed-in users (not guest) */}
                {isAuthenticated && !isGuest && <FloatingAiChat />}
            </div>
        </MenuProvider>
    );
}

