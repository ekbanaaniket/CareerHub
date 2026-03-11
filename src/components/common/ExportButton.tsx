// ============= Export Button =============
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  headers?: string[];
}

export function ExportButton({ data, filename, headers }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }

    const keys = headers ?? Object.keys(data[0]);
    const csvRows = [
      keys.join(","),
      ...data.map((row) =>
        keys.map((key) => {
          const val = String(row[key] ?? "");
          return val.includes(",") ? `"${val}"` : val;
        }).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export successful", description: `${data.length} records exported to ${filename}.csv` });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="w-4 h-4 mr-1" /> Export
    </Button>
  );
}
