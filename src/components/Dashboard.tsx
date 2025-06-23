
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, User, LogOut, Zap } from 'lucide-react';
import EstimateForm from './EstimateForm';
import { Estimate } from '../types/Estimate';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);

  const handleSaveEstimate = (estimate: Estimate) => {
    if (editingEstimate) {
      setEstimates(estimates.map(e => e.id === estimate.id ? estimate : e));
    } else {
      setEstimates([...estimates, estimate]);
    }
    setShowEstimateForm(false);
    setEditingEstimate(null);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setShowEstimateForm(true);
  };

  const handleDeleteEstimate = (id: string) => {
    setEstimates(estimates.filter(e => e.id !== id));
  };

  const totalValue = estimates.reduce((sum, estimate) => sum + estimate.grandTotal, 0);

  if (showEstimateForm) {
    return (
      <EstimateForm
        estimate={editingEstimate}
        onSave={handleSaveEstimate}
        onCancel={() => {
          setShowEstimateForm(false);
          setEditingEstimate(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="electric-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ElectriPro</h1>
                <p className="text-white/80 text-sm">Professional Electrical Estimates</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-white hover:bg-white/20 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimates.length}</div>
              <p className="text-xs text-muted-foreground">
                Active projects in progress
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Combined estimate value
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Project</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${estimates.length > 0 ? Math.round(totalValue / estimates.length).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Average estimate value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Estimates</h2>
            <p className="text-muted-foreground">
              Manage and track all your electrical project estimates
            </p>
          </div>
          <Button
            onClick={() => setShowEstimateForm(true)}
            className="electric-gradient text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Estimate
          </Button>
        </div>

        {/* Estimates Grid */}
        {estimates.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No estimates yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Get started by creating your first electrical estimate
              </p>
              <Button
                onClick={() => setShowEstimateForm(true)}
                className="electric-gradient text-white hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Estimate
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estimates.map((estimate, index) => (
              <Card 
                key={estimate.id} 
                className="hover:shadow-lg transition-shadow animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{estimate.projectTitle}</CardTitle>
                      <CardDescription>{estimate.clientName}</CardDescription>
                    </div>
                    <Badge variant="secondary">{estimate.status || 'Draft'}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Materials:</span>
                      <span>${estimate.materialsCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Labor:</span>
                      <span>${estimate.laborCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-primary">${estimate.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEstimate(estimate)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="flex-1"
                    >
                      Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
