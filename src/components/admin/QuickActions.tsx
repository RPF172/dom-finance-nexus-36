import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Users, 
  BookOpen, 
  Plus, 
  Settings, 
  Download 
} from "lucide-react";
import JsonQuickAdd from "./JsonQuickAdd";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Review Applications",
      icon: FileText,
      onClick: () => navigate("/admin/applications"),
      variant: "default" as const,
    },
    {
      label: "Create Lesson",
      icon: Plus,
      onClick: () => navigate("/admin/content/new"),
      variant: "secondary" as const,
    },
    {
      label: "Manage Students",
      icon: Users,
      onClick: () => navigate("/admin/students"),
      variant: "outline" as const,
    },
    {
      label: "Content Library",
      icon: BookOpen,
      onClick: () => navigate("/admin/content"),
      variant: "outline" as const,
    },
    {
      label: "Export Data",
      icon: Download,
      onClick: () => {
        // TODO: Implement export functionality
        console.log("Export data");
      },
      variant: "ghost" as const,
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => navigate("/admin/settings"),
      variant: "ghost" as const,
    },
  ];

  return (
    <div className="space-y-2">
      <JsonQuickAdd />
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          className="w-full justify-start"
          onClick={action.onClick}
        >
          <action.icon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;