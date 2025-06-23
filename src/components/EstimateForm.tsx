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
  const [brand, setBrand] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labor, setLabor] = useState<Labor[]>([]);
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('GHS');
  const { toast } = useToast();

  const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];

  useEffect(() => {
    if (estimate) {
      setProjectTitle(estimate.projectTitle);
      setClientName(estimate.clientName);
      setClientAddress(estimate.clientAddress);
      setBrand(estimate.brand || '');
      setMaterials(estimate.materials);
      setLabor(estimate.labor);
      setNotes(estimate.notes || '');
      setCurrency(estimate.currency || 'GHS');
    }
  }, [estimate]);

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: '',
      brand: '',
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
    const grandTotal = subtotal; // No tax calculation

    return { materialsCost, laborCost, subtotal, grandTotal };
  };

  const handleSave = () => {
    const { materialsCost, laborCost, subtotal, grandTotal } = calculateTotals();
    
    const estimateData: Estimate = {
      id: estimate?.id || Date.now().toString(),
      projectTitle,
      clientName,
      clientAddress,
      brand,
      date: estimate?.date || new Date().toISOString().split('T')[0],
      materials,
      labor,
      materialsCost,
      laborCost,
      subtotal,
      grandTotal,
      notes,
      currency
    };

    onSave(estimateData);
  };

  const shareViaWhatsApp = () => {
    // Generate PDF and create download link
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const currentEstimate: Estimate = {
        id: estimate?.id || Date.now().toString(),
        projectTitle,
        clientName,
        clientAddress,
        brand,
        date: estimate?.date || new Date().toISOString().split('T')[0],
        materials,
        labor,
        materialsCost: calculateTotals().materialsCost,
        laborCost: calculateTotals().laborCost,
        subtotal: calculateTotals().subtotal,
        grandTotal: calculateTotals().grandTotal,
        notes,
        currency
      };

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AG Electrical Estimate - ${projectTitle}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="bg-white p-8 max-w-4xl mx-auto">
              <div class="border-b-2 border-blue-600 pb-6 mb-8">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-xl">AG</span>
                      </div>
                      <div>
                        <h1 class="text-2xl font-bold text-blue-600">AG ELECTRICAL ESTIMATE APP</h1>
                        <p class="text-gray-600">Professional Electrical Services</p>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <h2 class="text-xl font-bold text-gray-800">ESTIMATE</h2>
                    <p class="text-gray-600">Date: ${new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 class="font-bold text-gray-800 mb-3">Project Information</h3>
                  <div class="space-y-2">
                    <p><span class="font-semibold">Project:</span> ${projectTitle}</p>
                    <p><span class="font-semibold">Client:</span> ${clientName}</p>
                    <p><span class="font-semibold">Address:</span> ${clientAddress}</p>
                    ${brand ? `<p><span class="font-semibold">Brand:</span> ${brand}</p>` : ''}
                  </div>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-3">Estimate Summary</h3>
                  <div class="space-y-2">
                    <p><span class="font-semibold">Currency:</span> ${selectedCurrency.name}</p>
                    <p><span class="font-semibold">Total:</span> ${selectedCurrency.symbol}${calculateTotals().grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              ${materials.length > 0 ? `
              <div class="mb-8">
                <h3 class="font-bold text-gray-800 mb-4">Materials</h3>
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-blue-50">
                      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Material Name</th>
                      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Brand</th>
                      <th class="border border-gray-300 px-4 py-3 text-center font-semibold">Quantity</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Unit Cost</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${materials.map(material => `
                    <tr>
                      <td class="border border-gray-300 px-4 py-3">${material.name}</td>
                      <td class="border border-gray-300 px-4 py-3">${material.brand || '-'}</td>
                      <td class="border border-gray-300 px-4 py-3 text-center">${material.quantity}</td>
                      <td class="border border-gray-300 px-4 py-3 text-right">${selectedCurrency.symbol}${material.unitCost.toFixed(2)}</td>
                      <td class="border border-gray-300 px-4 py-3 text-right font-semibold">${selectedCurrency.symbol}${material.total.toFixed(2)}</td>
                    </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              ` : ''}
              
              ${labor.length > 0 ? `
              <div class="mb-8">
                <h3 class="font-bold text-gray-800 mb-4">Labor</h3>
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-orange-50">
                      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                      <th class="border border-gray-300 px-4 py-3 text-center font-semibold">Hours</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Rate/Hour</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${labor.map(laborItem => `
                    <tr>
                      <td class="border border-gray-300 px-4 py-3">${laborItem.description}</td>
                      <td class="border border-gray-300 px-4 py-3 text-center">${laborItem.hours}</td>
                      <td class="border border-gray-300 px-4 py-3 text-right">${selectedCurrency.symbol}${laborItem.hourlyRate.toFixed(2)}</td>
                      <td class="border border-gray-300 px-4 py-3 text-right font-semibold">${selectedCurrency.symbol}${laborItem.total.toFixed(2)}</td>
                    </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              ` : ''}
              
              <div class="border-t-2 border-gray-300 pt-6">
                <div class="max-w-md ml-auto">
                  <div class="space-y-3">
                    <div class="flex justify-between text-xl font-bold border-t pt-3 text-blue-600">
                      <span>GRAND TOTAL:</span>
                      <span>${selectedCurrency.symbol}${calculateTotals().grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              ${notes ? `
              <div class="mt-8 border-t pt-6">
                <h3 class="font-bold text-gray-800 mb-3">Notes</h3>
                <p class="text-gray-700">${notes}</p>
              </div>
              ` : ''}
              
              <div class="mt-12 text-center text-gray-600 border-t pt-6">
                <p>Thank you for choosing AG Electrical Services</p>
                <p class="text-sm">This estimate is valid for 30 days from the date issued</p>
              </div>
              
              <div class="no-print mt-8 text-center">
                <button onclick="window.print()" class="bg-blue-600 text-white px-6 py-2 rounded mr-4">Print PDF</button>
                <button onclick="window.close()" class="bg-gray-600 text-white px-6 py-2 rounded">Close</button>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    // Create WhatsApp message with PDF link
    const message = `📋 *AG ELECTRICAL ESTIMATE*\n\n` +
      `Project: ${projectTitle}\n` +
      `Client: ${clientName}\n` +
      `Total: ${selectedCurrency.symbol}${calculateTotals().grandTotal.toFixed(2)}\n\n` +
      `Click the link above to view and download the detailed PDF estimate.\n\n` +
      `Generated by AG Electrical Estimate App`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "PDF Generated & Shared",
      description: "PDF window opened and WhatsApp sharing link created.",
    });
  };

  const { materialsCost, laborCost, subtotal, grandTotal } = calculateTotals();

  const currentEstimate: Estimate = {
    id: estimate?.id || Date.now().toString(),
    projectTitle,
    clientName,
    clientAddress,
    brand,
    date: estimate?.date || new Date().toISOString().split('T')[0],
    materials,
    labor,
    materialsCost,
    laborCost,
    subtotal,
    grandTotal,
    notes,
    currency
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 print:hidden">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header with smaller back button */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCancel}
                className="hover:bg-blue-50 transition-all duration-300 hover:scale-105 px-3 py-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
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
                Share PDF
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
              {/* Project Info with Brand field */}
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
                      <Label htmlFor="brand" className="text-sm font-semibold text-gray-700">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="Company/Brand Name"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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
                        <div className="col-span-3">
                          <Label className="text-sm font-semibold text-gray-700">Material Name</Label>
                          <Input
                            placeholder="12 AWG Wire"
                            value={material.name}
                            onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                            className="mt-2 transition-all duration-300 focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-700">Brand</Label>
                          <Input
                            placeholder="Brand name"
                            value={material.brand || ''}
                            onChange={(e) => updateMaterial(material.id, 'brand', e.target.value)}
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
                        <div className="col-span-2">
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
