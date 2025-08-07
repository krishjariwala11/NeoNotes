import { useState } from "react";
import { 
  Home, 
  FileText, 
  Search, 
  Settings, 
  User, 
  Plus, 
  Zap,
  Archive,
  Star,
  Trash
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  onCreateNote?: () => void;
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

const mainItems = [
  { id: "dashboard", title: "Dashboard", icon: Home },
  { id: "notes", title: "All Notes", icon: FileText },
  { id: "search", title: "Search", icon: Search },
  { id: "starred", title: "Starred", icon: Star },
  { id: "archive", title: "Archive", icon: Archive },
];

const settingsItems = [
  { id: "profile", title: "Profile", icon: User },
  { id: "settings", title: "Settings", icon: Settings },
  { id: "trash", title: "Trash", icon: Trash },
];

export function AppSidebar({ onCreateNote, onNavigate, activeSection = "dashboard" }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const handleNavigation = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <Sidebar className="border-r border-border-secondary bg-surface">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-lg font-bold text-terminal-green">NeoNote</div>
              <div className="text-xs text-terminal-green-dim">[RETRO-FUTURE_NOTES_v2.1]</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-neon-green">
            {!isCollapsed && "&gt; MAIN_MODULES"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full justify-start ${
                      activeSection === item.id
                        ? "bg-neon-green bg-opacity-20 border border-neon-green text-neon-green"
                        : "text-terminal-green-dim hover:text-neon-green hover:bg-surface-elevated"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>[{item.title.toUpperCase()}]</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-neon-cyan">
            {!isCollapsed && "&gt; ACTIONS"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onCreateNote}
                  className="w-full justify-start text-terminal-green-dim hover:text-neon-green hover:bg-surface-elevated"
                >
                  <Plus className="w-4 h-4" />
                  {!isCollapsed && <span>[NEW_NOTE]</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-neon-purple">
            {!isCollapsed && "&gt; PREFERENCES"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full justify-start ${
                      activeSection === item.id
                        ? "bg-neon-purple bg-opacity-20 border border-neon-purple text-neon-purple"
                        : "text-terminal-green-dim hover:text-neon-green hover:bg-surface-elevated"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>[{item.title.toUpperCase()}]</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!isCollapsed && (
          <div className="space-y-3">
            <div className="text-xs text-neon-green">
              &gt; NEURAL_STATUS: ONLINE
            </div>
            <div className="text-xs text-terminal-green-dim">
              User: {user?.email?.split('@')[0] || 'unknown'}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}