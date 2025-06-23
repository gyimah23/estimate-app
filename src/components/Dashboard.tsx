
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, User, LogOut, Zap, TrendingUp, DollarSign, Activity } from 'lucide-react';
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
  const avgProjectValue = estimates.length > 0 ? totalValue / estimates.length : 0;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AG</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">AG ELECTRICAL ESTIMATE APP</h1>
                <p className="text-white/90 text-lg font-medium">Professional Electrical Estimates Made Easy</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Estimates</CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{estimates.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active projects in progress
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Value</CardTitle>
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">₵{totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Combined estimate value
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Avg. Project</CardTitle>
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ₵{Math.round(avgProjectValue).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average estimate value
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in shadow-lg border-0 bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">This Month</CardTitle>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Activity className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{estimates.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimates created
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex justify-between items-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div>
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Estimates
            </h2>
            <p className="text-muted-foreground text-lg mt-2">
              Manage and track all your electrical project estimates with ease
            </p>
          </div>
          <Button
            onClick={() => setShowEstimateForm(true)}
            className="electric-gradient text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg text-lg px-8 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Estimate
          </Button>
        </div>

        {/* Enhanced Estimates Grid */}
        {estimates.length === 0 ? (
          <Card className="animate-fade-in shadow-xl border-0 bg-gradient-to-br from-white to-blue-50" style={{ animationDelay: '0.5s' }}>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-full mb-6 animate-pulse">
                <FileText className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No estimates yet</h3>
              <p className="text-muted-foreground text-center mb-8 text-lg max-w-md">
                Get started by creating your first professional electrical estimate
              </p>
              <Button
                onClick={() => setShowEstimateForm(true)}
                className="electric-gradient text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg text-lg px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Estimate
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {estimates.map((estimate, index) => (
              <Card 
                key={estimate.id} 
                className="hover:shadow-2xl transition-all duration-300 animate-fade-in cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">{estimate.projectTitle}</CardTitle>
                      <CardDescription className="text-blue-100 text-base mt-1">{estimate.clientName}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {estimate.status || 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm bg-green-50 p-3 rounded-lg">
                      <span className="text-gray-700 font-medium">Materials:</span>
                      <span className="font-bold text-green-600">₵{estimate.materialsCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm bg-orange-50 p-3 rounded-lg">
                      <span className="text-gray-700 font-medium">Labor:</span>
                      <span className="font-bold text-orange-600">₵{estimate.laborCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                      <span className="text-lg text-gray-800">Total:</span>
                      <span className="text-xl text-purple-600">₵{estimate.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEstimate(estimate)}
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="flex-1 hover:bg-green-50 hover:text-green-600 transition-all duration-300 hover:scale-105"
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
