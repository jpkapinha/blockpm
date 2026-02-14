"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Plus,
    Boxes,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "@/components/notifications/notifications-popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
    projects: { id: string; name: string; blockchain_focus: string | null }[];
    onNewProject: () => void;
}

const blockchainIcons: Record<string, string> = {
    ethereum: "Ξ",
    solana: "◎",
    polygon: "⬡",
    avalanche: "▲",
    arbitrum: "🔵",
    optimism: "🔴",
    base: "🔵",
    bnb: "◆",
};

export function Sidebar({ projects, onNewProject }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
    ];

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white bg-black/50 backdrop-blur-md border border-white/10">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r border-white/10 bg-[#0a0a0f] w-[280px]">
                        <SidebarContent
                            pathname={pathname}
                            collapsed={false}
                            setCollapsed={() => { }}
                            setMobileOpen={setMobileOpen}
                            session={session}
                            projects={projects}
                            onNewProject={onNewProject}
                            navItems={navItems}
                            isMobile={true}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex flex-col h-screen border-r border-white/[0.06] bg-[#0a0a0f] transition-all duration-300",
                    collapsed ? "w-[68px]" : "w-[260px]"
                )}
            >
                <div className="flex-1 flex flex-col h-full">
                    <SidebarContent
                        pathname={pathname}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        setMobileOpen={setMobileOpen}
                        session={session}
                        projects={projects}
                        onNewProject={onNewProject}
                        navItems={navItems}
                        isMobile={false}
                    />
                </div>
            </aside>
        </>
    );
}

interface SidebarContentProps {
    pathname: string;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    setMobileOpen: (open: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: any;
    projects: { id: string; name: string; blockchain_focus: string | null }[];
    onNewProject: () => void;
    navItems: { href: string; label: string; icon: any }[];
    isMobile: boolean;
}

function SidebarContent({
    pathname,
    collapsed,
    setCollapsed,
    setMobileOpen,
    session,
    projects,
    onNewProject,
    navItems,
    isMobile
}: SidebarContentProps) {
    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] border-r border-white/[0.06]">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-4">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
                        <Boxes className="h-4 w-4 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-base font-semibold text-white">BlockPM</span>
                    )}
                </Link>
                {!isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white/30 hover:text-white/60 hidden md:flex"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                collapsed && "rotate-180"
                            )}
                        />
                    </Button>
                )}
            </div>

            <Separator />

            {/* Nav */}
            <div className="px-3 py-3">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                            pathname === item.href
                                ? "bg-violet-600/15 text-violet-300"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setMobileOpen(false)}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </div>

            <Separator />

            {/* Projects */}
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    {!collapsed && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/30">
                            Projects
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/30 hover:text-violet-400"
                        onClick={onNewProject}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                </div>

                <ScrollArea className="h-full px-3 pb-4">
                    {projects.length === 0 ? (
                        !collapsed && (
                            <p className="px-3 text-xs text-white/20">No projects yet</p>
                        )
                    ) : (
                        <div className="space-y-1">
                            {projects.map((project) => {
                                const isActive = pathname.startsWith(
                                    `/project/${project.id}`
                                );
                                const chainIcon =
                                    blockchainIcons[
                                    project.blockchain_focus?.toLowerCase() || ""
                                    ] || "◈";

                                return (
                                    <Link
                                        key={project.id}
                                        href={`/project/${project.id}/overview`}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                            isActive
                                                ? "bg-violet-600/15 text-violet-300"
                                                : "text-white/50 hover:text-white hover:bg-white/5"
                                        )}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span className="shrink-0 text-base">{chainIcon}</span>
                                        {!collapsed && (
                                            <span className="truncate">{project.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <Separator />

            {/* User */}
            <div className="px-3 py-3">
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2",
                        collapsed && "justify-center"
                    )}
                >
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                            src={session?.user?.image || ""}
                            alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-white/30 truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    )}
                    {!collapsed && (
                        <div className="flex items-center gap-1">
                            <div className="h-7 w-7 flex items-center justify-center">
                                <NotificationsPopover />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-white/30 hover:text-red-400"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                <LogOut className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
