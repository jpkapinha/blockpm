"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { CreateProjectModal } from "@/components/projects/create-project-modal";

// Mock projects for development — will use Supabase later
const mockProjects: { id: string; name: string; blockchain_focus: string | null }[] = [];

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [projects, setProjects] = useState(mockProjects);

    const handleCreateProject = (project: {
        name: string;
        description: string;
        blockchain_focus: string;
    }) => {
        const newProject = {
            id: crypto.randomUUID(),
            name: project.name,
            blockchain_focus: project.blockchain_focus,
        };
        setProjects((prev) => [...prev, newProject]);
        setShowCreateModal(false);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                projects={projects}
                onNewProject={() => setShowCreateModal(true)}
            />
            <main className="flex-1 overflow-y-auto">
                <div className="ambient-glow min-h-full">
                    {children}
                </div>
            </main>

            <CreateProjectModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onSubmit={handleCreateProject}
            />
        </div>
    );
}
