import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowLeft, Save, FileText, Share, MessageCircle } from 'lucide-react';
import { Estimate, Material, Labor } from '../types/Estimate';
import { useToast } from '@/hooks/use-toast';
import EstimatePrintView from './EstimatePrintView';

interface EstimateFormProps {
  estimate?: Estimate | null;
  onSave: (estimate: Estimate) => void;
  onCancel: () => void;
}

const currencies = [
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

const EstimateForm = ({ estimate, onSave, onCancel }: EstimateFormProps) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labor, setLabor] = useState<Labor[]>([]);
  const [taxRate, setTaxRate] = useState(8.5);
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('GHS');
  const { toast } = useToast();

  const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];

  useEffect(() => {
    if (estimate) {
      setProjectTitle(estimate.projectTitle);
      setClientName(estimate.clientName);
      setClientAddress(estimate.clientAddress);
      setMaterials(estimate.materials);
      setLabor(estimate.labor);
      setTaxRate(estimate.taxRate);
      setNotes(estimate.notes || '');
      setCurrency(estimate.currency || 'GHS');
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
      notes,
      currency
    };

    onSave(estimateData);
  };

  const shareViaWhatsApp = () => {
    const { materialsCost, laborCost, subtotal, taxAmount, grandTotal } = calculateTotals();
    
    // Create detailed WhatsApp message in document format
    let message = `📋 *ELECTRICAL ESTIMATE DOCUMENT*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Header
    message += `🏢 *AG ELECTRICAL ESTIMATE APP*\n`;
    message += `Professional Electrical Services\n\n`;
    
    // Project Info
    message += `📝 *PROJECT INFORMATION*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Project: ${projectTitle}\n`;
    message += `Client: ${clientName}\n`;
    message += `Address: ${clientAddress}\n`;
    message += `Date: ${new Date().toLocaleDateString()}\n`;
    message += `Currency: ${selectedCurrency.name}\n\n`;
    
    // Materials
    if (materials.length > 0) {
      message += `🔧 *MATERIALS*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      materials.forEach((material, index) => {
        message += `${index + 1}. ${material.name}\n`;
        message += `   Qty: ${material.quantity} × ${selectedCurrency.symbol}${material.unitCost.toFixed(2)} = ${selectedCurrency.symbol}${material.total.toFixed(2)}\n`;
      });
      message += `\n💰 *Materials Total: ${selectedCurrency.symbol}${materialsCost.toFixed(2)}*\n\n`;
    }
    
    // Labor
    if (labor.length > 0) {
      message += `👷 *LABOR*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      labor.forEach((laborItem, index) => {
        message += `${index + 1}. ${laborItem.description}\n`;
        message += `   ${laborItem.hours} hrs × ${selectedCurrency.symbol}${laborItem.hourlyRate.toFixed(2)}/hr = ${selectedCurrency.symbol}${laborItem.total.toFixed(2)}\n`;
      });
      message += `\n💰 *Labor Total: ${selectedCurrency.symbol}${laborCost.toFixed(2)}*\n\n`;
    }
    
    // Summary
    message += `📊 *ESTIMATE SUMMARY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Subtotal: ${selectedCurrency.symbol}${subtotal.toFixed(2)}\n`;
    message += `Tax (${taxRate}%): ${selectedCurrency.symbol}${taxAmount.toFixed(2)}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🏆 *GRAND TOTAL: ${selectedCurrency.symbol}${grandTotal.toFixed(2)}*\n\n`;
    
    // Notes
    if (notes) {
      message += `📌 *ADDITIONAL NOTES*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `${notes}\n\n`;
    }
    
    // Footer
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✅ This estimate is valid for 30 days\n`;
    message += `📱 Generated by AG Electrical Estimate App\n`;
    message += `🙏 Thank you for choosing AG Electrical Services`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Document Shared",
      description: "Professional estimate document shared via WhatsApp",
    });
  };

  const { materialsCost, laborCost, subtotal, taxAmount, grandTotal } = calculateTotals();

  const currentEstimate: Estimate = {
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
    notes,
    currency
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 print:hidden">
        {/* ... keep existing code (main form UI) */}
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {estimate ? 'Edit Estimate' : 'New Estimate'}
                </h1>
                <p className="text-muted-foreground text-lg">Create professional electrical estimates with ease</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={shareViaWhatsApp}
                className="hover:bg-green-50 hover:text-green-600 transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                <FileText className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
              <Button 
                onClick={handleSave} 
                className="electric-gradient text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Estimate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Form */}
            <div className="xl:col-span-3 space-y-8">
              {/* Project Info */}
              <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-r from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl">Project Information</CardTitle>
                  <CardDescription className="text-blue-100">Basic details about the electrical project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="projectTitle" className="text-sm font-semibold text-gray-700">Project Title</Label>
                      <Input
                        id="projectTitle"
                        placeholder="Kitchen Rewiring Project"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="clientName" className="text-sm font-semibold text-gray-700">Client Name</Label>
                      <Input
                        id="clientName"
                        placeholder="John Smith"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="clientAddress" className="text-sm font-semibold text-gray-700">Client Address</Label>
                      <Input
                        id="clientAddress"
                        placeholder="123 Main Street, City, State 12345"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg">
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code} className="hover:bg-blue-50">
                              {curr.symbol} {curr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Materials */}
              <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-r from-white to-green-50" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Materials</CardTitle>
                      <CardDescription className="text-green-100">Add electrical materials and supplies</CardDescription>
                    </div>
                    <Button 
                      onClick={addMaterial} 
                      size="sm" 
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Material
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {materials.map((material, index) => (
                      <div key={material.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border transition-all duration-300 hover:shadow-md">
                        <div className="col-span-4">
                          <Label className="text-sm font-semibold text-gray-700">Material Name</Label>
                          <Input
                            placeholder="12 AWG Wire"
                            value={material.name}
                            onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-700">Qty</Label>
                          <Input
                            type="number"
                            min="1"
                            value={material.quantity}
                            onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-700">Unit Cost</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={material.unitCost}
                            onChange={(e) => updateMaterial(material.id, 'unitCost', parseFloat(e.target.value) || 0)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-sm font-semibold text-gray-700">Total</Label>
                          <Input
                            value={`${selectedCurrency.symbol}${material.total.toFixed(2)}`}
                            readOnly
                            className="mt-2 bg-gray-100 font-semibold"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMaterial(material.id)}
                            className="hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-105 mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {materials.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border-2 border-dashed">
                        <div className="animate-pulse">
                          <Plus className="h-12 w-12 mx-auto mb-4 text-green-400" />
                          <p className="text-lg">No materials added yet</p>
                          <p className="text-sm">Click "Add Material" to get started</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Labor */}
              <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-r from-white to-orange-50" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Labor</CardTitle>
                      <CardDescription className="text-orange-100">Add labor costs and time estimates</CardDescription>
                    </div>
                    <Button 
                      onClick={addLabor} 
                      size="sm" 
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Labor
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {labor.map((laborItem, index) => (
                      <div key={laborItem.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg border transition-all duration-300 hover:shadow-md">
                        <div className="col-span-4">
                          <Label className="text-sm font-semibold text-gray-700">Description</Label>
                          <Input
                            placeholder="Installation & Wiring"
                            value={laborItem.description}
                            onChange={(e) => updateLabor(laborItem.id, 'description', e.target.value)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-700">Hours</Label>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={laborItem.hours}
                            onChange={(e) => updateLabor(laborItem.id, 'hours', parseFloat(e.target.value) || 0)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-700">Rate/Hour</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={laborItem.hourlyRate}
                            onChange={(e) => updateLabor(laborItem.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-sm font-semibold text-gray-700">Total</Label>
                          <Input
                            value={`${selectedCurrency.symbol}${laborItem.total.toFixed(2)}`}
                            readOnly
                            className="mt-2 bg-gray-100 font-semibold"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeLabor(laborItem.id)}
                            className="hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-105 mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {labor.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg border-2 border-dashed">
                        <div className="animate-pulse">
                          <Plus className="h-12 w-12 mx-auto mb-4 text-orange-400" />
                          <p className="text-lg">No labor items added yet</p>
                          <p className="text-sm">Click "Add Labor" to get started</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-r from-white to-purple-50" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl">Additional Notes</CardTitle>
                  <CardDescription className="text-purple-100">Any special instructions or details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Textarea
                    placeholder="Include any special requirements, warranty information, or project details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="transition-all duration-300 focus:ring-2 focus:ring-purple-500 hover:border-purple-300"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Summary Sidebar */}
            <div className="space-y-6">
              <Card className="animate-fade-in sticky top-4 shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50" style={{ animationDelay: '0.4s' }}>
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center">
                    <Share className="h-5 w-5 mr-2" />
                    Estimate Summary
                  </CardTitle>
                  <CardDescription className="text-blue-100">Cost breakdown and totals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Materials:</span>
                      <span className="font-bold text-green-600">{selectedCurrency.symbol}{materialsCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Labor:</span>
                      <span className="font-bold text-orange-600">{selectedCurrency.symbol}{laborCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Subtotal:</span>
                      <span className="font-bold text-blue-600">{selectedCurrency.symbol}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                      <Label htmlFor="taxRate" className="text-gray-700 font-medium">Tax Rate (%):</Label>
                      <div className="w-20">
                        <Input
                          id="taxRate"
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          className="text-right transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Tax Amount:</span>
                      <span className="font-bold text-yellow-600">{selectedCurrency.symbol}{taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border-2 border-purple-200">
                      <span className="text-xl font-bold text-purple-800">Grand Total:</span>
                      <span className="text-2xl font-bold text-purple-600">{selectedCurrency.symbol}{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Print View */}
      <EstimatePrintView 
        estimate={currentEstimate} 
        selectedCurrency={selectedCurrency} 
      />
    </>
  );
};

export default EstimateForm;
