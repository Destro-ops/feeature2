import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type UploadFile = {
  file: File;
  previewUrl?: string;
};

type MaterialRow = {
  name: string;
  predicted: number;
  acquired: number;
};

const materialsFallback: MaterialRow[] = [
  { name: "Steel Bars", predicted: 120, acquired: 140 },
  { name: "Wood", predicted: 80, acquired: 60 },
  { name: "Tiles", predicted: 200, acquired: 210 },
  { name: "Cement", predicted: 150, acquired: 130 },
  { name: "Concrete", predicted: 300, acquired: 300 },
];

function parseCsv(csvText: string): MaterialRow[] {
  try {
    const lines = csvText.trim().split(/\r?\n/);
    const header = lines.shift() || ""; // expect: name,predicted,acquired
    const cols = header.split(",").map((s) => s.trim().toLowerCase());
    const nameIdx = cols.indexOf("name");
    const predIdx = cols.indexOf("predicted");
    const acqIdx = cols.indexOf("acquired");
    if (nameIdx === -1 || predIdx === -1 || acqIdx === -1) return materialsFallback;
    const rows: MaterialRow[] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(",");
      rows.push({
        name: parts[nameIdx]?.trim() || "Material",
        predicted: Number(parts[predIdx]) || 0,
        acquired: Number(parts[acqIdx]) || 0,
      });
    }
    return rows.length ? rows : materialsFallback;
  } catch {
    return materialsFallback;
  }
}

function classify(predicted: number, acquired: number): "Surplus" | "Balanced" | "Shortage" {
  const diff = acquired - predicted;
  const tolerance = Math.max(1, Math.round(predicted * 0.05));
  if (diff > tolerance) return "Surplus";
  if (Math.abs(diff) <= tolerance) return "Balanced";
  return "Shortage";
}

const InventoryCheck = () => {
  const [boq, setBoq] = useState<UploadFile | null>(null);
  const [ifc, setIfc] = useState<UploadFile | null>(null);
  const [dragOverBoq, setDragOverBoq] = useState(false);
  const [dragOverIfc, setDragOverIfc] = useState(false);
  const [rows, setRows] = useState<MaterialRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    kind: "boq" | "ifc",
  ) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    attachFile(f, kind);
    if (kind === "boq") setDragOverBoq(false);
    else setDragOverIfc(false);
  };

  const attachFile = (f: File, kind: "boq" | "ifc") => {
    if (kind === "boq") {
      const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
      setBoq({ file: f, previewUrl: preview });
    } else {
      setIfc({ file: f });
    }
  };

  const canGenerate = useMemo(() => !!boq && !!ifc, [boq, ifc]);

  const onGenerate = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const resp = await fetch("/mock_data.csv");
      const text = await resp.text();
      const parsed = parseCsv(text);
      setRows(parsed);
      toast({ title: "Predictions generated" });
    } catch {
      // fallback to random values
      const randomized = materialsFallback.map((m) => ({
        ...m,
        predicted: Math.max(0, Math.round(m.predicted * (0.8 + Math.random() * 0.4))),
        acquired: Math.max(0, Math.round(m.acquired * (0.8 + Math.random() * 0.4))),
      }));
      setRows(randomized);
      toast({ title: "Predictions generated (mocked)" });
    } finally {
      setLoading(false);
    }
  };

  const actionClick = (intent: "buy" | "sell") => {
    toast({ title: "Redirecting to Marketplace...", description: intent === "buy" ? "Buying flow" : "Selling flow" });
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory Check</h1>
          <Button variant="secondary" onClick={() => (window.location.href = "/marketplace")}>Back to Marketplace</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={"border-dashed " + (dragOverBoq ? "ring-2 ring-primary" : "")}
            onDragOver={(e) => { e.preventDefault(); setDragOverBoq(true); }}
            onDragLeave={() => setDragOverBoq(false)}
            onDrop={(e) => handleDrop(e, "boq")}
          >
            <CardHeader>
              <CardTitle>Upload BoQ (image/pdf)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="boq">Choose file</Label>
                <Input id="boq" type="file" accept="image/*,.pdf" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) attachFile(f, "boq");
                }} />
                <div className="text-xs text-muted-foreground">Or drag and drop here</div>
                {boq?.previewUrl && (
                  <img src={boq.previewUrl} alt="BoQ preview" className="mt-2 max-h-48 rounded-md border" />
                )}
                {!boq?.previewUrl && boq && (
                  <div className="text-sm text-muted-foreground">{boq.file.name}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={"border-dashed " + (dragOverIfc ? "ring-2 ring-primary" : "")}
            onDragOver={(e) => { e.preventDefault(); setDragOverIfc(true); }}
            onDragLeave={() => setDragOverIfc(false)}
            onDrop={(e) => handleDrop(e, "ifc")}
          >
            <CardHeader>
              <CardTitle>Upload IFC (.ifc)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="ifc">Choose file</Label>
                <Input id="ifc" type="file" accept=".ifc" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) attachFile(f, "ifc");
                }} />
                <div className="text-xs text-muted-foreground">Or drag and drop here</div>
                {ifc && (
                  <div className="text-sm text-muted-foreground">{ifc.file.name}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button disabled={!canGenerate || loading} onClick={onGenerate}>{loading ? "Generating..." : "Generate Predictions"}</Button>
        </div>

        {rows && (
          <Card>
            <CardHeader>
              <CardTitle>Predicted Material Quantities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-muted-foreground">
                      <th className="px-3 py-2">Material Name</th>
                      <th className="px-3 py-2">Predicted Quantity</th>
                      <th className="px-3 py-2">Acquired Quantity</th>
                      <th className="px-3 py-2">Final Prediction</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => {
                      const status = classify(r.predicted, r.acquired);
                      const color = status === "Surplus" ? "bg-emerald-50 text-emerald-900" : status === "Shortage" ? "bg-rose-50 text-rose-900" : "bg-gray-50 text-gray-900";
                      return (
                        <tr key={idx} className={"border-t " + color}>
                          <td className="px-3 py-3 font-medium">{r.name}</td>
                          <td className="px-3 py-3">{r.predicted}</td>
                          <td className="px-3 py-3">{r.acquired}</td>
                          <td className="px-3 py-3 font-semibold">{status}</td>
                          <td className="px-3 py-3">
                            {status === "Surplus" && (
                              <Button size="sm" variant="secondary" onClick={() => actionClick("sell")}>Sell to Marketplace</Button>
                            )}
                            {status === "Shortage" && (
                              <Button size="sm" onClick={() => actionClick("buy")}>Buy from Marketplace</Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryCheck;


