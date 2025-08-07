import { useState,useEffect } from "react";
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

// function ClockDisplay() {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime(new Date());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const formatNumber = (n: number) => n.toString().padStart(2, "0");

//   const hours = formatNumber(time.getHours());
//   const minutes = formatNumber(time.getMinutes());
//   const seconds = formatNumber(time.getSeconds());
//   const date = time.toDateString();

//   return (
//     <div className="text-neon-green text-xs space-y-1">
//       <div>&gt; TIME: {hours}:{minutes}:{seconds}</div>
//       <div>&gt; DATE: {date}</div>
//       <div className="text-terminal-green-dim">:: SYSTEM ONLINE ::</div>
//     </div>
//   );
// }

function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="relative w-32 h-32 border-4 border-neon-green rounded-full">
      {/* Hour hand */}
      <div
        className="absolute w-1 h-10 bg-neon-green origin-bottom left-1/2 top-6"
        style={{ transform: `rotate(${hourDeg}deg) translateX(-50%)` }}
      />
      {/* Minute hand */}
      <div
        className="absolute w-1 h-14 bg-neon-cyan origin-bottom left-1/2 top-2"
        style={{ transform: `rotate(${minuteDeg}deg) translateX(-50%)` }}
      />
      {/* Second hand */}
      <div
        className="absolute w-0.5 h-16 bg-neon-purple origin-bottom left-1/2 top-0"
        style={{ transform: `rotate(${secondDeg}deg) translateX(-50%)` }}
      />
      {/* Center dot */}
      <div className="absolute w-3 h-3 bg-neon-green rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

function Spaceship() {
  return (
    <div className="relative w-32 h-32 animate-float">
      {/* Spaceship body */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-10 h-20 bg-neon-purple rounded-full shadow-lg shadow-neon-purple/40" />

      {/* Cockpit */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-neon-cyan rounded-full shadow-md shadow-neon-cyan/50" />

      {/* Wings */}
      <div className="absolute top-12 left-[10px] w-4 h-10 bg-neon-green transform -rotate-45 rounded-sm shadow-neon-green/40" />
      <div className="absolute top-12 right-[10px] w-4 h-10 bg-neon-green transform rotate-45 rounded-sm shadow-neon-green/40" />

      {/* Thruster flame */}
      <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-2 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-md shadow-yellow-400/40" />
    </div>
  );
}

function MatrixEffect() {
  const columns = 7;
  const characters = "01";
  const [glitter, setGlitter] = useState(
    Array.from({ length: columns }, () => Math.floor(Math.random() * 10))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitter(
        Array.from({ length: columns }, () => Math.floor(Math.random() * 10))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-32 h-32 grid grid-cols-8 gap-[1px] bg-black border border-neon-green p-1 rounded shadow-inner shadow-neon-green/30">
      {glitter.map((_, colIndex) =>
        Array.from({ length: 8 }).map((_, rowIndex) => (
          <span
            key={`${colIndex}-${rowIndex}`}
            className="text-neon-green text-xs font-mono animate-pulse"
          >
            {characters[Math.floor(Math.random() * characters.length)]}
          </span>
        ))
      )}
    </div>
  );
}


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
        {/* <SidebarGroup>
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
                        // ? "bg-neon-green bg-opacity-20 border border-neon-green text-neon-green"
                        ? "bg-green-900 border border-green-600 text-green-300"
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
        </SidebarGroup> */}

        <SidebarGroup>
  <SidebarGroupLabel className="text-neon-green">
    {!isCollapsed && "> MATRIX_STREAM"}
  </SidebarGroupLabel>
  <SidebarGroupContent>
    {!isCollapsed && (
      <div className="flex justify-center p-4">
        <MatrixEffect />
      </div>
    )}
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

        {/* <SidebarGroup>
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
                        // ? "bg-neon-purple bg-opacity-20 border border-neon-purple text-neon-purple"
                        ? "bg-purple-900 border border-purple-600 text-purple-300"
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
        </SidebarGroup> */}

        <SidebarGroup>
  <SidebarGroupLabel className="text-neon-purple">
    {!isCollapsed && "> MATRIX_CLOCK"}
  </SidebarGroupLabel>
  <SidebarGroupContent>
    {!isCollapsed && (
      // <div className="flex justify-center p-4">
      //   <AnalogClock />
      // </div>

      <div className="flex flex-col items-center p-4 space-y-2">
  <AnalogClock />
  <div className="text-xs text-neon-green font-mono">
    {new Date().toDateString()}
  </div>
</div>
    )}
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