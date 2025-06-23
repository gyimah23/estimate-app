
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowLeft, Save, FileText } from 'lucide-react';
import { Estimate, Material, Labor } from '../types/Estimate';

interface EstimateFormProps {
  estimate?: Estimate | null;
  onSave: (estimate: Estimate) => void;
  onCancel: () => void;
}

const EstimateForm = ({ estimate, onSave, onCancel }: EstimateFormProps) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labor, setLabor] = useState<Labor[]>([]);
  const [taxRate, setTaxRate] = useState(8.5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (estimate) {
      setProjectTitle(estimate.projectTitle);
      setClientName(estimate.clientName);
      setClientAddress(estimate.clientAddress);
      setMaterials(estimate.materials);
      setLabor(estimate.labor);
      setTaxRate(estimate.taxRate);
      setNotes(estimate.notes || '');
    }
  }, [estimate]);

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitCost: 0,
      total: 0
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        const updated = { ...material, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updated.total = updated.quantity * updated.unitCost;
        }
        return updated;
      }
      return material;
    }));
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const addLabor = () => {
    const newLabor: Labor = {
      id: Date.now().toString(),
      description: '',
      hours: 1,
      hourlyRate: 65,
      total: 65
    };
    setLabor([...labor, newLabor]);
  };

  const updateLabor = (id: string, field: keyof Labor, value: string | number) => {
    setLabor(labor.map(laborItem => {
      if (laborItem.id === id) {
        const updated = { ...laborItem, [field]: value };
        if (field === 'hours' || field === 'hourlyRate') {
          updated.total = updated.hours * updated.hourlyRate;
        }
        return updated;
      }
      return laborItem;
    }));
  };

  const removeLabor = (id: string) => {
    setLabor(labor.filter(laborItem => laborItem.id !== id));
  };

  const calculateTotals = () => {
    const materialsCost = materials.reduce((sum, material) => sum + material.total, 0);
    const laborCost = labor.reduce((sum, laborItem) => sum + laborItem.total, 0);
    const subtotal = materialsCost + laborCost;
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    return { materialsCost, laborCost, subtotal, taxAmount, grandTotal };
  };

  const handleSave = () => {
    const { materialsCost, laborCost, subtotal, taxAmount, grandTotal } = calculateTotals();
    
    const estimateData: Estimate = {
      id: estimate?.id || Date.now().toString(),
      projectTitle,
      clientName,
      clientAddress,
      date: estimate?.date || new Date().toISOString().split('T')[0],
      materials,
      labor,
      materialsCost,
      laborCost,
      subtotal,
      taxRate,
      taxAmount,
      grandTotal,
      notes
    };

    onSave(estimateData);
  };

  const { materialsCost, laborCost, subtotal, taxAmount, grandTotal } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {estimate ? 'Edit Estimate' : 'New Estimate'}
              </h1>
              <p className="text-muted-foreground">Create professional electrical estimates</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} className="electric-gradient text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Estimate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Basic details about the electrical project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      placeholder="Kitchen Rewiring Project"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="John Smith"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label html-for="clientAddress">Client Address</Label>
                  <Input
                    id="clientAddress"
                    placeholder="123 Main Street, City, State 12345"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Materials</CardTitle>
                    <CardDescription>Add electrical materials and supplies</CardDescription>
                  </div>
                  <Button onClick={addMaterial} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <div key={material.id} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4">
                        <Label>Material Name</Label>
                        <Input
                          placeholder="12 AWG Wire"
                          value={material.name}
                          onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Unit Cost</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={material.unitCost}
                          onChange={(e) => updateMaterial(material.id, 'unitCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Total</Label>
                        <Input
                          value={`$${material.total.toFixed(2)}`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {materials.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No materials added yet. Click "Add Material" to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Labor */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Labor</CardTitle>
                    <CardDescription>Add labor costs and time estimates</CardDescription>
                  </div>
                  <Button onClick={addLabor} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Labor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labor.map((laborItem, index) => (
                    <div key={laborItem.id} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4">
                        <Label>Description</Label>
                        <Input
                          placeholder="Installation & Wiring"
                          value={laborItem.description}
                          onChange={(e) => updateLabor(laborItem.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Hours</Label>
                        <Input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={laborItem.hours}
                          onChange={(e) => updateLabor(laborItem.id, 'hours', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Rate/Hour</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={laborItem.hourlyRate}
                          onChange={(e) => updateLabor(laborItem.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Total</Label>
                        <Input
                          value={`$${laborItem.total.toFixed(2)}`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLabor(laborItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {labor.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No labor items added yet. Click "Add Labor" to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Any special instructions or details</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Include any special requirements, warranty information, or project details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="animate-fade-in sticky top-4" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Estimate Summary</CardTitle>
                <CardDescription>Cost breakdown and totals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Materials:</span>
                    <span className="font-medium">${materialsCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Labor:</span>
                    <span className="font-medium">${laborCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="taxRate" className="text-muted-foreground">Tax Rate (%):</Label>
                    <div className="w-20">
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="20"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Amount:</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Grand Total:</span>
                    <span className="text-xl font-bold text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateForm;
