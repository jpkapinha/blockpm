"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const blockchains = [
    { value: "ethereum", label: "Ethereum", icon: "Ξ" },
    { value: "solana", label: "Solana", icon: "◎" },
    { value: "polygon", label: "Polygon", icon: "⬡" },
    { value: "avalanche", label: "Avalanche", icon: "▲" },
    { value: "arbitrum", label: "Arbitrum", icon: "🔵" },
    { value: "optimism", label: "Optimism", icon: "🔴" },
    { value: "base", label: "Base", icon: "🔵" },
    { value: "bnb", label: "BNB Chain", icon: "◆" },
    { value: "multichain", label: "Multi-chain", icon: "◈" },
];

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (project: {
        name: string;
        description: string;
        blockchain_focus: string;
    }) => void;
}

export function CreateProjectModal({
    open,
    onOpenChange,
    onSubmit,
}: CreateProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [blockchainFocus, setBlockchainFocus] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !blockchainFocus) return;
        onSubmit({
            name: name.trim(),
            description: description.trim(),
            blockchain_focus: blockchainFocus,
        });
        setName("");
        setDescription("");
        setBlockchainFocus("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Set up a new blockchain product project. Your AI agents will start
                        building context immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. DeFi Yield Optimizer v2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the product..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Blockchain Focus</Label>
                        <Select value={blockchainFocus} onValueChange={setBlockchainFocus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a blockchain" />
                            </SelectTrigger>
                            <SelectContent>
                                {blockchains.map((chain) => (
                                    <SelectItem key={chain.value} value={chain.value}>
                                        <span className="flex items-center gap-2">
                                            <span>{chain.icon}</span>
                                            <span>{chain.label}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim() || !blockchainFocus}>
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
