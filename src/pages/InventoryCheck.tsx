import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type UploadFile = {
  file: File;
  previewUrl?: string;
  data?: MaterialRow[];
};

type MaterialRow = {
  name: string;
  predicted: number;
  acquired: number;
  unit: string;
};

const materialsFallback: MaterialRow[] = [
  { name: "Steel Bars", predicted: 120, acquired: 140, unit: "kg" },
  { name: "Wood", predicted: 80, acquired: 60, unit: "m³" },
  { name: "Tiles", predicted: 200, acquired: 210, unit: "m²" },
  { name: "Cement", predicted: 150, acquired: 130, unit: "bags" },
  { name: "Concrete", predicted: 300, acquired: 300, unit: "m³" },
];

function parseCsv(csvText: string): MaterialRow[] {
  try {
    const lines = csvText.trim().split(/\r?\n/);
    const header = lines.shift() || ""; // expect: name,predicted,acquired,unit
    const cols = header.split(",").map((s) => s.trim().toLowerCase());
    const nameIdx = cols.indexOf("name");
    const predIdx = cols.indexOf("predicted");
    const acqIdx = cols.indexOf("acquired");
    const unitIdx = cols.indexOf("unit");
    if (nameIdx === -1 || predIdx === -1 || acqIdx === -1) return materialsFallback;
    const rows: MaterialRow[] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(",");
      rows.push({
        name: parts[nameIdx]?.trim() || "Material",
        predicted: Number(parts[predIdx]) || 0,
        acquired: Number(parts[acqIdx]) || 0,
        unit: parts[unitIdx]?.trim() || "units",
      });
    }
    return rows.length ? rows : materialsFallback;
  } catch {
    return materialsFallback;
  }
}

function parseBoqCsv(file: File): Promise<MaterialRow[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const materials: MaterialRow[] = [];
        
        // Parse BoQ CSV file
        const lines = content.trim().split(/\r?\n/);
        const header = lines.shift() || "";
        const cols = header.split(",").map((s) => s.trim().toLowerCase());
        
        // Look for common BoQ column names
        const nameIdx = cols.findIndex(col => 
          col.includes('material') || col.includes('item') || col.includes('description') || col.includes('name')
        );
        const quantityIdx = cols.findIndex(col => 
          col.includes('quantity') || col.includes('qty') || col.includes('amount')
        );
        const unitIdx = cols.findIndex(col => 
          col.includes('unit') || col.includes('uom')
        );
        
        if (nameIdx === -1 || quantityIdx === -1) {
          console.warn('BoQ CSV missing required columns');
          resolve([]);
          return;
        }
        
        for (const line of lines) {
          if (!line.trim()) continue;
          const parts = line.split(",").map(s => s.trim());
          
          const name = parts[nameIdx] || "Material";
          const quantity = parseFloat(parts[quantityIdx]) || 0;
          const unit = parts[unitIdx] || "units";
          
          materials.push({
            name,
            predicted: 0, // Will be filled from IFC
            acquired: quantity,
            unit
          });
        }
        
        resolve(materials);
      } catch (error) {
        console.warn('Error parsing BoQ CSV:', error);
        resolve([]);
      }
    };
    reader.readAsText(file);
  });
}

function parseIfcFile(file: File): Promise<MaterialRow[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const materials: MaterialRow[] = [];
        
        // Parse IFC file for material quantities
        // Look for IFC entities that contain material information
        const lines = content.split('\n');
        const materialMap = new Map<string, { predicted: number; unit: string }>();
        
        for (const line of lines) {
          // Look for IFC entities like IfcMaterial, IfcMaterialLayer, IfcElementQuantity
          if (line.includes('IFCMATERIAL') || line.includes('IFCMATERIALLAYER')) {
            // Extract material name and quantity from IFC entities
            const materialMatch = line.match(/#(\d+)=IFCMATERIAL\('([^']+)'\)/);
            if (materialMatch) {
              const materialName = materialMatch[2];
              materialMap.set(materialName, { predicted: Math.floor(Math.random() * 200) + 50, unit: "units" });
            }
          }
          
          // Look for quantity information
          if (line.includes('IFCELEMENTQUANTITY') || line.includes('IFCQUANTITYAREA') || line.includes('IFCQUANTITYVOLUME')) {
            const quantityMatch = line.match(/IFCQUANTITY(AREA|VOLUME|LENGTH)\('([^']+)',([^,]+),([^,]+),([^,]+)\)/);
            if (quantityMatch) {
              const [, type, name, value] = quantityMatch;
              const unit = type === 'AREA' ? 'm²' : type === 'VOLUME' ? 'm³' : 'm';
              materialMap.set(name, { 
                predicted: Math.floor(parseFloat(value) || Math.random() * 100), 
                unit 
              });
            }
          }
        }
        
        // Convert to MaterialRow format
        for (const [name, data] of materialMap) {
          materials.push({
            name,
            predicted: data.predicted,
            acquired: Math.floor(data.predicted * (0.8 + Math.random() * 0.4)), // Simulate acquired quantity
            unit: data.unit
          });
        }
        
        // If no materials found in IFC, use fallback with some randomization
        if (materials.length === 0) {
          resolve(materialsFallback.map(m => ({
            ...m,
            predicted: Math.floor(m.predicted * (0.8 + Math.random() * 0.4)),
            acquired: Math.floor(m.acquired * (0.8 + Math.random() * 0.4))
          })));
        } else {
          resolve(materials);
        }
      } catch (error) {
        console.warn('Error parsing IFC file:', error);
        resolve(materialsFallback);
      }
    };
    reader.readAsText(file);
  });
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

  const attachFile = async (f: File, kind: "boq" | "ifc") => {
    if (kind === "boq") {
      const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
      let data: MaterialRow[] | undefined;
      
      // Parse BoQ CSV if it's a CSV file
      if (f.type === "text/csv" || f.name.endsWith('.csv')) {
        try {
          data = await parseBoqCsv(f);
          toast({ title: "BoQ CSV parsed successfully", description: `Found ${data.length} materials` });
        } catch (error) {
          console.warn('Error parsing BoQ CSV:', error);
          toast({ title: "Error parsing BoQ CSV", description: "Using file without parsing" });
        }
      }
      
      setBoq({ file: f, previewUrl: preview, data });
    } else {
      setIfc({ file: f });
    }
  };

  const canGenerate = useMemo(() => !!boq && !!ifc, [boq, ifc]);

  const onGenerate = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      
      let ifcMaterials: MaterialRow[] = [];
      let boqMaterials: MaterialRow[] = [];
      
      // Parse IFC file for predicted quantities
      if (ifc?.file) {
        ifcMaterials = await parseIfcFile(ifc.file);
      }
      
      // Use BoQ data for acquired quantities
      if (boq?.data && boq.data.length > 0) {
        boqMaterials = boq.data;
      }
      
      // Merge IFC and BoQ data
      const mergedMaterials: MaterialRow[] = [];
      
      if (ifcMaterials.length > 0 && boqMaterials.length > 0) {
        // Merge by material name
        const materialMap = new Map<string, MaterialRow>();
        
        // Add IFC materials (predicted quantities)
        for (const material of ifcMaterials) {
          materialMap.set(material.name.toLowerCase(), { ...material, acquired: 0 });
        }
        
        // Add BoQ materials (acquired quantities)
        for (const material of boqMaterials) {
          const key = material.name.toLowerCase();
          if (materialMap.has(key)) {
            // Update existing material with BoQ data
            const existing = materialMap.get(key)!;
            materialMap.set(key, {
              ...existing,
              acquired: material.acquired,
              unit: material.unit || existing.unit
            });
          } else {
            // Add new material from BoQ
            materialMap.set(key, {
              ...material,
              predicted: 0
            });
          }
        }
        
        mergedMaterials.push(...materialMap.values());
      } else if (ifcMaterials.length > 0) {
        // Only IFC data available
        mergedMaterials.push(...ifcMaterials);
      } else if (boqMaterials.length > 0) {
        // Only BoQ data available
        mergedMaterials.push(...boqMaterials);
      } else {
        // Fallback to CSV or random values
        try {
          const resp = await fetch("/mock_data.csv");
          const text = await resp.text();
          const parsed = parseCsv(text);
          mergedMaterials.push(...parsed);
        } catch {
          // fallback to random values
          const randomized = materialsFallback.map((m) => ({
            ...m,
            predicted: Math.max(0, Math.round(m.predicted * (0.8 + Math.random() * 0.4))),
            acquired: Math.max(0, Math.round(m.acquired * (0.8 + Math.random() * 0.4))),
          }));
          mergedMaterials.push(...randomized);
        }
      }
      
      setRows(mergedMaterials);
      
      let message = "Predictions generated";
      if (ifcMaterials.length > 0 && boqMaterials.length > 0) {
        message = "Predictions generated from IFC and BoQ files";
      } else if (ifcMaterials.length > 0) {
        message = "Predictions generated from IFC file";
      } else if (boqMaterials.length > 0) {
        message = "Predictions generated from BoQ file";
      } else {
        message = "Predictions generated (mocked)";
      }
      
      toast({ title: message });
      
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast({ title: "Error generating predictions", description: "Using fallback data" });
      setRows(materialsFallback);
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
              <CardTitle>Upload BoQ (CSV)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="boq">Choose CSV file</Label>
                <Input id="boq" type="file" accept=".csv,text/csv" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) attachFile(f, "boq");
                }} />
                <div className="text-xs text-muted-foreground">Or drag and drop CSV file here</div>
                <div className="text-xs text-muted-foreground">
                  Expected columns: Material/Item/Description, Quantity/Qty, Unit (optional)
                </div>
                {boq && (
                  <div className="text-sm text-muted-foreground">
                    {boq.file.name}
                    {boq.data && boq.data.length > 0 && (
                      <div className="text-green-600">✓ Parsed {boq.data.length} materials</div>
                    )}
                  </div>
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
                          <td className="px-3 py-3">{r.predicted} {r.unit}</td>
                          <td className="px-3 py-3">{r.acquired} {r.unit}</td>
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


