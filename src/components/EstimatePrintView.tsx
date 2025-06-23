import { Estimate } from '../types/Estimate';

interface EstimatePrintViewProps {
  estimate: Estimate;
  selectedCurrency: { symbol: string; name: string };
}

const EstimatePrintView = ({ estimate, selectedCurrency }: EstimatePrintViewProps) => {
  return (
    <div className="print:block hidden bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AG</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">AG ELECTRICAL ESTIMATE APP</h1>
                <p className="text-gray-600">Professional Electrical Services</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">ESTIMATE</h2>
            <p className="text-gray-600">Date: {new Date(estimate.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Project Information</h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Project:</span> {estimate.projectTitle}</p>
            <p><span className="font-semibold">Client:</span> {estimate.clientName}</p>
            <p><span className="font-semibold">Address:</span> {estimate.clientAddress}</p>
            {estimate.brand && <p><span className="font-semibold">Brand:</span> {estimate.brand}</p>}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Estimate Summary</h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Currency:</span> {selectedCurrency.name}</p>
            <p><span className="font-semibold">Status:</span> {estimate.status || 'Draft'}</p>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      {estimate.materials.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Materials</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Material Name</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Quantity</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Unit Cost</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{material.name}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{material.quantity}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{selectedCurrency.symbol}{material.unitCost.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">{selectedCurrency.symbol}{material.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-green-50">
                <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-bold">Materials Subtotal:</td>
                <td className="border border-gray-300 px-4 py-3 text-right font-bold text-green-600">{selectedCurrency.symbol}{estimate.materialsCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Labor Table */}
      {estimate.labor.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Labor</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-orange-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Hours</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Rate/Hour</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.labor.map((laborItem) => (
                <tr key={laborItem.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{laborItem.description}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{laborItem.hours}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{selectedCurrency.symbol}{laborItem.hourlyRate.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">{selectedCurrency.symbol}{laborItem.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-orange-50">
                <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-bold">Labor Subtotal:</td>
                <td className="border border-gray-300 px-4 py-3 text-right font-bold text-orange-600">{selectedCurrency.symbol}{estimate.laborCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Total Summary */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="max-w-md ml-auto">
          <div className="space-y-3">
            <div className="flex justify-between text-xl font-bold border-t pt-3 text-blue-600">
              <span>GRAND TOTAL:</span>
              <span>{selectedCurrency.symbol}{estimate.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {estimate.notes && (
        <div className="mt-8 border-t pt-6">
          <h3 className="font-bold text-gray-800 mb-3">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{estimate.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-gray-600 border-t pt-6">
        <p>Thank you for choosing AG Electrical Services</p>
        <p className="text-sm">This estimate is valid for 30 days from the date issued</p>
      </div>
    </div>
  );
};

export default EstimatePrintView;
